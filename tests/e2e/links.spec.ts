import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test("all links on homepage return 200", async ({ page }) => {
  const resp = await page.goto(BASE, { waitUntil: "networkidle" });
  expect(resp?.status()).toBe(200);
  const links = await page.locator("a").all();
  const hrefs = await Promise.all(links.map((l) => l.getAttribute("href")));
  const unique = [...new Set(hrefs.filter(Boolean) as string[])];
  for (const href of unique) {
    if (href.startsWith("/")) {
      const r = await page.goto(`${BASE}${href}`, { waitUntil: "networkidle" });
      expect(r?.status()).toBe(200);
    }
  }
});

test("all calculator pages return 200", async ({ page }) => {
  const resp = await page.goto(BASE, { waitUntil: "networkidle" });
  expect(resp?.status()).toBe(200);
  const calcLinks = page.locator('a[href*="/revenue/"], a[href*="/growth-efficiency/"], a[href*="/churn-retention/"], a[href*="/unit-economics/"]');
  const hrefs = await calcLinks.evaluateAll((links) =>
    links.map((l) => (l as HTMLAnchorElement).href)
  );
  for (const href of hrefs) {
    const r = await page.goto(href, { waitUntil: "networkidle" });
    expect(r?.status()).toBe(200);
  }
});

test("all embed pages return 200", async ({ page }) => {
  const resp = await page.goto(BASE, { waitUntil: "networkidle" });
  expect(resp?.status()).toBe(200);
  const embedLinks = page.locator('a[href*="/embed/"]');
  const hrefs = await embedLinks.evaluateAll((links) =>
    links.map((l) => (l as HTMLAnchorElement).href)
  );
  for (const href of hrefs) {
    const r = await page.goto(href, { waitUntil: "networkidle" });
    expect(r?.status()).toBe(200);
  }
});

test("all category pages return 200 (including empty categories)", async ({ page }) => {
  for (const cat of ["revenue", "unit-economics", "churn-retention", "growth-efficiency"]) {
    const r = await page.goto(`${BASE}/${cat}`, { waitUntil: "networkidle" });
    expect(r?.status()).toBe(200);
  }
});

test("static pages return 200", async ({ page }) => {
  for (const path of ["/blog", "/dashboard", "/request-calculator"]) {
    const r = await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    expect(r?.status()).toBe(200);
  }
});

test("unknown calculator slug shows not-found content", async ({ page }) => {
  await page.goto(`${BASE}/revenue/nonexistent-calc`, { waitUntil: "networkidle" });
  await expect(page.locator("text=Calculator Not Found")).toBeVisible();
});
