import { test, expect } from "@playwright/test";
import { BASE } from "./helpers";

const GA_MEASUREMENT_ID = "G-BHDH2PETBK";

// GA4 (and all third-party scripts) load ONLY after cookie consent
// (components/ConsentScripts.tsx). Seed consent before navigation so these
// tests exercise the post-consent path.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("cookie-consent", "accepted");
    } catch {
      /* ignore */
    }
  });
});

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
    const gtagScript = page.locator('script[src*="googletagmanager.com/gtag/js"]');
    await expect(gtagScript).toBeAttached();
  });

  test("window.dataLayer exists on calculator page", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect
      .poll(async () =>
        page.evaluate(() => Array.isArray((window as { dataLayer?: unknown }).dataLayer))
      )
      .toBe(true);
  });

  test("window.gtag exists on calculator page", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect
      .poll(async () =>
        page.evaluate(() => typeof (window as { gtag?: unknown }).gtag === "function")
      )
      .toBe(true);
  });

  test("embed page has GA4 script", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    const gtagScript = page.locator('script[src*="googletagmanager.com/gtag/js"]');
    await expect(gtagScript).toBeAttached();
  });

  test("blog page has GA4 script", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const gtagScript = page.locator('script[src*="googletagmanager.com/gtag/js"]');
    await expect(gtagScript).toBeAttached();
  });

  test("pricing page has GA4 script", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const gtagScript = page.locator('script[src*="googletagmanager.com/gtag/js"]');
    await expect(gtagScript).toBeAttached();
  });

  test("calculator page has no duplicate GA4 scripts", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const scripts = page.locator('script[src*="googletagmanager.com/gtag/js"]');
    await expect(scripts).toHaveCount(1);
  });

  test("homepage has no duplicate GA4 scripts", async ({ page }) => {
    await page.goto(`${BASE}`, { waitUntil: "load" });
    const scripts = page.locator('script[src*="googletagmanager.com/gtag/js"]');
    await expect(scripts).toHaveCount(1);
  });

  test("embed page has no duplicate GA4 scripts", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    const scripts = page.locator('script[src*="googletagmanager.com/gtag/js"]');
    await expect(scripts).toHaveCount(1);
  });

  test("blog page has no duplicate GA4 scripts", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    const scripts = page.locator('script[src*="googletagmanager.com/gtag/js"]');
    await expect(scripts).toHaveCount(1);
  });

  test("pricing page has no duplicate GA4 scripts", async ({ page }) => {
    await page.goto(`${BASE}`, { waitUntil: "load" });
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    const scripts = page.locator('script[src*="googletagmanager.com/gtag/js"]');
    await expect(scripts).toHaveCount(1);
  });

  test("GA4 config event fires on calculator page load", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect
      .poll(async () =>
        page.evaluate(
          (id) =>
            (
              (window as { dataLayer?: Array<Record<string, unknown>> }).dataLayer ?? []
            ).some((entry) => entry[0] === "config" && entry[1] === id),
          GA_MEASUREMENT_ID
        )
      )
      .toBe(true);
  });

  test("window.dataLayer and window.gtag are accessible globally on homepage", async ({
    page,
  }) => {
    await page.goto(`${BASE}`, { waitUntil: "load" });
    await expect
      .poll(async () =>
        page.evaluate(() => ({
          dataLayer: Array.isArray((window as { dataLayer?: unknown }).dataLayer),
          gtag: typeof (window as { gtag?: unknown }).gtag === "function",
        }))
      )
      .toEqual({ dataLayer: true, gtag: true });
  });
});
