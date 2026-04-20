/**
 * Allabolag.se Scraper
 * Scrapar företagsdata från Allabolag.se
 * 
 * Input: URL eller företagsnamn
 * Output: { name, orgnr, adress, sni, omsattning, anstallda, hemsida }
 */

const puppeteer = require('puppeteer');

/**
 * Parse input - avgör om det är URL eller företagsnamn
 */
function parseInput(input) {
  const trimmed = input.trim();
  
  // Kolla om det är en URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.includes('.')) {
    return { type: 'url', value: trimmed };
  }
  
  // Annars är det ett företagsnamn
  return { type: 'name', value: trimmed };
}

/**
 * Bygg Allabolag sök-URL från företagsnamn eller extrahera från hemsida-URL
 */
function buildSearchUrl(input) {
  // Om input är en hemsida-URL, extrahera domännamn som företagsnamn
  if (input.startsWith('http://') || input.startsWith('https://')) {
    try {
      const url = new URL(input);
      // Extrahera domännamn utan www. och TLD
      const hostname = url.hostname.replace('www.', '');
      const name = hostname.split('.')[0];
      
      // Omvandla till Allabolag slug
      const slug = name
        .toLowerCase()
        .replace(/-/g, ' ')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 50);
      
      return `https://www.allabolag.se/sok/${slug}`;
    } catch (e) {
      // Om URL-parsing misslyckas, använd hela input
    }
  }
  
  // Annars är input ett företagsnamn
  const slug = input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 50);
  
  return `https://www.allabolag.se/sok/${slug}`;
}

async function scrapeAllabolag(input) {
  const parsed = parseInput(input);
  console.log('Input typ:', parsed.type, '-', parsed.value);
  
  let browser;
  try {
    // Starta Puppeteer med stealth-läge
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Sätt vanlig User-Agent för att undvika bot-detektion
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Bygg URL baserat på input
    let url;
    if (parsed.type === 'url' && parsed.value.includes('allabolag.se')) {
      // Om input är redan en Allabolag-URL, använd den direkt
      url = parsed.value;
    } else {
      // Annars bygg sök-URL (från företagsnamn eller hemsida)
      url = buildSearchUrl(parsed.value);
    }
    
    console.log('Scrapar URL:', url);
    
    // Navigera till sidan
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Vänta på att innehåll ska ladda
    await page.waitForSelector('h1, .company-name, [data-testid="company-name"]', { timeout: 10000 }).catch(() => {
      console.log('Ingen specifik selector hittad, fortsätter ändå...');
    });
    
    // Extrahera data från sidan
    const data = await page.evaluate(() => {
      // Kolla om vi hamnade på en felsida
      const h1Text = document.querySelector('h1')?.textContent.trim() || '';
      if (h1Text.includes('Å nej!') || h1Text.includes('kunde inte hittas')) {
        return { error: 'Felsida - företaget hittades inte' };
      }
      
      // Hjälpfunktion för att säkert hämta text
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : null;
      };
      
      // Företagsnamn
      const name = getText('h1') || 
                   getText('.company-name') || 
                   getText('[data-testid="company-name"]') ||
                   document.title.split('-')[0].trim();
      
      // Orgnr - leta efter mönster XXXXXX-XXXX
      const orgnrText = getText('[data-orgnr]') || 
                        getText('.orgnr') || 
                        getText('.org-number') ||
                        document.body.textContent;
      const orgnrMatch = orgnrText?.match(/(\d{6}-\d{4})/);
      const orgnr = orgnrMatch ? orgnrMatch[1] : null;
      
      // Adress
      const adress = getText('.address') || 
                     getText('[data-testid="address"]') ||
                     getText('address');
      
      // SNI-kod
      const sniText = getText('[data-sni]') || 
                      getText('.sni-code') ||
                      document.body.textContent;
      const sniMatch = sniText?.match(/SNI[\s:]+(\d{5})/i);
      const sni = sniMatch ? sniMatch[1] : null;
      
      // Omsättning
      const omsattningText = getText('.revenue') || 
                             getText('[data-revenue]') ||
                             document.body.textContent;
      const omsattningMatch = omsattningText?.match(/(\d+[\s,]?\d*)\s*kr/i);
      const omsattning = omsattningMatch ? omsattningMatch[1].replace(/\s/g, '') : null;
      
      // Anställda
      const anstalldaText = getText('.employees') || 
                            getText('[data-employees]') ||
                            document.body.textContent;
      const anstalldaMatch = anstalldaText?.match(/(\d+)\s*anställda/i);
      const anstallda = anstalldaMatch ? anstalldaMatch[1] : null;
      
      // Hemsida
      const hemsidaLink = document.querySelector('a[href*="http"]');
      const hemsida = hemsidaLink ? hemsidaLink.href : null;
      
      return {
        name,
        orgnr,
        adress,
        sni,
        omsattning,
        anstallda,
        hemsida
      };
    });
    
    // Kolla om vi fick ett fel
    if (data.error) {
      console.log('⚠️ Allabolag scraping misslyckades:', data.error);
      return {
        name: null,
        orgnr: null,
        adress: null,
        sni: null,
        omsattning: null,
        anstallda: null,
        hemsida: null,
        error: data.error
      };
    }
    
    console.log('✅ Data extraherad:', data);
    
    return data;
    
  } catch (error) {
    console.error('❌ Fel vid scraping:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Export för module use
module.exports = { scrapeAllabolag };

// Kör om scriptet körs direkt
if (require.main === module) {
  const input = process.argv[2];
  if (!input) {
    console.error('Användning: node allabolag.js <input>');
    process.exit(1);
  }
  
  scrapeAllabolag(input)
    .then(data => {
      console.log('\n=== RESULTAT ===');
      console.log(JSON.stringify(data, null, 2));
    })
    .catch(err => {
      console.error('Fel:', err.message);
      process.exit(1);
    });
}
