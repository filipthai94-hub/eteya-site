#!/usr/bin/env node
/**
 * Generate Professional Test Briefing
 * 
 * Skapar en test-briefing med NY proffsig design:
 * - Vit bakgrund
 * - Lucide icons (SVG)
 * - Mer informativ konkurrensanalys
 * - Webbläsarvänlig
 */

import { writeFile } from 'fs/promises'
import { join } from 'path'

// Lucide icons som SVG
const icons = {
  building: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  dollarSign: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  trendUp: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  robot: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M9 10v.01"/><path d="M15 10v.01"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M8 22h8"/></svg>`,
  target: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  chartBar: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`
}

// Mock data
const data = {
  company: {
    name: 'Telestore Sverige AB',
    orgnr: '556789-1234',
    description: 'E-handel av mobiltelefoner och tillbehör. Företaget erbjuder ett brett sortiment av smartphones, skal, skydd och tillbehör från ledande varumärken.',
    industry: 'E-handel',
    sniCode: '47910',
    employees: 8,
    revenue: 5200000,
    address: 'Storgatan 1, 111 22 Stockholm'
  },
  booking: {
    contactName: 'Filip Thai',
    contactEmail: 'filip@telestore.se',
    bookingTime: '2026-04-29 kl 14:00',
    service: 'AI-strategi och rådgivning'
  },
  roi: {
    annualSavings: 390000,
    roi: 156,
    payback: 3,
    year1: 390000,
    year2: 780000,
    year3: 1170000
  },
  aiOpportunities: [
    {
      title: 'Orderbekräftelse-automation',
      description: 'Automatisera orderbekräftelser, spårningsmeddelanden och returhantering',
      hoursSaved: 15,
      priority: 'high'
    },
    {
      title: 'Returhantering automation',
      description: 'Automatisera returflöden, kreditgivning och lageruppdatering',
      hoursSaved: 8,
      priority: 'high'
    },
    {
      title: 'AI-chatbot för kundtjänst',
      description: 'Hantera vanliga kundfrågor automatiskt 24/7 med AI',
      hoursSaved: 6,
      priority: 'medium'
    },
    {
      title: 'AI-genererade produktbeskrivningar',
      description: 'Använd AI för att skapa SEO-optimerade produktbeskrivningar i skala',
      hoursSaved: 5,
      priority: 'medium'
    }
  ],
  competitors: [
    { 
      name: 'Satori ML', 
      pricing: '~2 200 kr/h', 
      monthly: '~35 200 kr/mån (vid 16h)', 
      focus: 'Maskininlärning, AI-strategi',
      tier: 'premium',
      calc: '2 200 kr/h × 16h = 35 200 kr/mån'
    },
    { 
      name: 'Codon Consulting', 
      pricing: 'Från 15 000 kr/mån', 
      hourly: '~937 kr/h (vid 16h)', 
      focus: 'NLP, Chatbot, MLOps',
      tier: 'mid-market',
      calc: '15 000 kr/mån ÷ 16h = 937 kr/h'
    },
    { 
      name: 'Aixia', 
      pricing: '1 500-2 000 kr/h', 
      monthly: '~24 000-32 000 kr/mån', 
      focus: 'AI-infrastruktur, strategi',
      tier: 'premium',
      calc: '1 750 kr/h (snitt) × 16h = 28 000 kr/mån'
    },
    { 
      name: 'Abundly AI', 
      pricing: '1 200-1 800 kr/h', 
      monthly: '~19 200-28 800 kr/mån', 
      focus: 'Generativ AI, agenter',
      tier: 'mid-market',
      calc: '1 500 kr/h (snitt) × 16h = 24 000 kr/mån'
    },
    { 
      name: 'Arange AI', 
      pricing: '900-1 500 kr/h', 
      monthly: '~14 400-24 000 kr/mån', 
      focus: 'AI-strategi → implementation',
      tier: 'budget',
      calc: '1 200 kr/h (snitt) × 16h = 19 200 kr/mån'
    }
  ],
  marketInsights: {
    averageHourly: 1650,
    note: 'Priser under 900 kr/h bör väcka frågor om kompetensnivå',
    packaging: 'De flesta erbjuder både timpris och paketlösningar. Paket ger bättre marginal och förutsägbarhet.',
    trend: 'Agentisk AI och generativ AI är hetast 2026. Många går från timpris till värdebaserad prissättning.'
  }
}

const fmt = (n: number) => n.toLocaleString('sv-SE')
const fmtCurrency = (n: number) => `${fmt(Math.round(n))} kr`

function generateHTML(): string {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Strategimöte — ${data.company.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #FFFFFF;
      color: #1A1A1A;
      line-height: 1.6;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #C8FF00;
      padding-bottom: 20px;
      margin-bottom: 40px;
    }
    .header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #1A1A1A;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .header .subtitle {
      font-size: 14px;
      color: #666;
    }
    .section {
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #1A1A1A;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-title svg {
      color: #C8FF00;
      background: #1A1A1A;
      padding: 4px;
      border-radius: 4px;
    }
    .card {
      background: #F8F9FA;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 16px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .stat-box {
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 20px;
    }
    .stat-box .label {
      font-size: 13px;
      color: #666;
      margin-bottom: 8px;
    }
    .stat-box .value {
      font-size: 28px;
      font-weight: 700;
      color: #1A1A1A;
    }
    .roi-highlight {
      background: linear-gradient(135deg, #C8FF00 0%, #9FCC00 100%);
      color: #1A1A1A;
      padding: 32px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 24px;
    }
    .roi-highlight .value {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .roi-highlight .label {
      font-size: 16px;
      opacity: 0.9;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .info-item .label {
      font-size: 13px;
      color: #666;
      font-weight: 500;
    }
    .info-item .value {
      font-size: 15px;
      color: #1A1A1A;
      font-weight: 600;
    }
    .opportunity-item {
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-left: 4px solid #C8FF00;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 12px;
    }
    .opportunity-item h4 {
      font-size: 16px;
      font-weight: 600;
      color: #1A1A1A;
      margin-bottom: 8px;
    }
    .opportunity-item .description {
      font-size: 14px;
      color: #4B5563;
      margin-bottom: 12px;
    }
    .opportunity-item .meta {
      display: flex;
      gap: 16px;
      font-size: 13px;
    }
    .opportunity-item .hours {
      color: #6B7280;
    }
    .opportunity-item .priority {
      padding: 4px 12px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
    }
    .priority.high {
      background: #DCFCE7;
      color: #166534;
    }
    .priority.medium {
      background: #FEF9C3;
      color: #854D0E;
    }
    .competitor-table {
      width: 100%;
      border-collapse: collapse;
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #E5E7EB;
    }
    .competitor-table th {
      background: #F8F9FA;
      padding: 12px 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #E5E7EB;
    }
    .competitor-table td {
      padding: 16px;
      border-bottom: 1px solid #E5E7EB;
      font-size: 14px;
    }
    .competitor-table tr:last-child td {
      border-bottom: none;
    }
    .tier-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .tier-badge.premium {
      background: #FEE2E2;
      color: #991B1B;
    }
    .tier-badge.mid-market {
      background: #DBEAFE;
      color: #1E40AF;
    }
    .tier-badge.budget {
      background: #D1FAE5;
      color: #065F46;
    }
    .calc-note {
      font-size: 12px;
      color: #9CA3AF;
      font-style: italic;
    }
    .insights-box {
      background: #F8F9FA;
      border-left: 4px solid #C8FF00;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .insights-box h4 {
      font-size: 15px;
      font-weight: 600;
      color: #1A1A1A;
      margin-bottom: 12px;
    }
    .insights-box p {
      font-size: 14px;
      color: #4B5563;
      margin-bottom: 8px;
    }
    .insights-box p:last-child {
      margin-bottom: 0;
    }
    .footer {
      margin-top: 60px;
      padding-top: 24px;
      border-top: 1px solid #E5E7EB;
      text-align: center;
      font-size: 13px;
      color: #9CA3AF;
    }
    .footer strong {
      color: #1A1A1A;
    }
    @media (max-width: 768px) {
      .grid, .info-grid {
        grid-template-columns: 1fr;
      }
      .competitor-table {
        font-size: 12px;
      }
      .competitor-table th,
      .competitor-table td {
        padding: 8px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>ETHEYA</h1>
      <div class="subtitle">Strategimöte — ${data.company.name}</div>
      <div class="subtitle">${data.booking.bookingTime}</div>
    </div>

    <!-- Företagsinformation -->
    <div class="section">
      <div class="section-title">
        ${icons.building}
        Företagsinformation
      </div>
      <div class="card">
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Företag</span>
            <span class="value">${data.company.name}</span>
          </div>
          <div class="info-item">
            <span class="label">Organisationsnummer</span>
            <span class="value">${data.company.orgnr}</span>
          </div>
          <div class="info-item">
            <span class="label">Bransch</span>
            <span class="value">${data.company.industry} (SNI ${data.company.sniCode})</span>
          </div>
          <div class="info-item">
            <span class="label">Kontakt</span>
            <span class="value">${data.booking.contactName}</span>
          </div>
          <div class="info-item">
            <span class="label">Antal anställda</span>
            <span class="value">${icons.users} ${data.company.employees} st</span>
          </div>
          <div class="info-item">
            <span class="label">Omsättning</span>
            <span class="value">${icons.dollarSign} ${fmtCurrency(data.company.revenue)}</span>
          </div>
        </div>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
          <div class="info-item">
            <span class="label">Verksamhetsbeskrivning</span>
            <span class="value" style="font-weight: 400; margin-top: 4px;">${data.company.description}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ROI-prognos -->
    <div class="section">
      <div class="section-title">
        ${icons.trendUp}
        ROI-prognos
      </div>
      <div class="roi-highlight">
        <div class="value">${fmtCurrency(data.roi.annualSavings)}/år</div>
        <div class="label">Uppskattad årsbesparing</div>
      </div>
      <div class="grid">
        <div class="stat-box">
          <div class="label">År 1</div>
          <div class="value">${fmtCurrency(data.roi.year1)}</div>
        </div>
        <div class="stat-box">
          <div class="label">År 2</div>
          <div class="value">${fmtCurrency(data.roi.year2)}</div>
        </div>
        <div class="stat-box">
          <div class="label">År 3</div>
          <div class="value">${fmtCurrency(data.roi.year3)}</div>
        </div>
        <div class="stat-box">
          <div class="label">ROI</div>
          <div class="value">${data.roi.roi}%</div>
        </div>
      </div>
    </div>

    <!-- AI-möjligheter -->
    <div class="section">
      <div class="section-title">
        ${icons.robot}
        AI-möjligheter
      </div>
      ${data.aiOpportunities.map(opp => `
        <div class="opportunity-item">
          <h4>${opp.title}</h4>
          <div class="description">${opp.description}</div>
          <div class="meta">
            <span class="hours">💰 ~${opp.hoursSaved} h/vecka</span>
            <span class="priority ${opp.priority}">${opp.priority === 'high' ? 'Hög prioritet' : 'Medelprioritet'}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Konkurrensanalys -->
    <div class="section">
      <div class="section-title">
        ${icons.chartBar}
        Konkurrensanalys — Prissättning
      </div>
      <div class="card">
        <table class="competitor-table">
          <thead>
            <tr>
              <th>Bolag</th>
              <th>Nivå</th>
              <th>Timpris</th>
              <th>Månadskostnad</th>
              <th>Fokus</th>
            </tr>
          </thead>
          <tbody>
            ${data.competitors.map(c => `
              <tr>
                <td><strong>${c.name}</strong></td>
                <td><span class="tier-badge ${c.tier}">${c.tier.replace('-', ' ')}</span></td>
                <td>${c.pricing}</td>
                <td>
                  ${c.monthly || c.hourly}
                  <div class="calc-note">${c.calc}</div>
                </td>
                <td>${c.focus}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="insights-box">
          <h4>Marknadsinsikter</h4>
          <p><strong>Genomsnittligt timpris:</strong> ${fmtCurrency(data.marketInsights.averageHourly)}/h</p>
          <p><strong>Notera:</strong> ${data.marketInsights.note}</p>
          <p><strong>Paketering:</strong> ${data.marketInsights.packaging}</p>
          <p><strong>Trend:</strong> ${data.marketInsights.trend}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <strong>ETHEYA</strong> | kontakt@eteya.ai<br>
      Genererad: ${new Date().toLocaleString('sv-SE')}
    </div>
  </div>
</body>
</html>`
}

async function main() {
  console.log('\n📄 Genererar ny proffsig test-briefing...\n')
  
  try {
    const html = generateHTML()
    console.log(`✅ HTML genererad, storlek: ${(html.length / 1024).toFixed(2)} KB`)
    
    const timestamp = Date.now()
    const filename = `test-briefing-pro-${timestamp}.html`
    const outputPath = join(process.cwd(), 'briefings', filename)
    
    await writeFile(outputPath, html, 'utf-8')
    
    console.log(`✅ Sparad till: ${outputPath}\n`)
    console.log('='.repeat(70))
    console.log('📊 NY PROFFSIG DESIGN KLAR!')
    console.log('='.repeat(70))
    console.log('\n📝 Nyheter:')
    console.log('   ✅ Vit bakgrund (renare)')
    console.log('   ✅ Lucide icons (samma som hemsidan)')
    console.log('   ✅ Enklare färgpalett (vit/grå/lime)')
    console.log('   ✅ Mer informativ konkurrensanalys')
    console.log('   ✅ Prisberäkningar visas')
    console.log('   ✅ Inga gradienter')
    console.log('   ✅ Webbläsarvänlig')
    console.log('\n🔗 Öppna filen:')
    console.log(`   file://${outputPath}\n`)
    
  } catch (error) {
    console.error('❌ Fel:', error)
    process.exit(1)
  }
}

main()
