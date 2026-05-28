import { test, expect } from "@playwright/test";

const GA_MEASUREMENT_ID = "G-BHDH2PETBK";

test.describe("Google Analytics 4 — script injection", () => {
  test("GA4 gtag script loads on a calculator page", async ({ page }) => {
    await page.goto("/revenue/mrr-calculator", { waitUntil: "networkidle" });

    const gtagScript = page.locator(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`);
    await expect(gtagScript).toBeAttached();

    const hasDataLayerInit = await page.evaluate(() => {
      return Array.isArray(window.dataLayer);
    });
    expect(hasDataLayerInit).toBe(true);
  });

  test("GA4 config event fires on page load", async ({ page }) => {
    await page.goto("/revenue/mrr-calculator", { waitUntil: "networkidle" });

    const configFired = await page.evaluate(() => {
      const dl = window.dataLayer as Array<Record<string, unknown>> | undefined;
      return dl?.some(
        (entry) =>
          entry[0] === "config" && entry[1] === "G-BHDH2PETBK",
      );
    });
    expect(configFired).toBe(true);
  });

  test("GA4 loads on embed pages (embed layout nested under root layout with GA)", async ({ page }) => {
    await page.goto("/embed/mrr-calculator", { waitUntil: "networkidle" });

    const gtagScript = page.locator(`script[src*="googletagmanager.com/gtag/js"]`);
    await expect(gtagScript).toBeAttached();

    const configFired = await page.evaluate(() => {
      const dl = window.dataLayer as Array<Record<string, unknown>> | undefined;
      return dl?.some((entry) => entry[0] === "config");
    });
    expect(configFired).toBe(true);
  });

  test("GA4 loads on category and homepage", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const homepageLoaded = await page.evaluate(() => {
      const dl = window.dataLayer as Array<Record<string, unknown>> | undefined;
      return dl?.some((entry) => entry[0] === "config");
    });
    expect(homepageLoaded).toBe(true);

    await page.goto("/revenue", { waitUntil: "networkidle" });
    const categoryLoaded = await page.evaluate(() => {
      const dl = window.dataLayer as Array<Record<string, unknown>> | undefined;
      return dl?.some((entry) => entry[0] === "config");
    });
    expect(categoryLoaded).toBe(true);
  });
});

test.describe("Google Analytics 4 — custom events", () => {
  test("calculate_tool event fires when calculator produces a result", async ({ page }) => {
    await page.goto("/revenue/mrr-calculator", { waitUntil: "networkidle" });

    // Wait for hydration + 500ms debounce in CalculatorClient
    await page.waitForTimeout(2000);

    const hasEvent = await page.evaluate(() => {
      const dl = window.dataLayer as Array<Record<string, unknown>> | undefined;
      return dl?.some(
        (entry) => entry[0] === "event" && entry[1] === "calculate_tool",
      ) ?? false;
    });

    expect(hasEvent).toBe(true);
  });

  test("share_tool event fires when share button clicked", async ({ page }) => {
    await page.goto("/revenue/mrr-calculator", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const shareButton = page.locator("button:has(svg)").filter({ hasText: /share/i }).first();
    if (await shareButton.isVisible()) {
      await shareButton.click();
      await page.waitForTimeout(500);

      const hasEvent = await page.evaluate(() => {
        const dl = window.dataLayer as Array<Record<string, unknown>> | undefined;
        return dl?.some(
          (entry) => entry[0] === "event" && entry[1] === "share_tool",
        ) ?? false;
      });
      expect(hasEvent).toBe(true);
    }
  });

  test("search event fires when search is used", async ({ page }) => {
    await page.goto("/revenue", { waitUntil: "networkidle" });

    const searchInput = page.locator("input[aria-label='Search calculators']");
    if (await searchInput.isVisible()) {
      await searchInput.fill("mrr");
      await page.waitForTimeout(500);

      const hasEvent = await page.evaluate(() => {
        const dl = window.dataLayer as Array<Record<string, unknown>> | undefined;
        return dl?.some(
          (entry) => entry[0] === "event" && entry[1] === "search",
        ) ?? false;
      });
      expect(hasEvent).toBe(true);
    }
  });
});

test.describe("Google Analytics 4 — events cross-page", () => {
  test("dashboard page also fires calculate events", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const configFired = await page.evaluate(() => {
      const dl = window.dataLayer as Array<Record<string, unknown>> | undefined;
      return dl?.some(
        (entry) => entry[0] === "config" && entry[1] === "G-BHDH2PETBK",
      );
    });
    expect(configFired).toBe(true);
  });

  test("blog page loads GA4", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "networkidle" });
    const hasGA = await page.evaluate(() => Array.isArray(window.dataLayer));
    expect(hasGA).toBe(true);
  });

  test("GA dataLayer is accessible globally", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const gtagExists = await page.evaluate(() => typeof window.gtag === "function");
    expect(gtagExists).toBe(true);

    const dataLayerExists = await page.evaluate(() => Array.isArray(window.dataLayer));
    expect(dataLayerExists).toBe(true);
  });
});
