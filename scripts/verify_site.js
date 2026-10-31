const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const consoleErrors = [];

  for (const viewport of [
    { name: 'desktop', width: 1400, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(`[${viewport.name}] ${msg.text()}`);
    });
    page.on('pageerror', (err) => consoleErrors.push(`[${viewport.name}] pageerror: ${err.message}`));

    await page.goto('http://localhost:8731/index.html', { waitUntil: 'load' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `scripts/verify_${viewport.name}_hero.png` });

    // Scroll to details, check countdown is ticking
    await page.locator('#details').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const secsFirst = await page.locator('#cd-secs').textContent();
    await page.waitForTimeout(1500);
    const secsSecond = await page.locator('#cd-secs').textContent();
    await page.screenshot({ path: `scripts/verify_${viewport.name}_details.png` });

    const activeAfterDetails = await page.locator('.nav-link.active').getAttribute('data-section');

    // Scroll to venue, check map iframe + active link
    await page.locator('#venue').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `scripts/verify_${viewport.name}_venue.png` });
    const activeAfterVenue = await page.locator('.nav-link.active').getAttribute('data-section');
    const iframeSrc = await page.locator('.map-frame iframe').getAttribute('src');

    console.log(`--- ${viewport.name} ---`);
    console.log('countdown secs first/second:', secsFirst, secsSecond, '(should differ)');
    console.log('active nav after scrolling to details:', activeAfterDetails);
    console.log('active nav after scrolling to venue:', activeAfterVenue);
    console.log('map iframe src:', iframeSrc);

    await page.close();
  }

  console.log('--- console errors ---');
  console.log(consoleErrors.length ? consoleErrors.join('\n') : '(none)');

  await browser.close();
})();
