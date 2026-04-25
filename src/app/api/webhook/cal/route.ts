import { after, NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

export const maxDuration = 60

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
import { generateProHTML } from '@/lib/generate-pro-briefing-html'


type ApiCompany = {
  name?: string
  orgnr?: string
  address?: string
  postal_code?: string
  city?: string
  sni_codes?: { code?: string; description?: string }[]
  number_of_employees?: number
  revenue?: number
  board_members?: unknown[]
  description?: string
}

type IndustryStats = {
  average_revenue_per_employee?: number
  total_enterprises?: number | null
  size_distribution?: unknown
}

type Competitor = {
  name?: string
  pricing?: string
  service?: string
  focus?: string
  source?: string
}

type BriefingAIOpportunity = {
  title?: string
  description?: string
  estimatedSavings?: string
  priority?: 'high' | 'medium' | 'low'
}

function verifyCalSignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(payload).digest('hex')
  const provided = signature.replace(/^sha256=/, '')

  if (!/^[a-f0-9]+$/i.test(provided)) return false

  const expectedBuffer = Buffer.from(expected, 'hex')
  const providedBuffer = Buffer.from(provided, 'hex')

  if (expectedBuffer.length !== providedBuffer.length) return false
  return timingSafeEqual(expectedBuffer, providedBuffer)
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return '[invalid-email]'
  return `${local.slice(0, 2)}***@${domain}`
}

function normalizeWebsite(input: string): string {
  const value = input.trim().replace(/\/+$/, '')
  if (!value) return ''
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

function looksLikeWebsite(input: string): boolean {
  const value = input.trim()
  if (!value) return false
  if (/^https?:\/\//i.test(value)) return true
  return /^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(value)
}

function companyFromWebsite(input: string): string {
  try {
    const hostname = new URL(normalizeWebsite(input)).hostname.replace(/^www\./i, '')
    const baseName = hostname.split('.')[0] || hostname
    return baseName.charAt(0).toUpperCase() + baseName.slice(1)
  } catch {
    const cleaned = input.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0].split('.')[0]
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  }
}

async function saveToSupabase(data: {
  name: string
  email: string
  company: string
  service: string
  description: string
  roiData: string | null
  bookingDate: string
  gdprAccepted: boolean
}): Promise<string | null> {
  const { ETEYA_SUPABASE_URL, ETEYA_SUPABASE_SERVICE_ROLE_KEY } = process.env
  if (!ETEYA_SUPABASE_URL || !ETEYA_SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Supabase env vars missing, skipping save')
    return null
  }

  try {
    const res = await fetch(`${ETEYA_SUPABASE_URL}/rest/v1/eteya_leads`, {
      method: 'POST',
      headers: {
        apikey: ETEYA_SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${ETEYA_SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
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
        gdpr_accepted: data.gdprAccepted,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => '[unreadable response]')
      console.error('❌ Supabase save failed:', res.status, errorText)
      return null
    }

    const rows = await res.json().catch(() => null)
    const leadId = Array.isArray(rows) && typeof rows[0]?.id === 'string' ? rows[0].id : null
    if (!leadId) {
      console.warn('Supabase save succeeded but no lead id was returned')
    }
    return leadId
  } catch (error) {
    console.error('❌ Supabase save exception:', error)
    return null
  }
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
  leadId?: string | null
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

    let company: ApiCompany | null = null
    let industryStats: IndustryStats | null = null

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
          name: briefingData.foretagsnamn || data.company || 'Okänt företag',
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
        competitors: briefingData.konkurrens.map((k: Competitor) => ({
          name: k.name || 'Okänd konkurrent',
          pricing: k.pricing || 'Okänt pris',
          service: k.focus || k.service || 'Okänd tjänst',
          source: k.source || '',
        })),
        aiOpportunities: Array.isArray(briefingData.rekommendationer.aiMojligheter)
          ? briefingData.rekommendationer.aiMojligheter.map((ai: string | BriefingAIOpportunity, i: number) => ({
              title: typeof ai === 'string' ? ai : (ai.title || 'AI-möjlighet'),
              description: typeof ai === 'string' ? ai : (ai.description || 'Identifiera relevant AI-möjlighet'),
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
        hourlyRate: 400,
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
    if (!ETEYA_SUPABASE_URL || !ETEYA_SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase env vars missing for briefing URL update')
    }

    const patchFilter = data.leadId
      ? `id=eq.${encodeURIComponent(data.leadId)}`
      : `company=eq.${encodeURIComponent(data.company)}`
    const patchRes = await fetch(`${ETEYA_SUPABASE_URL}/rest/v1/eteya_leads?${patchFilter}`, {
      method: 'PATCH',
      headers: {
        apikey: ETEYA_SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${ETEYA_SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ briefing_html_url: htmlUrl }),
    })

    if (!patchRes.ok) {
      const errorText = await patchRes.text().catch(() => '[unreadable response]')
      console.error('❌ Failed to update lead with HTML URL:', {
        status: patchRes.status,
        leadId: data.leadId || '[missing]',
        fallback: data.leadId ? 'none' : 'company',
        error: errorText,
      })
    } else {
      console.log('✅ Lead record updated with HTML URL:', data.leadId ? 'by lead id' : 'by company fallback')
    }

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

    const isNonProductionTestBypass = signature === 'test-skip-validation' && process.env.NODE_ENV !== 'production'

    if (isNonProductionTestBypass) {
      console.log('⚠️ Non-production test mode: skipping signature validation')
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

    const eventType = body.event || body.triggerEvent
    const bookingId = body.payload?.bookingId || body.payload?.id || body.payload?.uid || body.uid || 'unknown'

    console.log('Webhook event:', eventType, 'bookingId:', bookingId)
    console.log('Body keys:', Object.keys(body).join(', '))

    // Only handle BOOKING_CREATED
    if (eventType !== 'BOOKING_CREATED') {
      console.log('Event not handled, returning early:', eventType)
      return NextResponse.json({ ok: true, message: 'Event not handled' })
    }

    const payload = body.payload ?? body
    const metadata = payload?.metadata ?? {}

    console.log('Payload summary:', JSON.stringify({
      bookingId: payload?.bookingId || payload?.id || payload?.uid || bookingId,
      hasResponses: Boolean(payload.responses),
      attendeeCount: payload.attendees?.length ?? 0,
      hasMetadata: Boolean(payload.metadata),
      eventTitle: payload.eventTitle || payload.title || '[missing]',
    }))

    // Helper to extract value from { label, value } objects
    const extractValue = (field: unknown): string => {
      if (!field) return ''
      if (typeof field === 'string') return field.trim()
      if (typeof field === 'object' && field !== null && 'value' in field) return String(field.value).trim()
      return ''
    }

    // Extract data (handle { label, value } format from Cal.com)
    const name = extractValue(payload?.responses?.name ?? payload?.attendees?.[0]?.name ?? payload?.title)
    const email = extractValue(payload?.responses?.email ?? payload?.attendees?.[0]?.email)
    const websiteInput = extractValue(metadata.website)
    const service = extractValue(metadata.service ?? payload?.eventTitle ?? payload?.title)
    const description = extractValue(payload?.description ?? payload?.responses?.notes)
    const gdprAccepted = metadata.gdprAccepted === 'true' || metadata.gdprAccepted === true || Boolean(metadata.gdprAcceptedAt)

    // SMART PARSING: Extract company name from website input
    // User can enter: "telestore.se", "www.telestore.se", "https://telestore.se", or "Telestore Sverige AB".
    let company = ''
    let website = ''

    if (websiteInput) {
      if (looksLikeWebsite(websiteInput)) {
        website = normalizeWebsite(websiteInput)
        company = companyFromWebsite(websiteInput)
      } else {
        company = websiteInput.trim()
      }
    }

    const toNumber = (value: unknown, fallback = 0) => {
      const numberValue = Number(value)
      return Number.isFinite(numberValue) ? numberValue : fallback
    }

    // Build roiData from separate metadata fields (sent from ContactCard), keeping originals
    // and adding briefing-format aliases expected downstream.
    const roiData = metadata.annualSavings ? {
      annualSavings: toNumber(metadata.annualSavings),
      totalHours: toNumber(metadata.totalHours),
      roi: toNumber(metadata.roi),
      payback: metadata.payback ? toNumber(metadata.payback) : null,
      implCost: metadata.implCost ? toNumber(metadata.implCost) : null,
      hourlyRate: metadata.hourlyRate ? toNumber(metadata.hourlyRate, 400) : 400,
      year1: metadata.year1 ? toNumber(metadata.year1) : 0,
      year2: metadata.year2 ? toNumber(metadata.year2) : 0,
      year3: metadata.year3 ? toNumber(metadata.year3) : 0,
      roiProcesses: metadata.roiProcesses || null,
      besparingKr: toNumber(metadata.annualSavings),
      sparatTimmar: toNumber(metadata.totalHours),
      roiProcent: toNumber(metadata.roi),
      paybackManader: metadata.payback ? toNumber(metadata.payback) : 0,
      fte: toNumber(metadata.fte),
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
      gdprAccepted,
    }

    // Save to Supabase + notify Discord in parallel before returning.
    console.log('Saving lead:', JSON.stringify({
      bookingId: payload?.bookingId || payload?.id || payload?.uid || bookingId,
      email: email ? maskEmail(email) : '[missing]',
      company: company || '[missing]',
      service: service || '[missing]',
      hasRoiData: Boolean(roiData),
      gdprAccepted,
    }))

    const [saveResult, discordResult] = await Promise.allSettled([
      saveToSupabase(leadData),
      notifyDiscord({ name, company, service, bookingDate: formattedDate }),
    ])

    console.log('Supabase save result:', saveResult.status)
    console.log('Discord notify result:', discordResult.status)

    const leadId = saveResult.status === 'fulfilled' ? saveResult.value : null

    if (saveResult.status === 'rejected') {
      console.error('❌ Supabase save failed:', saveResult.reason)
    }
    if (discordResult.status === 'rejected') {
      console.error('❌ Discord notify failed:', discordResult.reason)
    }

    // Generate research/HTML after the response using Next.js after(), so Vercel keeps it within route maxDuration.
    after(async () => {
      try {
        await runResearchAndGenerateHTML({
          leadId,
          name,
          email,
          company,
          website: website || undefined,
          service,
          roiData: leadData.roiData,
          bookingDate,
        })
      } catch (error) {
        console.error('Async research/HTML pipeline failed:', {
          bookingId: payload?.bookingId || payload?.id || payload?.uid || bookingId,
          leadId: leadId || '[missing]',
          email: email ? maskEmail(email) : '[missing]',
          error,
        })
      }
    })

    console.log('\n=== WEBHOOK COMPLETE ===')
    console.log('Total execution time: ~', ((Date.now() - startTime) / 1000).toFixed(2), 's')

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Cal webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
