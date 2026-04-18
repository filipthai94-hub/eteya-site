import { readFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface BriefingData {
  meetingDate: string
  company: string
  contactName: string
  contactEmail: string
  roi: {
    employees: number
    hourlyRate: number
    adminHoursPerWeek: number
    annualSavings: number
  }
  analysis: {
    industry: string
    employees: number
    revenue: string
    website: string
    description: string
  }
  competitors: { name: string; pricing: string; service: string }[]
  opportunities: { title: string; description: string; impact: string; priority: string }[]
  recommendedFocus: string
}

const testData: BriefingData = {
  meetingDate: '2026-04-21 kl 14:00',
  company: 'Telestore Sverige AB',
  contactName: 'Filip Thai',
  contactEmail: 'filip@telestore.se',
  roi: {
    employees: 8,
    hourlyRate: 350,
    adminHoursPerWeek: 20,
    annualSavings: 390000,
  },
  analysis: {
    industry: 'E-handel (SNI 47910)',
    employees: 8,
    revenue: '~5M kr',
    website: 'telestore.se',
    description: 'E-handel av mobiltelefoner och tillbehör',
  },
  competitors: [
    { name: 'Satori ML', pricing: '~2 200 kr/h', service: 'AI-konsultation' },
    { name: 'Codon Consulting', pricing: 'Från 15 000 kr/paket', service: 'AI-automatisering' },
    { name: 'Bransch-genomsnitt', pricing: '1 500–2 500 kr/h', service: 'AI-konsultation' },
  ],
  opportunities: [
    { title: 'Orderbekräftelse-automation', description: 'Automatisera orderbekräftelser och fakturering', impact: '~15 h/vecka', priority: 'Hög' },
    { title: 'Kundtjänst AI-chatbot', description: 'AI-driven kundtjänst för vanliga frågor', impact: '~8 h/vecka', priority: 'Hög' },
    { title: 'Lagerhantering prediktiv AI', description: 'Prediktiv lagerhantering med AI', impact: '~5 h/vecka', priority: 'Medium' },
  ],
  recommendedFocus:
    'Fokusera på orderautomatisering — störst ROI baserat på kalkylatorn. E-handel = hög volym repetitiva processer.',
}

function formatSwe(num: number): string {
  return num.toLocaleString('sv-SE')
}

function priorityClass(p: string): string {
  const lower = p.toLowerCase()
  if (lower === 'hög' || lower === 'high') return 'high'
  if (lower === 'medium') return 'medium'
  return 'low'
}

function buildCompetitorsRows(competitors: BriefingData['competitors']): string {
  return competitors
    .map(
      (c) => `      <tr>
        <td>${c.name}</td>
        <td>${c.pricing}</td>
        <td>${c.service}</td>
      </tr>`
    )
    .join('\n')
}

function buildOpportunitiesItems(opportunities: BriefingData['opportunities']): string {
  return opportunities
    .map(
      (o, i) => `  <div class="opp-item">
    <div class="opp-num">${i + 1}.</div>
    <div class="opp-main">
      <div class="opp-title">${o.title}</div>
      <div class="opp-desc">${o.description}</div>
    </div>
    <div class="opp-meta">
      <span class="opp-impact">${o.impact}</span>
      <span class="opp-priority">${o.priority}</span>
    </div>
  </div>`
    )
    .join('\n')
}

async function generatePDF(data: BriefingData, outputPath: string) {
  // Read template
  const templatePath = join(__dirname, 'briefing-template.html')
  let html = readFileSync(templatePath, 'utf-8')

  // Replace placeholders
  html = html
    .replace('{{meetingDate}}', data.meetingDate)
    .replace('{{company}}', data.company)
    .replace('{{contactName}}', data.contactName)
    .replace('{{contactEmail}}', data.contactEmail)
    .replace('{{roiEmployees}}', String(data.roi.employees))
    .replace('{{roiHourlyRate}}', formatSwe(data.roi.hourlyRate))
    .replace('{{roiAdminHours}}', String(data.roi.adminHoursPerWeek))
    .replace('{{roiAnnualSavings}}', formatSwe(data.roi.annualSavings))
    .replace('{{analysisIndustry}}', data.analysis.industry)
    .replace('{{analysisEmployees}}', String(data.analysis.employees))
    .replace('{{analysisRevenue}}', data.analysis.revenue)
    .replace('{{analysisWebsite}}', data.analysis.website)
    .replace('{{analysisDescription}}', data.analysis.description)
    .replace('{{competitorsRows}}', buildCompetitorsRows(data.competitors))
    .replace('{{opportunitiesItems}}', buildOpportunitiesItems(data.opportunities))
    .replace('{{recommendedFocus}}', data.recommendedFocus)

  // Ensure output directory
  const outputDir = dirname(outputPath)
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true })

  // Generate PDF with Puppeteer
  const puppeteer = await import('puppeteer')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0' })

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true,
  })

  await browser.close()
  console.log(`✅ PDF generated: ${outputPath}`)
}

// Run
const jsonPath = process.argv[2]
const data: BriefingData = jsonPath
  ? JSON.parse(readFileSync(jsonPath, 'utf-8'))
  : testData

const outputPath = join(__dirname, 'output', 'briefing-test.pdf')
generatePDF(data, outputPath).catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})