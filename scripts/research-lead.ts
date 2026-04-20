#!/usr/bin/env node
/**
 * Research Lead Script
 * 
 * Kör automatiserad research på ett företag baserat på bokningsdata.
 * Scrapar hemsida, Allabolag, SCB och jämför med konkurrentpriser.
 * 
 * Användning:
 *   node scripts/research-lead.ts --company "Telestore Sverige AB" --website "telestore.se"
 */

import { writeFile } from 'fs/promises'
import { join } from 'path'

// Types
interface ROIData {
  annualSavings: number
  totalHours: number
  fte: number
  roi: number
  payback: number | null
  implCost?: number
  hourlyRate?: number
  year1?: number
  year2?: number
  year3?: number
  processes?: Array<{
    key: string
    label: string
    hoursPerWeek: number
    automationRate: number
    annualSavings: number
  }>
}

interface ResearchInput {
  companyName: string
  companyWebsite?: string
  roiData: ROIData
  contactName: string
  contactEmail: string
  service: string
  description?: string
  bookingTime: string
}

interface ResearchOutput {
  company: {
    name: string
    website: string
    description: string
    industry: string
    employees: number
    revenue: number
    techStack: string[]
  }
  industry: {
    sniCode: string
    averageRevenue: number
    employeeGrowth: string
  }
  competitors: Array<{
    name: string
    pricing: string
    service: string
    source: string
  }>
  aiOpportunities: Array<{
    title: string
    description: string
    estimatedSavings: string
    priority: 'high' | 'medium' | 'low'
  }>
  roiValidation: {
    claimed: number
    realistic: number
    confidence: 'high' | 'medium' | 'low'
    notes: string
  }
  recommendedFocus: string
}

// Load competitors data
async function loadCompetitors() {
  const competitorsPath = join(process.cwd(), 'scripts', 'data', 'competitors.json')
  const data = await import(competitorsPath)
  return data.default
}

// Mock functions — replace with real scraping logic
async function scrapeWebsite(website: string): Promise<{ description: string; techStack: string[] }> {
  console.log(`🔍 Scrapar ${website}...`)
  
  // TODO: Implementera riktig scraping med Puppeteer/Cheerio
  // För nu: returnera mock-data
  
  return {
    description: 'E-handel av mobiltelefoner och tillbehör',
    techStack: ['WordPress', 'WooCommerce', 'Klarna', 'Google Analytics']
  }
}

async function scrapeAllabolag(companyName: string): Promise<{ employees: number; revenue: number; industry: string; sniCode: string }> {
  console.log(`🔍 Scrapar Allabolag för ${companyName}...`)
  
  // TODO: Implementera Allabolag scraping
  // För nu: returnera mock-data
  
  return {
    employees: 8,
    revenue: 5000000,
    industry: 'E-handel',
    sniCode: '47910'
  }
}

async function getSCBData(sniCode: string): Promise<{ averageRevenue: number; employeeGrowth: string }> {
  console.log(`🔍 Hämtar SCB data för SNI ${sniCode}...`)
  
  // TODO: Implementera SCB API anrop
  // För nu: returnera mock-data
  
  return {
    averageRevenue: 625000,
    employeeGrowth: '+2.3%'
  }
}

// Generate AI opportunities based on company data
function generateAIOpportunities(input: ResearchInput, companyData: any): ResearchOutput['aiOpportunities'] {
  const opportunities: ResearchOutput['aiOpportunities'] = []
  
  // Analysera ROI-data och föreslå AI-lösningar
  if (input.roiData.processes?.some(p => p.key === 'kundtjanst')) {
    opportunities.push({
      title: '🤖 Orderbekräftelse-automation',
      description: 'Automatisera orderbekräftelser och spårningsmeddelanden',
      estimatedSavings: '~15 h/vecka',
      priority: 'high'
    })
  }
  
  if (input.roiData.processes?.some(p => p.key === 'epost')) {
    opportunities.push({
      title: '📧 AI-chatbot för kundtjänst',
      description: 'Hantera vanliga kundfrågor automatiskt 24/7',
      estimatedSavings: '~8 h/vecka',
      priority: 'high'
    })
  }
  
  if (input.roiData.processes?.some(p => p.key === 'fakturering')) {
    opportunities.push({
      title: '📄 Fakturering automation',
      description: 'Automatisera fakturaskapande och påminnelser',
      estimatedSavings: '~5 h/vecka',
      priority: 'medium'
    })
  }
  
  // Generell AI-strategi
  opportunities.push({
    title: '📊 Prediktiv försäljningsanalys',
    description: 'Använd AI för att förutse efterfrågan och optimera lager',
    estimatedSavings: '~3 h/vecka + ökad konvertering',
    priority: 'medium'
  })
  
  return opportunities.slice(0, 3) // Returnera topp 3
}

// Validate ROI claims against industry benchmarks
function validateROI(input: ResearchInput, industryData: any): ResearchOutput['roiValidation'] {
  const claimedSavings = input.roiData.annualSavings
  const employees = input.roiData.processes?.reduce((sum, p) => sum + p.hoursPerWeek, 0) || 0
  const hourlyRate = input.roiData.hourlyRate || 350
  
  // Beräkna realistisk besparing baserat på bransch-genomsnitt
  const realisticSavings = employees * hourlyRate * 52 * 0.5 // 50% automation är realistiskt
  
  const diff = Math.abs(claimedSavings - realisticSavings) / realisticSavings
  
  let confidence: 'high' | 'medium' | 'low' = 'high'
  if (diff > 0.3) confidence = 'medium'
  if (diff > 0.5) confidence = 'low'
  
  return {
    claimed: claimedSavings,
    realistic: Math.round(realisticSavings),
    confidence,
    notes: confidence === 'high' 
      ? 'ROI-prognos verkar realistisk baserat på branschdata'
      : confidence === 'medium'
      ? 'ROI-prognos är något optimitisk men inom rimliga gränser'
      : 'ROI-prognos kan vara överskattad — justera förväntningar'
  }
}

// Generate recommended focus for the meeting
function generateRecommendedFocus(input: ResearchInput, companyData: any): string {
  const service = input.service
  
  if (service === 'ai-automatisering') {
    return 'Fokusera på processautomatisering — störst ROI baserat på kalkylatorn. E-handel = hög volym repetitiva processer.'
  }
  
  if (service === 'ai-agent') {
    return 'Fokusera på AI-agenter för kundtjänst — hög potential baserat på företagets storlek och bransch.'
  }
  
  if (service === 'strategi') {
    return 'Fokusera på AI-strategi och roadmap — identifiera högst värdeskapande use cases.'
  }
  
  return 'Fokusera på att förstå företagets behov och identifiera bästa AI-möjligheterna.'
}

// Main research function
export async function researchLead(input: ResearchInput): Promise<ResearchOutput> {
  console.log('\n🚀 Startar research för', input.companyName)
  console.log('Website:', input.companyWebsite || 'Ej angiven')
  console.log('Service:', input.service)
  console.log('ROI-prognos:', input.roiData.annualSavings.toLocaleString('sv-SE'), 'kr/år\n')
  
  // 1. Scrapa företagets hemsida
  const websiteData = input.companyWebsite 
    ? await scrapeWebsite(input.companyWebsite)
    : { description: 'Ej tillgänglig', techStack: [] }
  
  // 2. Scrapa Allabolag
  const allabolagData = await scrapeAllabolag(input.companyName)
  
  // 3. Hämta SCB bransch-statistik
  const scbData = await getSCBData(allabolagData.sniCode)
  
  // 4. Hämta konkurrenspriser
  const competitorsData = await loadCompetitors()
  const competitors = competitorsData.competitors.slice(0, 5).map((c: any) => ({
    name: c.name,
    pricing: c.pricing,
    service: c.services[0],
    source: c.source
  }))
  
  // 5. Generera AI-möjligheter
  const aiOpportunities = generateAIOpportunities(input, { ...websiteData, ...allabolagData })
  
  // 6. Validera ROI
  const roiValidation = validateROI(input, scbData)
  
  // 7. Generera rekommenderat fokus
  const recommendedFocus = generateRecommendedFocus(input, { ...websiteData, ...allabolagData })
  
  // Sammanställ resultat
  const output: ResearchOutput = {
    company: {
      name: input.companyName,
      website: input.companyWebsite || 'Ej angiven',
      description: websiteData.description,
      industry: allabolagData.industry,
      employees: allabolagData.employees,
      revenue: allabolagData.revenue,
      techStack: websiteData.techStack
    },
    industry: {
      sniCode: allabolagData.sniCode,
      averageRevenue: scbData.averageRevenue,
      employeeGrowth: scbData.employeeGrowth
    },
    competitors,
    aiOpportunities,
    roiValidation,
    recommendedFocus
  }
  
  console.log('\n✅ Research klar!\n')
  console.log('Företag:', output.company.name)
  console.log('Bransch:', output.company.industry)
  console.log('Anställda:', output.company.employees)
  console.log('Omsättning:', output.company.revenue.toLocaleString('sv-SE'), 'kr')
  console.log('AI-möjligheter:', output.aiOpportunities.length)
  console.log('ROI-validering:', output.roiValidation.confidence)
  console.log('Rekommenderat fokus:', output.recommendedFocus)
  console.log('')
  
  return output
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2)
  const companyIndex = args.indexOf('--company')
  const websiteIndex = args.indexOf('--website')
  
  const companyName = companyIndex > -1 ? args[companyIndex + 1] : 'Test AB'
  const companyWebsite = websiteIndex > -1 ? args[websiteIndex + 1] : undefined
  
  const mockInput: ResearchInput = {
    companyName,
    companyWebsite,
    roiData: {
      annualSavings: 390000,
      totalHours: 20,
      fte: 0.5,
      roi: 156,
      payback: 3,
      hourlyRate: 350,
      year1: 390000,
      year2: 780000,
      year3: 1170000,
      processes: [
        { key: 'kundtjanst', label: 'Kundtjänst', hoursPerWeek: 8, automationRate: 0.45, annualSavings: 140000 }
      ]
    },
    contactName: 'Filip Test',
    contactEmail: 'filip@test.com',
    service: 'ai-automatisering',
    description: 'Test-bokning',
    bookingTime: new Date().toISOString()
  }
  
  researchLead(mockInput)
    .then(result => {
      console.log('\n📊 Research Output:')
      console.log(JSON.stringify(result, null, 2))
    })
    .catch(console.error)
}
