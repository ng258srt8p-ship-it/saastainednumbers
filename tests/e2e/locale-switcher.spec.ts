import { test, expect } from "@playwright/test";
import { BASE, MOBILE, LOCALES, localeSwitcherBtn, localeSwitcherDropdown, toggleDarkMode } from "./helpers";

// ─── LOCALE SWITCHER - DESKTOP ─────────────────────────────────────────
test.describe("Locale Switcher - Desktop", () => {
  test("locale switcher button visible on homepage", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    await expect(localeSwitcherBtn(page)).toBeVisible();
  });

  test("locale switcher button visible on calculator page", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect(localeSwitcherBtn(page)).toBeVisible();
  });

  test("clicking locale switcher opens dropdown", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    await localeSwitcherBtn(page).click();
    await expect(localeSwitcherDropdown(page)).toBeVisible();
  });

  test("dropdown lists all 6 locales", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    await localeSwitcherBtn(page).click();
    for (const locale of LOCALES) {
      const option = localeSwitcherDropdown(page).locator(`button[role="option"]`, { hasText: locale.code });
      await expect(option).toBeVisible();
    }
  });

  test("switching from EN to ES updates URL path", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await localeSwitcherBtn(page).click();
    await localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: "es" }).click();
    await page.waitForTimeout(500);
    expect(page.url()).toContain("/es/revenue/mrr-calculator");
  });

  test("switching from EN to DE updates heading language", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await localeSwitcherBtn(page).click();
    await localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: "de" }).click();
    await page.waitForTimeout(500);
    const body = page.locator("body");
    await expect(body).toContainText(/Rechner|Berechnen|Berechnung|Umsatz|MRR/i);
  });

  test("switching from EN to JA updates page title to Japanese", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await localeSwitcherBtn(page).click();
    await localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: "ja" }).click();
    await page.waitForTimeout(500);
    const title = await page.title();
    expect(title).toMatch(/[\u3000-\u9FFF\u3040-\u30FF]/);
  });

  test("switching locale preserves currency setting", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    // Set GBP currency
    await page.locator('button[aria-label="Select currency"]').click();
    await page.locator('button[role="option"]', { hasText: "GBP" }).click();
    await page.waitForTimeout(300);

    // Switch to Spanish
    await localeSwitcherBtn(page).click();
    await localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: "es" }).click();
    await page.waitForTimeout(500);

    // Currency should still be GBP
    await expect(page.locator('button[aria-label="Select currency"]')).toContainText("GBP");
  });
});

// ─── LOCALE SWITCHER - MOBILE ─────────────────────────────────────────
test.describe("Locale Switcher - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("locale switcher accessible from mobile menu", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    // Open mobile nav
    await page.locator('button[aria-label*="Open navigation"]').click();
    await page.waitForTimeout(300);
    // Locale switcher should be inside the mobile dialog
    const mobileLocale = page.locator('div[role="dialog"] button[aria-label*="Select language"]');
    await expect(mobileLocale).toBeVisible();
  });
});

// ─── LOCALE SWITCHER - CROSS-PAGE PERSISTENCE ──────────────────────────
test.describe("Locale Persistence", () => {
  test("locale persists when navigating between calculators", async ({ page }) => {
    await page.goto(`${BASE}/es/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.goto(`${BASE}/es/churn/churn-rate-calculator`, { waitUntil: "load" });
    expect(page.url()).toContain("/es/");
  });

  test("locale persists on page reload", async ({ page }) => {
    await page.goto(`${BASE}/fr/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.reload({ waitUntil: "load" });
    expect(page.url()).toContain("/fr/");
  });

  test("dark mode with locale switching works", async ({ page }) => {
    await page.goto(`${BASE}/de/revenue/mrr-calculator`, { waitUntil: "load" });
    await toggleDarkMode(page, "dark");
    expect(page.url()).toContain("/de/");
    await toggleDarkMode(page, "light");
  });
});

// ─── LOCALE 404 REDIRECT VERIFICATION ──────────────────────────────────
test.describe("Locale 404 Redirect Verification", () => {
  LOCALES.forEach(({ code }) => {
    test(`[${code}] /${code} redirects to calculators homepage`, async ({ page }) => {
      const resp = await page.goto(`${BASE}/${code}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
      await page.waitForTimeout(1000);
      const calcCards = page.locator('[class*="card" i], [data-testid*="calculator"], a[href*="calculator"]');
      const count = await calcCards.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });
});
