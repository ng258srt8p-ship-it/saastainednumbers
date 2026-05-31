import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";
const MOBILE = { width: 390, height: 844 };

function currencyBtn(page: Page) {
  return page.locator('button[aria-label="Select currency"]').first();
}

function currencyDropdown(page: Page) {
  return page.locator('div[role="listbox"][aria-label="Select currency"]');
}

test.describe("Currency Switcher - Desktop", () => {
  test("currency switcher is visible in desktop nav header", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect(currencyBtn(page)).toBeVisible();
  });

  test("currency button shows current currency symbol and code", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const btnText = await currencyBtn(page).textContent();
    expect(btnText).toMatch(/^\$USD|€EUR|£GBP/);
  });

  test("dropdown opens on click", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await currencyBtn(page).click();
    await expect(currencyDropdown(page)).toBeVisible();
  });

  test("dropdown has aria-expanded toggling", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "false");
    await currencyBtn(page).click();
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "true");
    await currencyBtn(page).click();
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("dropdown contains multiple currency options", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await currencyBtn(page).click();
    const options = currencyDropdown(page).locator('button[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test("clicking EUR updates currency display", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await currencyBtn(page).click();
    await currencyDropdown(page).locator('button[role="option"]', { hasText: "EUR" }).click();
    await page.waitForTimeout(300);
    await expect(currencyBtn(page)).toContainText(/€/);
  });

  test("clicking GBP updates currency display", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await currencyBtn(page).click();
    await currencyDropdown(page).locator('button[role="option"]', { hasText: "GBP" }).click();
    await page.waitForTimeout(300);
    await expect(currencyBtn(page)).toContainText(/£/);
  });

  test("dropdown closes when clicking overlay", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await currencyBtn(page).click();
    await expect(currencyDropdown(page)).toBeVisible();
    await page.locator('div.fixed.inset-0.z-40').first().click({ force: true });
    await expect(currencyDropdown(page)).not.toBeVisible();
  });

  test("currency persists across page navigation", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await currencyBtn(page).click();
    await currencyDropdown(page).locator('button[role="option"]', { hasText: "EUR" }).click();
    await page.waitForTimeout(300);
    await expect(currencyBtn(page)).toContainText(/€/);

    await page.goto(`${BASE}/revenue/ltv-calculator`, { waitUntil: "load" });
    await expect(currencyBtn(page)).toContainText(/€/);
  });

  test("currency persists on page reload", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await currencyBtn(page).click();
    await currencyDropdown(page).locator('button[role="option"]', { hasText: "EUR" }).click();
    await page.waitForTimeout(300);

    await page.reload({ waitUntil: "load" });
    await expect(currencyBtn(page)).toContainText(/€/);
  });

  test("changing currency updates input prefix on calculator page", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    // MRR calculator has currency inputs, switch to EUR
    await currencyBtn(page).click();
    await currencyDropdown(page).locator('button[role="option"]', { hasText: "EUR" }).click();
    await page.waitForTimeout(300);
    // Check that at least one input has a € prefix
    const prefix = page.locator('span.pointer-events-none').first();
    await expect(prefix).toContainText(/€/);
  });
});

test.describe("Currency Switcher - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("currency switcher is accessible inside hamburger menu", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator('button[aria-label*="Open navigation"]').click();
    await expect(page.locator('div[role="dialog"]')).toBeVisible();
    // Look for the currency button inside the mobile menu
    const menuCurrency = page.locator('div[role="dialog"] button[aria-label="Select currency"]');
    await expect(menuCurrency).toBeVisible();
  });

  test("can change currency from mobile menu", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator('button[aria-label*="Open navigation"]').click();
    const menuCurrency = page.locator('div[role="dialog"] button[aria-label="Select currency"]');
    await menuCurrency.click();
    const dropdown = page.locator('div[aria-label="Select currency"][role="listbox"]');
    await dropdown.locator('button[role="option"]', { hasText: "GBP" }).click();
    await page.waitForTimeout(300);
    const headerCurrency = page.locator('button[aria-label="Select currency"]').first();
    await expect(headerCurrency).toContainText(/£/);
  });
});
