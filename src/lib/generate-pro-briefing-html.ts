// Professional HTML Generator for Eteya Briefing
// White background, clean design, black text on numbers

import type { FinancialEnrichment, FinancialMetric } from './financial-enrichment'
import type { SalesIntelligence } from './sales-intelligence'

export interface ResearchOutput {
  company: {
    name: string
    orgnr?: string | null
    website: string | null
    description: string | null
    industry: string | null
    employees: number | null
    revenue: number | null
    techStack: string[]
    verified?: boolean
    confidence?: 'high' | 'medium' | 'low'
  }
  industry: {
    sniCode: string | null
    averageRevenue: number | null
    employeeGrowth: string | null
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
    whyItMatches?: string
  }>
  roiValidation: {
    claimed: number | null
    realistic: number | null
    confidence: 'high' | 'medium' | 'low'
    notes: string
  }
  recommendedFocus: string
  salesIntelligence?: SalesIntelligence | null
  financials?: FinancialEnrichment | null
  sources?: string[]
  dataGaps?: string[]
}

export interface ROIData {
  annualSavings: number | null
  totalHours: number | null
  fte: number | null
  roi: number | null
  payback: number | null
  implCost?: number | null
  hourlyRate?: number | null
  year1?: number | null
  year2?: number | null
  year3?: number | null
  processes?: Array<{
    label: string
    hoursPerWeek: number
    automationRate: number
    annualSavings: number
  }>
}

export interface BookingData {
  contactName: string
  contactEmail: string
  bookingTime: string
  service: string
}

const icons = {
  building: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  dollarSign: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  trendUp: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  robot: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M9 10v.01"/><path d="M15 10v.01"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M8 22h8"/></svg>`,
  target: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  chartBar: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function generateProHTML(research: ResearchOutput, roiData: ROIData, booking: BookingData): string {
  const fmt = (n: number) => n.toLocaleString('sv-SE')
  const fmtCurrency = (n: number | null | undefined) => Number.isFinite(Number(n)) && Number(n) > 0 ? `${fmt(Math.round(Number(n)))} kr` : 'Ej verifierat'
  const fmtNumber = (n: number | null | undefined, suffix = '') => Number.isFinite(Number(n)) && Number(n) > 0 ? `${fmt(Math.round(Number(n)))}${suffix}` : 'Ej verifierat'
  const fmtPercent = (n: number | null | undefined) => Number.isFinite(Number(n)) && Number(n) > 0 ? `${fmt(Math.round(Number(n)))}%` : 'Ej verifierat'
  const valueOrUnknown = (value: unknown) => value === null || value === undefined || value === '' || value === '0000' || value === '000000-0000' ? 'Ej verifierat' : escapeHtml(value)
  const list = (items: string[] | undefined, fallback = 'Ej verifierat') => items && items.length ? `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : `<p class="muted">${fallback}</p>`
  const sales = research.salesIntelligence
  const financials = research.financials
  const latestFinancials = financials?.latestYear || null
  const hasAvailableFinancials = financials?.status === 'available' && Boolean(latestFinancials)
  const hasVerifiedEmployees = hasAvailableFinancials && latestFinancials?.employees !== null && latestFinancials?.employees !== undefined
  const hasVerifiedRevenue = hasAvailableFinancials && latestFinancials?.revenue?.valueSek !== null && latestFinancials?.revenue?.valueSek !== undefined
  const aiCases = sales?.aiUseCases?.length
    ? sales.aiUseCases.map(useCase => ({ title: useCase.title, description: useCase.description, estimatedSavings: useCase.estimatedImpact, priority: useCase.priority, whyItMatches: useCase.whyItMatches }))
    : research.aiOpportunities
  const rawDataGaps = [...(sales?.dataGaps || []), ...(research.dataGaps || [])]
  const dataGaps = rawDataGaps
    .filter(item => {
      const normalized = item.toLowerCase()
      if (hasVerifiedEmployees && normalized.includes('antal anställda') && normalized.includes('saknas')) return false
      if (hasVerifiedRevenue && normalized.includes('omsättning') && normalized.includes('saknas')) return false
      return true
    })
    .filter((item, index, array) => array.indexOf(item) === index)
  const confidenceNotes = [
    ...(sales?.confidenceNotes || []),
    financials?.confidence === 'high' && financials.orgnrMatched ? 'Ekonomidata: high confidence via Allabolag, orgnr matchad.' : null,
  ].filter((item): item is string => Boolean(item)).filter((item, index, array) => array.indexOf(item) === index)
  const sources = [...(sales?.sources || []), ...(research.sources || [])].filter((item, index, array) => item && array.indexOf(item) === index)
  const companyFinancialInfoHtml = hasAvailableFinancials ? '' : `
          <div class="info-item"><span class="label">Antal anställda</span><span class="value">${fmtNumber(research.company.employees, ' st')}</span></div>
          <div class="info-item"><span class="label">Omsättning</span><span class="value">${fmtCurrency(research.company.revenue)}</span></div>`
  const fmtFinancialMetric = (metric?: FinancialMetric | null) => metric?.valueSek !== null && metric?.valueSek !== undefined ? `${fmt(Math.round(metric.valueSek))} kr${metric.raw ? ` <span class="muted">(${escapeHtml(metric.raw)})</span>` : ''}` : 'Ej verifierat'
  const financialSource = financials?.sourceUrl ? `<a href="${escapeHtml(financials.sourceUrl)}">Allabolag</a>` : 'Ej verifierat'
  const financialWarnings = financials?.warnings?.length ? financials.warnings : financials ? [] : ['Ekonomiberikning saknas i research-output.']

  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Strategimöte — ${escapeHtml(research.company.name)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FFFFFF; color: #1A1A1A; line-height: 1.6; padding: 40px 20px; }
    .container { max-width: 980px; margin: 0 auto; }
    .header { border-bottom: 2px solid #C8FF00; padding-bottom: 20px; margin-bottom: 40px; }
    .header h1 { font-size: 32px; font-weight: 700; color: #1A1A1A; letter-spacing: 2px; margin-bottom: 8px; }
    .subtitle { font-size: 14px; color: #666; }
    .section { margin-bottom: 40px; }
    .section-title { font-size: 20px; font-weight: 650; color: #1A1A1A; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
    .section-title svg { color: #C8FF00; background: #1A1A1A; padding: 4px; border-radius: 4px; flex: 0 0 auto; }
    .card { background: #F8F9FA; border-radius: 10px; padding: 24px; margin-bottom: 16px; border: 1px solid #EEF0F2; }
    .white-card { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; padding: 18px; margin-bottom: 12px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .label { font-size: 13px; color: #666; font-weight: 500; }
    .value { font-size: 15px; color: #1A1A1A; font-weight: 600; }
    .muted { color: #6B7280; font-size: 14px; }
    .roi-highlight { background: linear-gradient(135deg, #C8FF00 0%, #9FCC00 100%); color: #1A1A1A; padding: 32px; border-radius: 12px; text-align: center; margin-bottom: 24px; }
    .roi-highlight .value { font-size: 46px; font-weight: 750; margin-bottom: 8px; }
    .stat-box { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; }
    .stat-box .value { font-size: 26px; font-weight: 750; color: #1A1A1A; }
    .opportunity-item { background: #FFFFFF; border: 1px solid #E5E7EB; border-left: 4px solid #C8FF00; border-radius: 8px; padding: 20px; margin-bottom: 12px; }
    .opportunity-item h4 { font-size: 16px; font-weight: 650; color: #1A1A1A; margin-bottom: 8px; }
    .opportunity-item .description { font-size: 14px; color: #4B5563; margin-bottom: 10px; }
    .why { background: rgba(200,255,0,0.18); border-left: 3px solid #C8FF00; padding: 10px 12px; border-radius: 4px; font-size: 13px; margin-top: 10px; }
    .meta { display: flex; gap: 16px; align-items: center; font-size: 13px; flex-wrap: wrap; }
    .priority { padding: 4px 12px; border-radius: 9999px; font-weight: 650; font-size: 12px; text-transform: uppercase; }
    .priority.high { background: #DCFCE7; color: #166534; }
    .priority.medium { background: #FEF9C3; color: #854D0E; }
    .priority.low { background: #E5E7EB; color: #374151; }
    .competitor-table { width: 100%; border-collapse: collapse; background: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #E5E7EB; }
    .competitor-table th { background: #F8F9FA; padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 650; color: #374151; border-bottom: 2px solid #E5E7EB; }
    .competitor-table td { padding: 16px; border-bottom: 1px solid #E5E7EB; font-size: 14px; vertical-align: top; }
    .competitor-table tr:last-child td { border-bottom: none; }
    ul, ol { margin-left: 20px; }
    li { margin: 6px 0; }
    .callout { background: #111827; color: #FFFFFF; border-radius: 10px; padding: 22px; }
    .callout strong { color: #C8FF00; }
    .footer { margin-top: 60px; padding-top: 24px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 13px; color: #9CA3AF; }
    .footer strong { color: #1A1A1A; }
    @media (max-width: 768px) { .grid, .info-grid { grid-template-columns: 1fr; } .roi-highlight .value { font-size: 34px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ETEYA</h1>
      <div class="subtitle">Strategimöte — ${escapeHtml(research.company.name)}</div>
      <div class="subtitle">${escapeHtml(booking.bookingTime)} · ${escapeHtml(booking.service)}</div>
    </div>

    <div class="section">
      <div class="section-title">${icons.briefcase} Executive summary / vad bolaget gör</div>
      <div class="callout">
        <p><strong>Mötesöppning:</strong> ${escapeHtml(sales?.meetingOpening || `Jag har tittat på ${research.company.name}. Min hypotes är att vi bör börja med att hitta ett mätbart, repetitivt flöde där AI kan ge effekt snabbt.`)}</p>
        <p style="margin-top: 12px;"><strong>Sammanfattning:</strong> ${escapeHtml(sales?.companySummary || research.company.description || 'Ej verifierat')}</p>
        <p style="margin-top: 12px;"><strong>Pitchvinkel:</strong> ${escapeHtml(sales?.pitchAngle || research.recommendedFocus)}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">${icons.building} Företagsinformation</div>
      <div class="card">
        <div class="info-grid">
          <div class="info-item"><span class="label">Företag</span><span class="value">${escapeHtml(research.company.name)}</span></div>
          <div class="info-item"><span class="label">Organisationsnummer</span><span class="value">${valueOrUnknown(research.company.orgnr)}</span></div>
          <div class="info-item"><span class="label">Bransch</span><span class="value">${valueOrUnknown(research.company.industry)} (SNI ${valueOrUnknown(research.industry.sniCode)})</span></div>
          <div class="info-item"><span class="label">Kontakt</span><span class="value">${escapeHtml(booking.contactName)}</span></div>${companyFinancialInfoHtml}
          <div class="info-item"><span class="label">Datakonfidens</span><span class="value">${escapeHtml(research.company.confidence || 'Ej verifierat')}${research.company.verified ? ' · verifierat' : ''}</span></div>
        </div>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
          <span class="label">Verksamhetsbeskrivning</span>
          <p class="muted" style="margin-top: 4px;">${escapeHtml(research.company.description || 'Ej verifierat')}</p>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">${icons.chartBar} Senaste ekonomi</div>
      <div class="card">
        <div class="info-grid">
          <div class="info-item"><span class="label">Bokslutsår</span><span class="value">${escapeHtml(latestFinancials?.fiscalYear || 'Ej verifierat')}</span></div>
          <div class="info-item"><span class="label">Omsättning</span><span class="value">${fmtFinancialMetric(latestFinancials?.revenue)}</span></div>
          <div class="info-item"><span class="label">Resultat efter finansnetto</span><span class="value">${fmtFinancialMetric(latestFinancials?.profitAfterFinancialNet)}</span></div>
          <div class="info-item"><span class="label">Årets resultat</span><span class="value">${fmtFinancialMetric(latestFinancials?.netIncome)}</span></div>
          <div class="info-item"><span class="label">Anställda</span><span class="value">${latestFinancials?.employees !== null && latestFinancials?.employees !== undefined ? `${fmt(latestFinancials.employees)} st` : 'Ej verifierat'}</span></div>
          <div class="info-item"><span class="label">Källa / confidence</span><span class="value">${financialSource} · ${escapeHtml(financials?.confidence || 'not_available')}</span></div>
        </div>
        ${financials?.orgnrMatched ? '<div class="why"><strong>Verifiering:</strong> Allabolag-sidan matchade organisationsnumret från bolagsberikningen.</div>' : '<div class="why"><strong>Verifiering:</strong> Ej verifierat mot organisationsnummer — använd inte siffrorna utan manuell kontroll.</div>'}
        ${financialWarnings.length ? `<div style="margin-top: 16px;"><span class="label">Varningar</span>${list(financialWarnings)}</div>` : ''}
      </div>
    </div>

    <div class="section">
      <div class="section-title">${icons.trendUp} ROI-prognos</div>
      <div class="roi-highlight">
        <div class="value">${fmtCurrency(roiData.annualSavings)}/år</div>
        <div class="label">Uppskattad årsbesparing från kalkylatorn</div>
      </div>
      <div class="grid">
        <div class="stat-box"><div class="label">År 1</div><div class="value">${fmtCurrency(roiData.year1)}</div></div>
        <div class="stat-box"><div class="label">År 2</div><div class="value">${fmtCurrency(roiData.year2)}</div></div>
        <div class="stat-box"><div class="label">År 3</div><div class="value">${fmtCurrency(roiData.year3)}</div></div>
        <div class="stat-box"><div class="label">ROI</div><div class="value">${fmtPercent(roiData.roi)}</div></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">${icons.target} Sannolika flaskhalsar</div>
      <div class="card">${list(sales?.likelyBottlenecks, 'Bekräfta flaskhalsar i discovery.')}</div>
    </div>

    <div class="section">
      <div class="section-title">${icons.robot} AI-case med varför det matchar</div>
      ${aiCases.map(opp => `
        <div class="opportunity-item">
          <h4>${escapeHtml(opp.title)}</h4>
          <div class="description">${escapeHtml(opp.description)}</div>
          ${opp.whyItMatches ? `<div class="why"><strong>Varför matchar:</strong> ${escapeHtml(opp.whyItMatches)}</div>` : ''}
          <div class="meta" style="margin-top: 12px;">
            <span>${escapeHtml(opp.estimatedSavings)}</span>
            <span class="priority ${escapeHtml(opp.priority)}">${opp.priority === 'high' ? 'Hög prioritet' : opp.priority === 'medium' ? 'Medelprioritet' : 'Låg prioritet'}</span>
          </div>
        </div>`).join('')}
    </div>

    <div class="section">
      <div class="section-title">${icons.checkCircle} Frågor att ställa i mötet</div>
      <div class="card">${list(sales?.meetingQuestions, 'Ställ discovery-frågor kring volym, system, risk och pilotmål.')}</div>
    </div>

    <div class="section">
      <div class="section-title">${icons.trendUp} Snabba wins</div>
      <div class="card">${list(sales?.quickWins, 'Välj ett mätbart pilotflöde med mänskligt godkännande först.')}</div>
    </div>

    <div class="section">
      <div class="section-title">${icons.chartBar} Marknad / Eteya-positionering</div>
      <div class="card">
        <p>${escapeHtml(sales?.marketContext || 'AI-leverantörer nedan är positioneringsreferenser för Eteya, inte kundens direkta konkurrenter.')}</p>
        <table class="competitor-table" style="margin-top: 16px;">
          <thead><tr><th>AI-leverantör</th><th>Pris</th><th>Positionering/tjänst</th></tr></thead>
          <tbody>
            ${research.competitors.map(c => `<tr><td><strong>${escapeHtml(c.name)}</strong></td><td>${escapeHtml(c.pricing)}</td><td>${escapeHtml(c.service)}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="section">
      <div class="section-title">${icons.checkCircle} ROI-validering</div>
      <div class="card">
        <div class="info-grid">
          <div class="info-item"><span class="label">Påstådd besparing</span><span class="value">${fmtCurrency(research.roiValidation.claimed)}</span></div>
          <div class="info-item"><span class="label">Realistisk besparing</span><span class="value">${fmtCurrency(research.roiValidation.realistic)}</span></div>
        </div>
        <div class="why"><strong>Bedömning:</strong> ${escapeHtml(research.roiValidation.confidence.toUpperCase())} CONFIDENCE<br>${escapeHtml(research.roiValidation.notes)}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">${icons.target} Data gaps / osäkerheter</div>
      <div class="card">
        ${list(dataGaps, 'Inga större datagap identifierade, men verifiera alltid i mötet.')}
        ${confidenceNotes.length ? `<div style="margin-top: 16px;"><span class="label">Konfidensnoter</span>${list(confidenceNotes)}</div>` : ''}
      </div>
    </div>

    <div class="section">
      <div class="section-title">${icons.building} Källor</div>
      <div class="card">${sources.length ? `<ul>${sources.map(source => `<li><a href="${escapeHtml(source)}">${escapeHtml(source)}</a></li>`).join('')}</ul>` : '<p class="muted">Apiverket/Cal.com/ROI-kalkylator. Website-källor ej verifierade.</p>'}</div>
    </div>

    <div class="footer">
      <strong>ETEYA</strong> | kontakt@eteya.ai<br>
      Genererad: ${new Date().toLocaleString('sv-SE')}
    </div>
  </div>
</body>
</html>`
}
