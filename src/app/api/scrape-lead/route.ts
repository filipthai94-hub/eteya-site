import { NextRequest, NextResponse } from 'next/server'

const APIVERKET_API_KEY = process.env.APIVERKET_API_KEY
const APIVERKET_BASE_URL = 'https://apiverket.se/v1'

interface ApiverketCompany {
  org_number: string
  name: string
  legal_form: string
  status: string
  registration_date: string
  address: string
  postal_code: string
  city: string
  sni_codes: Array<{ code: string; description: string }>
}

interface IndustryStats {
  sni_code: string
  sni_description: string
  total_enterprises: number
  size_distribution: Record<string, number>
  year: string
}

interface ScrapeResult {
  company: {
    name: string
    orgnr: string
    address: string
    postal_code: string
    city: string
    legal_form: string
    status: string
    registration_date: string
    sni_codes: Array<{ code: string; description: string }>
  } | null
  industryStats: IndustryStats | null
  error?: string
}

async function searchApiverket(name: string): Promise<ApiverketCompany[]> {
  try {
    const res = await fetch(`${APIVERKET_BASE_URL}/companies/search?q=${encodeURIComponent(name)}`, {
      headers: { 'Authorization': `Bearer ${APIVERKET_API_KEY}` },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return []
    const data = await res.json()
    return data?.data?.companies || []
  } catch {
    return []
  }
}

async function lookupApiverket(orgnr: string): Promise<ApiverketCompany | null> {
  try {
    const res = await fetch(`${APIVERKET_BASE_URL}/companies/${orgnr.replace(/-/g, '')}`, {
      headers: { 'Authorization': `Bearer ${APIVERKET_API_KEY}` },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.data || null
  } catch {
    return null
  }
}

async function getIndustryStats(sniCode: string): Promise<IndustryStats | null> {
  try {
    const res = await fetch(`${APIVERKET_BASE_URL}/statistics/industry/${sniCode}`, {
      headers: { 'Authorization': `Bearer ${APIVERKET_API_KEY}` },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.data || null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  // Require internal API key
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { companyName, website, orgnr } = body

    if (!companyName && !orgnr) {
      return NextResponse.json({ error: 'companyName or orgnr required' }, { status: 400 })
    }

    // Step 1: Get company data from Apiverket
    let company: ApiverketCompany | null = null

    if (orgnr) {
      company = await lookupApiverket(orgnr)
    }
    if (!company && companyName) {
      const results = await searchApiverket(companyName)
      company = results[0] || null
    }

    if (!company) {
      return NextResponse.json({
        company: null,
        industryStats: null,
        error: 'Company not found',
      } satisfies ScrapeResult)
    }

    // Step 2: Get industry stats (2-digit SNI for overview)
    const sniCode = company.sni_codes?.[0]?.code
    let industryStats: IndustryStats | null = null

    if (sniCode) {
      industryStats = await getIndustryStats(sniCode.slice(0, 2))
    }

    const result: ScrapeResult = {
      company: {
        name: company.name,
        orgnr: company.org_number,
        address: company.address,
        postal_code: company.postal_code,
        city: company.city,
        legal_form: company.legal_form,
        status: company.status,
        registration_date: company.registration_date,
        sni_codes: company.sni_codes || [],
      },
      industryStats,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('scrape-lead error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Require internal API key
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const companyName = searchParams.get('q')
  const orgnr = searchParams.get('orgnr')

  if (!companyName && !orgnr) {
    return NextResponse.json({ error: 'q or orgnr parameter required' }, { status: 400 })
  }

  // Reuse POST logic via internal call
  const postReq = new NextRequest(req.url, {
    method: 'POST',
    body: JSON.stringify({ companyName: companyName || undefined, orgnr: orgnr || undefined }),
    headers: { 'Content-Type': 'application/json' },
  })
  return POST(postReq)
}