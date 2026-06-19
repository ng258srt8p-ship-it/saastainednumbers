import { chromium } from 'playwright';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  console.log('Triggering affiliate_click on MRR calculator...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  page.setViewportSize({ width: 1400, height: 900 });

  await page.goto('https://saastainednumbers.com/revenue/mrr-calculator');
  await sleep(3000);

  // Open all FAQ items
  const faqBtns = page.locator('details summary');
  const faqCount = await faqBtns.count();
  console.log(`Found ${faqCount} FAQ items`);
  for (let i = 0; i < faqCount; i++) {
    await faqBtns.nth(i).scrollIntoViewIfNeeded();
    await sleep(300);
    await faqBtns.nth(i).click();
    await sleep(500);
  }

  // Count external/affiliate links
  const links = page.locator('a[rel*="sponsored"]');
  const count = await links.count();
  console.log(`Found ${count} affiliate links`);

  if (count > 0) {
    for (let i = 0; i < Math.min(count, 3); i++) {
      await links.nth(i).scrollIntoViewIfNeeded().catch(() => {});
      await sleep(200);
      await links.nth(i).click({ force: true }).catch(() => {});
      await sleep(1000);
    }
    console.log('   ✅ affiliate_click');
  } else {
    // Debug: count all links
    const allLinks = page.locator('a');
    const allCount = await allLinks.count();
    console.log(`Total <a> elements: ${allCount}`);
    for (let i = 0; i < Math.min(allCount, 10); i++) {
      const href = await allLinks.nth(i).getAttribute('href').catch(() => '');
      const rel = await allLinks.nth(i).getAttribute('rel').catch(() => '');
      const text = (await allLinks.nth(i).textContent().catch(() => '')).trim().substring(0, 40);
      console.log(`  [${i}] rel="${rel}" href="${href}" text="${text}"`);
    }
  }

  console.log('\nDone. Now check GA4 Admin > Events.');
  await browser.close();
})();
