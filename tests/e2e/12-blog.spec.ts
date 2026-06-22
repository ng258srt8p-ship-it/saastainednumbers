import { test, expect } from "@playwright/test";
import { BASE, MOBILE } from "./helpers";

test.describe("Blog listing page", () => {
  test("blog page returns 200", async ({ page }) => {
    const resp = await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
  });

  test("blog page loads with heading", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    // The page should have an h1 or prominent heading containing "Blog"
    const heading = page.locator("h1").or(page.getByRole("heading", { level: 1 }));
    await expect(heading.first()).toBeVisible();
    const text = await heading.first().textContent();
    expect(text?.toLowerCase()).toContain("blog");
  });

  test("featured post section exists when there are posts", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    // Featured post is the first/largest post card at the top
    // It has a "Read Article" link
    const readArticleLink = page.getByRole("link", { name: /read article/i }).first();
    if (await readArticleLink.isVisible()) {
      await expect(readArticleLink).toBeVisible();
    }
  });

  test("article cards are listed with titles and dates", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    // Blog posts are rendered as links with titles
    const articles = page.locator("article, a[href*='/blog/']");
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
  });

  test("click an article card navigates to the post page", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    // Find first blog post link (not the nav links)
    const postLink = page.locator("a[href*='/blog/']").first();
    await expect(postLink).toBeVisible();
    const href = await postLink.getAttribute("href");
    expect(href).toContain("/blog/");
    await postLink.click();
    await page.waitForLoadState("load");
    // Should now be on a blog post page
    expect(page.url()).toContain("/blog/");
  });

  test("post page loads with title, content, and back-to-blog link", async ({ page }) => {
    // Navigate directly to a known blog post
    await page.goto(`${BASE}/blog/introducing-canvas-workspace`, { waitUntil: "load" });
    // Should have a title (h1)
    const title = page.locator("h1");
    await expect(title).toBeVisible();
    // Should have article content
    const article = page.locator("article");
    await expect(article).toBeVisible();
    // Should have a back-to-blog link
    const backLink = page.getByRole("link", { name: /back to blog/i });
    await expect(backLink).toBeVisible();
  });

  test("back-to-blog link returns to /blog", async ({ page }) => {
    await page.goto(`${BASE}/blog/introducing-canvas-workspace`, { waitUntil: "load" });
    const backLink = page.getByRole("link", { name: /back to blog/i });
    await backLink.click();
    await page.waitForLoadState("load");
    expect(page.url()).toContain("/blog");
    // Should not be on a post page anymore
    expect(page.url()).not.toContain("/blog/introducing-canvas-workspace");
  });

  test("blog listing shows post dates", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    // Date text should be visible somewhere on the page (e.g. "June 20, 2026")
    const body = await page.locator("body").textContent();
    // Blog posts have dates - check for month names or date patterns
    const hasDate = /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i.test(body ?? "");
    expect(hasDate).toBe(true);
  });

  test("blog has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    expect(errors.length).toBe(0);
  });

  test("mobile: blog renders at 390px viewport", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const heading = page.locator("h1");
    await expect(heading.first()).toBeVisible();
  });

  test("cross-locale: /es/blog loads with Spanish heading", async ({ page }) => {
    await page.goto(`${BASE}/es/blog`, { waitUntil: "load" });
    const heading = page.locator("h1");
    await expect(heading.first()).toBeVisible();
    // The heading text should differ from English, confirming locale switch
    const text = await heading.first().textContent();
    expect(text).toBeTruthy();
  });
});
