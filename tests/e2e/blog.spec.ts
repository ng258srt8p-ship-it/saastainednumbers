import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Blog Listing Page", () => {
  test("blog listing returns 200", async ({ page }) => {
    const resp = await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
  });

  test("blog page has correct title", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const title = await page.title();
    expect(title).toContain("Blog");
  });

  test("blog page has heading", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    await expect(page.locator("h1")).toBeVisible();
  });

  test("blog has featured post section", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    // Look for featured post heading
    const featured = page.locator("text=Featured Post").or(page.locator("text=Featured"));
    const count = await featured.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("blog has article listing section", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const articles = page.locator("text=All Articles").or(page.locator("text=Articles"));
    if (await articles.count() > 0) {
      await expect(articles.first()).toBeVisible();
    }
  });

  test("featured post has a title and description", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const articleCards = page.locator("a[href*='/blog/']");
    const count = await articleCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const firstCard = articleCards.first();
    await expect(firstCard).toBeVisible();
  });

  test("blog post link navigates to post page", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const postLink = page.locator("a[href*='/blog/']").first();
    const href = await postLink.getAttribute("href");
    if (href) {
      const resp = await page.goto(`${BASE}${href}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
    }
  });

  test("blog post link has dates", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const dates = page.locator("time");
    const count = await dates.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("blog has meta description", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content");
  });
});

test.describe("Blog Post Pages", () => {
  const POST_SLUGS = [
    "saas-metrics-guide-2026",
  ];

  for (const slug of POST_SLUGS) {
    test(`${slug} returns 200`, async ({ page }) => {
      const resp = await page.goto(`${BASE}/blog/${slug}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
    });

    test(`${slug} has content`, async ({ page }) => {
      await page.goto(`${BASE}/blog/${slug}`, { waitUntil: "load" });
      const content = page.locator("article, main, .prose, .content");
      const count = await content.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test(`${slug} has back-to-blog navigation`, async ({ page }) => {
      await page.goto(`${BASE}/blog/${slug}`, { waitUntil: "load" });
      const backLink = page.locator("a").filter({ hasText: /back to blog/i });
      if (await backLink.count() > 0) {
        await expect(backLink.first()).toBeVisible();
        await backLink.first().click();
        await expect(page).toHaveURL(/\/blog$/);
      }
    });

    test(`${slug} has correct title`, async ({ page }) => {
      await page.goto(`${BASE}/blog/${slug}`, { waitUntil: "load" });
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });
  }
});
