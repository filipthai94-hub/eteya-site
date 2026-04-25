import type { WebsiteAnalysis } from './website-analyzer'
import { normalizeWebsiteUrl } from './website-analyzer'

export type ApiCompany = {
  name?: string | null
  orgnr?: string | null
  org_number?: string | null
  address?: string | null
  postal_code?: string | null
  city?: string | null
  sni_codes?: { code?: string | null; description?: string | null }[] | null
  number_of_employees?: number | null
  employee_class?: string | null
  revenue?: number | null
  board_members?: unknown[] | null
  description?: string | null
  website?: string | null
  legal_form?: string | null
  status?: string | null
  registration_date?: string | null
}

export type IndustryStats = {
  average_revenue_per_employee?: number | null
  total_enterprises?: number | null
  size_distribution?: unknown
}

export type EnrichedCompany = {
  name: string
  orgnr: string | null
  website: string | null
  address: string | null
  postalCode: string | null
  city: string | null
  industry: string | null
  sniCode: string | null
  employees: number | null
  revenue: number | null
  boardMembers: unknown[]
  description: string | null
  verified: boolean
  confidence: 'high' | 'medium' | 'low'
  warnings: string[]
  candidatesTried: string[]
  source: 'apiverket' | 'input-fallback'
  raw?: ApiCompany | null
}

export type CompanyEnrichmentResult = {
  company: EnrichedCompany
  industryStats: IndustryStats | null
}

type SearchCandidate = ApiCompany & Record<string, unknown>

type EnrichInput = {
  company?: string | null
  websiteInput?: string | null
  websiteAnalysis?: WebsiteAnalysis | null
  apiKey?: string | null
}

const COMPANY_SUFFIXES = /\b(ab|aktiebolag|hb|handelsbolag|kb|kommanditbolag|ekonomisk förening|ek\. för\.|ltd|limited|inc|llc)\b/gi
const STOP_TOKENS = new Set(['www', 'http', 'https', 'com', 'se', 'nu', 'ai', 'io', 'ab', 'aktiebolag', 'sverige', 'sweden'])

export function looksLikeWebsiteInput(input: string): boolean {
  const value = input.trim()
  if (!value) return false
  if (/^https?:\/\//i.test(value)) return true
  return /^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(value)
}

export function normalizedCompanyName(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(COMPANY_SUFFIXES, '')
    .replace(/[^a-z0-9åäö\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function companyNameFromWebsite(input: string): string {
  try {
    const hostname = new URL(normalizeWebsiteUrl(input)).hostname.replace(/^www\./i, '')
    const baseName = hostname.split('.')[0] || hostname
    return titleCase(baseName.replace(/[-_]+/g, ' '))
  } catch {
    const cleaned = input.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0].split('.')[0]
    return titleCase(cleaned.replace(/[-_]+/g, ' '))
  }
}

export function normalizeWebsiteInput(input?: string | null): string | null {
  if (!input?.trim()) return null
  if (!looksLikeWebsiteInput(input)) return null
  return normalizeWebsiteUrl(input)
}

function titleCase(input: string): string {
  return input.replace(/\b\w/g, char => char.toUpperCase()).trim()
}

function domainTokens(input?: string | null): string[] {
  if (!input) return []
  try {
    const hostname = new URL(normalizeWebsiteUrl(input)).hostname.replace(/^www\./i, '')
    return hostname.split(/[.-]/).map(t => t.toLowerCase()).filter(token => token && !STOP_TOKENS.has(token))
  } catch {
    return []
  }
}

function nameTokens(input?: string | null): string[] {
  if (!input) return []
  return normalizedCompanyName(input).split(/[\s-]+/).filter(token => token.length >= 2 && !STOP_TOKENS.has(token))
}

export function generateCompanyCandidates(input: { company?: string | null; websiteInput?: string | null; websiteAnalysis?: WebsiteAnalysis | null }): string[] {
  const candidates: string[] = []
  const add = (value?: string | null) => {
    const normalized = value?.trim()
    if (normalized && normalized.length >= 2 && !candidates.includes(normalized)) candidates.push(normalized)
  }

  add(input.company)
  if (input.websiteInput && looksLikeWebsiteInput(input.websiteInput)) add(companyNameFromWebsite(input.websiteInput))
  add(domainTokens(input.websiteInput)[0])
  add(input.websiteAnalysis?.title?.split(/[|–—-]/)[0])
  add(input.websiteAnalysis?.h1?.[0])

  const text = `${input.websiteAnalysis?.title || ''} ${input.websiteAnalysis?.description || ''} ${input.websiteAnalysis?.bodyText?.slice(0, 1000) || ''}`
  const legalNameMatch = text.match(/([A-ZÅÄÖ][\wÅÄÖåäö&\s-]{2,80}\s(?:AB|Aktiebolag|HB|Handelsbolag|KB))\b/)
  add(legalNameMatch?.[1])

  return candidates.slice(0, 8)
}

function getCandidateName(candidate: SearchCandidate): string {
  return String(candidate.name || candidate.company_name || candidate.foretagsnamn || candidate.namn || '').trim()
}

function getCandidateOrgnr(candidate: SearchCandidate): string | null {
  const value = candidate.orgnr || candidate.org_number || candidate.organization_number || candidate.organisationsnummer || candidate.org_no
  return value ? String(value) : null
}

function scoreSearchCandidate(candidate: SearchCandidate, signals: { company?: string | null; websiteInput?: string | null; websiteAnalysis?: WebsiteAnalysis | null }): number {
  const candidateName = getCandidateName(candidate)
  const candidateNorm = normalizedCompanyName(candidateName)
  const queryTokens = new Set([
    ...nameTokens(signals.company),
    ...domainTokens(signals.websiteInput),
    ...nameTokens(signals.websiteAnalysis?.title?.split(/[|–—-]/)[0]),
  ])
  const candidateTokens = new Set(nameTokens(candidateName))

  let score = 0
  const normalizedInput = normalizedCompanyName(signals.company || '')
  if (normalizedInput && candidateNorm === normalizedInput) score += 70
  if (normalizedInput && candidateNorm.includes(normalizedInput)) score += 35

  for (const token of queryTokens) {
    if (candidateTokens.has(token)) score += 16
    else if (candidateNorm.includes(token)) score += 8
  }

  for (const token of domainTokens(signals.websiteInput)) {
    if (candidateNorm.includes(token)) score += 22
  }

  const sniDescription = String(candidate.sni_description || candidate.sni_codes?.[0]?.description || '').toLowerCase()
  const websiteIndustry = signals.websiteAnalysis?.industry?.toLowerCase() || ''
  if (sniDescription && websiteIndustry && websiteIndustry.split(/[\/\s-]+/).some(part => part.length > 4 && sniDescription.includes(part))) score += 8
  if (candidate.status === 'active' || candidate.active === true) score += 5

  return score
}

async function searchApiverket(query: string, apiKey: string): Promise<SearchCandidate[]> {
  const response = await fetch(`https://apiverket.se/v1/companies/search?q=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(9000),
  })
  if (!response.ok) throw new Error(`Apiverket search ${response.status}`)
  const json: unknown = await response.json().catch(() => null)
  if (Array.isArray(json)) return json as SearchCandidate[]
  if (json && typeof json === 'object') {
    const payload = json as { data?: unknown; results?: unknown }
    if (Array.isArray(payload.data)) return payload.data as SearchCandidate[]
    if (Array.isArray(payload.results)) return payload.results as SearchCandidate[]
    if (payload.data && typeof payload.data === 'object') {
      const data = payload.data as { companies?: unknown; results?: unknown }
      if (Array.isArray(data.companies)) return data.companies as SearchCandidate[]
      if (Array.isArray(data.results)) return data.results as SearchCandidate[]
    }
  }
  return []
}

async function fetchCompanyDetails(orgnr: string, apiKey: string): Promise<ApiCompany | null> {
  const response = await fetch(`https://apiverket.se/v1/companies/${encodeURIComponent(orgnr)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(9000),
  })
  if (!response.ok) throw new Error(`Apiverket details ${response.status}`)
  const json: unknown = await response.json().catch(() => null)
  if (!json || typeof json !== 'object') return null
  const payload = json as { data?: unknown }
  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) return payload.data as ApiCompany
  return json as ApiCompany
}

async function fetchIndustryStats(sniCode: string | null, apiKey: string): Promise<IndustryStats | null> {
  if (!sniCode) return null
  const response = await fetch(`https://api.apiverket.se/v1/statistics/industry/${encodeURIComponent(sniCode)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(9000),
  })
  if (!response.ok) return null
  return response.json().catch(() => null)
}

function nonZeroOrNull(value: unknown): number | null {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue) || numberValue <= 0) return null
  return numberValue
}

function toCompany(company: ApiCompany | null, fallbackName: string, website: string | null, options: { verified: boolean; confidence: 'high' | 'medium' | 'low'; warnings: string[]; candidatesTried: string[]; source: 'apiverket' | 'input-fallback' }): EnrichedCompany {
  const sni = company?.sni_codes?.[0]
  const employees = nonZeroOrNull(company?.number_of_employees)
  const warnings = [...options.warnings]
  if (employees === null && company?.employee_class) warnings.push(`Apiverket anger endast storleksklass (${company.employee_class}); exakt antal anställda ej verifierat`)

  return {
    name: company?.name?.trim() || fallbackName || 'Okänt företag',
    orgnr: company?.orgnr || company?.org_number || null,
    website: website || company?.website || null,
    address: company?.address || null,
    postalCode: company?.postal_code || null,
    city: company?.city || null,
    industry: sni?.description || company?.description || null,
    sniCode: sni?.code || null,
    employees,
    revenue: nonZeroOrNull(company?.revenue),
    boardMembers: company?.board_members || [],
    description: company?.description || sni?.description || null,
    verified: options.verified,
    confidence: options.confidence,
    warnings,
    candidatesTried: options.candidatesTried,
    source: options.source,
    raw: company,
  }
}

export async function enrichCompany(input: EnrichInput): Promise<CompanyEnrichmentResult> {
  const website = normalizeWebsiteInput(input.websiteInput || input.websiteAnalysis?.url || null)
  const fallbackName = input.company?.trim() || (website ? companyNameFromWebsite(website) : '') || input.websiteAnalysis?.title?.split(/[|–—-]/)[0]?.trim() || 'Okänt företag'
  const candidates = generateCompanyCandidates(input)
  const warnings: string[] = []

  if (!input.apiKey) {
    warnings.push('APIVERKET_API_KEY saknas; företagsdata ej verifierad')
    return { company: toCompany(null, fallbackName, website, { verified: false, confidence: 'low', warnings, candidatesTried: candidates, source: 'input-fallback' }), industryStats: null }
  }

  try {
    const searchResults: SearchCandidate[] = []
    for (const candidate of candidates.length ? candidates : [fallbackName]) {
      try {
        const results = await searchApiverket(candidate, input.apiKey)
        searchResults.push(...results)
      } catch (error) {
        warnings.push(`Apiverket-sökning misslyckades för "${candidate}": ${error instanceof Error ? error.message : 'okänt fel'}`)
      }
      if (searchResults.length >= 12) break
    }

    const deduped = Array.from(new Map(searchResults.map(result => [getCandidateOrgnr(result) || getCandidateName(result), result])).values())
    const ranked = deduped
      .map(result => ({ result, score: scoreSearchCandidate(result, input) }))
      .sort((a, b) => b.score - a.score)

    const best = ranked[0]
    const orgnr = best ? getCandidateOrgnr(best.result) : null
    if (!best || !orgnr || best.score < 24) {
      warnings.push('Ingen tillräckligt säker Apiverket-träff; använder input/website som fallback')
      return { company: toCompany(null, fallbackName, website, { verified: false, confidence: 'low', warnings, candidatesTried: candidates, source: 'input-fallback' }), industryStats: null }
    }

    const details = await fetchCompanyDetails(orgnr, input.apiKey).catch(error => {
      warnings.push(`Kunde inte hämta bolagsdetaljer: ${error instanceof Error ? error.message : 'okänt fel'}`)
      return best.result as ApiCompany
    })

    const sniCode = details?.sni_codes?.[0]?.code || null
    const industryStats = await fetchIndustryStats(sniCode, input.apiKey).catch(() => null)
    const confidence: 'high' | 'medium' | 'low' = best.score >= 60 ? 'high' : best.score >= 36 ? 'medium' : 'low'
    if (confidence !== 'high') warnings.push(`Apiverket-träff matchade med ${confidence} confidence; verifiera bolagsnamn/orgnr manuellt`)

    return {
      company: toCompany(details, fallbackName, website, { verified: true, confidence, warnings, candidatesTried: candidates, source: 'apiverket' }),
      industryStats,
    }
  } catch (error) {
    warnings.push(`Bolagsberikning misslyckades: ${error instanceof Error ? error.message : 'okänt fel'}`)
    return { company: toCompany(null, fallbackName, website, { verified: false, confidence: 'low', warnings, candidatesTried: candidates, source: 'input-fallback' }), industryStats: null }
  }
}
