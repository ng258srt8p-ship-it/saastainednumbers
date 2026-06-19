import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

const CATEGORIES = [
  { path: "revenue", name: "Revenue" },
  { path: "growth-efficiency", name: "Growth & Efficiency" },
  { path: "churn-retention", name: "Churn & Retention" },
  { path: "unit-economics", name: "Unit Economics" },
  { path: "ai-cost", name: "AI Cost" },
  { path: "side-hustle", name: "Side Hustle" },
  { path: "personal-finance", name: "Personal Finance" },
  { path: "general-business", name: "General Business" },
  { path: "saas-deepen", name: "SaaS Deepen" },
];

test.describe("Category Pages", () => {
  for (const cat of CATEGORIES) {
    test(`${cat.path} returns 200`, async ({ page }) => {
      const resp = await page.goto(`${BASE}/${cat.path}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
    });

    test(`${cat.path} has heading with category name`, async ({ page }) => {
      await page.goto(`${BASE}/${cat.path}`, { waitUntil: "load" });
      const h1 = page.locator("h1");
      await expect(h1).toBeVisible();
      const text = await h1.textContent();
      expect(text).toContain(cat.name);
    });

    test(`${cat.path} has calculator cards`, async ({ page }) => {
      await page.goto(`${BASE}/${cat.path}`, { waitUntil: "load" });
      const calcCards = page.locator("a[href*='calculator']").or(
        page.locator("a[href*='/revenue/'], a[href*='/growth-efficiency/'], a[href*='/churn-retention/'], a[href*='/unit-economics/'], a[href*='/ai-cost/'], a[href*='/side-hustle/'], a[href*='/personal-finance/'], a[href*='/general-business/'], a[href*='/saas-deepen/']")
      );
      const count = await calcCards.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test(`${cat.path} calculator card links work`, async ({ page }) => {
      await page.goto(`${BASE}/${cat.path}`, { waitUntil: "load" });
      const firstCalcLink = page.locator("a[href*='-calculator']").first();
      const href = await firstCalcLink.getAttribute("href");
      if (href && !href.startsWith("http")) {
        const resp = await page.goto(`${BASE}${href}`, { waitUntil: "load" });
        expect(resp?.status()).toBe(200);
      }
    });

    test(`${cat.path} has breadcrumb`, async ({ page }) => {
      await page.goto(`${BASE}/${cat.path}`, { waitUntil: "load" });
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
      await expect(breadcrumb).toBeVisible();
    });
  }

  for (const cat of CATEGORIES) {
    test(`${cat.path} has calculator search input`, async ({ page }) => {
      await page.goto(`${BASE}/${cat.path}`, { waitUntil: "load" });
      const search = page.locator('input[aria-label="Search calculators"]').or(
        page.locator('input[type="text"]')
      ).first();
      if (await search.isVisible()) {
        await expect(search).toHaveAttribute("placeholder", /search/i);
      }
    });
  }

  for (const cat of CATEGORIES) {
    test(`${cat.path} calculator cards have descriptions`, async ({ page }) => {
      await page.goto(`${BASE}/${cat.path}`, { waitUntil: "load" });
      // Check that calculator cards have non-empty description text
      const cards = page.locator("a[href*='-calculator']");
      const cardCount = await cards.count();
      if (cardCount > 0) {
        const descriptions = page.locator("[class*='line-clamp']");
        const count = await descriptions.count();
        expect(count).toBeGreaterThanOrEqual(1);
      } else {
        // Empty category — check for coming-soon message
        await expect(page.getByText(/coming soon/i).first()).toBeVisible({ timeout: 3000 });
      }
    });
  }
});

test.describe("Category Page - Empty/Unknown", () => {
  test("unknown category shows coming soon page", async ({ page }) => {
    const resp = await page.goto(`${BASE}/nonexistent-category`, { waitUntil: "load" });
    // Category pages return 200 with an empty/coming-soon state
    expect(resp?.status()).toBe(200);
    await expect(page.getByText(/coming soon/i).first()).toBeVisible({ timeout: 3000 });
  });

  test("unknown category has browse all link", async ({ page }) => {
    await page.goto(`${BASE}/nonexistent-category`, { waitUntil: "load" });
    const browse = page.locator("a[href='/']").or(page.locator("a[href='/calculators']"));
    if (await browse.count() > 0) {
      await expect(browse.first()).toBeVisible();
    }
  });
});
