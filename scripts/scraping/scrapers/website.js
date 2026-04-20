/**
 * Website Scraper
 * Scrapar företagsinformation från företagets hemsida
 * 
 * Input: Hemsida URL
 * Output: { verksamhet, orgnr, kontakt, adress }
 */

const puppeteer = require('puppeteer');

/**
 * Extrahera data från en sida
 */
async function extractPageData(page) {
  return await page.evaluate(() => {
    const getText = (selector) => {
      const el = document.querySelector(selector);
      return el ? el.textContent.trim() : null;
    };
    
    const extractEmail = (text) => {
      if (!text) return null;
      const match = text.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      return match ? match[0] : null;
    };
    
    const extractPhone = (text) => {
      if (!text) return null;
      const match = text.match(/(\+46[\s-]?\d{2,3}[\s-]?\d{3}[\s-]?\d{2,3}|\d{2,3}-\d{3}[\s-]?\d{2,3})/);
      return match ? match[0] : null;
    };
    
    const name = getText('header .logo') || 
                 getText('footer .company-name') ||
                 getText('.brand') ||
                 document.title.split('-')[0].trim();
    
    const verksamhet = getText('.about-text') ||
                       getText('.hero-description') ||
                       getText('main p:first-of-type') ||
                       getText('.intro') ||
                       '';
    
    const footer = document.querySelector('footer');
    const footerText = footer ? footer.textContent : '';
    const allText = document.body.textContent;
    
    let orgnr = null;
    const orgnrPatterns = [
      /Org[.:\\s]*nr[.:\\s]*(\\d{6}-\\d{4})/i,
      /Organisationsnummer[.:\\s]*(\\d{6}-\\d{4})/i,
      /(\\d{6}-\\d{4})/
    ];
    
    for (const pattern of orgnrPatterns) {
      const match = footerText.match(pattern) || allText.match(pattern);
      if (match) {
        orgnr = match[1];
        break;
      }
    }
    
    const emailLink = document.querySelector('a[href^="mailto:"]');
    const email = emailLink ? emailLink.href.replace('mailto:', '') : extractEmail(footerText);
    
    const phoneLink = document.querySelector('a[href^="tel:"]');
    const phone = phoneLink ? phoneLink.href.replace('tel:', '') : extractPhone(footerText);
    
    const address = getText('footer address') || getText('[class*="address"]') || null;
    
    return {
      name,
      verksamhet: verksamhet.substring(0, 500),
      orgnr,
      kontakt: { email, telefon: phone },
      adress: address
    };
  });
}

/**
 * Hitta "Om oss"-sida
 */
async function findAboutPage(page, baseUrl) {
  const aboutLink = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href]');
    for (const link of links) {
      const text = link.textContent.toLowerCase();
      if (text.includes('om oss') || text.includes('about') || text.includes('om företaget')) {
        return link.href;
      }
    }
    return null;
  });
  
  if (aboutLink) return aboutLink;
  
  const commonUrls = [
    new URL('/om-oss/', baseUrl).href,
    new URL('/om/', baseUrl).href,
    new URL('/about/', baseUrl).href
  ];
  
  for (const testUrl of commonUrls) {
    try {
      const response = await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 5000 });
      if (response.ok()) return testUrl;
    } catch (e) { continue; }
  }
  
  return null;
}

async function scrapeWebsite(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  console.log('Scrapar hemsida:', url);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('body', { timeout: 10000 });
    
    let data = await extractPageData(page);
    
    if (!data.orgnr) {
      console.log('Hittade inte orgnr på startsidan, letar efter "Om oss"...');
      const aboutPageUrl = await findAboutPage(page, url);
      if (aboutPageUrl) {
        console.log('Hittade "Om oss"-sida:', aboutPageUrl);
        await page.goto(aboutPageUrl, { waitUntil: 'networkidle2', timeout: 15000 });
        const aboutData = await extractPageData(page);
        if (aboutData.orgnr) {
          data.orgnr = aboutData.orgnr;
          console.log('✅ Hittade orgnr på "Om oss"-sidan:', data.orgnr);
        }
      }
    }
    
    console.log('✅ Data extraherad:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Fel vid scraping:', error.message);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeWebsite };

if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.error('Användning: node website.js <url>');
    process.exit(1);
  }
  
  scrapeWebsite(url)
    .then(data => console.log('\n=== RESULTAT ===\n' + JSON.stringify(data, null, 2)))
    .catch(err => { console.error('Fel:', err.message); process.exit(1); });
}
