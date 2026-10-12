import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('UNCAUGHT PAGE ERROR:', error.message);
  });

  await page.goto('http://localhost:5173/#/login');
  
  // Wait for a bit
  await new Promise(r => setTimeout(r, 2000));
  
  // Try directly navigating to the page if it fails or requires login, maybe it logs something
  await page.goto('http://localhost:5173/#/admin/master/products/content');
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
