import { test, expect } from "@playwright/test";
import { BASE, MOBILE, toggleDarkMode } from "./helpers";

test.describe("Pricing Page - CTA", () => {
  test("pricing page loads", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    await expect(page.locator("h1")).toBeVisible();
  });

  test("pricing page shows 'Free' or '$0' pricing", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const body = page.locator("body");
    await expect(body).toContainText(/\$0|Free|Gratis|Grátis|Gratuit|無料/i);
  });

  test("pricing page has CTA button linking to calculators", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const ctaBtn = page.locator("a").filter({ hasText: /Browse|Calculators|Get Started|Start Free|Try Free/i }).first();
    await expect(ctaBtn).toBeVisible();
  });

  test("pricing page CTA links to home or calculators", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const ctaBtn = page.locator("a").filter({ hasText: /Browse|Calculators|Get Started|Start Free|Try Free/i }).first();
    const href = await ctaBtn.getAttribute("href");
    expect(href).toMatch(/^(\/|.*calculator)/);
  });

  test("pricing page shows feature cards", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const cards = page.locator('[class*="card" i]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});

test.describe("Pricing Page - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("pricing page renders CTA on mobile", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const ctaBtn = page.locator("a").filter({ hasText: /Browse|Calculators|Get Started|Start Free|Try Free/i }).first();
    await expect(ctaBtn).toBeVisible();
  });
});

test.describe("Pricing Page - Cross-Locale", () => {
  test("English pricing page has correct heading", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
  });
});

test.describe("Pricing Page - Dark Mode", () => {
  test("pricing page renders in dark mode", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    await toggleDarkMode(page, "dark");
    await expect(page.locator("h1")).toBeVisible();
    await toggleDarkMode(page, "light");
  });
});
