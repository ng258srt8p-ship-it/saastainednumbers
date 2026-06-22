import { test, expect } from "@playwright/test";
import { BASE } from "./helpers";

const GA_MEASUREMENT_ID = "G-BHDH2PETBK";

test.describe("GA4 analytics integration", () => {
  test("calculator page has GA4 gtag script", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const gtagScript = page.locator(
      `script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`
    );
    await expect(gtagScript).toBeAttached();
  });

  test("homepage has GA4 script", async ({ page }) => {
    await page.goto(`${BASE}`, { waitUntil: "load" });
    const gtagScript = page.locator(
      'script[src*="googletagmanager.com/gtag/js"]'
    );
    await expect(gtagScript).toBeAttached();
  });

  test("window.dataLayer exists on calculator page", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const hasDataLayer = await page.evaluate(() => {
      const w = window as unknown as { dataLayer?: unknown };
      return Array.isArray(w.dataLayer);
    });
    expect(hasDataLayer).toBe(true);
  });

  test("window.gtag exists on calculator page", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const hasGtag = await page.evaluate(() => {
      const w = window as unknown as { gtag?: unknown };
      return typeof w.gtag === "function";
    });
    expect(hasGtag).toBe(true);
  });

  test("embed page has GA4 script", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    const gtagScript = page.locator(
      'script[src*="googletagmanager.com/gtag/js"]'
    );
    await expect(gtagScript).toBeAttached();
  });

  test("blog page has GA4 script", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const gtagScript = page.locator(
      'script[src*="googletagmanager.com/gtag/js"]'
    );
    await expect(gtagScript).toBeAttached();
  });

  test("pricing page has GA4 script", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const gtagScript = page.locator(
      'script[src*="googletagmanager.com/gtag/js"]'
    );
    await expect(gtagScript).toBeAttached();
  });

  test("calculator page has no duplicate GA4 scripts", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const scripts = page.locator(
      'script[src*="googletagmanager.com/gtag/js"]'
    );
    const count = await scripts.count();
    expect(count).toBe(1);
  });

  test("homepage has no duplicate GA4 scripts", async ({ page }) => {
    await page.goto(`${BASE}`, { waitUntil: "load" });
    const scripts = page.locator(
      'script[src*="googletagmanager.com/gtag/js"]'
    );
    const count = await scripts.count();
    expect(count).toBe(1);
  });

  test("embed page has no duplicate GA4 scripts", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    const scripts = page.locator(
      'script[src*="googletagmanager.com/gtag/js"]'
    );
    const count = await scripts.count();
    expect(count).toBe(1);
  });

  test("blog page has no duplicate GA4 scripts", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const scripts = page.locator(
      'script[src*="googletagmanager.com/gtag/js"]'
    );
    const count = await scripts.count();
    expect(count).toBe(1);
  });

  test("pricing page has no duplicate GA4 scripts", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const scripts = page.locator(
      'script[src*="googletagmanager.com/gtag/js"]'
    );
    const count = await scripts.count();
    expect(count).toBe(1);
  });

  test("GA4 config event fires on calculator page load", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const configFired = await page.evaluate(() => {
      const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      return w.dataLayer?.some(
        (entry) =>
          entry[0] === "config" && entry[1] === GA_MEASUREMENT_ID
      );
    });
    expect(configFired).toBe(true);
  });

  test("window.dataLayer and window.gtag are accessible globally on homepage", async ({ page }) => {
    await page.goto(`${BASE}`, { waitUntil: "load" });
    const globals = await page.evaluate(() => {
      const w = window as unknown as { dataLayer?: unknown; gtag?: unknown };
      return {
        dataLayer: Array.isArray(w.dataLayer),
        gtag: typeof w.gtag === "function",
      };
    });
    expect(globals.dataLayer).toBe(true);
    expect(globals.gtag).toBe(true);
  });
});
