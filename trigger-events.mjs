import { chromium } from 'playwright';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  page.setViewportSize({ width: 1400, height: 900 });

  // ── 1. Search event ──
  console.log('\n1. search...');
  await page.goto('https://saastainednumbers.com/calculators');
  await sleep(2000);
  const searchInput = page.locator('input[type="search"], input[placeholder*="earch" i]');
  if (await searchInput.isVisible().catch(() => false)) {
    await searchInput.fill('MRR');
    await sleep(500);
    await searchInput.press('Enter');
    await sleep(2000);
    console.log('   ✅ search');
  } else {
    console.log('   ❌ search input not found');
  }

  // ── 2. MRR calculator: calculate + feedback + share + embed + compare ──
  console.log('\n2. Loading MRR calculator...');
  await page.goto('https://saastainednumbers.com/revenue/mrr-calculator');
  await sleep(3000);

  // calculate_tool: fire by interacting with inputs
  const numInputs = page.locator('input[type="number"]');
  const numCount = await numInputs.count().catch(() => 0);
  for (let i = 0; i < Math.min(numCount, 3); i++) {
    await numInputs.nth(i).fill(String(5000 + i * 1000));
    await sleep(200);
  }
  await sleep(1500);
  console.log('   ✅ calculate_tool');

  // feedback
  const fbYes = page.locator('button[aria-label="Yes, helpful"]');
  if (await fbYes.isVisible().catch(() => false)) {
    await fbYes.click();
    await sleep(500);
    console.log('   ✅ feedback');
  } else {
    console.log('   ❌ feedback');
  }

  // share
  const shareBtn = page.locator('button:has-text("Share")');
  if (await shareBtn.isVisible().catch(() => false)) {
    await shareBtn.click();
    await sleep(800);
    console.log('   ✅ share_tool');
  } else {
    console.log('   ❌ Share button');
  }

  // embed: click, copy, then properly close modal before next actions
  const embedBtn = page.locator('button:has-text("Embed")');
  if (await embedBtn.isVisible().catch(() => false)) {
    await embedBtn.click();
    await sleep(1500);
    const copyBtn = page.locator('button:has-text("Copy to Clipboard")');
    if (await copyBtn.isVisible().catch(() => false)) {
      await copyBtn.click();
      await sleep(500);
      console.log('   ✅ embed_generate');
    }
    // Close modal via the X button or Escape
    const closeBtn = page.locator('button:has-text("×"), button[aria-label="Close"], .embed-modal button:first-child');
    const escUnsuccessful = await page.evaluate(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      return document.querySelector('.fixed.inset-0.z-50') !== null;
    });
    if (escUnsuccessful) {
      // Try clicking the X button
      const xBtn = page.locator('button:has-text("×")').last();
      await xBtn.click().catch(() => {});
    }
    await sleep(1000);
  } else {
    console.log('   ❌ Embed button');
  }

  // compare: click "Add Scenario B to compare"
  console.log('\n3. compare_scenario...');
  const compareBtn = page.locator('button:has-text("Add Scenario B to compare")');
  if (await compareBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    // Use force:true to bypass any overlay interception
    await compareBtn.click({ force: true, timeout: 5000 });
    await sleep(2000);

    // Fill inputs in both scenarios
    const allRanges = page.locator('input[type="range"]');
    const allCount = await allRanges.count().catch(() => 0);
    for (let i = 0; i < Math.min(allCount, 6); i++) {
      await allRanges.nth(i).fill(String(3000 + i * 500));
      await sleep(200);
    }
    await sleep(1000);
    console.log('   ✅ compare_scenario');
  } else {
    console.log('   ❌ Compare button not found');
  }

  // ── 3. affiliate_click ──
  console.log('\n4. affiliate_click...');
  await page.goto('https://saastainednumbers.com/side-hustle/youtube-calculator');
  await sleep(3000);

  // Open all FAQ details to expose links
  const faqBtns = page.locator('details summary');
  const faqCount = await faqBtns.count().catch(() => 0);
  for (let i = 0; i < faqCount; i++) {
    await faqBtns.nth(i).scrollIntoViewIfNeeded();
    await sleep(200);
    await faqBtns.nth(i).click().catch(() => {});
    await sleep(500);
  }

  // Look for affiliate/external links
  const sponsoredLinks = page.locator('a[rel*="sponsored"]');
  const sponsoredCount = await sponsoredLinks.count().catch(() => 0);
  if (sponsoredCount > 0) {
    for (let i = 0; i < Math.min(sponsoredCount, 2); i++) {
      await sponsoredLinks.nth(i).scrollIntoViewIfNeeded();
      await sleep(200);
      await sponsoredLinks.nth(i).click({ force: true, timeout: 3000 }).catch(() => {});
      await sleep(800);
    }
    console.log(`   ✅ affiliate_click (${Math.min(sponsoredCount, 2)} links)`);
  } else {
    // Fallback: any external link in FAQ content
    const extLinks = page.locator('a[target="_blank"]');
    const extCount = await extLinks.count().catch(() => 0);
    if (extCount > 0) {
      for (let i = 0; i < Math.min(extCount, 2); i++) {
        await extLinks.nth(i).scrollIntoViewIfNeeded().catch(() => {});
        await sleep(200);
        await extLinks.nth(i).click({ force: true, timeout: 3000 }).catch(() => {});
        await sleep(800);
      }
      console.log(`   ✅ affiliate_click (${Math.min(extCount, 2)} external links)`);
    } else {
      console.log('   ❌ No external links found');
    }
  }

  console.log('\n=== All events triggered! ===');
  console.log('\nNow check GA4 Admin > Events (via Safari):');
  console.log('1. Open Safari → GA4 tab');
  console.log('2. Go to Admin > Events');
  console.log('3. Click the ⭐ star next to each event to mark as key event:');
  console.log('   - calculate_tool, compare_scenario, feedback');
  console.log('   - share_tool, embed_generate, search, affiliate_click');

  await browser.close();
})();
