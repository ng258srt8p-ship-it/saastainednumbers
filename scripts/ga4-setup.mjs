import { chromium } from 'playwright';

const EVENTS = [
  'calculate_tool',
  'compare_scenario',
  'feedback',
  'share_tool',
  'embed_generate',
  'search',
  'affiliate_click',
];

const BASE_URL = 'https://analytics.google.com/analytics/web';
const PROPERTY = '/a396022171p539251423';
const USER_DATA_DIR = '/tmp/ga4-chrome-profile';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  console.log('Launching Chrome with your profile...');

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    channel: 'chrome',
    headless: false,
    args: ['--profile-directory=Default', '--no-first-run'],
  });

  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  // ── Step 1: Realtime ──
  console.log('\n=== Step 1: Realtime Report ===');
  await page.goto(`${BASE_URL}/#/${PROPERTY}/reports/realtime`, { waitUntil: 'domcontentloaded' });
  console.log('  Page loaded, waiting for GA4 to render...');
  await sleep(8000);

  // Dismiss any welcome dialog
  try {
    const dismissBtn = page.locator('[role="dialog"] button:has-text("Dismiss"), [role="dialog"] button:has-text("Got it")');
    if (await dismissBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dismissBtn.click();
      await sleep(1000);
      console.log('  Dismissed dialog');
    }
  } catch { /* no dialog */ }

  await page.screenshot({ path: '/Users/georgetozer/Development/WebCalc/ga4-01-realtime.png' });
  console.log('  Saved ga4-01-realtime.png');

  // Check for event names in the page
  const bodyText = await page.locator('body').innerText().catch(() => '');
  for (const name of EVENTS) {
    console.log(bodyText.includes(name) ? `    ✅ ${name}` : `    ❌ ${name} not visible`);
  }
  console.log('  (Events may not appear in Realtime if no user has triggered them recently)');

  // ── Step 2: Admin > Events ──
  console.log('\n=== Step 2: Admin > Events ===');
  await page.goto(`${BASE_URL}/#/${PROPERTY}/admin/events`, { waitUntil: 'domcontentloaded' });
  console.log('  Loading admin events...');
  await sleep(6000);
  await page.screenshot({ path: '/Users/georgetozer/Development/WebCalc/ga4-02-admin-events.png' });
  console.log('  Saved ga4-02-admin-events.png');

  // ── Step 3: Mark each event as a key event ──
  console.log('\n=== Step 3: Marking Key Events ===');
  for (const eventName of EVENTS) {
    console.log(`\n  Processing: ${eventName}`);
    await page.goto(
      `${BASE_URL}/#/${PROPERTY}/admin/events/detail?event=${encodeURIComponent(eventName)}`,
      { waitUntil: 'domcontentloaded' }
    );
    await sleep(5000);

    // Try various selector patterns for the "Mark as key event" switch
    const selectors = [
      'div[role="switch"]',
      'button[role="switch"]',
      'input[type="checkbox"]',
      '[aria-label*="key event" i]',
      '[aria-label*="Key event"]',
      'span:has-text("Mark as key event")',
      'span:has-text("Key event")',
    ];

    let toggled = false;
    for (const selector of selectors) {
      const el = page.locator(selector).first();
      if (await el.isVisible({ timeout: 1000 }).catch(() => false)) {
        const tag = (await el.evaluate(el => el.tagName).catch(() => '')).toLowerCase();
        const type = await el.getAttribute('type').catch(() => null);
        const checked = await el.getAttribute('aria-checked').catch(() => null);
        
        if (checked === 'true') {
          console.log(`    ⏭️  Already a key event (selector: ${selector})`);
          toggled = true;
          break;
        }

        if (tag === 'input' && type === 'checkbox') {
          const isChecked = await el.isChecked().catch(() => false);
          if (!isChecked) {
            await el.check();
            console.log(`    ✅ Marked (checkbox via ${selector})`);
            toggled = true;
            break;
          }
        } else {
          await el.click();
          await sleep(1000);
          console.log(`    ✅ Clicked (via ${selector})`);
          toggled = true;
          break;
        }
      }
    }

    if (!toggled) {
      console.log(`    ❌ Could not find key event toggle`);
    }

    await page.screenshot({
      path: `/Users/georgetozer/Development/WebCalc/ga4-event-${eventName}.png`,
    });
  }

  // Final screenshot back on admin events list
  await page.goto(`${BASE_URL}/#/${PROPERTY}/admin/events`, { waitUntil: 'domcontentloaded' });
  await sleep(5000);
  await page.screenshot({ path: '/Users/georgetozer/Development/WebCalc/ga4-03-key-events-done.png' });
  console.log('\n  Saved ga4-03-key-events-done.png');

  console.log('\n=== ✅ All Done! ===');
  console.log('Screenshots saved in project root.');

  // Keep browser open for 30s so user can see results
  console.log('\nBrowser will close in 30 seconds...');
  await sleep(30000);
  await context.close();
  console.log('Browser closed.');
})();
