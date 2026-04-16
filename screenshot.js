const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://100.84.47.62:3000/sv/ai-besparing', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  
  // Scrolla ner lite för att fånga mer innehåll
  await page.evaluate(() => window.scrollBy(0, 200));
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ 
    path: '/home/openclaw/.openclaw/workspace/projects/eteya/site/screenshot.png',
    fullPage: false
  });
  
  await browser.close();
  console.log('✅ Screenshot saved!');
})();
