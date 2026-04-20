/**
 * Sales Briefing Scraper - Main Script
 * Scrapes company data from multiple sources and outputs a JSON briefing.
 * 
 * Usage: node scripts/scrape-company.js [orgnr] [url]
 * Default: Telestore Sverige AB, 556551-5663, https://telestore.se
 */

const { fetchCompanyData } = require('./sources/bolagsverket');
const { fetchScbStats } = require('./sources/scb');
const { analyzeWebsite } = require('./sources/website');
const { saveJson } = require('./utils/storage');

const DEFAULT_ORGNR = '556551-5663';
const DEFAULT_URL = 'https://telestore.se';

async function main() {
  const orgnr = process.argv[2] || DEFAULT_ORGNR;
  const url = process.argv[3] || DEFAULT_URL;

  console.log('🚀 Sales Briefing Scraper');
  console.log(`   Orgnr: ${orgnr}`);
  console.log(`   URL: ${url}\n`);

  // 1. Fetch company data (Bolagsverket / public registries)
  const companyData = await fetchCompanyData(orgnr);
  console.log(`   → ${companyData.foretagsnamn} (${companyData.sniKod})\n`);

  // 2. Fetch SCB statistics by SNI code
  const scbStats = await fetchScbStats(companyData.sniKod);
  console.log(`   → SCB stats loaded\n`);

  // 3. Analyze website
  const websiteData = await analyzeWebsite(url);

  // 4. Compile briefing
  const briefing = {
    foretagsnamn: companyData.foretagsnamn,
    orgnr: companyData.orgnr,
    adress: companyData.adress || undefined,
    bransch: companyData.bransch,
    sniKod: companyData.sniKod,
    antalAnstallda: companyData.antalAnstallda,
    omsattning: companyData.omsattning,
    verksamhet: websiteData.verksamhet || companyData.verksamhet || '',
    techStack: websiteData.techStack,
    kontakt: Object.keys(websiteData.kontakt).length > 0 ? websiteData.kontakt : undefined,
    scbStats: {
      genomsnittligLon: scbStats.genomsnittligLon,
      omsattningPerAnstalld: scbStats.omsattningPerAnstalld,
      branschtillvaxt: scbStats.branschtillvaxt,
    },
    scrapedAt: new Date().toISOString(),
  };

  // Remove undefined fields
  Object.keys(briefing).forEach(k => briefing[k] === undefined && delete briefing[k]);

  // 5. Save output
  const filename = `briefing-${briefing.foretagsnamn.split(' ')[0].toLowerCase()}.json`;
  saveJson(briefing, filename);

  console.log('\n✅ Briefing complete!');
  console.log(JSON.stringify(briefing, null, 2));
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});