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
  
  // Wait for GSAP animations
  await page.waitForTimeout(3000);
  
  // Hero (top)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/openclaw/.openclaw/workspace/projects/eteya/site/01-hero.png' });
  
  // Quick Result Card
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/openclaw/.openclaw/workspace/projects/eteya/site/02-quickresult.png' });
  
  // 3 Cards
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/openclaw/.openclaw/workspace/projects/eteya/site/03-cards.png' });
  
  // Trust Stack
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/openclaw/.openclaw/workspace/projects/eteya/site/04-trust.png' });
  
  // CTA Form
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/openclaw/.openclaw/workspace/projects/eteya/site/05-cta.png' });
  
  await browser.close();
  console.log('✅ All screenshots saved!');
})();
