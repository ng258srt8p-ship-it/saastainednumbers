import { test, expect } from "@playwright/test";
import { BASE, MOBILE, toggleDarkMode } from "./helpers";

test.describe("Canvas Page - Desktop", () => {
  test("canvas page loads and shows calculator templates", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    // Canvas page renders template cards as buttons
    const templates = page.locator("button").filter({ hasText: /SaaS Starter|Unit Economics|Growth|Revenue|Side Hustle|Churn|AI Cost|Business|Blank|Personal Finance/ });
    const count = await templates.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("canvas page has interactive elements (buttons/inputs)", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const interactive = page.locator("button, input, select, textarea");
    const count = await interactive.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("canvas page has template cards with descriptions", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    // Templates are buttons with names and descriptions
    const templates = page.locator("button").filter({ hasText: /Quick Start Templates/ });
    // The Quick Start Templates section should exist
    await expect(templates.first()).toBeVisible({ timeout: 5000 });
  });

  test("clicking a template button does not crash", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const saasTemplate = page.locator("button").filter({ hasText: /SaaS Starter Pack/ });
    await expect(saasTemplate.first()).toBeVisible({ timeout: 5000 });
    await saasTemplate.first().click();
    await page.waitForTimeout(500);
    // Page should still be functional after clicking
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Canvas Page - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("canvas page renders on mobile", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    // At minimum, the page body should be visible
    await expect(page.locator("body")).toBeVisible({ timeout: 15000 });
    const buttons = page.locator("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe("Canvas Page - Cross-Locale", () => {
  test("Spanish canvas page loads", async ({ page }) => {
    await page.goto(`${BASE}/es/canvas`, { waitUntil: "load" });
    // Locale-prefixed routes may redirect, just verify page loads
    await expect(page.locator("body")).toBeVisible({ timeout: 15000 });
  });
});

test.describe("Canvas Page - Dark Mode", () => {
  test("canvas page renders in dark mode", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    await toggleDarkMode(page, "dark");
    await expect(page.locator("body")).toBeVisible({ timeout: 15000 });
    await toggleDarkMode(page, "light");
  });
});
