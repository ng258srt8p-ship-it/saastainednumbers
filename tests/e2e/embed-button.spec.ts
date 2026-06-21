import { test, expect } from "@playwright/test";
import { BASE, MOBILE, embedBtn, toggleDarkMode } from "./helpers";

test.describe("Embed Button - Desktop", () => {
  test("embed button visible on MRR calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect(embedBtn(page)).toBeVisible();
  });

  test("click embed opens modal", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await embedBtn(page).click();
    await page.waitForTimeout(500);
    const modal = page.locator('[role="dialog"]').or(page.locator('[class*="modal" i]'));
    await expect(modal).toBeVisible();
  });

  test("embed modal close button works", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await embedBtn(page).click();
    await page.waitForTimeout(500);
    const closeBtn = page.locator('button[aria-label="Close"]').or(page.locator('button:has-text("Close")'));
    await closeBtn.click();
    await page.waitForTimeout(300);
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toHaveCount(0);
  });

  test("embed button visible on CAC calculator", async ({ page }) => {
    await page.goto(`${BASE}/unit-economics/cac-calculator`, { waitUntil: "load" });
    await expect(embedBtn(page)).toBeVisible();
  });

  test("embed button visible on FIRE calculator", async ({ page }) => {
    await page.goto(`${BASE}/personal-finance/fire-calculator`, { waitUntil: "load" });
    await expect(embedBtn(page)).toBeVisible();
  });
});

test.describe("Embed Button - Cross-Locale", () => {
  test("embed button visible in Spanish locale", async ({ page }) => {
    await page.goto(`${BASE}/es/revenue/mrr-calculator`, { waitUntil: "load" });
    const btn = embedBtn(page);
    await expect(btn).toBeVisible();
  });

  test("embed modal opens from Spanish locale", async ({ page }) => {
    await page.goto(`${BASE}/es/revenue/mrr-calculator`, { waitUntil: "load" });
    await embedBtn(page).click();
    await page.waitForTimeout(500);
    const modal = page.locator('[role="dialog"]').or(page.locator('[class*="modal" i]'));
    await expect(modal).toBeVisible();
  });
});

test.describe("Embed Button - Dark Mode", () => {
  test("embed button visible in dark mode", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await toggleDarkMode(page, "dark");
    await expect(embedBtn(page)).toBeVisible();
    await toggleDarkMode(page, "light");
  });
});
