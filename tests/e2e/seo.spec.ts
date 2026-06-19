import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Robots.txt", () => {
  test("robots.txt returns 200", async ({ page }) => {
    const resp = await page.goto(`${BASE}/robots.txt`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
  });

  test("robots.txt contains expected directives", async ({ page }) => {
    const resp = await page.goto(`${BASE}/robots.txt`, { waitUntil: "load" });
    const text = await resp?.text();
    expect(text).toContain("User-Agent: *");
    expect(text).toContain("Allow: /");
    expect(text).toContain("Sitemap");
  });
});

test.describe("Sitemap", () => {
  test("sitemap.xml returns 200", async ({ page }) => {
    const resp = await page.goto(`${BASE}/sitemap.xml`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
  });

  test("sitemap.xml is valid XML with URLs", async ({ page }) => {
    const resp = await page.goto(`${BASE}/sitemap.xml`, { waitUntil: "load" });
    const text = await resp?.text();
    expect(text).toContain("<?xml");
    expect(text).toContain("<urlset");
    expect(text).toContain("<loc>");
    expect(text).toContain("</urlset>");
  });

  test("sitemap contains homepage URL", async ({ page }) => {
    const resp = await page.goto(`${BASE}/sitemap.xml`, { waitUntil: "load" });
    const text = await resp?.text();
    expect(text).toContain("saastainednumbers.com");
  });

  test("sitemap contains calculator URLs", async ({ page }) => {
    const resp = await page.goto(`${BASE}/sitemap.xml`, { waitUntil: "load" });
    const text = await resp?.text();
    expect(text).toContain("mrr-calculator");
    expect(text).toContain("cac-calculator");
    expect(text).toContain("churn-calculator");
  });
});

test.describe("Page Titles", () => {
  const pages = [
    { path: "/", titleIncludes: "SaaStainedNumbers" },
    { path: "/calculators", titleIncludes: "Calculator" },
    { path: "/pricing", titleIncludes: "Free" },
    { path: "/blog", titleIncludes: "Blog" },
    { path: "/revenue", titleIncludes: "Revenue" },
    { path: "/revenue/mrr-calculator", titleIncludes: "MRR" },
    { path: "/growth-efficiency/cac-calculator", titleIncludes: "CAC" },
  ];

  for (const { path, titleIncludes } of pages) {
    test(`${path} has correct page title`, async ({ page }) => {
      const resp = await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).toContain(titleIncludes);
    });
  }
});

test.describe("Meta Description", () => {
  const pages = [
    "/", "/calculators", "/pricing", "/dashboard",
    "/revenue", "/revenue/mrr-calculator",
    "/growth-efficiency/cac-calculator",
    "/personal-finance/fire-calculator",
  ];

  for (const path of pages) {
    test(`${path} has meta description`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      const desc = page.locator('meta[name="description"]');
      await expect(desc).toHaveAttribute("content");
      const content = await desc.getAttribute("content");
      expect(content?.length).toBeGreaterThan(0);
    });
  }
});

test.describe("Open Graph Tags", () => {
  const pages = [
    "/", "/revenue/mrr-calculator", "/blog",
    "/pricing", "/dashboard",
  ];

  for (const path of pages) {
    test(`${path} has og:title`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      const og = page.locator('meta[property="og:title"]');
      await expect(og).toHaveAttribute("content");
    });

    test(`${path} has og:description`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      const og = page.locator('meta[property="og:description"]');
      await expect(og).toHaveAttribute("content");
    });

    test(`${path} has og:type`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      const og = page.locator('meta[property="og:type"]');
      await expect(og).toHaveAttribute("content", "website");
    });
  }
});

test.describe("Canonical URL", () => {
  const pages = [
    "/", "/revenue", "/revenue/mrr-calculator",
    "/blog", "/dashboard", "/pricing",
  ];

  for (const path of pages) {
    test(`${path} has canonical URL`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute("href");
      const href = await canonical.getAttribute("href");
      expect(href).toContain("saastainednumbers.com");
    });
  }
});

test.describe("JSON-LD Structured Data", () => {
  test("homepage has JSON-LD", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const jsonld = page.locator('script[type="application/ld+json"]');
    const count = await jsonld.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("calculator page has JSON-LD for WebApplication", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const jsonld = page.locator('script[type="application/ld+json"]');
    const texts = await jsonld.allTextContents();
    const hasWebApp = texts.some((t) => t.includes("WebApplication"));
    expect(hasWebApp).toBe(true);
  });
});

test.describe("Noindex and Robots Meta", () => {
  test("homepage is indexable", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const robots = page.locator('meta[name="robots"]');
    const content = await robots.getAttribute("content");
    if (content) {
      expect(content).not.toContain("noindex");
    }
  });
});
