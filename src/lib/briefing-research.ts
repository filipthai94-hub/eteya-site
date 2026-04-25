import { enrichCompany, type EnrichedCompany, type IndustryStats } from './company-enrichment'
import { enrichFinancials, type FinancialEnrichment } from './financial-enrichment'
import { buildSalesIntelligence, type SalesIntelligence } from './sales-intelligence'
import { analyzeWebsite, type WebsiteAnalysis } from './website-analyzer'
import type { ResearchOutput, ROIData } from './generate-pro-briefing-html'

type Competitor = {
  name?: string
  pricing?: string
  service?: string
  focus?: string
  source?: string
}

export type BriefingResearchInput = {
  company: string
  website?: string | null
  service: string
  roiData: string | Record<string, unknown> | null
  apiKey?: string | null
}

export type BriefingResearchResult = {
  research: ResearchOutput
  roi: ROIData
  company: EnrichedCompany
  industryStats: IndustryStats | null
  websiteAnalysis: WebsiteAnalysis | null
  salesIntelligence: SalesIntelligence
  financials: FinancialEnrichment
}

function parseRoiData(value: BriefingResearchInput['roiData']): Record<string, unknown> | null {
  if (!value) return null
  if (typeof value === 'string') {
    try {
      const parsed: unknown = JSON.parse(value)
      return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null
    } catch {
      return null
    }
  }
  return value
}

function numberOrNull(value: unknown): number | null {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null
}

function buildRoiData(raw: Record<string, unknown> | null): ROIData {
  const annualSavings = numberOrNull(raw?.annualSavings ?? raw?.besparingKr)
  const year1 = numberOrNull(raw?.year1) ?? annualSavings
  return {
    annualSavings,
    totalHours: numberOrNull(raw?.totalHours ?? raw?.sparatTimmar),
    fte: numberOrNull(raw?.fte),
    roi: numberOrNull(raw?.roi ?? raw?.roiProcent),
    payback: numberOrNull(raw?.payback ?? raw?.paybackManader),
    implCost: numberOrNull(raw?.implCost),
    hourlyRate: numberOrNull(raw?.hourlyRate),
    year1,
    year2: numberOrNull(raw?.year2) ?? (annualSavings ? annualSavings * 2 : null),
    year3: numberOrNull(raw?.year3) ?? (annualSavings ? annualSavings * 3 : null),
  }
}

async function loadCompetitors(): Promise<Required<Pick<Competitor, 'name' | 'pricing' | 'service' | 'source'>>[]> {
  try {
    const competitorsData = await import('@/data/competitors.json')
    const competitors = (competitorsData.default.competitors || []) as Competitor[]
    return competitors.slice(0, 5).map(k => ({
      name: k.name || 'Okänd AI-leverantör',
      pricing: k.pricing || 'Ej publikt',
      service: k.focus || k.service || 'AI-rådgivning/implementation',
      source: k.source || '',
    }))
  } catch {
    return [
      { name: 'Satori ML', pricing: '~2 200 kr/h', service: 'Maskininlärning, AI-strategi', source: '' },
      { name: 'Codon Consulting', pricing: 'Från 15 000 kr/mån', service: 'NLP, Chatbot, MLOps', source: '' },
      { name: 'Aixia', pricing: '1 500-2 000 kr/h', service: 'AI-infrastruktur, strategi', source: '' },
      { name: 'Abundly AI', pricing: '1 200-1 800 kr/h', service: 'Generativ AI, agenter', source: '' },
      { name: 'Arange AI', pricing: '900-1 500 kr/h', service: 'AI-strategi → implementation', source: '' },
    ]
  }
}

export async function buildBriefingResearch(input: BriefingResearchInput): Promise<BriefingResearchResult> {
  const roiRaw = parseRoiData(input.roiData)
  const roi = buildRoiData(roiRaw)

  let websiteAnalysis: WebsiteAnalysis | null = null
  if (input.website) {
    websiteAnalysis = await analyzeWebsite(input.website)
  }

  const { company, industryStats } = await enrichCompany({
    company: input.company,
    websiteInput: input.website || null,
    websiteAnalysis,
    apiKey: input.apiKey || null,
  })

  const financials = await enrichFinancials({
    companyName: company.name || input.company,
    orgnr: company.orgnr,
  })

  const salesIntelligence = buildSalesIntelligence({
    websiteAnalysis,
    roiData: roiRaw,
    company,
    service: input.service,
  })

  const competitors = await loadCompetitors()
  const aiOpportunities = salesIntelligence.aiUseCases.map(useCase => ({
    title: useCase.title,
    description: useCase.description,
    estimatedSavings: useCase.estimatedImpact,
    priority: useCase.priority,
    whyItMatches: useCase.whyItMatches,
  }))

  const claimed = roi.annualSavings
  const research: ResearchOutput = {
    company: {
      name: company.name || input.company || 'Okänt företag',
      orgnr: company.orgnr,
      website: company.website || websiteAnalysis?.url || input.website || null,
      description: websiteAnalysis?.description || company.description || null,
      industry: websiteAnalysis && websiteAnalysis.industry !== 'Okänd bransch' ? websiteAnalysis.industry : company.industry,
      employees: company.employees,
      revenue: company.revenue,
      techStack: [],
      verified: company.verified,
      confidence: company.confidence,
    },
    industry: {
      sniCode: company.sniCode,
      averageRevenue: numberOrNull(industryStats?.average_revenue_per_employee),
      employeeGrowth: null,
    },
    competitors,
    aiOpportunities,
    roiValidation: {
      claimed,
      realistic: claimed,
      confidence: claimed ? 'medium' : 'low',
      notes: claimed ? 'ROI-prognos baserad på kalkylatorn; validera volym, automationsgrad och implementation i mötet.' : 'ROI-data saknas eller är inte verifierad; kvantifiera i discovery innan case byggs.',
    },
    recommendedFocus: salesIntelligence.pitchAngle,
    salesIntelligence,
    financials,
    sources: [financials.sourceUrl, ...(websiteAnalysis?.sourceUrls || [])].filter(Boolean) as string[],
    dataGaps: [...company.warnings, ...financials.warnings],
  }

  return { research, roi, company, industryStats, websiteAnalysis, salesIntelligence, financials }
}
