import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
const MOBILE_VIEWPORT = { width: 375, height: 667 };

const CURRENCY_CODES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "BRL", "CHF"];
const LOCALE_LABELS = ["English", "Español", "Deutsch", "Português", "Français", "日本語"];

test.describe("Nav dropdowns — Desktop (1280px)", () => {
  test.use({ viewport: DESKTOP_VIEWPORT });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
  });

  test("currency dropdown opens and is fully visible", async ({ page }) => {
    const currencyBtn = page.locator('button[aria-label="Select currency"]');
    await expect(currencyBtn).toBeVisible();
    await currencyBtn.click();

    // The currency dropdown panel should appear
    const currencyListbox = page.locator('[role="listbox"][aria-label="Select currency"]');
    await expect(currencyListbox).toBeVisible({ timeout: 3000 });

    // Verify all currency codes are shown
    for (const code of CURRENCY_CODES) {
      await expect(currencyListbox.locator(`text=${code}`)).toBeVisible();
    }

    // Verify the dropdown extends below the nav (not clipped)
    const listboxRect = await currencyListbox.boundingBox();
    expect(listboxRect).not.toBeNull();
    expect(listboxRect!.y).toBeGreaterThanOrEqual(48); // Below nav height
    expect(listboxRect!.height).toBeGreaterThan(200); // Enough space for all items
  });

  test("language dropdown opens and is fully visible", async ({ page }) => {
    const langBtn = page.locator('button[aria-label="Select language"]');
    await expect(langBtn).toBeVisible();
    await langBtn.click();

    const langListbox = page.locator('[role="listbox"][aria-label="Select language"]');
    await expect(langListbox).toBeVisible({ timeout: 3000 });

    for (const label of LOCALE_LABELS) {
      await expect(langListbox.locator(`text=${label}`)).toBeVisible();
    }

    const listboxRect = await langListbox.boundingBox();
    expect(listboxRect).not.toBeNull();
    expect(listboxRect!.y).toBeGreaterThanOrEqual(48);
    expect(listboxRect!.height).toBeGreaterThan(150);
  });

  test("currency selection closes dropdown and updates button", async ({ page }) => {
    const currencyBtn = page.locator('button[aria-label="Select currency"]');
    await currencyBtn.click();
    await expect(page.locator('[role="listbox"][aria-label="Select currency"]')).toBeVisible();

    // Click EUR option inside the listbox
    await page.locator('[role="listbox"][aria-label="Select currency"] >> text=EUR').click();

    // Dropdown should close
    await expect(page.locator('[role="listbox"][aria-label="Select currency"]')).not.toBeVisible({ timeout: 3000 });
    // Button text should update
    await expect(currencyBtn).toContainText("EUR");
  });

  test("backdrop overlay closes dropdown when clicked", async ({ page }) => {
    // Open currency dropdown
    await page.locator('button[aria-label="Select currency"]').click();
    await expect(page.locator('[role="listbox"]').first()).toBeVisible();

    // Click the backdrop overlay (fixed inset-0) which closes the dropdown
    await page.locator('.fixed.inset-0').click();
    await expect(page.locator('[role="listbox"]')).toHaveCount(0);
  });

  test("language button opens after currency closes", async ({ page }) => {
    // Open and close currency
    await page.locator('button[aria-label="Select currency"]').click();
    await page.locator('.fixed.inset-0').click();
    await expect(page.locator('[role="listbox"]')).toHaveCount(0);

    // Now open language
    await page.locator('button[aria-label="Select language"]').click();
    await expect(page.locator('[role="listbox"][aria-label="Select language"]')).toBeVisible({ timeout: 3000 });
  });
});

test.describe("Nav dropdowns — Mobile (375px)", () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
  });

  test("currency dropdown is within viewport on mobile", async ({ page }) => {
    await page.locator('button[aria-label="Select currency"]').click();

    const listbox = page.locator('[role="listbox"][aria-label="Select currency"]');
    await expect(listbox).toBeVisible({ timeout: 3000 });

    // Check each currency option is present
    for (const code of CURRENCY_CODES) {
      await expect(listbox.locator(`text=${code}`)).toBeVisible();
    }

    // Verify the dropdown is fully within viewport bounds
    const listboxRect = await listbox.boundingBox();
    expect(listboxRect).not.toBeNull();
    expect(listboxRect!.y).toBeGreaterThanOrEqual(0);
    expect(listboxRect!.y + listboxRect!.height).toBeLessThanOrEqual(MOBILE_VIEWPORT.height);
    expect(listboxRect!.x).toBeGreaterThanOrEqual(0);
    expect(listboxRect!.x + listboxRect!.width).toBeLessThanOrEqual(MOBILE_VIEWPORT.width);
  });

  test("language dropdown is within viewport on mobile", async ({ page }) => {
    await page.locator('button[aria-label="Select language"]').click();

    const listbox = page.locator('[role="listbox"][aria-label="Select language"]');
    await expect(listbox).toBeVisible({ timeout: 3000 });

    for (const label of LOCALE_LABELS) {
      await expect(listbox.locator(`text=${label}`)).toBeVisible();
    }

    const listboxRect = await listbox.boundingBox();
    expect(listboxRect).not.toBeNull();
    expect(listboxRect!.y).toBeGreaterThanOrEqual(0);
    expect(listboxRect!.y + listboxRect!.height).toBeLessThanOrEqual(MOBILE_VIEWPORT.height);
    expect(listboxRect!.x).toBeGreaterThanOrEqual(0);
    expect(listboxRect!.x + listboxRect!.width).toBeLessThanOrEqual(MOBILE_VIEWPORT.width);
  });
});
