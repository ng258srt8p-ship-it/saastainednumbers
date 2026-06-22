import { test, expect } from "@playwright/test";
import { BASE, MOBILE } from "./helpers";

test.describe("Pricing page", () => {
  test("pricing page returns 200", async ({ page }) => {
    const resp = await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
  });

  test("title contains 'Free' or equivalent", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const title = await page.title();
    expect(title.toLowerCase()).toContain("free");
  });

  test("$0 price is displayed", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const price = page.getByText("$0");
    await expect(price).toBeVisible();
  });

  test("'Forever' text is visible", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const forever = page.getByText(/forever/i);
    await expect(forever.first()).toBeVisible();
  });

  test("feature list has at least 4 items with checkmarks", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    // Features are in a role="list" with checkmark SVG icons
    const featureList = page.locator('[role="list"]');
    await expect(featureList.first()).toBeVisible();
    const items = featureList.first().locator("li");
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("CTA button links to /calculators", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const cta = page.getByRole("link", { name: /browse calculators/i }).or(
      page.locator('a[href="/calculators"]').first()
    );
    await expect(cta.first()).toBeVisible();
    const href = await cta.first().getAttribute("href");
    expect(href).toContain("/calculators");
  });

  test("FAQ section exists with at least 3 questions", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    // FAQ items use <details> elements
    const details = page.locator("details");
    const count = await details.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("FAQ accordion expands on click", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const firstFaq = page.locator("details").first();
    const summary = firstFaq.locator("summary");
    // Initially the details should not be open
    const isOpen = await firstFaq.getAttribute("open");
    expect(isOpen).toBeNull();
    // Click to expand
    await summary.click();
    await page.waitForTimeout(300);
    const isOpenAfter = await firstFaq.getAttribute("open");
    expect(isOpenAfter).not.toBeNull();
  });

  test("FAQ accordion collapses on second click", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const firstFaq = page.locator("details").first();
    const summary = firstFaq.locator("summary");
    // Open it
    await summary.click();
    await page.waitForTimeout(300);
    expect(await firstFaq.getAttribute("open")).not.toBeNull();
    // Close it
    await summary.click();
    await page.waitForTimeout(300);
    expect(await firstFaq.getAttribute("open")).toBeNull();
  });

  test("no 'Contact Us' link on pricing page", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const contactLink = page.getByRole("link", { name: /contact us/i });
    await expect(contactLink).toHaveCount(0);
  });

  test("meta description exists", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content");
    const content = await desc.getAttribute("content");
    expect(content?.length).toBeGreaterThan(0);
  });

  test("canonical URL exists", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href");
    const href = await canonical.getAttribute("href");
    expect(href).toContain("pricing");
  });

  test("mobile: pricing page renders at 390px viewport", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    // Price should still be visible on mobile
    const price = page.getByText("$0");
    await expect(price).toBeVisible();
  });

  test("cross-locale: /es/pricing loads", async ({ page }) => {
    const resp = await page.goto(`${BASE}/es/pricing`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
    // Page should have content (price or heading)
    const body = await page.locator("body").textContent();
    expect(body?.length).toBeGreaterThan(0);
  });
});
