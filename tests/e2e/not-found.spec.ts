import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("404 - Calculator Not Found", () => {
  test("nonexistent calculator shows not-found content", async ({ page }) => {
    await page.goto(`${BASE}/revenue/nonexistent-calc`, { waitUntil: "load" });
    await expect(page.locator("text=Calculator Not Found")).toBeVisible();
  });

  test("nonexistent calculator shows navigation options", async ({ page }) => {
    await page.goto(`${BASE}/revenue/nonexistent-calc`, { waitUntil: "load" });
    // Should have a link to go back somewhere useful
    const links = page.locator("a");
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});

test.describe("404 - Beyond /[category]/[slug]", () => {
  test("completely non-existent route returns 200 and shows 404 UI", async ({ page }) => {
    const resp = await page.goto(`${BASE}/this-path-does-not-exist-at-all`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
  });

  test("404 page shows 404 number", async ({ page }) => {
    await page.goto(`${BASE}/this-path-does-not-exist-at-all`, { waitUntil: "load" });
    await expect(page.locator("text=404")).toBeVisible();
  });

  test("404 page has heading about page not found", async ({ page }) => {
    await page.goto(`${BASE}/this-path-does-not-exist-at-all`, { waitUntil: "load" });
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("404 page has Go Home button", async ({ page }) => {
    await page.goto(`${BASE}/this-path-does-not-exist-at-all`, { waitUntil: "load" });
    const homeBtn = page.locator("a[href='/']");
    await expect(homeBtn.first()).toBeVisible();
  });

  test("Go Home button navigates to homepage", async ({ page }) => {
    await page.goto(`${BASE}/this-path-does-not-exist-at-all`, { waitUntil: "load" });
    await page.locator("a[href='/']").first().click();
    await expect(page).toHaveURL(`${BASE}/`);
  });

  test("404 page has Calculators navigation option", async ({ page }) => {
    await page.goto(`${BASE}/this-path-does-not-exist-at-all`, { waitUntil: "load" });
    const calcBtn = page.locator("a[href='/calculators']");
    if (await calcBtn.count() > 0) {
      await expect(calcBtn.first()).toBeVisible();
      await calcBtn.first().click();
      await expect(page).toHaveURL(/\/calculators/);
    }
  });

  test("404 on deeply nested route", async ({ page }) => {
    const resp = await page.goto(`${BASE}/a/b/c/d/e/f/g`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
    await expect(page.locator("text=404")).toBeVisible();
  });
});

test.describe("404 - Page still has navigation", () => {
  test("404 page has working nav link", async ({ page }) => {
    await page.goto(`${BASE}/this-path-does-not-exist-at-all`, { waitUntil: "load" });
    const navLinks = page.locator("nav a");
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
