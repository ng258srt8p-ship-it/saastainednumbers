import { test, expect } from "@playwright/test";

const LOCALES = ["es", "de", "pt", "fr", "ja"] as const;
const SAMPLE_CALC = "mrr-calculator";
const SAMPLE_CAT = "revenue";

test.describe("Locale-prefixed calculator pages", () => {
  for (const locale of LOCALES) {
    test(`/${locale}/${SAMPLE_CAT}/${SAMPLE_CALC} returns 200`, async ({ page }) => {
      const resp = await page.goto(`/${locale}/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
    });

    test(`/${locale}/${SAMPLE_CAT}/${SAMPLE_CALC} has correct lang attribute`, async ({ page }) => {
      await page.goto(`/${locale}/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "load" });
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });
  }

  test("html lang differs between English and Spanish", async ({ page }) => {
    await page.goto(`/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "load" });
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.goto(`/es/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "load" });
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });

  test("html lang differs between English and Japanese", async ({ page }) => {
    await page.goto(`/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "load" });
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.goto(`/ja/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "load" });
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  });
});

test.describe("Locale-prefixed category pages", () => {
  for (const locale of LOCALES) {
    test(`/${locale}/${SAMPLE_CAT} returns 200`, async ({ page }) => {
      const resp = await page.goto(`/${locale}/${SAMPLE_CAT}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
    });

    test(`/${locale}/${SAMPLE_CAT} has correct lang`, async ({ page }) => {
      await page.goto(`/${locale}/${SAMPLE_CAT}`, { waitUntil: "load" });
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });
  }

  test("category page title differs between English and German", async ({ page }) => {
    await page.goto(`/${SAMPLE_CAT}`, { waitUntil: "load" });
    const enTitle = await page.title();

    await page.goto(`/de/${SAMPLE_CAT}`, { waitUntil: "load" });
    const deTitle = await page.title();

    expect(deTitle).not.toBe(enTitle);
  });
});

test.describe("Locale-prefixed blog pages", () => {
  for (const locale of LOCALES) {
    test(`/${locale}/blog returns 200`, async ({ page }) => {
      const resp = await page.goto(`/${locale}/blog`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
    });
  }
});

test.describe("Locale-prefixed dashboard", () => {
  for (const locale of LOCALES) {
    test(`/${locale}/dashboard returns 200`, async ({ page }) => {
      const resp = await page.goto(`/${locale}/dashboard`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
    });
  }
});

test.describe("Locale-prefixed embed routes", () => {
  for (const locale of LOCALES) {
    test(`/${locale}/embed/${SAMPLE_CALC} returns 200`, async ({ page }) => {
      const resp = await page.goto(`/${locale}/embed/${SAMPLE_CALC}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
    });
  }
});

test.describe("LocaleSwitcher on locale-prefixed pages", () => {
  for (const locale of LOCALES) {
    test(`locale switcher visible on /${locale}/ page`, async ({ page }) => {
      await page.goto(`/${locale}/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "load" });
      const switcher = page.locator('[aria-label="Select language"]');
      await expect(switcher).toBeAttached();
    });
  }
});

test.describe("Cross-locale navigation", () => {
  test("navigating from /es to /fr changes lang", async ({ page }) => {
    await page.goto("/es/revenue/mrr-calculator", { waitUntil: "load" });
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await page.goto("/fr/revenue/mrr-calculator", { waitUntil: "load" });
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  });
});

test.describe("No 404s for non-English locales on key pages", () => {
  const PAGES = [
    "/", "/calculators", "/pricing", "/legal",
    "/revenue", "/unit-economics", "/growth-efficiency",
    "/churn-retention", "/ai-cost", "/side-hustle",
    "/personal-finance", "/general-business", "/saas-deepen",
  ];

  for (const locale of LOCALES) {
    for (const pagePath of PAGES) {
      test(`/${locale}${pagePath} returns 200`, async ({ page }) => {
        const url = pagePath === "/" ? `/${locale}` : `/${locale}${pagePath}`;
        const resp = await page.goto(url, { waitUntil: "load" });
        expect(resp?.status()).toBe(200);
      });
    }
  }
});
