import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Pricing Page", () => {
  test("pricing page returns 200", async ({ page }) => {
    const resp = await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
  });

  test("pricing page has correct title", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const title = await page.title();
    expect(title).toContain("Everything Free");
  });

  test("pricing page has meta description", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content");
  });

  test("heading shows everything is free", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text?.toLowerCase()).toContain("free");
  });

  test("price shows $0 or equivalent", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const price = page.locator("p.font-numbers").or(page.locator("text=$0"));
    await expect(price.first()).toBeVisible();
  });

  test("forever label is present", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    await expect(page.locator("text=forever").or(page.locator("text=Forever")).first()).toBeVisible();
  });

  test("feature list renders multiple items", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const ul = page.locator("ul").filter({ has: page.locator("li") });
    const items = await ul.locator("li").count();
    expect(items).toBeGreaterThanOrEqual(3);
  });

  test("feature items have checkmarks", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const checkmarks = page.locator("li svg").or(page.locator("ul li").filter({ has: page.locator("text=✓") }));
    const count = await checkmarks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("CTA button links to /calculators", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const cta = page.locator("a[href='/calculators']").or(
      page.locator("a").filter({ hasText: /calculator|browse/i })
    );
    await expect(cta.first()).toBeVisible();
  });

  test("CTA button has gradient styling", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const cta = page.locator("a[href='/calculators']").first();
    if (await cta.isVisible()) {
      const bg = await cta.getAttribute("class");
      expect(bg).toMatch(/bg-gradient|brand/);
    }
  });

  test("pricing page has canonical URL", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href");
  });
});
