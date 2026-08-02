const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    // Firebase keeps a connection open, so networkidle0 hangs forever. Using domcontentloaded instead.
    await page.goto('https://abdelilahazzouzi.github.io/Casablanca-Verb-Survival/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Explicit wait to ensure fonts/images render
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await page.screenshot({ path: 'assets/casablanca_screenshot.jpg', fullPage: false });
    console.log('Screenshot saved to assets/casablanca_screenshot.jpg');
  } catch (err) {
    console.error('Failed to take screenshot:', err);
  }
  
  await browser.close();
})();
