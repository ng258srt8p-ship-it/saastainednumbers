import { chromium } from 'playwright';

const BASE_URL = 'https://analytics.google.com/analytics/web';
const PROPERTY = '/a396022171p539251423';
const USER_DATA_DIR = '/tmp/ga4-chrome-profile';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  console.log('=== GA4 Diagnostic ===\n');

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    channel: 'chrome',
    headless: false,
    args: ['--profile-directory=Default', '--no-first-run'],
  });

  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  // Navigate to Admin > Events
  console.log('Loading Admin > Events...');
  await page.goto(`${BASE_URL}/#/${PROPERTY}/admin/events`, { waitUntil: 'domcontentloaded' });
  await sleep(8000);

  // Dump page info
  const title = await page.title().catch(() => 'N/A');
  const url = page.url();
  console.log(`Title: ${title}`);
  console.log(`URL: ${url}\n`);

  // Dump visible text
  const bodyText = await page.locator('body').innerText().catch(() => '');
  console.log('=== Page Text (first 3000 chars) ===');
  console.log(bodyText.substring(0, 3000));
  console.log('=== End Page Text ===\n');

  // Check for specific elements
  console.log('Looking for elements...');
  const checks = [
    'table',
    '[role="table"]',
    '[role="row"]',
    '[role="switch"]',
    'button',
    'a[href*="key"]',
    'a[href*="event"]',
    '.key-event',
  ];

  for (const sel of checks) {
    const count = await page.locator(sel).count();
    console.log(`  ${sel}: ${count} found`);
  }

  // Check admin events detail page for one of our events
  console.log('\nLoading calculate_tool event detail...');
  await page.goto(
    `${BASE_URL}/#/${PROPERTY}/admin/events/detail?event=calculate_tool`,
    { waitUntil: 'domcontentloaded' }
  );
  await sleep(6000);

  console.log(`URL: ${page.url()}`);
  const detailText = await page.locator('body').innerText().catch(() => '');
  console.log('=== Detail Page Text (first 2000 chars) ===');
  console.log(detailText.substring(0, 2000));
  console.log('=== End Detail Text ===\n');

  // Check switches again
  const switchCount = await page.locator('[role="switch"]').count();
  console.log(`Switches on detail page: ${switchCount}`);

  // Dump HTML around switch elements
  const switchHtml = await page.locator('[role="switch"]').evaluateAll(
    els => els.map(el => el.outerHTML.substring(0, 500))
  ).catch(() => []);
  for (const h of switchHtml) {
    console.log(`  Switch HTML: ${h}`);
  }

  await page.screenshot({ path: '/Users/georgetozer/Development/WebCalc/ga4-diagnostic-detail.png' });
  console.log('\nSaved ga4-diagnostic-detail.png');

  await sleep(15000);
  await context.close();
})();
