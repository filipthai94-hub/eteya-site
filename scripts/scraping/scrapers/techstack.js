/**
 * Tech Stack Detector
 * Identifierar tekniker på hemsidan genom att analysera HTML/CSS/JS
 * 
 * Input: Hemsida URL
 * Output: Array med tekniker [{ name, categories, confidence }]
 */

const puppeteer = require('puppeteer');

/**
 * Detektera tekniker genom att analysera sidans HTML, headers, och JavaScript-objekt
 */
async function detectTechStack(url) {
  // Lägg till https:// om det saknas
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  console.log('Analyserar tech stack för:', url);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigera till sidan
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Analysera sidan för tekniker
    const technologies = await page.evaluate(() => {
      const detected = [];
      
      // CMS Detection
      if (window.wpContent || window.wpIncludes || document.querySelector('[class*="wp-"]')) {
        detected.push({ name: 'WordPress', categories: ['CMS'], confidence: 90 });
      }
      if (window.joomla || document.querySelector('[class*="joomla"]')) {
        detected.push({ name: 'Joomla', categories: ['CMS'], confidence: 85 });
      }
      if (window.Drupal || document.querySelector('[class*="drupal"]')) {
        detected.push({ name: 'Drupal', categories: ['CMS'], confidence: 85 });
      }
      if (window.Shopify || document.querySelector('[data-shopify]')) {
        detected.push({ name: 'Shopify', categories: ['E-commerce'], confidence: 95 });
      }
      
      // E-commerce Detection
      if (window.wcSettings || document.querySelector('[class*="woocommerce"]')) {
        detected.push({ name: 'WooCommerce', categories: ['E-commerce'], confidence: 90 });
      }
      if (document.querySelector('[data-product-id]')) {
        detected.push({ name: 'E-commerce Platform', categories: ['E-commerce'], confidence: 70 });
      }
      
      // Payment Detection
      if (window.Klarna || document.querySelector('[class*="klarna"]') || document.querySelector('[data-klarna]')) {
        detected.push({ name: 'Klarna', categories: ['Payment'], confidence: 85 });
      }
      if (window.Stripe) {
        detected.push({ name: 'Stripe', categories: ['Payment'], confidence: 90 });
      }
      if (window.Paypal) {
        detected.push({ name: 'PayPal', categories: ['Payment'], confidence: 90 });
      }
      if (document.querySelector('[class*="swish"]')) {
        detected.push({ name: 'Swish', categories: ['Payment'], confidence: 80 });
      }
      
      // Analytics Detection
      if (window.ga || window.google_analytics || window.gtag) {
        detected.push({ name: 'Google Analytics', categories: ['Analytics'], confidence: 90 });
      }
      if (window.fbq || window._fbq) {
        detected.push({ name: 'Facebook Pixel', categories: ['Analytics'], confidence: 85 });
      }
      if (window._paq) {
        detected.push({ name: 'Matomo', categories: ['Analytics'], confidence: 85 });
      }
      
      // JavaScript Frameworks
      if (window.React || document.querySelector('[data-reactroot]')) {
        detected.push({ name: 'React', categories: ['JavaScript Framework'], confidence: 90 });
      }
      if (window.Vue) {
        detected.push({ name: 'Vue.js', categories: ['JavaScript Framework'], confidence: 90 });
      }
      if (window.angular) {
        detected.push({ name: 'Angular', categories: ['JavaScript Framework'], confidence: 90 });
      }
      if (window.jQuery) {
        detected.push({ name: 'jQuery', categories: ['JavaScript Library'], confidence: 85 });
      }
      
      // CSS Frameworks
      if (document.querySelector('[class*="tw-"]') || document.querySelector('[class*="tailwind"]')) {
        detected.push({ name: 'Tailwind CSS', categories: ['CSS Framework'], confidence: 80 });
      }
      if (document.querySelector('[class*="bootstrap"]')) {
        detected.push({ name: 'Bootstrap', categories: ['CSS Framework'], confidence: 80 });
      }
      
      // Hosting/CDN
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const scriptSrcs = scripts.map(s => s.src).join(' ');
      
      if (scriptSrcs.includes('cloudflare')) {
        detected.push({ name: 'Cloudflare', categories: ['CDN'], confidence: 85 });
      }
      if (scriptSrcs.includes('jsdelivr')) {
        detected.push({ name: 'jsDelivr', categories: ['CDN'], confidence: 80 });
      }
      if (scriptSrcs.includes('unpkg')) {
        detected.push({ name: 'unpkg', categories: ['CDN'], confidence: 80 });
      }
      
      // Server detection from headers would need Puppeteer response interception
      // For now, we detect from meta tags
      const generator = document.querySelector('meta[name="generator"]');
      if (generator && generator.content) {
        const genContent = generator.content.toLowerCase();
        if (genContent.includes('wordpress')) {
          detected.push({ name: 'WordPress', categories: ['CMS'], confidence: 95 });
        }
      }
      
      return detected;
    });
    
    // Filtrera duplicates och sortera på confidence
    const unique = technologies
      .filter((tech, index, self) => 
        index === self.findIndex(t => t.name === tech.name)
      )
      .sort((a, b) => b.confidence - a.confidence);
    
    console.log('✅ Tech stack identifierad:', unique.length, 'tekniker');
    
    return unique;
    
  } catch (error) {
    console.error('❌ Fel vid tech-detektion:', error.message);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Förenklad version - returnerar bara namn som sträng-array
 */
function getTechNames(techList) {
  return techList.map(tech => tech.name);
}

// Export för module use
module.exports = { detectTechStack, getTechNames };

// Kör om scriptet körs direkt
if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.error('Användning: node techstack.js <url>');
    console.error('Exempel: node techstack.js https://telestore.se');
    process.exit(1);
  }
  
  detectTechStack(url)
    .then(data => {
      console.log('\n=== TECH STACK ===');
      console.log(JSON.stringify(data, null, 2));
      console.log('\n=== ENKEL LISTA ===');
      console.log(getTechNames(data).join(', '));
    })
    .catch(err => {
      console.error('Fel:', err.message);
      process.exit(1);
    });
}
