import * as cheerio from 'cheerio'

/**
 * Website Analyzer v2
 *
 * Scrapar startsida + ett litet urval relevanta interna sidor och extraherar
 * strukturerade säljsignaler. Bakåtkompatibla fält behålls för befintliga
 * briefing-anrop.
 */

export interface WebsiteAnalysis {
  url: string
  title: string
  description: string
  industry: string
  keywords: string[]
  aiOpportunities: AIOpportunity[]
  confidence: 'high' | 'medium' | 'low'
  pages: WebsitePageAnalysis[]
  h1: string[]
  h2: string[]
  bodyText: string
  offers: string[]
  services: string[]
  targetAudience: string[]
  contactSignals: ContactSignals
  sourceUrls: string[]
  warnings: string[]
}

export interface WebsitePageAnalysis {
  url: string
  title: string
  description: string
  h1: string[]
  h2: string[]
  bodyText: string
}

export interface ContactSignals {
  emails: string[]
  phones: string[]
  hasContactForm: boolean
  hasBooking: boolean
  socialLinks: string[]
}

export interface AIOpportunity {
  title: string
  description: string
  estimatedSavings: string
  priority: 'high' | 'medium' | 'low'
  matchedKeywords: string[]
}

const MAX_PAGES = 5
const PAGE_TIMEOUT_MS = 8000
const MAX_BODY_CHARS_PER_PAGE = 5000

const PAGE_LINK_PATTERNS = [
  /(^|\/)(om|om-oss|about|about-us)(\/|$)/i,
  /(^|\/)(tjanster|tjänster|services|service|losningar|lösningar)(\/|$)/i,
  /(^|\/)(kontakt|contact|kontakta-oss)(\/|$)/i,
  /(^|\/)(faq|fragor|frågor|help|support)(\/|$)/i,
  /(^|\/)(pris|priser|pricing|plans)(\/|$)/i,
]

const STOPWORDS = new Set([
  'och', 'att', 'det', 'som', 'för', 'med', 'till', 'har', 'kan', 'din', 'dina', 'vår', 'vara', 'våra', 'ett', 'den', 'detta', 'från', 'eller',
  'the', 'and', 'for', 'with', 'you', 'your', 'are', 'this', 'that', 'from', 'have', 'has', 'our', 'all', 'not', 'but', 'can', 'will',
])

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  'E-handel/retail': ['webshop', 'e-handel', 'köp', 'butik', 'order', 'produkt', 'retur', 'reklamation', 'lager', 'mobiltelefon', 'telefoner', 'begagnad'],
  'Kultur/event/bokning': ['artist', 'artister', 'kultur', 'scen', 'evenemang', 'konsert', 'föreställning', 'bokning', 'arrangör', 'program'],
  'Restaurang': ['restaurang', 'café', 'mat', 'bord', 'meny', 'beställ'],
  'Kundtjänst/service': ['support', 'kundtjänst', 'hjälp', 'kontakt', 'service', 'ärende'],
  'Ekonomi': ['faktura', 'ekonomi', 'redovisning', 'betala', 'pris'],
  'Rekrytering/HR': ['rekryter', 'jobb', 'karriär', 'anställ', 'cv'],
  'Logistik': ['lager', 'logistik', 'frakt', 'leverans', 'transport'],
  'Utbildning': ['utbildning', 'kurs', 'lärande', 'skola', 'certifikat'],
  'B2B konsult/tjänster': ['rådgivning', 'konsult', 'strategi', 'workshop', 'implementation', 'projekt'],
}

const AI_USE_CASES: Record<string, AIOpportunity> = {
  webshop: {
    title: '🛒 Order- och kundflödesautomation',
    description: 'Automatisera orderfrågor, statusuppdateringar, returer och återkommande kunddialoger.',
    estimatedSavings: '~10-20 h/vecka',
    priority: 'high',
    matchedKeywords: ['webshop', 'e-handel', 'order'],
  },
  retur: {
    title: '🔄 Retur- och reklamationsflöde',
    description: 'AI kan triagera retur/reklamationsärenden, samla underlag och föreslå nästa steg.',
    estimatedSavings: '~8-15 h/vecka',
    priority: 'high',
    matchedKeywords: ['retur', 'reklamation'],
  },
  produkt: {
    title: '📝 Produktfrågor och produktbeskrivningar',
    description: 'Skapa/svara på produktinformation baserat på katalog, villkor och lagerdata.',
    estimatedSavings: '~6-12 h/vecka',
    priority: 'medium',
    matchedKeywords: ['produkt', 'produktbeskrivning', 'katalog'],
  },
  bokning: {
    title: '📅 Boknings- och förfrågningsautomation',
    description: 'Kvalificera inkommande förfrågningar, föreslå rätt upplägg och automatisera uppföljning.',
    estimatedSavings: '~8-16 h/vecka',
    priority: 'high',
    matchedKeywords: ['boka', 'bokning', 'förfrågan'],
  },
  artist: {
    title: '🎭 Artist-/utbuds-matchning',
    description: 'Matcha arrangörens behov mot artister, budget, målgrupp och tidigare lyckade upplägg.',
    estimatedSavings: '~6-12 h/vecka',
    priority: 'high',
    matchedKeywords: ['artist', 'kultur', 'arrangör'],
  },
  support: {
    title: '💬 AI-stöd för kunddialog',
    description: 'Besvara vanliga frågor och skapa handläggningsunderlag för mer komplexa ärenden.',
    estimatedSavings: '~6-12 h/vecka',
    priority: 'high',
    matchedKeywords: ['support', 'kundtjänst', 'kontakt', 'faq'],
  },
  faktura: {
    title: '📄 Administrations- och fakturaflöden',
    description: 'Automatisera offert, faktura-/betalningspåminnelser och intern uppföljning.',
    estimatedSavings: '~4-8 h/vecka',
    priority: 'medium',
    matchedKeywords: ['faktura', 'betalning', 'offert'],
  },
}

export function normalizeWebsiteUrl(input: string): string {
  const cleaned = input.trim().replace(/^mailto:/i, '').replace(/\s+/g, '').replace(/\/+$/, '')
  if (!cleaned) return ''
  return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`
}

function cleanText(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\u00a0/g, ' ')
    .trim()
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items.filter(Boolean)))
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(PAGE_TIMEOUT_MS),
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Eteya Lead Research Bot/2.0)',
      Accept: 'text/html,application/xhtml+xml',
    },
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const contentType = response.headers.get('content-type') || ''
  if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
    throw new Error(`Unsupported content-type ${contentType}`)
  }
  return response.text()
}

function parsePage(url: string, html: string): WebsitePageAnalysis & { links: string[]; contactSignals: ContactSignals } {
  const $ = cheerio.load(html)
  $('script, style, noscript, svg, iframe, nav, footer').remove()

  const title = cleanText($('title').first().text()) || 'Okänd'
  const description = cleanText($('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '')
  const h1 = unique($('h1').map((_, el) => cleanText($(el).text())).get()).slice(0, 8)
  const h2 = unique($('h2').map((_, el) => cleanText($(el).text())).get()).slice(0, 20)
  const bodyText = cleanText($('body').text()).slice(0, MAX_BODY_CHARS_PER_PAGE)

  const links = unique($('a[href]').map((_, el) => String($(el).attr('href') || '')).get())
  const rawText = `${bodyText} ${links.join(' ')}`
  const emails = unique((rawText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []).map(e => e.toLowerCase())).slice(0, 5)
  const phones = unique((rawText.match(/(?:\+46|0)\s?[0-9][0-9\s-]{6,}/g) || []).map(cleanText)).slice(0, 5)
  const socialLinks = links.filter(link => /linkedin|facebook|instagram|youtube|tiktok|x\.com|twitter/i.test(link)).slice(0, 8)

  return {
    url,
    title,
    description,
    h1,
    h2,
    bodyText,
    links,
    contactSignals: {
      emails,
      phones,
      hasContactForm: $('form').length > 0 || /kontaktformulär|contact form|skicka meddelande/i.test(bodyText),
      hasBooking: /boka|booking|calendly|cal\.com|tidbok|förfrågan/i.test(rawText),
      socialLinks,
    },
  }
}

function selectInternalLinks(baseUrl: string, links: string[]): string[] {
  const base = new URL(baseUrl)
  const normalized = links
    .map(link => {
      try {
        if (!link || link.startsWith('#') || /^mailto:|^tel:|^javascript:/i.test(link)) return null
        const url = new URL(link, baseUrl)
        url.hash = ''
        if (url.hostname.replace(/^www\./, '') !== base.hostname.replace(/^www\./, '')) return null
        return url.toString().replace(/\/+$/, '')
      } catch {
        return null
      }
    })
    .filter((url): url is string => Boolean(url))

  return unique(normalized)
    .filter(url => url !== baseUrl.replace(/\/+$/, ''))
    .filter(url => PAGE_LINK_PATTERNS.some(pattern => pattern.test(new URL(url).pathname)))
    .slice(0, MAX_PAGES - 1)
}

function extractKeywords(text: string): string[] {
  const lowered = text.toLowerCase()
  const industryKeywords = Object.values(INDUSTRY_KEYWORDS).flat().filter(keyword => lowered.includes(keyword.toLowerCase()))
  const tokens = (lowered.match(/[a-zåäöéü0-9-]{4,}/gi) || [])
    .map(t => t.toLowerCase())
    .filter(token => !STOPWORDS.has(token) && !/^\d+$/.test(token))

  const counts = new Map<string, number>()
  for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1)
  const frequent = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([token]) => token)

  return unique([...industryKeywords, ...frequent]).slice(0, 25)
}

function inferIndustry(text: string): { industry: string; matches: number } {
  const lowered = text.toLowerCase()
  let best = { industry: 'Okänd bransch', matches: 0 }
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    const matches = keywords.filter(keyword => lowered.includes(keyword.toLowerCase())).length
    if (matches > best.matches) best = { industry, matches }
  }
  return best
}

function extractListSignals(lines: string[], patterns: RegExp[], fallbackKeywords: string[]): string[] {
  const candidates = lines.filter(line => {
    const lowered = line.toLowerCase()
    return patterns.some(pattern => pattern.test(line)) || fallbackKeywords.some(keyword => lowered.includes(keyword))
  })
  return unique(candidates.map(line => line.replace(/^[-–•\s]+/, '').trim()).filter(line => line.length >= 4 && line.length <= 140)).slice(0, 10)
}

function matchAIOpportunities(text: string): AIOpportunity[] {
  const lowered = text.toLowerCase()
  const matches: AIOpportunity[] = []
  const used = new Set<string>()
  for (const [keyword, opportunity] of Object.entries(AI_USE_CASES)) {
    if (lowered.includes(keyword) && !used.has(opportunity.title)) {
      matches.push(opportunity)
      used.add(opportunity.title)
    }
    if (matches.length >= 5) break
  }
  if (matches.length > 0) return matches
  return [
    {
      title: '🤖 Processautomatisering',
      description: 'Identifiera återkommande manuella flöden där AI kan skapa underlag, svar eller uppföljningar.',
      estimatedSavings: '~5-10 h/vecka',
      priority: 'medium',
      matchedKeywords: [],
    },
  ]
}

export async function analyzeWebsite(inputUrl: string): Promise<WebsiteAnalysis> {
  const normalizedUrl = normalizeWebsiteUrl(inputUrl)
  const warnings: string[] = []
  if (!normalizedUrl) {
    throw new Error('Website URL saknas')
  }

  try {
    const homeHtml = await fetchHtml(normalizedUrl)
    const home = parsePage(normalizedUrl, homeHtml)
    const internalLinks = selectInternalLinks(normalizedUrl, home.links)

    const childResults = await Promise.allSettled(internalLinks.map(async url => parsePage(url, await fetchHtml(url))))
    const pages = [home]
    for (const result of childResults) {
      if (result.status === 'fulfilled') pages.push(result.value)
      else warnings.push(`Kunde inte läsa intern sida: ${result.reason instanceof Error ? result.reason.message : 'okänt fel'}`)
    }

    const allText = cleanText(pages.map(page => [page.title, page.description, ...page.h1, ...page.h2, page.bodyText].join(' ')).join(' '))
    const lines = unique(allText.split(/(?<=[.!?])\s+|\n+/).map(cleanText)).filter(line => line.length > 3)
    const industry = inferIndustry(allText)
    const keywords = extractKeywords(allText)
    const services = extractListSignals(lines, [/tjänst|service|lösning|erbjuder|hjälper/i], ['tjänst', 'service', 'lösning', 'erbjuder']).slice(0, 8)
    const offers = extractListSignals(lines, [/erbjud|paket|pris|offert|boka|köp|beställ/i], ['erbjud', 'paket', 'pris', 'offert', 'boka']).slice(0, 8)
    const targetAudience = extractListSignals(lines, [/för företag|för dig|kunder|arrangör|butik|organisation|kommun|b2b|privatperson/i], ['arrangör', 'företag', 'kunder', 'kommun', 'organisation']).slice(0, 6)

    const contactSignals: ContactSignals = {
      emails: unique(pages.flatMap(page => page.contactSignals.emails)).slice(0, 5),
      phones: unique(pages.flatMap(page => page.contactSignals.phones)).slice(0, 5),
      hasContactForm: pages.some(page => page.contactSignals.hasContactForm),
      hasBooking: pages.some(page => page.contactSignals.hasBooking),
      socialLinks: unique(pages.flatMap(page => page.contactSignals.socialLinks)).slice(0, 8),
    }

    const pageScore = pages.length >= 3 ? 1 : pages.length >= 2 ? 0.5 : 0
    const confidence = industry.matches >= 4 || (industry.matches >= 2 && pageScore >= 0.5) ? 'high' : industry.matches >= 1 || keywords.length >= 6 ? 'medium' : 'low'

    return {
      url: normalizedUrl,
      title: home.title,
      description: home.description || home.h1[0] || 'Ingen beskrivning tillgänglig',
      industry: industry.industry,
      keywords,
      aiOpportunities: matchAIOpportunities(allText),
      confidence,
      pages: pages.map(({ links: _links, contactSignals: _signals, ...page }) => page),
      h1: unique(pages.flatMap(page => page.h1)).slice(0, 12),
      h2: unique(pages.flatMap(page => page.h2)).slice(0, 30),
      bodyText: allText.slice(0, 12000),
      offers,
      services,
      targetAudience,
      contactSignals,
      sourceUrls: pages.map(page => page.url),
      warnings,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'okänt fel'
    return {
      url: normalizedUrl,
      title: 'Kunde inte läsa hemsidan',
      description: 'Website scraping misslyckades. Kolla hemsidan manuellt före mötet.',
      industry: 'Okänd bransch',
      keywords: [],
      aiOpportunities: [
        {
          title: '🤖 Processautomatisering',
          description: 'Identifiera och automatisera manuella processer baserat på mötets discovery.',
          estimatedSavings: '~5-10 h/vecka',
          priority: 'medium',
          matchedKeywords: [],
        },
      ],
      confidence: 'low',
      pages: [],
      h1: [],
      h2: [],
      bodyText: '',
      offers: [],
      services: [],
      targetAudience: [],
      contactSignals: { emails: [], phones: [], hasContactForm: false, hasBooking: false, socialLinks: [] },
      sourceUrls: [normalizedUrl],
      warnings: [`Website-analys misslyckades: ${message}`],
    }
  }
}
