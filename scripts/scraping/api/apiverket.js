/**
 * Apiverket.se API Client — Updated with correct endpoints
 * 
 * Endpoints:
 *   GET /v1/companies/search?q=<name>  — Search by name (sandbox/limited)
 *   GET /v1/companies/<orgNumber>       — Lookup by orgnr
 *   GET /v1/statistics/industry/<sni>    — Industry stats from SCB
 */

const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../../../.env.local');
dotenv.config({ path: envPath });

const API_KEY = process.env.APIVERKET_API_KEY;
const BASE_URL = 'https://apiverket.se/v1';

const headers = () => ({
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
});

/**
 * Search companies by name
 */
async function searchByName(name) {
  try {
    const res = await axios.get(`${BASE_URL}/companies/search`, {
      headers: headers(),
      params: { q: name },
      timeout: 10000
    });
    
    if (res.data?.data?.companies?.length > 0) {
      return res.data.data.companies;
    }
    return [];
  } catch (err) {
    if (err.response?.status === 404) return [];
    console.error('Apiverket search error:', err.response?.data || err.message);
    return [];
  }
}

/**
 * Get company by orgnr
 */
async function getByOrgnr(orgnr) {
  const clean = orgnr.replace(/-/g, '');
  try {
    const res = await axios.get(`${BASE_URL}/companies/${clean}`, {
      headers: headers(),
      timeout: 10000
    });
    return res.data?.data || null;
  } catch (err) {
    if (err.response?.status === 404) return null;
    console.error('Apiverket lookup error:', err.response?.data || err.message);
    return null;
  }
}

/**
 * Get industry statistics by SNI code
 */
async function getIndustryStats(sniCode) {
  try {
    const res = await axios.get(`${BASE_URL}/statistics/industry/${sniCode}`, {
      headers: headers(),
      timeout: 10000
    });
    return res.data?.data || null;
  } catch (err) {
    console.error('Apiverket stats error:', err.response?.data || err.message);
    return null;
  }
}

/**
 * Main function — smart lookup
 * 1. If orgnr provided → direct lookup
 * 2. If name provided → search, then enrich with SCB data
 */
async function scrapeApiverket(input, orgnr = null) {
  let companyData = null;
  let companyOrgnr = null;

  // Step 1: Get company data
  if (orgnr) {
    companyData = await getByOrgnr(orgnr);
    companyOrgnr = orgnr;
  } else if (/^\d{6}-?\d{4}$/.test(input.trim())) {
    const clean = input.trim().replace('-', '');
    companyData = await getByOrgnr(clean);
    companyOrgnr = clean;
  } else {
    // Search by name
    const results = await searchByName(input);
    if (results.length > 0) {
      companyData = results[0];
      companyOrgnr = companyData.org_number;
    }
  }

  if (!companyData) {
    return {
      name: null,
      orgnr: null,
      error: 'Företag hittades inte'
    };
  }

  // Step 2: Get industry stats if we have SNI code
  let industryStats = null;
  const sniCode = companyData.sni_codes?.[0]?.code;
  if (sniCode) {
    industryStats = await getIndustryStats(sniCode.slice(0, 2)); // 2-digit for industry overview
  }

  // Step 3: Format result
  const result = {
    name: companyData.name || null,
    orgnr: companyData.org_number || companyOrgnr,
    address: companyData.address || null,
    postal_code: companyData.postal_code || null,
    city: companyData.city || null,
    sni_codes: companyData.sni_codes || [],
    legal_form: companyData.legal_form || null,
    status: companyData.status || null,
    registration_date: companyData.registration_date || null,
    industry_stats: industryStats ? {
      total_enterprises: industryStats.total_enterprises,
      size_distribution: industryStats.size_distribution,
      year: industryStats.year
    } : null
  };

  console.log('✅ Apiverket data:', result.name, result.orgnr);
  return result;
}

module.exports = { scrapeApiverket, searchByName, getByOrgnr, getIndustryStats };

if (require.main === module) {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node apiverket.js <name|orgnr>');
    process.exit(1);
  }
  scrapeApiverket(input).then(r => console.log(JSON.stringify(r, null, 2)));
}