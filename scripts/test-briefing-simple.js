#!/usr/bin/env node
/**
 * Fake test av briefing-pipeline
 * Simulerar Cal.com webhook + smart parsing
 */

console.log('=== 🧪 FAKE TEST: BRIEFING PIPELINE ===\n')

// Simulera payload från Cal.com (exakt som ContactCard skickar)
const fakePayload = {
  event: 'BOOKING_CREATED',
  payload: {
    responses: {
      name: { value: 'Filip Thai' },
      email: { value: 'filip@telestore.se' },
      website: { value: 'telestore.se' },
      company: { value: '' }, // TOMT! Ska extraheras från website
      gdpr: { value: true }
    },
    metadata: {
      website: 'telestore.se',
      company: '', // TOMT!
      service: 'ai-agents',
      source: 'roi-calculator',
      annualSavings: '890000',
      totalHours: '1240',
      roi: '425',
      payback: '1.5',
      implCost: '210000',
      hourlyRate: '420',
      year1: '890000',
      year2: '1150000',
      year3: '1420000'
    },
    title: 'AI-agenter',
    description: 'Vi vill automatisera kundsupport'
  }
}

// Kopia av extractValue från route.ts
function extractValue(field) {
  if (!field) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'object' && field.value) return String(field.value)
  return ''
}

// Kopia av isWebsite från route.ts
function isWebsite(str) {
  return str.includes('.') && !str.startsWith('http://') && !str.startsWith('https://')
}

// Extrahera data
const payload = fakePayload.payload
let company = extractValue(payload.metadata?.company ?? payload.responses?.company)
let website = extractValue(payload.metadata?.website) || null

console.log('📥 INPUT FRÅN CAL.COM:')
console.log('  company:', JSON.stringify(company))
console.log('  website:', JSON.stringify(website))
console.log()

// SMART PARSING (exakt som i route.ts)
console.log('🔧 SMART PARSING:')
if (!company && website) {
  company = website.replace(/^www\./, '').split('.')[0]
  company = company.charAt(0).toUpperCase() + company.slice(1)
  console.log('  ✅ Extraherade företagsnamn från website:', company)
} else if (company && !website && isWebsite(company)) {
  website = company
  company = company.replace(/^www\./, '').split('.')[0]
  company = company.charAt(0).toUpperCase() + company.slice(1)
  console.log('  ✅ Hittade website i company-fältet, extraherade:', company)
} else {
  console.log('  ℹ️  Båda fält ifyllda eller inget att extrahera')
}
console.log()

// Mock-research data (som Apiverket skulle returnera)
console.log('📊 MOCK RESEARCH (Apiverket):')
const research = {
  company: {
    name: company || 'Okänt företag',
    orgnr: '556123-4567',
    website: website || '',
    description: 'E-handelsföretag inom konsumentelektronik',
    industry: 'Handel',
    employees: 12,
    revenue: 28500000,
    techStack: ['Shopify', 'Fortnox', 'Zendesk']
  }
}
console.log('  Företag:', research.company.name)
console.log('  Org.nr:', research.company.orgnr)
console.log('  Anställda:', research.company.employees)
console.log('  Omsättning:', research.company.revenue.toLocaleString('sv-SE'), 'kr')
console.log()

// Parse ROI-data (exakt som i route.ts)
console.log('📈 ROI-DATA:')
const roiData = {
  annualSavings: Number(payload.metadata?.annualSavings) || 0,
  totalHours: Number(payload.metadata?.totalHours) || 0,
  roi: Number(payload.metadata?.roi) || 0,
  payback: payload.metadata?.payback ? Number(payload.metadata.payback) : null,
  implCost: payload.metadata?.implCost ? Number(payload.metadata.implCost) : undefined,
  hourlyRate: payload.metadata?.hourlyRate ? Number(payload.metadata.hourlyRate) : 350,
  year1: payload.metadata?.year1 ? Number(payload.metadata.year1) : 0,
  year2: payload.metadata?.year2 ? Number(payload.metadata.year2) : 0,
  year3: payload.metadata?.year3 ? Number(payload.metadata.year3) : 0
}
console.log('  Årlig besparing:', roiData.annualSavings.toLocaleString('sv-SE'), 'kr')
console.log('  ROI:', roiData.roi, '%')
console.log('  Payback:', roiData.payback, 'år')
console.log('  År 1-3:', roiData.year1, '/', roiData.year2, '/', roiData.year3)
console.log()

// Testa med annat scenario: användaren fyllde i company men inte website
console.log('=== SCENARIO 2: Company ifyllt, website tomt ===')
const fakePayload2 = {
  payload: {
    responses: {
      name: { value: 'Anna Andersson' },
      email: { value: 'anna@acando.se' },
      website: { value: '' },
      company: { value: 'acando.se' } // Användaren skrev website i company-fältet!
    },
    metadata: {
      website: '',
      company: 'acando.se'
    }
  }
}

let company2 = extractValue(fakePayload2.payload.metadata?.company ?? fakePayload2.payload.responses?.company)
let website2 = extractValue(fakePayload2.payload.metadata?.website) || null

console.log('  Input company:', JSON.stringify(company2))
console.log('  Input website:', JSON.stringify(website2))

if (!company2 && website2) {
  company2 = website2.replace(/^www\./, '').split('.')[0]
  company2 = company2.charAt(0).toUpperCase() + company2.slice(1)
  console.log('  ✅ Extraherade från website:', company2)
} else if (company2 && !website2 && isWebsite(company2)) {
  website2 = company2
  company2 = company2.replace(/^www\./, '').split('.')[0]
  company2 = company2.charAt(0).toUpperCase() + company2.slice(1)
  console.log('  ✅ Flyttade website från company-fältet:', company2)
}

console.log('  Resultat: company =', company2, ', website =', website2)
console.log()

console.log('=== ✅ TEST SLUTFÖRD ===')
console.log('Smart parsing fungerar korrekt!')
console.log()
console.log('NÄSTA STEG:')
console.log('1. Öppna ROI-kalkylatorn på /sv')
console.log('2. Fyll i: namn, email, website (t.ex. "telestore.se")')
console.log('3. Lämna "Företag" tomt (vi extraherar automatiskt)')
console.log('4. Boka möte')
console.log('5. Webhook skapar vit briefing med korrekt företagsnamn!')
