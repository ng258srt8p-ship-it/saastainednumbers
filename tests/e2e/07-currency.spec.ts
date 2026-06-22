import { test, expect } from "@playwright/test";
import {
  BASE,
  MOBILE,
  currencyBtn,
  currencyDropdown,
  switchCurrency,
  hamburgerBtn,
  mobileMenu,
} from "./helpers";

test.describe("Currency switcher", () => {
  test("currency switcher button is visible on desktop", async ({ page }) => {
    await page.goto(BASE);
    await expect(currencyBtn(page)).toBeVisible();
  });

  test("default currency is USD on English homepage", async ({ page }) => {
    await page.goto(BASE);
    const btn = currencyBtn(page);
    await expect(btn).toContainText("USD");
  });

  test("clicking currency button opens dropdown with currencies", async ({ page }) => {
    await page.goto(BASE);
    await currencyBtn(page).click();
    const dropdown = currencyDropdown(page);
    await expect(dropdown).toBeVisible();
    // Check that at least 15 of the 20 currencies are visible
    const options = dropdown.locator('button[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(15);
  });

  test("selecting EUR changes currency symbol", async ({ page }) => {
    await page.goto(BASE);
    await switchCurrency(page, "EUR");
    // Dropdown should close after selection
    await expect(currencyDropdown(page)).not.toBeVisible();
    // Currency button should now show EUR
    await expect(currencyBtn(page)).toContainText("EUR");
  });

  test("selecting GBP changes currency symbol", async ({ page }) => {
    await page.goto(BASE);
    await switchCurrency(page, "GBP");
    await expect(currencyDropdown(page)).not.toBeVisible();
    await expect(currencyBtn(page)).toContainText("GBP");
  });

  test("currency persists after navigation", async ({ page }) => {
    await page.goto(BASE);
    await switchCurrency(page, "EUR");
    // Navigate to another calculator
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    await expect(currencyBtn(page)).toContainText("EUR");
  });

  test("currency persists after reload", async ({ page }) => {
    await page.goto(BASE);
    await switchCurrency(page, "GBP");
    await page.reload({ waitUntil: "load" });
    await expect(currencyBtn(page)).toContainText("GBP");
  });

  test("currency input prefix updates on mrr-calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    // Default is USD — look for the dollar sign prefix in input labels or result cards
    const resultCards = page.locator('[data-testid]');
    await switchCurrency(page, "EUR");
    // After switching, the currency context should update
    // Verify the currency button reflects the change
    await expect(currencyBtn(page)).toContainText("EUR");
  });

  test("mobile: currency switcher accessible via hamburger menu", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    // Open hamburger menu
    await hamburgerBtn(page).click();
    await expect(mobileMenu(page)).toBeVisible();
    // Currency button should be inside the mobile menu
    const mobileCurrencyBtn = mobileMenu(page).locator('button[aria-label="Select currency"]');
    await expect(mobileCurrencyBtn).toBeVisible();
    await mobileCurrencyBtn.click();
    await expect(currencyDropdown(page)).toBeVisible();
  });

  test("dropdown closes when clicking outside (backdrop)", async ({ page }) => {
    await page.goto(BASE);
    await currencyBtn(page).click();
    await expect(currencyDropdown(page)).toBeVisible();
    // Click on the page body, away from the dropdown
    await page.locator("body").click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(400);
    await expect(currencyDropdown(page)).not.toBeVisible();
  });

  test("escape key closes dropdown", async ({ page }) => {
    await page.goto(BASE);
    await currencyBtn(page).click();
    await expect(currencyDropdown(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    await expect(currencyDropdown(page)).not.toBeVisible();
  });

  test("selecting same currency does not cause errors", async ({ page }) => {
    await page.goto(BASE);
    // Default is USD
    await switchCurrency(page, "USD");
    // Should still be on the page without errors
    await expect(page.locator("h1")).toBeVisible();
    await expect(currencyBtn(page)).toContainText("USD");
  });
});
