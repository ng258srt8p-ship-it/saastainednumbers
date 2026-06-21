import { test, expect } from "@playwright/test";
import { BASE, MOBILE, toggleDarkMode } from "./helpers";

test.describe("Dashboard Page (Unit Economics)", () => {
  test("dashboard page has heading", async ({ page }) => {
    await page.goto(`${BASE}/saas-deepen/unit-economics-dashboard-calculator`, { waitUntil: "load" });
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
  });

  test("dashboard has input fields for SaaS metrics", async ({ page }) => {
    await page.goto(`${BASE}/saas-deepen/unit-economics-dashboard-calculator`, { waitUntil: "load" });
    const inputs = page.locator('input[type="number"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("dashboard has output/result display area", async ({ page }) => {
    await page.goto(`${BASE}/saas-deepen/unit-economics-dashboard-calculator`, { waitUntil: "load" });
    // The unit economics dashboard outputs metrics like LTV/CAC ratio, contribution margin, etc.
    await expect(page.locator("body")).toContainText(/LTV|CAC|Ratio|Payback|MRR|Margin/i);
  });
});

test.describe("Blog Page", () => {
  test("blog page loads with heading", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
  });

  test("blog page lists at least 1 article", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    // Blog may use links to blog posts rather than <article> tags
    const links = page.locator('a[href*="/blog/"]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("blog page has pagination or more posts", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const moreBtn = page.locator("a").filter({ hasText: /Next|Older|More|Previous|Load/i }).first();
    await expect(moreBtn).toBeVisible();
  });
});

test.describe("Dashboard Page - Dark Mode", () => {
  test("dashboard page renders in dark mode", async ({ page }) => {
    await page.goto(`${BASE}/saas-deepen/unit-economics-dashboard-calculator`, { waitUntil: "load" });
    await toggleDarkMode(page, "dark");
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
    await toggleDarkMode(page, "light");
  });
});
