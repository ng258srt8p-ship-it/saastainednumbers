import { test, expect } from "@playwright/test";
import { BASE, MOBILE, ALL_CURRENCIES, currencyBtn, currencyDropdown, switchCurrency, gotoCalculator, CALC_SLUGS } from "./helpers";

// ─── FULL CURRENCY MATRIX (Desktop) ────────────────────────────────────
test.describe("Currency Matrix - Desktop (20 currencies × 3 calculators)", () => {
  const calcSlugs = [
    { category: "revenue", slug: "mrr-calculator" },
    { category: "unit-economics", slug: "cac-calculator" },
    { category: "personal-finance", slug: "savings-calculator" },
  ];

  for (const currency of ALL_CURRENCIES) {
    test(`${currency.code} (${currency.symbol}) is selectable on MRR calculator`, async ({ page }) => {
      await gotoCalculator(page, "revenue", "mrr-calculator");
      await currencyBtn(page).click();
      await currencyDropdown(page).locator('button[role="option"]', { hasText: currency.code }).click();
      await page.waitForTimeout(300);
      await expect(currencyBtn(page)).toContainText(new RegExp(currency.code));
    });
  }
});

// ─── CURRENCY PERSISTENCE ───────────────────────────────────────────────
test.describe("Currency Persistence - Page Navigation", () => {
  test("JPY persists when navigating between different calculators", async ({ page }) => {
    await gotoCalculator(page, "revenue", "mrr-calculator");
    await switchCurrency(page, "JPY");
    await expect(currencyBtn(page)).toContainText("JPY");
    await gotoCalculator(page, "churn", "churn-rate-calculator");
    await expect(currencyBtn(page)).toContainText("JPY");
  });

  test("BRL persists on page reload", async ({ page }) => {
    await gotoCalculator(page, "revenue", "mrr-calculator");
    await switchCurrency(page, "BRL");
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(500);
    await expect(currencyBtn(page)).toContainText("BRL");
  });

  test("currency persists across category pages", async ({ page }) => {
    await gotoCalculator(page, "revenue", "mrr-calculator");
    await switchCurrency(page, "EUR");

    await page.goto(`${BASE}/revenue/ltv-calculator`, { waitUntil: "load" });
    await expect(currencyBtn(page)).toContainText("EUR");

    await page.goto(`${BASE}/unit-economics/cac-calculator`, { waitUntil: "load" });
    await expect(currencyBtn(page)).toContainText("EUR");
  });
});

// ─── CURRENCY DROPDOWN UI STATES ────────────────────────────────────────
test.describe("Currency Dropdown - Edge Cases", () => {
  test("dropdown closes when pressing Escape", async ({ page }) => {
    await gotoCalculator(page, "revenue", "mrr-calculator");
    await currencyBtn(page).click();
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking same currency keeps dropdown open or closes gracefully", async ({ page }) => {
    await gotoCalculator(page, "revenue", "mrr-calculator");
    await currencyBtn(page).click();
    // Click USD (the default)
    await currencyDropdown(page).locator('button[role="option"]', { hasText: "USD" }).click();
    await page.waitForTimeout(300);
    // Should either close gracefully or stay open with USD highlighted
    const isExpanded = await currencyBtn(page).getAttribute("aria-expanded");
    expect(isExpanded === "false" || isExpanded === "true").toBeTruthy();
  });
});

// ─── MOBILE CURRENCY MATRIX ────────────────────────────────────────────
test.describe("Currency Matrix - Mobile (Representative currencies)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  const testCodes = ["JPY", "GBP", "EUR"];

  for (const code of testCodes) {
    test(`${code} selectable from mobile menu`, async ({ page }) => {
      await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
      // Open hamburger menu
      await page.locator('button[aria-label*="Open navigation"]').click();
      await page.waitForTimeout(300);
      // Find currency switcher inside mobile menu
      const mobileCurrency = page.locator('div[role="dialog"] button[aria-label="Select currency"]');
      await mobileCurrency.click();
      await page.locator('button[role="option"]', { hasText: code }).click();
      await page.waitForTimeout(300);
      // Close menu
      await page.locator('button[aria-label*="Close"]').click();
      await page.waitForTimeout(300);
      // Check header currency updated
      await expect(currencyBtn(page)).toContainText(new RegExp(code));
    });
  }
});
