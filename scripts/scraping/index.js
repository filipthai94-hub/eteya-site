/**
 * Sales Briefing Scraper - Main Entry
 * 
 * Användning: node scripts/scraping/index.js <input>
 * där <input> är antingen:
 *   - Hemsida URL: https://telestore.se
 *   - Företagsnamn: Telestore Sverige AB
 * 
 * Output: scripts/scraping/output/briefing-[foretag].json
 */

const fs = require('fs');
const path = require('path');
const { scrapeApiverket, getIndustryStats: getApiverketStats } = require('./api/apiverket');
const { scrapeWebsite } = require('./scrapers/website');
const { detectTechStack, getTechNames } = require('./scrapers/techstack');
const { getIndustryStats } = require('./api/scb');


/**
 * Parse input - avgör om det är URL eller företagsnamn
 */
function parseInput(input) {
  const trimmed = input.trim();
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.includes('.')) {
    return { type: 'url', value: trimmed };
  }
  
  return { type: 'name', value: trimmed };
}

/**
 * Skapa säkert filnamn från företagsnamn
 */
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9åäö\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

/**
 * Huvudfunktion - kör alla scrapers i sekvens
 */
async function scrapeCompany(input) {
  console.log('🚀 Startar scraping för:', input);
  console.log('=' .repeat(50));
  
  const parsed = parseInput(input);
  const results = {};
  
  try {
    // STEG 1: Scrapa hemsida FÖRST (för att få orgnr)
    console.log('\n🌐 STEG 1/4: Hemsida...');
    const websiteUrl = parsed.type === 'url' ? parsed.value : null;
    
    if (websiteUrl) {
      results.website = await scrapeWebsite(websiteUrl);
      console.log('   ✅ Namn:', results.website.name);
      console.log('   ✅ Email:', results.website.kontakt?.email || 'Saknas');
      console.log('   ✅ Orgnr:', results.website.orgnr || 'Saknas');
    } else {
      console.log('   ⚠️ Ingen hemsida angiven, skippar...');
      results.website = null;
    }
    
    // STEG 2: Hämta företagsdata från Apiverket (med orgnr om tillgängligt)
    console.log('\n🏢 STEG 2/5: Apiverket (Bolagsverket)...');
    const orgnrFromWebsite = results.website?.orgnr;
    results.apiverket = await scrapeApiverket(input, orgnrFromWebsite);
    console.log('   ✅ Namn:', results.apiverket.name || 'Saknas');
    console.log('   ✅ Orgnr:', results.apiverket.orgnr || 'Saknas');
    console.log('   ✅ Adress:', results.apiverket.address || results.apiverket.adress || 'Saknas');
    
    // STEG 3: SCB detaljerad företagsdata — HOPPAR ÖVER
    // SCB cert-API kan INTE filtrera på orgnr, returnerar bara första företaget per SNI
    // Apiverket ger bättre företagsdata (namn, adress, SNI, juridisk form)
    console.log('\n📊 STEG 3/5: SCB företagsdata — används ej (Apiverket ger bättre data)');
    results.scbCompany = null;
    
    // STEG 4: Tech stack detection
    console.log('\n🔧 STEG 4/5: Tech stack...');
    if (websiteUrl) {
      results.techstack = await detectTechStack(websiteUrl);
      const techNames = getTechNames(results.techstack);
      console.log('   ✅ Tekniker:', techNames.slice(0, 5).join(', ') + (techNames.length > 5 ? '...' : ''));
    } else {
      console.log('   ⚠️ Ingen hemsida, skippar tech detection...');
      results.techstack = [];
    }
    
    // STEG 5: SCB branschstatistik (via Apiverket)
    console.log('\n📈 STEG 5/5: Branschstatistik...');
    const sniCode = results.apiverket?.sni_codes?.[0]?.code || results.apiverket?.sni || '47';
    results.scb = await getIndustryStats(sniCode.slice(0, 5));
    if (!results.scb?.genomsnittligLon) {
      // Fallback: try 2-digit SNI first, then Apiverket industry stats
      results.scb = await getIndustryStats(sniCode.slice(0, 3));
    }
    if (!results.scb?.genomsnittligLon) {
      results.apiverketStats = await getApiverketStats(sniCode.slice(0, 2));
    }
    const hasStats = results.scb?.genomsnittligLon || results.apiverketStats;
    console.log('   ✅ Branschstatistik:', hasStats ? 'Hittad' : 'Använder default');
    
    // SLAG IHOP DATA TILL BRIEFING FORMAT
    console.log('\n' + '='.repeat(50));
    console.log('📝 Skapar briefing data...');
    
    const briefingData = createBriefingData(results);
    
    // SPARA TILL JSON
    const outputDir = path.join(__dirname, 'output');
    const filename = `briefing-${sanitizeFilename(briefingData.foretagsnamn)}.json`;
    const outputPath = path.join(outputDir, filename);
    
    // Skapa output directory om det inte finns
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(briefingData, null, 2), 'utf-8');
    console.log('✅ Sparad till:', outputPath);
    
    return { briefingData, outputPath, results };
    
  } catch (error) {
    console.error('\n❌ Fel vid scraping:', error.message);
    throw error;
  }
}

/**
 * Skapa briefing data i rätt format för sales-briefing-v5.html mallen
 */
function createBriefingData(results) {
  const apiverket = results.apiverket || {};
  const website = results.website || {};
  const scbCompany = results.scbCompany || null;
  const techstack = results.techstack || [];
  const scb = results.scb || {};
  const apiverketStats = results.apiverketStats || null;
  
  // Hämta tech namn som array
  const techNames = getTechNames(techstack);
  
  // Beräkna ROI-prognos (exempel - ska kopplas till ROI-kalkylatorn senare)
  const estimatedSavings = 390000; // Exempelvärde
  const roi = 156;
  const paybackMonths = 3;
  const hoursSavedPerWeek = 20;
  const fte = 0.5;
  
  // Extrahera företagsnamn - prioritera SCB, sedan Apiverket, fallback till hemsida
  let cleanName = scbCompany?.name || apiverket.name || website.name || 'Okänt företag';
  if (!scbCompany?.name && !apiverket.name) {
    // Rensa hemsida title från skräp
    cleanName = cleanName
      .replace(/\s*\|\s*.*/g, '') // Ta bort allt efter |
      .replace(/\s*[-–:].*/g, '') // Ta bort allt efter - eller :
      .trim()
      .substring(0, 60);
  }
  
  return {
    // Från SCB (detaljerad företagsdata)
    foretagsnamn: cleanName,
    orgnr: scbCompany?.orgnr || apiverket.orgnr || website.orgnr || '',
    adress: scbCompany?.address || apiverket.adress || apiverket.address || '',
    postnr: scbCompany?.postal_code || apiverket.postal_code || '',
    ort: scbCompany?.city || apiverket.city || '',
    bransch: scbCompany?.sni_description || getSniName(apiverket.sni_codes?.[0]),
    sniKod: scbCompany?.sni_code || apiverket.sni_codes?.[0]?.code || '47910',
    antalAnstallda: scbCompany?.employees || parseEmployees(apiverket.anstallda) || 0,
    anstalldKlass: scbCompany?.employee_class || '',
    legalForm: scbCompany?.legal_form || apiverket.legal_form || '',
    telefon: scbCompany?.phone || '',
    epost: scbCompany?.email || '',
    startdatum: scbCompany?.start_date || apiverket.registration_date || '',
    status: scbCompany?.status || apiverket.status || '',
    
    // Från hemsida
    verksamhet: website.verksamhet || 'Verksamhetsbeskrivning saknas',
    techStack: techNames,
    
    // Kontakt från hemsida
    kontakt: {
      email: website.kontakt?.email || '',
      telefon: website.kontakt?.telefon || ''
    },
    
    // Från SCB statistik + Apiverket stats
    scbStats: {
      genomsnittligLon: scb.genomsnittligLon || apiverketStats?.avg_salary || 45000,
      omsattningPerAnstalld: scb.omsattningPerAnstalld || 600000,
      branschtillvaxt: scb.branschtillvaxt || null,
      totalEnterprises: apiverketStats?.total_enterprises || null,
      sizeDistribution: apiverketStats?.size_distribution || null
    },
    
    // ROI-prognos (exempel - ska beräknas från ROI-kalkylatorn)
    roiPrognos: {
      besparingKr: estimatedSavings,
      roiProcent: roi,
      paybackManader: paybackMonths,
      sparatTimmar: hoursSavedPerWeek,
      fte: fte
    },
    
    // Processer att automatisera (exempel)
    processer: [
      { namn: 'Kundtjänst', timmar: 8, automation: 45, besparing: 140000 },
      { namn: 'Fakturering & Admin', timmar: 5, automation: 65, besparing: 95000 },
      { namn: 'Leads & Försäljning', timmar: 6, automation: 60, besparing: 85000 }
    ],
    
    // Rekommendationer
    rekommendationer: {
      fokus: 'Fokusera på orderautomatisering — störst ROI baserat på kalkylatorn. E-handel = hög volym repetitiva processer.',
      aiMojligheter: [
        'Orderbekräftelse-automation: ~15 h/vecka sparad',
        'AI-chatbot för kundtjänst: ~8 h/vecka sparad',
        'Fakturering automation: ~5 h/vecka sparad'
      ]
    },
    
    // Konkurrenslandskap (exempel - ska hämtas från research)
    konkurrens: [
      { namn: 'Satori ML', pris: '~2 200 kr/h', tjanst: 'Maskininlärning' },
      { namn: 'Codon Consulting', pris: 'Från 15 000 kr/mån', tjanst: 'AI-strategi' },
      { namn: 'AI Sweden Partners', pris: '2 500 kr/h', tjanst: 'AI-strategi' },
      { namn: 'Mindler AI', pris: '12 000 kr/mån', tjanst: 'Processautomatisering' },
      { namn: 'Nordic AI', pris: '1 800 kr/h', tjanst: 'Dataanalys' }
    ],
    
    // Agenda
    agenda: [
      { tid: '5 min', punkt: 'Förstå deras situation' },
      { tid: '5 min', punkt: 'Presentera ROI-prognos' },
      { tid: '10 min', punkt: 'Visa AI-möjligheter' },
      { tid: '5 min', punkt: 'Nästa steg' }
    ],
    
    // Metadata
    genererad: new Date().toLocaleDateString('sv-SE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };
}

/**
 * Konvertera SNI-kod/koder till branschnamn
 */
function getSniName(sniInput) {
  if (!sniInput) return 'Okänd bransch';
  
  // Hantera array från Apiverket
  if (Array.isArray(sniInput)) {
    const first = sniInput[0];
    if (first?.description) return first.description;
    if (first?.code) return getSniName(first.code);
  }
  
  // Hantera object {code, description}
  if (typeof sniInput === 'object') {
    return sniInput.description || getSniName(sniInput.code);
  }
  
  const code = String(sniInput);
  const sniMap = {
    '47': 'Detaljhandel',
    '474': 'Detaljhandel med informationsoch kommunikationsutrustning',
    '47910': 'E-handel',
    '62010': 'Datorprogrammering',
    '62020': 'Datakonsultverksamhet',
    '63110': 'Databehandling och hosting',
    '70220': 'Företagsrådgivning',
    '73110': 'Reklambyråer',
    '82990': 'Övrig kontorstjänst'
  };
  
  // Try exact match first, then 3-digit, then 2-digit
  return sniMap[code] || sniMap[code.slice(0,3)] || sniMap[code.slice(0,2)] || `Bransch ${code}`;
}


/**
 * Parsea anställda-intervall från Apiverket
 */
function parseEmployees(employeeInterval) {
  if (!employeeInterval) return 0;
  
  // Intervall som "1-4 anställda", "5-9 anställda", etc.
  const match = employeeInterval.match(/(\d+)-(\d+)/);
  if (match) {
    // Returnera mitten av intervallet
    const min = parseInt(match[1]);
    const max = parseInt(match[2]);
    return Math.round((min + max) / 2);
  }
  
  // Enskilt tal
  const singleMatch = employeeInterval.match(/(\d+)/);
  if (singleMatch) {
    return parseInt(singleMatch[1]);
  }
  
  return 0;
}

// Main entry point
async function main() {
  const input = process.argv[2];
  
  if (!input) {
    console.error('❌ Användning: node scripts/scraping/index.js <input>');
    console.error('');
    console.error('Exempel:');
    console.error('  node scripts/scraping/index.js "Telestore Sverige AB"');
    console.error('  node scripts/scraping/index.js https://telestore.se');
    process.exit(1);
  }
  
  try {
    const result = await scrapeCompany(input);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ SCRAPING KLAR!');
    console.log('=' .repeat(50));
    console.log('');
    console.log('📄 Briefing data:', result.outputPath);
    console.log('');
    console.log('För att generera PDF, kör:');
    console.log('  node scripts/scraping/generator/pdf.js', result.outputPath);
    
  } catch (error) {
    console.error('\n❌ Scraping misslyckades:', error.message);
    process.exit(1);
  }
}

// Exportera för module use
module.exports = { scrapeCompany, createBriefingData };

// Kör om scriptet körs direkt
if (require.main === module) {
  main();
}
