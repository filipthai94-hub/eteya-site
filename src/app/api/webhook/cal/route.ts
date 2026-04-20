import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

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

    // Step 2: Run tech stack detection (if website provided)
    let techStack: string[] = []
    if (data.website) {
      try {
        const { execSync } = await import('child_process')
        const techOutput = execSync(
          `node scripts/scraping/detect-tech.js '${data.website}'`,
          { encoding: 'utf-8', timeout: 30000, cwd: process.cwd(), stdio: ['pipe', 'pipe', 'pipe'] }
        )
        techStack = JSON.parse(techOutput.trim())
      } catch (err) {
        console.warn('Tech stack detection failed:', err)
      }
    }

    // Step 3: Build briefing data
    const briefingData = {
      foretagsnamn: company.name,
      orgnr: company.orgnr,
      adress: company.address,
      postnr: company.postal_code,
      ort: company.city,
      bransch: company.sni_codes?.[0]?.description || 'Okänd bransch',
      sniKod: company.sni_codes?.[0]?.code || '',
      antalAnstallda: 0,
      omsattning: 0, // Required by PDF template
      verksamhet: 'Verksamhetsbeskrivning baserad på branschdata',
      techStack,
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

    // Step 4: Generate PDF
    const { execSync } = await import('child_process')
    const fs = await import('fs/promises')
    const briefingJsonPath = `/tmp/briefing-${company.orgnr}-${Date.now()}.json`
    const pdfFilename = `briefing-${company.orgnr}-${Date.now()}.pdf`
    const pdfPath = `/tmp/${pdfFilename}`

    // Write JSON file first
    await fs.writeFile(briefingJsonPath, JSON.stringify(briefingData, null, 2), 'utf-8')

    // Generate PDF from JSON file
    execSync(
      `node scripts/scraping/generator/pdf.js '${briefingJsonPath}' '${pdfPath}'`,
      { encoding: 'utf-8', timeout: 60000, cwd: process.cwd() }
    )

    // Step 5: Upload PDF to Supabase Storage
    if (ETEYA_SUPABASE_URL && ETEYA_SUPABASE_SERVICE_ROLE_KEY) {
      const fs = await import('fs/promises')
      const pdfBuffer = await fs.readFile(pdfPath)

      await fetch(`${ETEYA_SUPABASE_URL}/storage/v1/object/briefings/${pdfFilename}`, {
        method: 'POST',
        headers: {
          apikey: ETEYA_SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${ETEYA_SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/pdf',
        },
        body: pdfBuffer,
      })

      // Update lead record with PDF URL
      const pdfUrl = `${ETEYA_SUPABASE_URL}/storage/v1/object/public/briefings/${pdfFilename}`
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

      console.log('✅ PDF uploaded:', pdfUrl)

      // Cleanup temp file
      try { await fs.unlink(pdfPath) } catch {}
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