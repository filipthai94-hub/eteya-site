export type FinancialMetricConfidence = 'high' | 'medium' | 'low' | 'not_available'

export type FinancialMetric = {
  raw: string | null
  valueSek: number | null
  unit: string | null
}

export type FinancialYear = {
  fiscalYear: string | null
  revenue: FinancialMetric
  profitAfterFinancialNet: FinancialMetric
  netIncome: FinancialMetric
  employees: number | null
}

export type FinancialEnrichment = {
  status: 'available' | 'not_available'
  source: 'allabolag'
  sourceUrl: string | null
  companyName: string
  orgnr: string | null
  orgnrMatched: boolean
  latestYear: FinancialYear | null
  confidence: FinancialMetricConfidence
  warnings: string[]
  fetchedAt: string
}

type EnrichFinancialsInput = {
  companyName: string
  orgnr?: string | null
  knownUrl?: string | null
}

const ALLABOLAG_BASE = 'https://www.allabolag.se'
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36'

function emptyMetric(): FinancialMetric {
  return { raw: null, valueSek: null, unit: null }
}

function notAvailable(input: EnrichFinancialsInput, warnings: string[], sourceUrl: string | null = null): FinancialEnrichment {
  return {
    status: 'not_available',
    source: 'allabolag',
    sourceUrl,
    companyName: input.companyName,
    orgnr: input.orgnr || null,
    orgnrMatched: false,
    latestYear: null,
    confidence: 'not_available',
    warnings,
    fetchedAt: new Date().toISOString(),
  }
}

function normalizeOrgnr(value?: string | null): string | null {
  const digits = value?.replace(/\D/g, '') || ''
  return digits.length >= 10 ? digits.slice(-10) : null
}

function htmlDecode(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/g, "'")
    .replace(/&aring;/gi, 'å')
    .replace(/&auml;/gi, 'ä')
    .replace(/&ouml;/gi, 'ö')
    .replace(/&Aring;/g, 'Å')
    .replace(/&Auml;/g, 'Ä')
    .replace(/&Ouml;/g, 'Ö')
}

function stripTags(value: string): string {
  return htmlDecode(value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeText(value: string): string {
  return stripTags(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
}

function parseSwedishNumber(value: string): number | null {
  const cleaned = htmlDecode(value)
    .replace(/[−–—]/g, '-')
    .replace(/\u00a0/g, ' ')
    .replace(/\s/g, '')
    .replace(/[^0-9,.-]/g, '')
  if (!cleaned || cleaned === '-') return null
  const decimalNormalized = cleaned.includes(',') && !cleaned.includes('.') ? cleaned.replace(',', '.') : cleaned.replace(/,/g, '')
  const parsed = Number(decimalNormalized)
  return Number.isFinite(parsed) ? parsed : null
}

function parseMoney(rawValue: string | null, defaultMultiplier: number): FinancialMetric {
  if (!rawValue) return emptyMetric()
  const raw = stripTags(rawValue)
  const lower = raw.toLowerCase()
  let multiplier = defaultMultiplier
  let unit = defaultMultiplier === 1000 ? 'tkr' : 'SEK'
  if (/\bmkr\b|miljoner/.test(lower)) {
    multiplier = 1_000_000
    unit = 'Mkr'
  } else if (/\btkr\b|belopp i 1000/.test(lower)) {
    multiplier = 1000
    unit = 'tkr'
  } else if (/\bkr\b|sek/.test(lower)) {
    unit = defaultMultiplier === 1000 ? 'tkr' : 'SEK'
  }
  const number = parseSwedishNumber(raw)
  return { raw: unit === 'tkr' && !/tkr|belopp i 1000/i.test(raw) ? `${raw} tkr` : raw, valueSek: number === null ? null : Math.round(number * multiplier), unit }
}

function absoluteAllabolagUrl(value: string): string | null {
  try {
    const url = new URL(value, ALLABOLAG_BASE)
    if (url.hostname !== 'www.allabolag.se' && url.hostname !== 'allabolag.se') return null
    if (url.pathname.startsWith('/api/')) return null
    return url.toString()
  } catch {
    return null
  }
}

async function fetchHtml(url: string): Promise<{ html: string; finalUrl: string }> {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'sv-SE,sv;q=0.9,en;q=0.8',
      'cache-control': 'no-cache',
    },
    signal: AbortSignal.timeout(12000),
  })
  const html = await response.text().catch(() => '')
  if (!response.ok) throw new Error(`Allabolag fetch ${response.status}`)
  if (!html || html.length < 500) throw new Error('Allabolag svarade med tomt eller mycket kort HTML-svar')
  return { html, finalUrl: response.url || url }
}

function findCompanyUrlInSearchHtml(html: string, expectedOrgnr?: string | null): string | null {
  const links = Array.from(html.matchAll(/href=["']([^"']*\/foretag\/[^"']+)["']/gi)).map(match => absoluteAllabolagUrl(match[1])).filter(Boolean) as string[]
  if (!links.length) return null
  if (!expectedOrgnr) return links[0]

  const expectedFormatted = `${expectedOrgnr.slice(0, 6)}-${expectedOrgnr.slice(6)}`
  const snippets = html.split(/<a\b/i)
  for (const snippet of snippets) {
    if ((snippet.includes(expectedOrgnr) || snippet.includes(expectedFormatted)) && snippet.includes('/foretag/')) {
      const link = snippet.match(/href=["']([^"']*\/foretag\/[^"']+)["']/i)?.[1]
      const absolute = link ? absoluteAllabolagUrl(link) : null
      if (absolute) return absolute
    }
  }
  return null
}

async function resolveAllabolagUrl(input: EnrichFinancialsInput, warnings: string[]): Promise<string | null> {
  const known = input.knownUrl ? absoluteAllabolagUrl(input.knownUrl) : null
  if (known) return known
  if (input.knownUrl && !known) warnings.push('Angiven Allabolag-URL ignorerades eftersom den inte var en giltig allabolag.se företags-URL')

  const orgnr = normalizeOrgnr(input.orgnr)
  if (orgnr) return `${ALLABOLAG_BASE}/${orgnr}`

  const query = input.companyName.trim()
  if (!query || query.length < 2) return null
  try {
    const { html } = await fetchHtml(`${ALLABOLAG_BASE}/what/${encodeURIComponent(query)}`)
    return findCompanyUrlInSearchHtml(html, null)
  } catch (error) {
    warnings.push(`Allabolag-sökning misslyckades: ${error instanceof Error ? error.message : 'okänt fel'}`)
    return null
  }
}

function htmlContainsOrgnr(html: string, expected: string | null): boolean {
  if (!expected) return false
  const formatted = `${expected.slice(0, 6)}-${expected.slice(6)}`
  const text = stripTags(html)
  return text.includes(expected) || text.includes(formatted)
}

function amountMultiplier(html: string): number {
  return /Belopp i\s*1000|Valutakod\s*\(\s*Belopp i\s*1000\s*\)/i.test(stripTags(html)) ? 1000 : 1
}

function extractFiscalYear(html: string): string | null {
  const header = html.match(/<th[^>]*>\s*Bokslut\s*<\/th>\s*<th[^>]*>\s*(20\d{2}(?:-\d{2})?)\s*<\/th>/i)
  if (header) return stripTags(header[1])
  const widget = html.match(/StatsWidget-header[^>]*>\s*Omsättning[\s\S]{0,80}?(20\d{2})/i)
  return widget?.[1] || null
}

function extractTableValue(html: string, label: string): string | null {
  const labelPattern = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')
  const regex = new RegExp(`<tr[^>]*>[\\s\\S]{0,500}?<th[^>]*>[\\s\\S]*?${labelPattern}[\\s\\S]*?<\\/th>[\\s\\S]{0,200}?<td[^>]*>([\\s\\S]*?)<\\/td>`, 'i')
  const match = html.match(regex)
  return match ? stripTags(match[1]) : null
}

function extractWidgetValue(html: string, label: string): { value: string | null; year: string | null } {
  const labelPattern = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')
  const regex = new RegExp(`StatsWidget-header[^>]*>[\\s\\S]*?${labelPattern}[\\s\\S]*?(20\\d{2})?[\\s\\S]*?<\\/span>[\\s\\S]{0,200}?StatsWidget-value[^>]*>([\\s\\S]*?)<\\/span>`, 'i')
  const match = html.match(regex)
  return { value: match ? stripTags(match[2]) : null, year: match?.[1] || null }
}

function extractEmployees(html: string): number | null {
  const widget = extractWidgetValue(html, 'Anställda').value
  const table = extractTableValue(html, 'Anställda')
  const parsed = parseSwedishNumber(widget || table || '')
  return parsed === null ? null : Math.round(parsed)
}

function parseFinancials(html: string): FinancialYear {
  const multiplier = amountMultiplier(html)
  const widgetRevenue = extractWidgetValue(html, 'Omsättning')
  const widgetProfit = extractWidgetValue(html, 'Resultat efter finansnetto')
  const fiscalYear = extractFiscalYear(html) || widgetRevenue.year || widgetProfit.year
  return {
    fiscalYear,
    revenue: parseMoney(extractTableValue(html, 'Omsättning') || widgetRevenue.value, multiplier),
    profitAfterFinancialNet: parseMoney(extractTableValue(html, 'Resultat efter finansnetto') || widgetProfit.value, multiplier),
    netIncome: parseMoney(extractTableValue(html, 'Årets resultat'), multiplier),
    employees: extractEmployees(html),
  }
}

function confidenceFor(orgnrMatched: boolean, year: FinancialYear, warnings: string[]): FinancialMetricConfidence {
  if (!orgnrMatched) return 'low'
  if (year.fiscalYear && year.revenue.valueSek !== null) return warnings.length ? 'medium' : 'high'
  if (year.revenue.valueSek !== null || year.profitAfterFinancialNet.valueSek !== null || year.netIncome.valueSek !== null || year.employees !== null) return 'medium'
  return 'low'
}

export async function enrichFinancials(input: EnrichFinancialsInput): Promise<FinancialEnrichment> {
  const warnings: string[] = []
  const expectedOrgnr = normalizeOrgnr(input.orgnr)
  const resolvedUrl = await resolveAllabolagUrl(input, warnings)
  if (!resolvedUrl) return notAvailable(input, ['Ingen säker Allabolag-URL kunde hittas', ...warnings])

  try {
    const { html, finalUrl } = await fetchHtml(resolvedUrl)
    const sourceUrl = absoluteAllabolagUrl(finalUrl) || resolvedUrl
    if (/gokuProps|challenge-container|AwsWafIntegration/i.test(html)) {
      return notAvailable(input, ['Allabolag returnerade en WAF/challenge-sida; ekonomidata kunde inte verifieras automatiskt', ...warnings], sourceUrl)
    }

    const orgnrMatched = expectedOrgnr ? htmlContainsOrgnr(html, expectedOrgnr) : false
    if (expectedOrgnr && !orgnrMatched) {
      return notAvailable(input, [`Allabolag-sidan matchade inte organisationsnummer ${input.orgnr}; ekonomidata ignorerades`, ...warnings], sourceUrl)
    }
    if (!expectedOrgnr) warnings.push('Organisationsnummer saknas; ekonomidata hämtades inte eftersom orgnr-matchning krävs')
    if (!expectedOrgnr) return notAvailable(input, warnings, sourceUrl)

    const latestYear = parseFinancials(html)
    const parsedSomething = latestYear.revenue.valueSek !== null || latestYear.profitAfterFinancialNet.valueSek !== null || latestYear.netIncome.valueSek !== null || latestYear.employees !== null
    if (!parsedSomething) warnings.push('Allabolag-sidan hittades och orgnr matchade, men bokslut/nyckeltal kunde inte parsas')

    const confidence = confidenceFor(orgnrMatched, latestYear, warnings)
    return {
      status: parsedSomething ? 'available' : 'not_available',
      source: 'allabolag',
      sourceUrl,
      companyName: input.companyName,
      orgnr: input.orgnr || null,
      orgnrMatched,
      latestYear: parsedSomething ? latestYear : null,
      confidence: parsedSomething ? confidence : 'low',
      warnings,
      fetchedAt: new Date().toISOString(),
    }
  } catch (error) {
    return notAvailable(input, [`Allabolag-hämtning/parsing misslyckades: ${error instanceof Error ? error.message : 'okänt fel'}`, ...warnings], resolvedUrl)
  }
}
