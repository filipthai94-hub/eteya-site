#!/usr/bin/env node
/**
 * Generate Test Briefing
 * 
 * Skapar en test-briefing med mockup data för att visa hur den nya briefingen ser ut.
 * Innehåller ALLA nya fält: anställda, omsättning, styrelse, website-analys, konkurrenter.
 * 
 * Användning:
 *   npx tsx scripts/generate-test-briefing.ts
 */

import { writeFile } from 'fs/promises'
import { join } from 'path'
import { generateHTML } from '../src/lib/generate-briefing-html'

// Mock data som simulerar en riktig lead
const mockResearch = {
  company: {
    name: 'Telestore Sverige AB',
    website: 'https://telestore.se',
    description: 'E-handel av mobiltelefoner och tillbehör. Företaget erbjuder ett brett sortiment av smartphones, skal, skydd och tillbehör från ledande varumärken.',
    industry: 'E-handel',
    employees: 8,
    revenue: 5200000,
    techStack: []
  },
  industry: {
    sniCode: '47910',
    averageRevenue: 625000,
    employeeGrowth: '+2.3%'
  },
  competitors: [
    { name: 'Satori ML', pricing: '~2 200 kr/h', service: 'Maskininlärning, AI-strategi', source: '' },
    { name: 'Codon Consulting', pricing: 'Från 15 000 kr/mån', service: 'NLP, Chatbot, MLOps', source: '' },
    { name: 'Aixia', pricing: '1 500-2 000 kr/h', service: 'AI-infrastruktur, strategi', source: '' },
    { name: 'Abundly AI', pricing: '1 200-1 800 kr/h', service: 'Generativ AI, agenter', source: '' },
    { name: 'Arange AI', pricing: '900-1 500 kr/h', service: 'AI-strategi → implementation', source: '' }
  ],
  aiOpportunities: [
    {
      title: '🛒 Orderbekräftelse-automation',
      description: 'Automatisera orderbekräftelser, spårningsmeddelanden och returhantering',
      estimatedSavings: '~15 h/vecka',
      priority: 'high' as const
    },
    {
      title: '🔄 Returhantering automation',
      description: 'Automatisera returflöden, kreditgivning och lageruppdatering',
      estimatedSavings: '~8 h/vecka',
      priority: 'high' as const
    },
    {
      title: '💬 AI-chatbot för kundtjänst',
      description: 'Hantera vanliga kundfrågor automatiskt 24/7 med AI',
      estimatedSavings: '~6 h/vecka',
      priority: 'medium' as const
    },
    {
      title: '📝 AI-genererade produktbeskrivningar',
      description: 'Använd AI för att skapa SEO-optimerade produktbeskrivningar i skala',
      estimatedSavings: '~5 h/vecka',
      priority: 'medium' as const
    }
  ],
  roiValidation: {
    claimed: 390000,
    realistic: 385000,
    confidence: 'high' as const,
    notes: 'ROI-prognos verkar realistisk baserat på branschdata och liknande kundcase'
  },
  recommendedFocus: 'Fokusera på order- och returautomatisering — e-handel har hög volym repetitiva processer. Störst ROI genom att reducera manuell hantering.'
}

const mockROIData = {
  annualSavings: 390000,
  totalHours: 20,
  fte: 0.5,
  roi: 156,
  payback: 3,
  hourlyRate: 350,
  year1: 390000,
  year2: 780000,
  year3: 1170000
}

const mockBooking = {
  contactName: 'Filip Thai (TEST)',
  contactEmail: 'filip@telestore.se',
  bookingTime: new Date().toISOString(),
  service: 'AI-strategi och rådgivning'
}

async function main() {
  console.log('\n📄 Genererar test-briefing med mockup data...\n')
  
  try {
    // Generate HTML
    const html = generateHTML(mockResearch as any, mockROIData, mockBooking)
    
    console.log(`✅ HTML genererad, storlek: ${(html.length / 1024).toFixed(2)} KB`)
    
    // Save to file
    const timestamp = Date.now()
    const filename = `test-briefing-${timestamp}.html`
    const outputPath = join(process.cwd(), 'briefings', filename)
    
    await writeFile(outputPath, html, 'utf-8')
    
    console.log(`✅ Sparad till: ${outputPath}\n`)
    console.log('='.repeat(70))
    console.log('📊 TEST-BRIEFING KLAR!')
    console.log('='.repeat(70))
    console.log('\n📝 Innehåll:')
    console.log(`   Företag: ${mockResearch.company.name}`)
    console.log(`   Anställda: ${mockResearch.company.employees} st`)
    console.log(`   Omsättning: ${mockResearch.company.revenue.toLocaleString('sv-SE')} kr`)
    console.log(`   Bransch: ${mockResearch.company.industry} (SNI ${mockResearch.industry.sniCode})`)
    console.log(`   AI-möjligheter: ${mockResearch.aiOpportunities.length} st`)
    console.log(`   Konkurrenter: ${mockResearch.competitors.length} st`)
    console.log(`   ROI: ${mockROIData.roi}% (${mockROIData.annualSavings.toLocaleString('sv-SE')} kr/år)`)
    console.log('\n🔗 Öppna filen i din browser för att se hur briefingen ser ut:')
    console.log(`   file://${outputPath}\n`)
    
  } catch (error) {
    console.error('❌ Fel:', error)
    process.exit(1)
  }
}

main()
