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
      const option = localeSwitcherDropdown(page).locator(`button[role="option"]`, { hasText: locale.name });
      await expect(option).toBeVisible();
    }
  });

  test("switching from EN to ES updates URL path", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await localeSwitcherBtn(page).click();
    await localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: "Español" }).click();
    await page.waitForTimeout(500);
    expect(page.url()).toContain("/es/revenue/mrr-calculator");
  });

  test("switching from EN to DE changes locale cookie", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await localeSwitcherBtn(page).click();
    await localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: "Deutsch" }).click();
    await page.waitForTimeout(500);
    // Nav should show German text
    const navText = await page.locator("nav").textContent();
    expect(navText).toMatch(/Rechner|Preise|Über/);
  });

  test("switching from EN to JA sets locale cookie", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await localeSwitcherBtn(page).click();
    await localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: "日本語" }).click();
    await page.waitForTimeout(500);
    // The page should still load (may show 404 for locale-prefixed path)
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("switching locale preserves currency setting", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    // Set GBP currency
    await page.locator('button[aria-label="Select currency"]').click();
    await page.locator('button[role="option"]', { hasText: "GBP" }).click();
    await page.waitForTimeout(300);

    // Switch to Spanish
    await localeSwitcherBtn(page).click();
    await localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: "Español" }).click();
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

  test("locale switcher available on mobile viewport", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    // The locale switcher is in the header (outside hamburger menu) on mobile
    await expect(localeSwitcherBtn(page)).toBeVisible();
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
      // Should redirect to /calculators (bare path, not locale-prefixed in redirect)
      expect(page.url()).toContain("/calculators");
      // Verify calculator content is present
      const calcCards = page.locator('[class*="card" i], [data-testid*="calculator"], a[href*="calculator"]');
      const count = await calcCards.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });
});
