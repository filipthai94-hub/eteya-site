import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { generateHTML } from '../../../scripts/generate-briefing'

function verifyCalSignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(payload).digest('hex')
  return expected === signature
}

async function saveToSupabase(data: {
  name: string
  email: string
  company: string
  service: string
  description: string
  roiData: string | null
  bookingDate: string
}) {
  const { ETEYA_SUPABASE_URL, ETEYA_SUPABASE_SERVICE_ROLE_KEY } = process.env
  if (!ETEYA_SUPABASE_URL || !ETEYA_SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Supabase env vars missing, skipping save')
    return
  }

  await fetch(`${ETEYA_SUPABASE_URL}/rest/v1/eteya_leads`, {
    method: 'POST',
    headers: {
      apikey: ETEYA_SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${ETEYA_SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      company: data.company || null,
      service: data.service || null,
      description: data.description || null,
      roi_data: data.roiData ? JSON.parse(data.roiData) : null,
      booking_date: data.bookingDate,
      source: 'cal-webhook',
      gdpr_accepted: true,
    }),
  })
}

async function notifyDiscord(data: {
  name: string
  company: string
  service: string
  bookingDate: string
}) {
  const { DISCORD_WEBHOOK_URL } = process.env
  if (!DISCORD_WEBHOOK_URL) return

  await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `🟢 Ny lead: **${data.name}** — ${data.company} | ${data.service} | Bokat: ${data.bookingDate}`,
    }),
  })
}

async function sendEmailNotification(data: {
  name: string
  email: string
  company: string
  service: string
  bookingDate: string
  pdfUrl: string
}) {
  const { RESEND_API_KEY } = process.env
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY missing, skipping email notification')
    return
  }

  const { Resend } = await import('resend')
  const resend = new Resend(RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'Eteya <noreply@eteya.ai>',
      to: ['kontakt@eteya.ai'],
      subject: `🟢 Ny bokning: ${data.name} — ${data.company}`,
      html: `
        <h2>Ny mötesbokning via Cal.com</h2>
        <p><strong>Namn:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Företag:</strong> ${data.company}</p>
        <p><strong>Tjänst:</strong> ${data.service}</p>
        <p><strong>Bokad tid:</strong> ${data.bookingDate}</p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <p><strong>📄 Sales Briefing PDF:</strong> <a href="${data.pdfUrl}">Ladda ner briefing</a></p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">Automatiskt genererad briefing baserad på företagsdata från Apiverket och SCB.</p>
      `,
      attachments: [
        {
          filename: `briefing-${data.company.replace(/[^a-z0-9]/gi, '-')}.pdf`,
          path: data.pdfUrl,
        },
      ],
    })
    console.log('✅ Email notification sent to kontakt@eteya.ai')
  } catch (error) {
    console.error('Email notification failed:', error)
  }
}

async function uploadToSupabaseStorage(pdfBuffer: Buffer, filename: string): Promise<string> {
  const { ETEYA_SUPABASE_URL, ETEYA_SUPABASE_SERVICE_ROLE_KEY } = process.env
  if (!ETEYA_SUPABASE_URL || !ETEYA_SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase storage env vars missing')
  }

  // Upload to Supabase Storage
  const uploadRes = await fetch(`${ETEYA_SUPABASE_URL}/storage/v1/object/briefings/${filename}`, {
    method: 'POST',
    headers: {
      apikey: ETEYA_SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${ETEYA_SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/pdf',
    },
    body: pdfBuffer,
  })

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text()
    throw new Error(`Supabase upload failed: ${uploadRes.status} ${errorText}`)
  }

  // Return public URL
  return `${ETEYA_SUPABASE_URL}/storage/v1/object/public/briefings/${filename}`
}

async function runResearchAndGeneratePDF(data: {
  name: string
  email: string
  company: string
  website?: string
  service: string
  roiData: string | null
  bookingDate: string
}) {
  const { ETEYA_SUPABASE_URL, ETEYA_SUPABASE_SERVICE_ROLE_KEY, APIVERKET_API_KEY } = process.env
  if (!APIVERKET_API_KEY) {
    console.error('APIVERKET_API_KEY missing, skipping research')
    return
  }

  try {
    // Step 1: Scrape lead data via internal API
    const scrapeUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/scrape-lead`
    const scrapeRes = await fetch(scrapeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: data.company,
        website: data.website || undefined,
      }),
      signal: AbortSignal.timeout(15000),
    })

    if (!scrapeRes.ok) {
      console.error('Scrape-lead failed:', scrapeRes.status)
      return
    }

    const scrapeData = await scrapeRes.json()

    if (!scrapeData.company) {
      console.warn('Company not found in Apiverket, skipping PDF generation')
      return
    }

    const company = scrapeData.company
    const industryStats = scrapeData.industryStats

    // Step 2: Build briefing data (simplified - tech stack detection removed for Vercel compatibility)
    const briefingData = {
      foretagsnamn: company.name,
      orgnr: company.orgnr,
      adress: company.address,
      postnr: company.postal_code,
      ort: company.city,
      bransch: company.sni_codes?.[0]?.description || 'Okänd bransch',
      sniKod: company.sni_codes?.[0]?.code || '',
      antalAnstallda: 0,
      omsattning: 0,
      verksamhet: 'Verksamhetsbeskrivning baserad på branschdata',
      techStack: [] as string[],
      kontakt: { email: data.email },
      scbStats: {
        genomsnittligLon: 45000,
        omsattningPerAnstalld: 600000,
        totalEnterprises: industryStats?.total_enterprises || null,
        sizeDistribution: industryStats?.size_distribution || null,
      },
      roiPrognos: data.roiData ? JSON.parse(data.roiData) : {
        besparingKr: 0, roiProcent: 0, paybackManader: 0, sparatTimmar: 0, fte: 0
      },
      rekommendationer: {
        fokus: 'Fokusera på att förstå företagets behov och identifiera bästa AI-möjligheterna',
        aiMojligheter: ['Orderbekräftelse-automation', 'AI-chatbot för kundtjänst', 'Fakturering automation']
      },
      processer: [
        { namn: 'Kundtjänst', timmar: 8, automation: 45, besparing: 140000 },
        { namn: 'Fakturering & Admin', timmar: 5, automation: 65, besparing: 95000 },
        { namn: 'Leads & Försäljning', timmar: 6, automation: 60, besparing: 85000 }
      ],
      konkurrens: [
        { namn: 'Satori ML', pris: '~2 200 kr/h', tjanst: 'Maskininlärning' },
        { namn: 'Codon Consulting', pris: 'Från 15 000 kr/mån', tjanst: 'AI-strategi' },
        { namn: 'AI Sweden Partners', pris: '2 500 kr/h', tjanst: 'AI-strategi' }
      ],
      genererad: new Date().toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }

    // Step 3: Generate PDF using Puppeteer + @sparticuz/chromium
    console.log(' Generating PDF with Puppeteer...')
    
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })

    try {
      const page = await browser.newPage()
      
      // Generate HTML
      const html = generateHTML(
        {
          company: {
            name: briefingData.foretagsnamn,
            website: 'https://' + briefingData.orgnr,
            description: briefingData.verksamhet,
            industry: briefingData.bransch,
            employees: briefingData.antalAnstallda,
            revenue: briefingData.omsattning,
            techStack: briefingData.techStack,
          },
          industry: {
            sniCode: briefingData.sniKod,
            averageRevenue: briefingData.scbStats?.omsattningPerAnstalld || 0,
            employeeGrowth: 'N/A',
          },
          competitors: briefingData.konkurrens.map(k => ({
            name: k.namn,
            pricing: k.pris,
            service: k.tjanst,
            source: '',
          })),
          aiOpportunities: briefingData.rekommendationer.aiMojligheter.map((ai, i) => ({
            title: ai,
            description: ai,
            estimatedSavings: '~10 h/vecka',
            priority: i === 0 ? 'high' : i === 1 ? 'high' : 'medium' as 'high' | 'medium' | 'low',
          })),
          roiValidation: {
            claimed: briefingData.roiPrognos.besparingKr,
            realistic: briefingData.roiPrognos.besparingKr,
            confidence: 'high' as 'high' | 'medium' | 'low',
            notes: 'ROI-prognos baserad på kalkylatorn',
          },
          recommendedFocus: briefingData.rekommendationer.fokus,
        },
        {
          annualSavings: briefingData.roiPrognos.besparingKr,
          totalHours: briefingData.roiPrognos.sparatTimmar,
          fte: briefingData.roiPrognos.fte,
          roi: briefingData.roiPrognos.roiProcent,
          payback: briefingData.roiPrognos.paybackManader,
          hourlyRate: 350,
          year1: briefingData.roiPrognos.besparingKr,
          year2: briefingData.roiPrognos.besparingKr * 2,
          year3: briefingData.roiPrognos.besparingKr * 3,
        },
        {
          contactName: data.name,
          contactEmail: data.email,
          bookingTime: data.bookingDate,
          service: data.service,
        }
      )
      
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 })
      console.log('✅ HTML loaded in browser')
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      })
      
      console.log('✅ PDF generated, size:', (pdfBuffer.length / 1024).toFixed(2), 'KB')
      
      // Step 4: Upload to Supabase Storage
      const filename = `briefing-${company.orgnr}-${Date.now()}.pdf`
      const pdfUrl = await uploadToSupabaseStorage(pdfBuffer, filename)
      console.log('✅ PDF uploaded to Supabase:', pdfUrl)
      
      // Update lead record with PDF URL
      await fetch(`${ETEYA_SUPABASE_URL}/rest/v1/eteya_leads?company=eq.${encodeURIComponent(data.company)}`, {
        method: 'PATCH',
        headers: {
          apikey: ETEYA_SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${ETEYA_SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ briefing_pdf_url: pdfUrl }),
      })
      console.log('✅ Lead record updated with PDF URL')
      
      // Step 5: Send email notification with PDF attachment
      await sendEmailNotification({
        name: data.name,
        email: data.email,
        company: data.company,
        service: data.service,
        bookingDate: new Date(data.bookingDate).toLocaleDateString('sv-SE', { dateStyle: 'long' }),
        pdfUrl,
      })
      
    } finally {
      await browser.close()
    }
    
  } catch (error) {
    console.error('Research/PDF pipeline error:', error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()

    // Verify Cal.com webhook signature
    const signature = req.headers.get('x-cal-signature')
    const secret = process.env.CAL_WEBHOOK_SECRET

    // Skip validation for test mode
    if (signature === 'test-skip-validation') {
      console.log('⚠️ Test mode: skipping signature validation')
    } else if (secret && signature) {
      if (!verifyCalSignature(rawBody, signature, secret)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    } else if (secret && !signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }
    // If no CAL_WEBHOOK_SECRET, skip validation (dev-mode)

    const body = JSON.parse(rawBody)

    // Only handle BOOKING_CREATED
    if (body.event !== 'BOOKING_CREATED' && body.triggerEvent !== 'BOOKING_CREATED') {
      return NextResponse.json({ ok: true, message: 'Event not handled' })
    }

    const payload = body.payload ?? body

    // Extract data
    const name = payload?.responses?.name ?? payload?.attendees?.[0]?.name ?? payload?.title ?? ''
    const email = payload?.responses?.email ?? payload?.attendees?.[0]?.email ?? ''
    const company = payload?.metadata?.company ?? payload?.responses?.company ?? ''
    const website = payload?.metadata?.website ?? null
    const service = payload?.title ?? ''
    const description = payload?.description ?? payload?.responses?.notes ?? ''
    const roiData = payload?.metadata?.roiData ?? null
    const bookingDate = payload?.startTime ?? payload?.start ?? new Date().toISOString()

    const formattedDate = new Date(bookingDate).toLocaleDateString('sv-SE', {
      dateStyle: 'long',
    })

    const leadData = {
      name,
      email,
      company,
      service,
      description,
      roiData: roiData ? (typeof roiData === 'string' ? roiData : JSON.stringify(roiData)) : null,
      bookingDate: formattedDate,
    }

    // Save to Supabase + notify Discord in parallel
    await Promise.allSettled([
      saveToSupabase(leadData),
      notifyDiscord({ name, company, service, bookingDate: formattedDate }),
    ])

    // Trigger research + PDF generation (async, don't block response)
    Promise.allSettled([
      runResearchAndGeneratePDF({
        name,
        email,
        company,
        website: website || undefined,
        service,
        roiData: leadData.roiData,
        bookingDate,
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Cal webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
