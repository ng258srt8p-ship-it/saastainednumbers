import { test, expect } from "@playwright/test";

const LOCALES = ["es", "de", "pt", "fr", "ja"] as const;
const SAMPLE_CALC = "mrr-calculator";
const SAMPLE_CAT = "revenue";

test.describe("Locale-prefixed calculator pages", () => {
  for (const locale of LOCALES) {
    test(`/${locale}/${SAMPLE_CAT}/${SAMPLE_CALC} returns 200`, async ({ page }) => {
      const resp = await page.goto(`/${locale}/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "networkidle" });
      expect(resp?.status()).toBe(200);
    });

    test(`/${locale}/${SAMPLE_CAT}/${SAMPLE_CALC} has correct lang attribute`, async ({ page }) => {
      await page.goto(`/${locale}/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "networkidle" });
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });
  }

  test("content differs between English and Spanish", async ({ page }) => {
    await page.goto(`/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "networkidle" });
    const enH1 = await page.locator("h1").textContent();

    await page.goto(`/es/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "networkidle" });
    const esH1 = await page.locator("h1").textContent();

    expect(esH1).not.toBe(enH1);
  });

  test("content differs between English and Japanese", async ({ page }) => {
    await page.goto(`/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "networkidle" });
    const enH1 = await page.locator("h1").textContent();

    await page.goto(`/ja/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "networkidle" });
    const jaH1 = await page.locator("h1").textContent();

    expect(jaH1).not.toBe(enH1);
  });
});

test.describe("Locale-prefixed category pages", () => {
  for (const locale of LOCALES) {
    test(`/${locale}/${SAMPLE_CAT} returns 200`, async ({ page }) => {
      const resp = await page.goto(`/${locale}/${SAMPLE_CAT}`, { waitUntil: "networkidle" });
      expect(resp?.status()).toBe(200);
    });

    test(`/${locale}/${SAMPLE_CAT} has correct lang`, async ({ page }) => {
      await page.goto(`/${locale}/${SAMPLE_CAT}`, { waitUntil: "networkidle" });
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });
  }

  test("category page title differs between English and German", async ({ page }) => {
    await page.goto(`/${SAMPLE_CAT}`, { waitUntil: "networkidle" });
    const enTitle = await page.title();

    await page.goto(`/de/${SAMPLE_CAT}`, { waitUntil: "networkidle" });
    const deTitle = await page.title();

    expect(deTitle).not.toBe(enTitle);
  });
});

test.describe("Locale-prefixed blog pages", () => {
  for (const locale of LOCALES) {
    test(`/${locale}/blog returns 200`, async ({ page }) => {
      const resp = await page.goto(`/${locale}/blog`, { waitUntil: "networkidle" });
      expect(resp?.status()).toBe(200);
    });
  }
});

test.describe("Locale-prefixed dashboard", () => {
  for (const locale of LOCALES) {
    test(`/${locale}/dashboard returns 200`, async ({ page }) => {
      const resp = await page.goto(`/${locale}/dashboard`, { waitUntil: "networkidle" });
      expect(resp?.status()).toBe(200);
    });
  }
});

test.describe("Locale-prefixed embed routes", () => {
  for (const locale of LOCALES) {
    test(`/${locale}/embed/${SAMPLE_CALC} returns 200`, async ({ page }) => {
      const resp = await page.goto(`/${locale}/embed/${SAMPLE_CALC}`, { waitUntil: "networkidle" });
      expect(resp?.status()).toBe(200);
    });
  }
});

test.describe("LocaleSwitcher on locale-prefixed pages", () => {
  for (const locale of LOCALES) {
    test(`shows ${locale.toUpperCase()} in switcher on /${locale}/ page`, async ({ page }) => {
      await page.goto(`/${locale}/${SAMPLE_CAT}/${SAMPLE_CALC}`, { waitUntil: "networkidle" });
      await expect(page.locator('[aria-label="Select language"]')).toContainText(locale.toUpperCase());
    });
  }
});

test.describe("Cross-locale navigation", () => {
  test("navigating from /es to /fr changes lang", async ({ page }) => {
    await page.goto("/es/revenue/mrr-calculator", { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await page.goto("/fr/revenue/mrr-calculator", { waitUntil: "networkidle" });
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
        const resp = await page.goto(url, { waitUntil: "networkidle" });
        expect(resp?.status()).toBe(200);
      });
    }
  }
});
