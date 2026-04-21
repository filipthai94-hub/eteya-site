/**
 * Website Analyzer
 * 
 * Analyserar ett företags hemsida och extraherar:
 * - Verksamhetsbeskrivning (vad gör de?)
 * - Bransch/industri
 * - Nyckelord (produkter, tjänster, målgrupp)
 * - Matchar till AI-use-cases baserat på vad vi hittar
 */

interface WebsiteAnalysis {
  url: string
  title: string
  description: string
  industry: string
  keywords: string[]
  aiOpportunities: AIOpportunity[]
  confidence: 'high' | 'medium' | 'low'
}

interface AIOpportunity {
  title: string
  description: string
  estimatedSavings: string
  priority: 'high' | 'medium' | 'low'
  matchedKeywords: string[]
}

// AI-use-case mapping baserat på nyckelord
const AI_USE_CASES: Record<string, AIOpportunity> = {
  // E-handel
  'webshop': {
    title: '🛒 Orderbekräftelse-automation',
    description: 'Automatisera orderbekräftelser, spårningsmeddelanden och returhantering',
    estimatedSavings: '~15 h/vecka',
    priority: 'high',
    matchedKeywords: ['webshop', 'e-handel', 'order']
  },
  'e-handel': {
    title: '🛒 Orderbekräftelse-automation',
    description: 'Automatisera orderbekräftelser, spårningsmeddelanden och returhantering',
    estimatedSavings: '~15 h/vecka',
    priority: 'high',
    matchedKeywords: ['webshop', 'e-handel', 'order']
  },
  'retur': {
    title: '🔄 Returhantering automation',
    description: 'Automatisera returflöden, kreditgivning och lageruppdatering',
    estimatedSavings: '~8 h/vecka',
    priority: 'high',
    matchedKeywords: ['retur', 'återköp', 'reklamation']
  },
  'produktbeskriv': {
    title: '📝 AI-genererade produktbeskrivningar',
    description: 'Använd AI för att skapa SEO-optimerade produktbeskrivningar i skala',
    estimatedSavings: '~10 h/vecka',
    priority: 'medium',
    matchedKeywords: ['produkt', 'beskrivning', 'katalog']
  },
  
  // Bokning/Tidsbokning
  'boka': {
    title: '📅 Bokningsautomation',
    description: 'Automatisera tidsbokning, påminnelser och no-show hantering',
    estimatedSavings: '~12 h/vecka',
    priority: 'high',
    matchedKeywords: ['boka', 'tider', 'kalender', 'besök']
  },
  'tidsbokning': {
    title: '📅 Bokningsautomation',
    description: 'Automatisera tidsbokning, påminnelser och no-show hantering',
    estimatedSavings: '~12 h/vecka',
    priority: 'high',
    matchedKeywords: ['boka', 'tider', 'kalender', 'besök']
  },
  'restaurang': {
    title: '🍽️ Restaurangautomation',
    description: 'Bordsbokning, beställningsautomation och menyoptimering med AI',
    estimatedSavings: '~10 h/vecka',
    priority: 'high',
    matchedKeywords: ['restaurang', 'bord', 'meny', 'beställ']
  },
  
  // Kundtjänst/Support
  'support': {
    title: '💬 AI-chatbot för kundtjänst',
    description: 'Hantera vanliga kundfrågor automatiskt 24/7 med AI',
    estimatedSavings: '~8 h/vecka',
    priority: 'high',
    matchedKeywords: ['support', 'kundtjänst', 'hjälp', 'kontakt']
  },
  'kundtjänst': {
    title: '💬 AI-chatbot för kundtjänst',
    description: 'Hantera vanliga kundfrågor automatiskt 24/7 med AI',
    estimatedSavings: '~8 h/vecka',
    priority: 'high',
    matchedKeywords: ['support', 'kundtjänst', 'hjälp', 'kontakt']
  },
  'faq': {
    title: '💬 AI-drivet kunskapsstöd',
    description: 'Automatisera svarsförslag på vanliga frågor baserat på ert innehåll',
    estimatedSavings: '~6 h/vecka',
    priority: 'medium',
    matchedKeywords: ['faq', 'vanliga frågor', 'hjälpcenter']
  },
  
  // Fakturering/Ekonomi
  'faktura': {
    title: '📄 Fakturering automation',
    description: 'Automatisera fakturaskapande, påminnelser och betalningsflöden',
    estimatedSavings: '~5 h/vecka',
    priority: 'high',
    matchedKeywords: ['faktura', 'betalning', 'ekonomi']
  },
  'betalning': {
    title: '💳 Betalningsautomation',
    description: 'Automatisera betalningspåminnelser och avstämningar',
    estimatedSavings: '~4 h/vecka',
    priority: 'medium',
    matchedKeywords: ['faktura', 'betalning', 'ekonomi']
  },
  
  // Recruitment/HR
  'rekryter': {
    title: '👥 CV-screening automation',
    description: 'AI som förvaliderar ansökningar och bokar intervjuer',
    estimatedSavings: '~8 h/vecka',
    priority: 'high',
    matchedKeywords: ['rekryter', 'jobb', 'karriär', 'ansök']
  },
  'karriär': {
    title: '👥 Rekryteringsautomation',
    description: 'Automatisera ansökningsprocesser och kandidat-kommunikation',
    estimatedSavings: '~6 h/vecka',
    priority: 'medium',
    matchedKeywords: ['rekryter', 'jobb', 'karriär', 'ansök']
  },
  
  // Logistik/Lager
  'lager': {
    title: '📦 Lageroptimering med AI',
    description: 'Prediktiv analys för lagerhållning och inköp',
    estimatedSavings: '~6 h/vecka + minskat lagervärde',
    priority: 'medium',
    matchedKeywords: ['lager', 'logistik', 'frakt', 'försändelse']
  },
  'logistik': {
    title: '🚚 Logistikoptimering',
    description: 'AI för ruttplanering och leveransoptimering',
    estimatedSavings: '~5 h/vecka + lägre fraktkostnader',
    priority: 'medium',
    matchedKeywords: ['lager', 'logistik', 'frakt', 'försändelse']
  },
  
  // Utbildning
  'utbildning': {
    title: '🎓 Kursadministrationsautomation',
    description: 'Automatisera kursanmälningar, certifikat och elevkommunikation',
    estimatedSavings: '~8 h/vecka',
    priority: 'high',
    matchedKeywords: ['utbildning', 'kurs', 'lärande', 'certifikat']
  },
  'kurs': {
    title: '📚 Kursautomation',
    description: 'Automatisera kursflöden, material och uppföljningar',
    estimatedSavings: '~6 h/vecka',
    priority: 'medium',
    matchedKeywords: ['utbildning', 'kurs', 'lärande', 'certifikat']
  }
}

// Bransch-mapping
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  'E-handel': ['webshop', 'e-handel', 'köp', 'butik', 'order', 'produkt'],
  'Restaurang': ['restaurang', 'café', 'mat', 'bord', 'meny', 'beställ'],
  'Kundtjänst': ['support', 'kundtjänst', 'hjälp', 'kontakt', 'service'],
  'Ekonomi': ['faktura', 'ekonomi', 'redovisning', 'betala', 'pris'],
  'Rekrytering': ['rekryter', 'jobb', 'karriär', 'anställ', 'cv'],
  'Logistik': ['lager', 'logistik', 'frakt', 'leverans', 'transport'],
  'Utbildning': ['utbildning', 'kurs', 'lärande', 'skola', 'certifikat']
}

export async function analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
  console.log(`\n🔍 Analyserar ${url}...`)
  
  try {
    // Fetch website HTML
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000), // 10s timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Eteya Lead Research Bot/1.0)'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const html = await response.text()
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : 'Okänd'
    
    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                     html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i)
    const description = descMatch ? descMatch[1].trim() : 'Ingen beskrivning tillgänglig'
    
    // Extract body text (first 2000 chars for keyword analysis)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    const bodyText = bodyMatch ? bodyMatch[1].toLowerCase() : ''
    
    // Find industry based on keywords
    let industry = 'Okänd bransch'
    let maxMatches = 0
    
    for (const [ind, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
      const matches = keywords.filter(kw => bodyText.includes(kw.toLowerCase())).length
      if (matches > maxMatches) {
        maxMatches = matches
        industry = ind
      }
    }
    
    // Extract all found keywords
    const foundKeywords: string[] = []
    for (const keywords of Object.values(INDUSTRY_KEYWORDS)) {
      for (const kw of keywords) {
        if (bodyText.includes(kw.toLowerCase())) {
          foundKeywords.push(kw)
        }
      }
    }
    
    // Match AI opportunities
    const aiOpportunities: AIOpportunity[] = []
    const usedTitles = new Set<string>()
    
    for (const [keyword, opportunity] of Object.entries(AI_USE_CASES)) {
      if (bodyText.includes(keyword.toLowerCase()) && !usedTitles.has(opportunity.title)) {
        aiOpportunities.push(opportunity)
        usedTitles.add(opportunity.title)
      }
      
      // Limit to top 5 opportunities
      if (aiOpportunities.length >= 5) break
    }
    
    // If no AI opportunities found, add generic ones
    if (aiOpportunities.length === 0) {
      aiOpportunities.push(
        {
          title: '🤖 Processautomatisering',
          description: 'Identifiera och automatisera manuella processer i er verksamhet',
          estimatedSavings: '~5-10 h/vecka',
          priority: 'medium',
          matchedKeywords: []
        },
        {
          title: '📊 Dataanalys med AI',
          description: 'Använd AI för att analysera affärsdata och identifiera mönster',
          estimatedSavings: '~3-5 h/vecka',
          priority: 'medium',
          matchedKeywords: []
        }
      )
    }
    
    const result: WebsiteAnalysis = {
      url,
      title,
      description,
      industry,
      keywords: foundKeywords.slice(0, 10), // Top 10 keywords
      aiOpportunities,
      confidence: maxMatches >= 3 ? 'high' : maxMatches >= 1 ? 'medium' : 'low'
    }
    
    console.log(`✅ Analys klar!`)
    console.log(`   Bransch: ${result.industry}`)
    console.log(`   AI-möjligheter: ${result.aiOpportunities.length}`)
    console.log(`   Konfidens: ${result.confidence}`)
    
    return result
    
  } catch (error) {
    console.error(`❌ Fel vid analys av ${url}:`, error)
    
    // Return fallback
    return {
      url,
      title: 'Kunde inte läsa hemsidan',
      description: 'Website scraping misslyckades. Bokaren bör kolla hemsidan manuellt.',
      industry: 'Okänd',
      keywords: [],
      aiOpportunities: [
        {
          title: '🤖 Processautomatisering',
          description: 'Identifiera och automatisera manuella processer',
          estimatedSavings: '~5-10 h/vecka',
          priority: 'medium',
          matchedKeywords: []
        }
      ],
      confidence: 'low'
    }
  }
}
