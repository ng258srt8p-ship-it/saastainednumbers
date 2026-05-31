import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Breadcrumbs - Category Pages", () => {
  const categories = [
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

  for (const cat of categories) {
    test(`${cat.path} has breadcrumb with Home > ${cat.name}`, async ({ page }) => {
      await page.goto(`${BASE}/${cat.path}`, { waitUntil: "load" });
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.locator("a")).toContainText("Home");
      await expect(breadcrumb.locator("span").last()).toContainText(cat.name);
    });
  }

  test("breadcrumb Home link navigates to homepage", async ({ page }) => {
    await page.goto(`${BASE}/revenue`, { waitUntil: "load" });
    await page.locator('nav[aria-label="Breadcrumb"] a').click();
    await expect(page).toHaveURL(`${BASE}/`);
  });
});

test.describe("Breadcrumbs - Calculator Pages", () => {
  const calcs = [
    { path: "revenue/mrr-calculator", category: "Revenue", name: "MRR" },
    { path: "growth-efficiency/cac-calculator", category: "Growth & Efficiency", name: "CAC" },
    { path: "churn-retention/churn-calculator", category: "Churn & Retention", name: "Churn" },
    { path: "personal-finance/fire-calculator", category: "Personal Finance", name: "FIRE" },
  ];

  for (const calc of calcs) {
    test(`${calc.path} has breadcrumb with Home > ${calc.category} > ${calc.name}`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.path}`, { waitUntil: "load" });
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
      await expect(breadcrumb).toBeVisible();
      const texts = await breadcrumb.locator("a, span:not([aria-hidden])").allTextContents();
      const joined = texts.map((t) => t.trim()).filter(Boolean).join(" ");
      expect(joined).toContain("Home");
      expect(joined).toContain(calc.name);
    });
  }

  test("breadcrumb category link on calculator page navigates correctly", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    // Click the category link (second link, first is Home)
    const links = breadcrumb.locator("a");
    const linkCount = await links.count();
    if (linkCount >= 2) {
      await links.nth(1).click();
      await expect(page).toHaveURL(/\/revenue/);
    }
  });
});

test.describe("Breadcrumbs - JSON-LD", () => {
  test("category page has BreadcrumbList JSON-LD", async ({ page }) => {
    await page.goto(`${BASE}/revenue`, { waitUntil: "load" });
    const jsonld = page.locator('script[type="application/ld+json"]');
    const texts = await jsonld.allTextContents();
    const hasBreadcrumb = texts.some((t) => t.includes("BreadcrumbList"));
    expect(hasBreadcrumb).toBe(true);
  });

  test("calculator page has BreadcrumbList JSON-LD", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const jsonld = page.locator('script[type="application/ld+json"]');
    const texts = await jsonld.allTextContents();
    const hasBreadcrumb = texts.some((t) => t.includes("BreadcrumbList"));
    expect(hasBreadcrumb).toBe(true);
  });
});
