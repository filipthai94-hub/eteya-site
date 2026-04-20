/**
 * PDF Generator
 * Genererar PDF från sales-briefing-v5.html mallen
 * 
 * Input: Briefing data (JSON) + output path
 * Output: PDF fil
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

/**
 * Ersätt variabler i HTML-mallen med briefing data
 */
function fillTemplate(templateHtml, data) {
  let html = templateHtml;
  
  // Enkla ersättningar
  const replacements = {
    '[FÖRETAGS_NAMN]': data.foretagsnamn,
    '[DATUM]': data.genererad,
    '[HUVUDSAKLIG_VERKSAMHET]': data.verksamhet,
    '[BRANSCH]': data.bransch,
    '[SNI_KOD]': data.sniKod,
    '[ANTAL_ANSTÄLLDA]': data.antalAnstallda.toString(),
    '[OMSAETTNING]': data.omsattning.toLocaleString('sv-SE') + ' kr',
    '[TECH_STACK]': data.techStack.join(', '),
    '[BESPARING_KR]': data.roiPrognos.besparingKr.toLocaleString('sv-SE'),
    '[ROI_PROCENT]': data.roiPrognos.roiProcent.toString(),
    '[PAYBACK_MÅN]': data.roiPrognos.paybackManader.toString(),
    '[SPARAT_TIMMAR]': data.roiPrognos.sparatTimmar.toString(),
    '[FTE]': data.roiPrognos.fte.toString(),
    '[REKOMMENDERAT_FOKUS]': data.rekommendationer.fokus,
    '[BRANSCHSNITT_PRIS]': '2 200 kr/h · 15 000 kr/mån',
    '[VART_EDGE]': 'Prisvärt, snabb implementation, ROI-fokus'
  };
  
  // Ersätt enkla variabler
  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(placeholder.replace(/[\[\]]/g, '\\$&'), 'g'), value);
  }
  
  // Ersätt listor (PROCESS_LIST, AI_MOEJLIGHETER_LIST, KONKURRENSER_LIST)
  
  // Processer att automatisera
  const processItems = data.processer.map(p => 
    `<li><span class='label'>${p.namn}:</span> ${p.timmar}h/vecka · ${p.automation}% automation · ${p.besparing.toLocaleString('sv-SE')} kr/år</li>`
  ).join('\n        ');
  html = html.replace('[PROCESS_LIST]', processItems);
  
  // AI-möjligheter
  const aiItems = data.rekommendationer.aiMojligheter.map(item => 
    `<li><span class='label'>${item.split(':')[0]}:</span> ${item.split(':')[1]}</li>`
  ).join('\n          ');
  html = html.replace('[AI_MOEJLIGHETER_LIST]', aiItems);
  
  // Konkurrenslandskap
  const competitorRows = data.konkurrens.map(c => 
    `<tr><td>${c.namn}</td><td>${c.pris}</td><td>${c.tjanst}</td></tr>`
  ).join('\n          ');
  html = html.replace('[KONKURRENSER_LIST]', competitorRows);
  
  // Agenda - already hardcoded in template, but can be customized if needed
  
  return html;
}

/**
 * Generera PDF från briefing data
 */
async function generatePDF(briefingData, outputPath) {
  console.log('Genererar PDF från briefing data...');
  
  let browser;
  try {
    // Ladda HTML-mallen
    const templatePath = path.join(__dirname, 'templates', 'briefing-template.html');
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Mallen hittades inte: ${templatePath}`);
    }
    
    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    console.log('✅ Mall laddad:', templatePath);
    
    // Fyll i mallen med data
    const filledHtml = fillTemplate(templateHtml, briefingData);
    console.log('✅ Mall ifylld med data');
    
    // Starta Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--print-background'
      ]
    });
    
    const page = await browser.newPage();
    
    // Ladda HTML
    await page.setContent(filledHtml, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    console.log('✅ HTML laddad i browser');
    
    // Generera PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      },
      preferCSSPageSize: true
    });
    
    console.log('✅ PDF genererad:', outputPath);
    
    return outputPath;
    
  } catch (error) {
    console.error('❌ Fel vid PDF-generering:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Export för module use
module.exports = { generatePDF, fillTemplate };

// Kör om scriptet körs direkt
if (require.main === module) {
  const jsonPath = process.argv[2];
  const outputPath = process.argv[3]; // Optional output path
  
  if (!jsonPath) {
    console.error('Användning: node pdf.js <path-till-briefing.json> [output.pdf]');
    console.error('Exempel: node pdf.js scripts/scraping/output/briefing-telestore.json');
    process.exit(1);
  }
  
  // Ladda JSON data
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Filen hittades inte:', jsonPath);
    process.exit(1);
  }
  
  const briefingData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  
  // Skapa output path
  let pdfPath;
  if (outputPath) {
    pdfPath = outputPath;
  } else {
    const outputDir = path.dirname(jsonPath);
    const baseName = path.basename(jsonPath, '.json');
    pdfPath = path.join(outputDir, baseName + '.pdf');
  }
  
  generatePDF(briefingData, pdfPath)
    .then(() => {
      console.log('\n✅ PDF KLAR!');
      console.log('📄', pdfPath);
    })
    .catch(err => {
      console.error('❌ Misslyckades:', err.message);
      process.exit(1);
    });
}
