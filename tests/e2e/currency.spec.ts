import { test, expect } from "@playwright/test";
import { BASE, MOBILE, ALL_CURRENCIES, currencyBtn, currencyDropdown, switchCurrency, toggleDarkMode, CALC_SLUGS } from "./helpers";

test.describe("Currency Switcher - Desktop Core", () => {
  test("currency switcher visible in desktop nav header", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect(currencyBtn(page)).toBeVisible();
  });

  test("currency button shows USD by default", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const btnText = await currencyBtn(page).textContent();
    expect(btnText).toContain("USD");
    expect(btnText).toContain("$");
  });

  test("dropdown opens and closes on click", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "false");
    await currencyBtn(page).click();
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "true");
    await currencyBtn(page).click();
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("dropdown has at least 15 currency options", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await currencyBtn(page).click();
    const options = currencyDropdown(page).locator('button[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(15);
  });

  test("switching to GBP updates currency display", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await switchCurrency(page, "GBP");
    await expect(currencyBtn(page)).toContainText(/£/);
  });

  test("switching to EUR persists across page navigation", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await switchCurrency(page, "EUR");
    await expect(currencyBtn(page)).toContainText(/€/);
    await page.goto(`${BASE}/revenue/ltv-calculator`, { waitUntil: "load" });
    await expect(currencyBtn(page)).toContainText(/€/);
  });

  test("currency persists on page reload", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await switchCurrency(page, "EUR");
    await page.reload({ waitUntil: "load" });
    await expect(currencyBtn(page)).toContainText(/€/);
  });

  test("changing currency updates input prefix", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await switchCurrency(page, "EUR");
    const prefix = page.locator('span.pointer-events-none').first();
    await expect(prefix).toContainText(/€/);
  });
});

test.describe("Currency Switcher - Mobile Core", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("currency switcher accessible inside hamburger menu", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator('button[aria-label*="Open navigation"]').click();
    await expect(page.locator('div[role="dialog"]')).toBeVisible();
    const menuCurrency = page.locator('div[role="dialog"] button[aria-label="Select currency"]');
    await expect(menuCurrency).toBeVisible();
  });

  test("can change currency from mobile menu", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator('button[aria-label*="Open navigation"]').click();
    const menuCurrency = page.locator('div[role="dialog"] button[aria-label="Select currency"]');
    await menuCurrency.click();
    const dropdown = page.locator('div[role="listbox"][aria-label="Select currency"]');
    await dropdown.locator('button[role="option"]', { hasText: "GBP" }).click();
    await page.waitForTimeout(300);
    await expect(currencyBtn(page)).toContainText(/£/);
  });
});

test.describe("Currency Switcher - Dropdown Coverage", () => {
  test("ALL 20 currencies appear as options in dropdown", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await currencyBtn(page).click();
    for (const c of ALL_CURRENCIES) {
      await expect(
        currencyDropdown(page).locator('button[role="option"]', { hasText: c.code })
      ).toBeVisible();
    }
  });

  test("dropdown closes when clicking overlay", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await currencyBtn(page).click();
    await expect(currencyDropdown(page)).toBeVisible();
    await page.locator('div.fixed.inset-0.z-40').first().click({ force: true });
    await expect(currencyDropdown(page)).not.toBeVisible();
  });
});
