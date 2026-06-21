import { test, expect } from "@playwright/test";
import { BASE, MOBILE, toggleDarkMode } from "./helpers";

test.describe("Dashboard Page", () => {
  test("dashboard page has heading", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
  });

  test("dashboard has input fields for SaaS metrics", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const inputs = page.locator("input");
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("dashboard has output/result display area", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const outputs = page.locator('[class*="output" i], [class*="result" i], [class*="metric" i], [class*="stat" i]');
    const count = await outputs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe("Blog Page", () => {
  test("blog page loads with heading", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
  });

  test("blog page lists at least 1 article", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const articles = page.locator("article, [class*='post' i], [class*='card' i] a");
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("blog page has pagination or more posts", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const moreBtn = page.locator("a").filter({ hasText: /Next|Older|More|Previous/i }).first();
    await expect(moreBtn).toBeVisible();
  });
});

test.describe("Dashboard Page - Dark Mode", () => {
  test("dashboard page renders in dark mode", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    await toggleDarkMode(page, "dark");
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
    await toggleDarkMode(page, "light");
  });
});
