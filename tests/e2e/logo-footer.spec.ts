import { test, expect } from "@playwright/test";
import { BASE, MOBILE, toggleDarkMode } from "./helpers";

test.describe("Logo - Desktop", () => {
  test("logo is visible in nav header", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    const logo = page.locator("header a").filter({ has: page.locator("img[src*='logo'], img[alt*='logo' i]") }).first();
    // Fallback to SVG or text logo
    const logoImg = page.locator("img[src*='logo'], img[alt*='logo' i]").first();
    const logoText = page.locator("header a").filter({ hasText: /SaaStainedNumbers|WebCalc|LOGO/i }).first();
    await expect(logoImg.or(logoText).first()).toBeVisible();
  });

  test("logo link navigates to home", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const logoLink = page.locator("header a[href='/']").first();
    await logoLink.click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/^(http:\/\/localhost:3000)?\/$/);
  });
});

test.describe("Footer Links", () => {
  test("footer is visible on home page", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("footer contains at least 5 links", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    const links = page.locator("footer a");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("footer has SaaStainedNumbers copyright text", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    const footer = page.locator("footer");
    await expect(footer).toContainText(/SaaStainedNumbers|Inc\./i);
  });

  test("footer Privacy link goes to /privacy", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    const privacyLink = page.locator('footer a').filter({ hasText: /Privacy/i }).first();
    await expect(privacyLink).toBeVisible();
    const href = await privacyLink.getAttribute("href");
    expect(href).toContain("/privacy");
  });

  test("footer Terms link goes to /terms", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    const termsLink = page.locator('footer a').filter({ hasText: /Terms/i }).first();
    await expect(termsLink).toBeVisible();
    const href = await termsLink.getAttribute("href");
    expect(href).toContain("/terms");
  });

  test("footer Contact link goes to /contact", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    const contactLink = page.locator('footer a').filter({ hasText: /Contact/i }).first();
    await expect(contactLink).toBeVisible();
    const href = await contactLink.getAttribute("href");
    expect(href).toContain("/contact");
  });

  test("footer links work on calculator pages too", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    const links = footer.locator("a");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});

test.describe("Footer - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("footer visible on mobile viewport", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });
});

test.describe("Footer - Dark Mode", () => {
  test("footer visible in dark mode", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    await toggleDarkMode(page, "dark");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await toggleDarkMode(page, "light");
  });
});
