import { test, expect } from "@playwright/test";
import { BASE } from "./helpers";

test.describe("SEO", () => {
  test("robots.txt returns 200 and contains User-agent", async ({ request }) => {
    const response = await request.get(`${BASE}/robots.txt`);
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("User-agent");
  });

  test("sitemap.xml returns 200 and contains urlset", async ({ request }) => {
    const response = await request.get(`${BASE}/sitemap.xml`);
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("urlset");
  });

  test("homepage has title containing SaaStainedNumbers", async ({ page }) => {
    await page.goto(BASE);
    const title = await page.title();
    expect(title).toContain("SaaStainedNumbers");
  });

  test("homepage has meta description", async ({ page }) => {
    await page.goto(BASE);
    const description = await page.getAttribute('meta[name="description"]', "content");
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(10);
  });

  test("homepage has og:title and og:description", async ({ page }) => {
    await page.goto(BASE);
    const ogTitle = await page.getAttribute('meta[property="og:title"]', "content");
    const ogDescription = await page.getAttribute('meta[property="og:description"]', "content");
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
  });

  test("calculator page has title, meta description, and canonical URL", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(5);

    const description = await page.getAttribute('meta[name="description"]', "content");
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(10);

    const canonical = await page.getAttribute('link[rel="canonical"]', "href");
    expect(canonical).toBeTruthy();
    expect(canonical).toContain("mrr-calculator");
  });

  test("pricing page has title and meta description", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(5);

    const description = await page.getAttribute('meta[name="description"]', "content");
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(10);
  });

  test("blog page has title and meta description", async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(5);

    const description = await page.getAttribute('meta[name="description"]', "content");
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(10);
  });

  test("JSON-LD exists on homepage", async ({ page }) => {
    await page.goto(BASE);
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd.first()).toBeAttached();
    const content = await jsonLd.first().textContent();
    expect(content).toBeTruthy();
    const parsed = JSON.parse(content!);
    expect(parsed).toHaveProperty("@context");
  });

  test("JSON-LD exists on calculator page", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd.first()).toBeAttached();
    const content = await jsonLd.first().textContent();
    expect(content).toBeTruthy();
    const parsed = JSON.parse(content!);
    expect(parsed).toHaveProperty("@context");
  });

  test("homepage does not have noindex in meta robots", async ({ page }) => {
    await page.goto(BASE);
    const robots = await page.getAttribute('meta[name="robots"]', "content");
    // Either no robots tag at all (defaults to index), or not noindex
    if (robots) {
      expect(robots.toLowerCase()).not.toContain("noindex");
    }
  });

  test("calculator page does not have noindex in meta robots", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    const robots = await page.getAttribute('meta[name="robots"]', "content");
    if (robots) {
      expect(robots.toLowerCase()).not.toContain("noindex");
    }
  });

  test("pricing page does not have noindex in meta robots", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    const robots = await page.getAttribute('meta[name="robots"]', "content");
    if (robots) {
      expect(robots.toLowerCase()).not.toContain("noindex");
    }
  });

  test("/about returns 404", async ({ page }) => {
    const response = await page.goto(`${BASE}/about`);
    // For static export, Next.js serves the not-found page with 200
    // but we check the page content shows 404
    const content = await page.textContent("body");
    expect(content).toContain("404");
  });

  test("/contact returns 404", async ({ page }) => {
    const response = await page.goto(`${BASE}/contact`);
    const content = await page.textContent("body");
    expect(content).toContain("404");
  });
});
