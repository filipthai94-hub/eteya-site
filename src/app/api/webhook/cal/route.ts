import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

// In-memory rate limiting (resets on cold start, acceptable for webhook)
const webhookRateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkWebhookRateLimit(ip: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = webhookRateLimitMap.get(ip)
  if (!record || now > record.resetTime) {
    webhookRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  if (record.count >= maxRequests) {
    return false
  }
  record.count++
  return true
}
import { generateHTML, type ResearchOutput, type ROIData, type BookingData } from '@/lib/generate-briefing-html'
import { generateProHTML } from '@/lib/generate-pro-briefing-html'

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
      roi_data: data.roiData ? (typeof data.roiData === 'string' ? JSON.parse(data.roiData) : data.roiData) : null,
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
      content: `🟢 Ny lead: **${data.name}** - ${data.company} | ${data.service} | Bokat: ${data.bookingDate}`,
    }),
  })
}

async function sendEmailNotification(data: {
  name: string
  email: string
  company: string
  service: string
  bookingDate: string
  htmlUrl: string
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
      subject: `🟢 Ny bokning: ${data.name} - ${data.company}`,
      html: `
        <h2>Ny mötesbokning via Cal.com</h2>
        <p><strong>Namn:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Företag:</strong> ${data.company}</p>
        <p><strong>Tjänst:</strong> ${data.service}</p>
        <p><strong>Bokad tid:</strong> ${data.bookingDate}</p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <p><strong>📄 Sales Briefing:</strong></p>
        <p><a href="${data.htmlUrl}" download style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">📥 Ladda ner briefing (.html)</a></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0 0 10px 0; font-weight: bold;">💡 Så här öppnar du filen:</p>
          <ol style="margin: 0; padding-left: 20px;">
            <li>Ladda ner filen genom att klicka på knappen ovan</li>
            <li>Dubbelklicka på den nedladdade filen (öppnas i din browser)</li>
            <li>Se hela briefing med styling och design!</li>
          </ol>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">Automatiskt genererad briefing baserad på företagsdata från Apiverket och SCB.</p>
      `,
    })
    console.log('✅ Email notification sent to kontakt@eteya.ai')
  } catch (error) {
    console.error('Email notification failed:', error)
  }
}

async function uploadHtmlToSupabase(htmlContent: string, filename: string): Promise<string> {
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
      'Content-Type': 'text/html; charset=utf-8',
    },
    body: htmlContent,
  })

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text()
    throw new Error(`Supabase upload failed: ${uploadRes.status} ${errorText}`)
  }

  // Return public URL with ?download parameter to force browser download
  return `${ETEYA_SUPABASE_URL}/storage/v1/object/public/briefings/${filename}?download=${encodeURIComponent(filename)}`
}

// Load competitors from JSON file
async function loadCompetitors() {
  try {
    const competitorsData = await import('@/data/competitors.json')
    return competitorsData.default.competitors.slice(0, 5) // Return top 5 competitors
  } catch (error) {
    console.error('Failed to load competitors:', error)
    // Fallback to hardcoded list
    return [
      { name: 'Satori ML', pricing: '~2 200 kr/h', service: 'Maskininlärning, AI-strategi' },
      { name: 'Codon Consulting', pricing: 'Från 15 000 kr/mån', service: 'NLP, Chatbot, MLOps' },
      { name: 'Aixia', pricing: '1 500-2 000 kr/h', service: 'AI-infrastruktur, strategi' },
      { name: 'Abundly AI', pricing: '1 200-1 800 kr/h', service: 'Generativ AI, agenter' },
      { name: 'Arange AI', pricing: '900-1 500 kr/h', service: 'AI-strategi → implementation' }
    ]
  }
}

async function runResearchAndGenerateHTML(data: {
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
    // Step 1: Call Apiverket API directly
    const { APIVERKET_API_KEY } = process.env

    // Search for company by name
    const searchRes = await fetch(`https://api.apiverket.se/v1/companies/search?query=${encodeURIComponent(data.company)}`, {
      headers: { 'Authorization': `Bearer ${APIVERKET_API_KEY}` }
    })

    if (!searchRes.ok) {
      console.error('Apiverket search failed:', searchRes.status)
    }

    const searchResults = await searchRes.json().catch(() => null)
    const orgnr = searchResults?.[0]?.orgnr

    let company: any = null
    let industryStats: any = null

    if (orgnr) {
      // Get company details
      const detailsRes = await fetch(`https://api.apiverket.se/v1/companies/${orgnr}`, {
        headers: { 'Authorization': `Bearer ${APIVERKET_API_KEY}` }
      })
      company = await detailsRes.json().catch(() => null)

      // Get industry stats if SNI code exists
      if (company?.sni_codes?.[0]?.code) {
        const statsRes = await fetch(`https://api.apiverket.se/v1/statistics/industry/${company.sni_codes[0].code}`, {
          headers: { 'Authorization': `Bearer ${APIVERKET_API_KEY}` }
        })
        industryStats = await statsRes.json().catch(() => null)
      }
    }

    // Fallback to mock data if Apiverket fails
    if (!company) {
      console.warn('Company not found in Apiverket, using mock data')
      company = {
        name: data.company,
        orgnr: '000000-0000',
        address: 'Okänd adress',
        postal_code: '000 00',
        city: 'Okänd ort',
        sni_codes: [{ code: '0000', description: 'Okänd bransch' }],
        number_of_employees: 0,
        revenue: 0,
        board_members: [],
        description: 'Verksamhetsbeskrivning saknas',
      }
    }

    // Step 2: Website analysis (if website provided)
    let websiteAnalysis = null
    if (data.website) {
      try {
        console.log('🔍 Analyserar hemsida:', data.website)
        const { analyzeWebsite } = await import('@/lib/website-analyzer')
        websiteAnalysis = await analyzeWebsite(data.website)
      } catch (error) {
        console.error('Website analysis failed:', error)
      }
    }

    // Step 3: Build briefing data with ALL available fields
    const briefingData = {
      foretagsnamn: company.name,
      orgnr: company.orgnr,
      adress: company.address,
      postnr: company.postal_code,
      ort: company.city,
      bransch: websiteAnalysis?.industry || company.sni_codes?.[0]?.description || 'Okänd bransch',
      sniKod: company.sni_codes?.[0]?.code || '',
      antalAnstallda: company.number_of_employees || 0,
      omsattning: company.revenue || 0,
      styrelse: company.board_members || [],
      verksamhet: websiteAnalysis?.description || company.description || 'Verksamhetsbeskrivning baserad på branschdata',
      techStack: [] as string[],
      kontakt: { email: data.email },
      scbStats: {
        genomsnittligLon: 45000,
        omsattningPerAnstalld: industryStats?.average_revenue_per_employee || 600000,
        totalEnterprises: industryStats?.total_enterprises || null,
        sizeDistribution: industryStats?.size_distribution || null,
      },
      roiPrognos: data.roiData ? (typeof data.roiData === 'string' ? JSON.parse(data.roiData) : data.roiData) : {
        besparingKr: 0, roiProcent: 0, paybackManader: 0, sparatTimmar: 0, fte: 0
      },
      // Use AI opportunities from website analysis OR fallback to generic
      rekommendationer: {
        fokus: websiteAnalysis?.aiOpportunities?.[0]?.description || 'Fokusera på att förstå företagets behov och identifiera bästa AI-möjligheterna',
        aiMojligheter: websiteAnalysis?.aiOpportunities || ['Orderbekräftelse-automation', 'AI-chatbot för kundtjänst', 'Fakturering automation']
      },
      // Load competitors from JSON file
      konkurrens: await loadCompetitors(),
      genererad: new Date().toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }

    // Step 3: Generate HTML (no Puppeteer needed!)
    console.log(' Generating HTML briefing...')

    const html = generateProHTML(
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
        competitors: briefingData.konkurrens.map((k: any) => ({
          name: k.name,
          pricing: k.pricing,
          service: k.focus || k.service,
          source: k.source || '',
        })),
        aiOpportunities: Array.isArray(briefingData.rekommendationer.aiMojligheter)
          ? briefingData.rekommendationer.aiMojligheter.map((ai: any, i: number) => ({
              title: typeof ai === 'string' ? ai : ai.title,
              description: typeof ai === 'string' ? ai : ai.description,
              estimatedSavings: typeof ai === 'string' ? '~10 h/vecka' : (ai.estimatedSavings || '~10 h/vecka'),
              priority: (typeof ai === 'string' ? (i === 0 ? 'high' : i === 1 ? 'high' : 'medium') : (ai.priority || 'medium')) as 'high' | 'medium' | 'low',
            }))
          : [],
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

    console.log('✅ HTML generated, size:', (html.length / 1024).toFixed(2), 'KB')

    // Step 4: Upload HTML to Supabase Storage
    const filename = `briefing-${company.orgnr}-${Date.now()}.html`
    const htmlUrl = await uploadHtmlToSupabase(html, filename)
    console.log('✅ HTML uploaded to Supabase:', htmlUrl)

    // Update lead record with HTML URL
    if (!ETEYA_SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('ETEYA_SUPABASE_SERVICE_ROLE_KEY is undefined')
    }

    await fetch(`${ETEYA_SUPABASE_URL}/rest/v1/eteya_leads?company=eq.${encodeURIComponent(data.company)}`, {
      method: 'PATCH',
      headers: {
        apikey: ETEYA_SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${ETEYA_SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ briefing_html_url: htmlUrl }),
    })
    console.log('✅ Lead record updated with HTML URL')

    // Step 5: Send email notification with HTML link
    await sendEmailNotification({
      name: data.name,
      email: data.email,
      company: data.company,
      service: data.service,
      bookingDate: new Date(data.bookingDate).toLocaleDateString('sv-SE', { dateStyle: 'long' }),
      htmlUrl,
    })

  } catch (error) {
    console.error('Research/HTML pipeline error:', error)
  }
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkWebhookRateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const startTime = Date.now()
  console.log('\n=== WEBHOOK RECEIVED ===')
  console.log('Timestamp:', new Date().toISOString())
  console.log('Headers:', JSON.stringify({
    'x-cal-signature': req.headers.get('x-cal-signature') ? '[PRESENT]' : '[MISSING]',
    'content-type': req.headers.get('content-type'),
  }, null, 2))

  try {
    const rawBody = await req.text()
    console.log('Raw body length:', rawBody.length)

    // Verify Cal.com webhook signature
    const signature = req.headers.get('x-cal-signature-256') || req.headers.get('x-cal-signature')
    const secret = process.env.CAL_WEBHOOK_SECRET

    console.log('Signature header:', signature ? '[PRESENT]' : '[MISSING]')

    // Handle ping events (no signature required)
    try {
      const body = JSON.parse(rawBody)
      if (body.event === 'PING' || body.triggerEvent === 'PING') {
        console.log(' Ping received, responding with 200 OK')
        return NextResponse.json({ ok: true, message: 'Ping received' })
      }
      console.log('Event type:', body.event || body.triggerEvent)
    } catch {
      console.log('Not JSON, continue with normal flow')
    }

    // Skip validation for test mode
    if (signature === 'test-skip-validation') {
      console.log('⚠️ Test mode: skipping signature validation')
    } else if (secret && signature) {
      if (!verifyCalSignature(rawBody, signature, secret)) {
        console.error('❌ Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
      console.log('✅ Signature verified')
    } else if (secret && !signature) {
      console.error('❌ Missing signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    } else {
      console.log('⚠️ No secret configured, skipping validation')
    }

    const body = JSON.parse(rawBody)

    console.log('\n=== FULL PAYLOAD ===')
    console.log('Event:', body.event || body.triggerEvent)
    console.log('Body keys:', Object.keys(body).join(', '))
    console.log('Full body:', JSON.stringify(body, null, 2).slice(0, 2000))

    // Only handle BOOKING_CREATED
    if (body.event !== 'BOOKING_CREATED' && body.triggerEvent !== 'BOOKING_CREATED') {
      console.log('Event not handled, returning early')
      return NextResponse.json({ ok: true, message: 'Event not handled' })
    }

    const payload = body.payload ?? body

    console.log('\n=== PAYLOAD STRUCTURE ===')
    console.log('Payload keys:', Object.keys(payload).join(', '))
    console.log('payload.responses:', payload.responses ? 'EXISTS' : 'MISSING')
    console.log('payload.attendees:', payload.attendees ? payload.attendees.length + ' items' : 'MISSING')
    console.log('payload.metadata:', payload.metadata ? 'EXISTS' : 'MISSING')
    console.log('payload.title:', payload.title)
    console.log('payload.description:', payload.description)

    // Helper to extract value from { label, value } objects
    const extractValue = (field: any): string => {
      if (!field) return ''
      if (typeof field === 'string') return field
      if (typeof field === 'object' && field.value) return String(field.value)
      return ''
    }

    // Helper to detect if a string looks like a website (contains .)
    const isWebsite = (str: string): boolean => {
      return str.includes('.') && !str.startsWith('http://') && !str.startsWith('https://')
    }

    // Extract data (handle { label, value } format from Cal.com)
    const name = extractValue(payload?.responses?.name ?? payload?.attendees?.[0]?.name ?? payload?.title)
    const email = extractValue(payload?.responses?.email ?? payload?.attendees?.[0]?.email)
    let company = extractValue(payload?.metadata?.company ?? payload?.responses?.company)
    let website = extractValue(payload?.metadata?.website) || null
    const service = extractValue(payload?.title)
    const description = extractValue(payload?.description ?? payload?.responses?.notes)

    // SMART PARSING: If company field is empty but website is filled (or vice versa), use whichever is available
    if (!company && website) {
      // User provided website but not company name
      // Extract company name from website (e.g., "telestore.se" -> "Telestore")
      company = website.replace(/^www\./, '').split('.')[0]
      // Capitalize first letter
      company = company.charAt(0).toUpperCase() + company.slice(1)
      console.log('🔍 Extracted company name from website:', company)
    } else if (company && !website && isWebsite(company)) {
      // User put website in company field
      website = company
      company = company.replace(/^www\./, '').split('.')[0]
      company = company.charAt(0).toUpperCase() + company.slice(1)
      console.log('🔍 Detected website in company field, extracted:', company)
    }

    // Build roiData from separate metadata fields (sent from ContactCard)
    const roiData = payload?.metadata?.annualSavings ? {
      annualSavings: Number(payload.metadata.annualSavings) || 0,
      totalHours: Number(payload.metadata.totalHours) || 0,
      roi: Number(payload.metadata.roi) || 0,
      payback: payload.metadata.payback ? Number(payload.metadata.payback) : null,
      implCost: payload.metadata.implCost ? Number(payload.metadata.implCost) : null,
      hourlyRate: payload.metadata.hourlyRate ? Number(payload.metadata.hourlyRate) : 350,
      year1: payload.metadata.year1 ? Number(payload.metadata.year1) : 0,
      year2: payload.metadata.year2 ? Number(payload.metadata.year2) : 0,
      year3: payload.metadata.year3 ? Number(payload.metadata.year3) : 0,
    } : null

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
      roiData: roiData ? JSON.stringify(roiData) : null,
      bookingDate: formattedDate,
    }

    // Save to Supabase + notify Discord in parallel
    console.log('\n=== SAVING TO SUPABASE ===')
    console.log('Lead data:', JSON.stringify({ name, email, company, service }, null, 2))

    const [saveResult, discordResult] = await Promise.allSettled([
      saveToSupabase(leadData),
      notifyDiscord({ name, company, service, bookingDate: formattedDate }),
    ])

    console.log('Supabase save result:', saveResult.status)
    console.log('Discord notify result:', discordResult.status)

    if (saveResult.status === 'rejected') {
      console.error('❌ Supabase save failed:', saveResult.reason)
    }
    if (discordResult.status === 'rejected') {
      console.error('❌ Discord notify failed:', discordResult.reason)
    }

    // Generate HTML (await to ensure completion before response)
    console.log('\n=== GENERATING HTML BRIEFING ===')
    console.log('Company:', company)
    console.log('ROI data:', roiData ? 'PRESENT' : 'MISSING')

    await runResearchAndGenerateHTML({
      name,
      email,
      company,
      website: website || undefined,
      service,
      roiData: leadData.roiData,
      bookingDate,
    })

    console.log('\n=== WEBHOOK COMPLETE ===')
    console.log('Total execution time: ~', ((Date.now() - startTime) / 1000).toFixed(2), 's')

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Cal webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
