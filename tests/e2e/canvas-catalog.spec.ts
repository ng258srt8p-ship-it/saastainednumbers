import { test, expect } from "@playwright/test";
import { BASE, MOBILE, toggleDarkMode } from "./helpers";

test.describe("Canvas Page - Desktop", () => {
  test("canvas page loads at /canvas or /en/canvas", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
  });

  test("canvas page has interactive elements (buttons/inputs)", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const interactive = page.locator("button, input, select, textarea");
    const count = await interactive.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("canvas page renders calculator grid or cards", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const cards = page.locator('[class*="card" i], [class*="grid"] a, [data-testid*="calculator"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("canvas page has category filter tabs", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const filters = page.locator("button").filter({ hasText: /All|Revenue|Churn|Growth|Unit Economics|AI Cost|Side Hustle|Personal Finance/ });
    const count = await filters.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("clicking category filter shows relevant calculators", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const revenueBtn = page.locator("button").filter({ hasText: "Revenue" });
    await revenueBtn.click();
    await page.waitForTimeout(500);
    // After clicking Revenue, the visible cards should change
    const cards = page.locator('[class*="card" i]');
    await expect(cards.first()).toBeVisible();
  });
});

test.describe("Canvas Page - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("canvas page renders on mobile", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
  });
});

test.describe("Canvas Page - Cross-Locale", () => {
  test("Spanish canvas page loads", async ({ page }) => {
    await page.goto(`${BASE}/es/canvas`, { waitUntil: "load" });
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
  });
});

test.describe("Canvas Page - Dark Mode", () => {
  test("canvas page renders in dark mode", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    await toggleDarkMode(page, "dark");
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
    await toggleDarkMode(page, "light");
  });
});
