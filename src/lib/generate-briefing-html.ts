// PDF HTML Generator for Eteya Briefing
// This file is designed to be imported by Next.js API routes

export interface ResearchOutput {
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

export interface ROIData {
  annualSavings: number
  totalHours: number
  fte: number
  roi: number
  payback: number | null
  hourlyRate?: number
  year1?: number
  year2?: number
  year3?: number
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

// Generate HTML for PDF
export function generateHTML(research: ResearchOutput, roiData: ROIData, booking: BookingData): string {
  const fmt = (n: number) => n.toLocaleString('sv-SE')
  const fmtCurrency = (n: number) => `${fmt(Math.round(n))} kr`
  
  const priorityColors = {
    high: '#C8FF00',
    medium: '#FFD700',
    low: '#FFA500'
  }
  
  const confidenceColors = {
    high: '#C8FF00',
    medium: '#FFD700',
    low: '#FF6B6B'
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Strategimöte — ${research.company.name}</title>
  <style>
    @page { size: A4; margin: 0; }
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #ffffff; line-height: 1.6; }
    .page { padding: 40px; }
    .header { background: linear-gradient(135deg, #C8FF00 0%, #9FCC00 100%); color: #0a0a0a; padding: 30px; margin: -40px -40px 30px -40px; }
    .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 700; }
    .header .subtitle { font-size: 14px; opacity: 0.8; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 18px; font-weight: 600; color: #C8FF00; margin-bottom: 15px; border-bottom: 1px solid rgba(200, 255, 0, 0.3); padding-bottom: 8px; }
    .card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 15px; }
    .card h3 { margin: 0 0 10px 0; font-size: 16px; color: #C8FF00; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .stat { background: rgba(200, 255, 0, 0.1); border-left: 3px solid #C8FF00; padding: 15px; border-radius: 4px; }
    .stat-value { font-size: 24px; font-weight: 700; color: #C8FF00; }
    .stat-label { font-size: 12px; opacity: 0.7; margin-top: 5px; }
    .roi-badge { background: linear-gradient(135deg, rgba(200, 255, 0, 0.2) 0%, rgba(159, 204, 0, 0.2) 100%); border: 2px solid #C8FF00; border-radius: 12px; padding: 25px; text-align: center; margin: 20px 0; }
    .roi-badge .value { font-size: 42px; font-weight: 700; color: #C8FF00; }
    .roi-badge .label { font-size: 14px; opacity: 0.8; margin-top: 8px; }
    .opportunity { background: rgba(255, 255, 255, 0.03); border-left: 3px solid; padding: 15px; margin-bottom: 12px; border-radius: 4px; }
    .opportunity h4 { margin: 0 0 8px 0; font-size: 15px; }
    .opportunity .savings { font-size: 13px; opacity: 0.8; margin-top: 5px; }
    .competitor-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .competitor-table th { text-align: left; padding: 10px; border-bottom: 1px solid #C8FF00; color: #C8FF00; }
    .competitor-table td { padding: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; font-size: 12px; opacity: 0.6; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>🎯 Strategimöte — Briefing</h1>
      <div class="subtitle">${new Date(booking.bookingTime).toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
    </div>

    <div class="section">
      <div class="card">
        <h3>📋 Mötesinformation</h3>
        <div class="grid">
          <div><strong>Företag:</strong> ${research.company.name}<br><strong>Kontakt:</strong> ${booking.contactName}<br><strong>Email:</strong> ${booking.contactEmail}</div>
          <div><strong>Tjänst:</strong> ${booking.service}<br><strong>Bransch:</strong> ${research.company.industry}<br><strong>SNI:</strong> ${research.industry.sniCode}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="roi-badge">
        <div class="value">${fmtCurrency(roiData.annualSavings)}/år</div>
        <div class="label">Uppskattad besparing</div>
      </div>
      ${roiData.year1 && roiData.year2 && roiData.year3 ? `
      <div class="card">
        <h3>📊 3-årsprognos</h3>
        <div class="grid">
          <div class="stat"><div class="stat-value">${fmtCurrency(roiData.year1)}</div><div class="stat-label">År 1</div></div>
          <div class="stat"><div class="stat-value">${fmtCurrency(roiData.year2)}</div><div class="stat-label">År 2</div></div>
          <div class="stat"><div class="stat-value">${fmtCurrency(roiData.year3)}</div><div class="stat-label">År 3</div></div>
          <div class="stat"><div class="stat-value">${roiData.roi}%</div><div class="stat-label">ROI</div></div>
        </div>
      </div>` : ''}
    </div>

    <div class="section">
      <div class="section-title">🏢 Företagsanalys</div>
      <div class="card">
        <div class="grid">
          <div><strong>Verksamhet:</strong><br>${research.company.description}</div>
          <div><strong>Teknologier:</strong><br>${research.company.techStack.join(', ') || 'Ej detekterat'}</div>
          <div><strong>Anställda:</strong><br>${research.company.employees} st</div>
          <div><strong>Omsättning:</strong><br>${fmtCurrency(research.company.revenue)}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">🤖 AI-möjligheter</div>
      ${research.aiOpportunities.map(opp => `
        <div class="opportunity" style="border-color: ${priorityColors[opp.priority]}">
          <h4 style="color: ${priorityColors[opp.priority]}">${opp.title}</h4>
          <div>${opp.description}</div>
          <div class="savings">💰 ${opp.estimatedSavings} | Prioritet: <span class="badge" style="background: ${priorityColors[opp.priority]}; color: #0a0a0a;">${opp.priority}</span></div>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <div class="section-title">💰 Konkurrenspriser</div>
      <div class="card">
        <table class="competitor-table">
          <thead><tr><th>Företag</th><th>Pris</th><th>Tjänst</th></tr></thead>
          <tbody>${research.competitors.map(c => `<tr><td>${c.name}</td><td>${c.pricing}</td><td>${c.service}</td></tr>`).join('')}</tbody>
        </table>
      </div>
    </div>

    <div class="section">
      <div class="section-title">✅ ROI-validering</div>
      <div class="card">
        <div class="grid">
          <div><strong>Påstådd besparing:</strong><br>${fmtCurrency(research.roiValidation.claimed)}</div>
          <div><strong>Realistisk besparing:</strong><br><span style="color: ${confidenceColors[research.roiValidation.confidence]}">${fmtCurrency(research.roiValidation.realistic)}</span></div>
        </div>
        <div style="margin-top: 15px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 4px;">
          <strong>Bedömning:</strong> <span class="badge" style="background: ${confidenceColors[research.roiValidation.confidence]}; color: #0a0a0a; margin-left: 8px;">${research.roiValidation.confidence.toUpperCase()}</span>
          <div style="margin-top: 8px; font-size: 13px;">${research.roiValidation.notes}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">🎯 Rekommenderat fokus</div>
      <div class="card">${research.recommendedFocus}</div>
    </div>

    <div class="footer"><strong>eteya.ai</strong> | kontakt@eteya.ai<br>Genererad: ${new Date().toLocaleString('sv-SE')}</div>
  </div>
</body>
</html>
  `
}
