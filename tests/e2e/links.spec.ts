import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test("all links on homepage return 200", async ({ page }) => {
  const resp = await page.goto(BASE, { waitUntil: "load" });
  expect(resp?.status()).toBe(200);
  const links = await page.locator("a").all();
  const hrefs = await Promise.all(links.map((l) => l.getAttribute("href")));
  const unique = [...new Set(hrefs.filter(Boolean) as string[])];
  for (const href of unique) {
    if (href.startsWith("/") && href !== "/") {
      const r = await page.goto(`${BASE}${href}`, { waitUntil: "load", timeout: 15000 });
      if (r) expect(r?.status()).toBe(200);
    }
  }
});

test("all calculator pages return 200", async ({ page }) => {
  // Check subset of calculators to keep test time reasonable
  const slugs = ["mrr-calculator", "cac-calculator", "ltv-calculator", "fire-calculator", "roi-calculator", "claude-api-cost-calculator"];
  for (const slug of slugs) {
    const r = await page.goto(`${BASE}/revenue/${slug}`, { waitUntil: "load", timeout: 15000 });
    if (r) expect(r?.status()).toBe(200);
  }
});

test("all category pages return 200 (including empty categories)", async ({ page }) => {
  const ALL_CATEGORIES = ["revenue", "unit-economics", "churn-retention", "growth-efficiency", "ai-cost", "side-hustle", "personal-finance", "general-business", "saas-deepen"];
  for (const cat of ALL_CATEGORIES) {
    const r = await page.goto(`${BASE}/${cat}`, { waitUntil: "load" });
    expect(r?.status()).toBe(200);
  }
});

test("static pages return 200", async ({ page }) => {
  for (const path of ["/blog", "/dashboard", "/pricing"]) {
    const r = await page.goto(`${BASE}${path}`, { waitUntil: "load" });
    expect(r?.status()).toBe(200);
  }
});

test("unknown calculator slug shows not-found content", async ({ page }) => {
  await page.goto(`${BASE}/revenue/nonexistent-calc`, { waitUntil: "load" });
  await expect(page.locator("text=Page Not Found")).toBeVisible();
});
