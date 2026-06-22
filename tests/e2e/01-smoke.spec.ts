import { test, expect } from "@playwright/test";
import { BASE, CALC_SLUGS } from "./helpers";

const ALL_CATEGORIES = [
  "revenue",
  "unit-economics",
  "churn-retention",
  "growth-efficiency",
  "ai-cost",
  "side-hustle",
  "personal-finance",
  "general-business",
  "saas-deepen",
];

const STATIC_PAGES = [
  "/pricing",
  "/blog",
  "/legal",
  "/terms",
  "/privacy",
  "/advertisers",
  "/calculators",
  "/canvas",
];

test.describe("Homepage", () => {
  test("homepage loads with title containing 'SaaStainedNumbers'", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    await expect(page).toHaveTitle(/SaaStainedNumbers/i);
  });

  test("homepage has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(BASE, { waitUntil: "load" });
    // Give time for any deferred console errors
    await page.waitForTimeout(2000);
    // Filter out known non-critical errors (e.g. analytics, third-party)
    const criticalErrors = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("analytics") && !e.includes("POST")
    );
    expect(criticalErrors).toEqual([]);
  });

  test("all nav links (Calculators, Canvas, Pricing, Blog) are visible on desktop", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    // Desktop nav links are in the hidden md:flex container
    const nav = page.locator("nav");
    await expect(nav.getByRole("link", { name: /Calculators/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Pricing/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Blog/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Canvas/i })).toBeVisible();
  });
});

test.describe("Calculator page", () => {
  test("calculator page loads", async ({ page }) => {
    const response = await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Embed page", () => {
  test("embed page loads", async ({ page }) => {
    const response = await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    expect(response?.status()).toBe(200);
  });
});

test.describe("Category pages", () => {
  for (const category of ALL_CATEGORIES) {
    test(`category page /${category} loads`, async ({ page }) => {
      const response = await page.goto(`${BASE}/${category}`, { waitUntil: "load" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
    });
  }
});

test.describe("Static pages", () => {
  for (const path of STATIC_PAGES) {
    test(`static page ${path} loads`, async ({ page }) => {
      const response = await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      expect(response?.status()).toBe(200);
    });
  }
});

test.describe("404 page", () => {
  test("unknown slug shows 404", async ({ page }) => {
    await page.goto(`${BASE}/nonexistent-page`, { waitUntil: "load" });
    // Should show the 404 text from the not-found page
    await expect(page.locator("text=404")).toBeVisible();
  });
});

test.describe("Nav does not contain unwanted links", () => {
  test("no 'About Us' link in the nav", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const nav = page.locator("nav");
    await expect(nav.getByRole("link", { name: /about/i })).toHaveCount(0);
  });

  test("no 'Contact Us' link in the nav", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const nav = page.locator("nav");
    await expect(nav.getByRole("link", { name: /contact/i })).toHaveCount(0);
  });
});
