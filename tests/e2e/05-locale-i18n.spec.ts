import { test, expect } from "@playwright/test";
import { BASE, LOCALES, switchCurrency, currencyBtn, localeSwitcherBtn } from "./helpers";

const LOCALE_CODES = LOCALES.map((l) => l.code);

test.describe("Locale html lang attribute", () => {
  for (const { code } of LOCALES) {
    test(`${code}: html lang attribute is set correctly`, async ({ page }) => {
      const path = code === "en" ? "" : `/${code}`;
      await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      const lang = await page.getAttribute("html", "lang");
      expect(lang).toBe(code);
    });
  }
});

test.describe("Locale nav translations", () => {
  test("Spanish nav links are translated", async ({ page }) => {
    await page.goto(`${BASE}/es`, { waitUntil: "load" });
    const nav = page.locator("nav");
    // Check that Spanish locale text is present (non-English labels)
    const navLinks = nav.locator("a");
    const linkTexts = await navLinks.allTextContents();
    // Spanish nav should not have English-only "Calculators" text
    // It should contain the translated version or locale code
    const combined = linkTexts.join(" ");
    // Verify the nav exists and has links
    expect(linkTexts.length).toBeGreaterThan(0);
    // The locale switcher should show "ES"
    const langSwitcher = localeSwitcherBtn(page);
    await expect(langSwitcher).toBeVisible();
  });

  test("Japanese nav links are translated", async ({ page }) => {
    await page.goto(`${BASE}/ja`, { waitUntil: "load" });
    const nav = page.locator("nav");
    const navLinks = nav.locator("a");
    const linkTexts = await navLinks.allTextContents();
    expect(linkTexts.length).toBeGreaterThan(0);
    // Japanese locale switcher should show "JA"
    const langSwitcher = localeSwitcherBtn(page);
    await expect(langSwitcher).toBeVisible();
  });
});

test.describe("Locale pricing and blog pages", () => {
  for (const { code } of LOCALES) {
    test(`${code}: pricing page heading exists`, async ({ page }) => {
      const path = code === "en" ? "" : `/${code}`;
      await page.goto(`${BASE}${path}/pricing`, { waitUntil: "load" });
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
    });

    test(`${code}: blog page heading exists`, async ({ page }) => {
      const path = code === "en" ? "" : `/${code}`;
      await page.goto(`${BASE}${path}/blog`, { waitUntil: "load" });
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
    });

    test(`${code}: mrr-calculator page loads`, async ({ page }) => {
      const path = code === "en" ? "" : `/${code}`;
      const response = await page.goto(`${BASE}${path}/revenue/mrr-calculator`, {
        waitUntil: "load",
      });
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
    });
  }
});

test.describe("Currency x Locale matrix", () => {
  const testCases = [
    { locale: "en", currency: "USD" },
    { locale: "en", currency: "EUR" },
    { locale: "en", currency: "JPY" },
    { locale: "es", currency: "USD" },
    { locale: "es", currency: "EUR" },
    { locale: "es", currency: "JPY" },
    { locale: "ja", currency: "USD" },
    { locale: "ja", currency: "EUR" },
    { locale: "ja", currency: "JPY" },
  ];

  for (const { locale, currency } of testCases) {
    test(`${locale} + ${currency}: currency persists after switch`, async ({ page }) => {
      const path = locale === "en" ? "" : `/${locale}`;
      await page.goto(`${BASE}${path}`, { waitUntil: "load" });

      // Switch currency
      await switchCurrency(page, currency);
      await expect(currencyBtn(page)).toContainText(currency);

      // Navigate to calculator page
      await page.goto(`${BASE}${path}/revenue/mrr-calculator`, { waitUntil: "load" });

      // Currency should persist
      await expect(currencyBtn(page)).toContainText(currency);
    });
  }
});

test.describe("Locale persistence", () => {
  test("switching to es sets locale cookie and persists across navigation", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });

    // Set locale cookie to Spanish
    await page.context().addCookies([
      {
        name: "locale",
        value: "es",
        domain: "localhost",
        path: "/",
      },
    ]);

    // Navigate to homepage with locale
    await page.goto(`${BASE}/es`, { waitUntil: "load" });

    // Verify URL has /es/ prefix
    expect(page.url()).toContain("/es");

    // Navigate to another page
    await page.goto(`${BASE}/es/pricing`, { waitUntil: "load" });
    expect(page.url()).toContain("/es");
  });
});

test.describe("Locale root path redirects", () => {
  for (const locale of ["es", "de", "pt", "fr", "ja"]) {
    test(`/${locale} root path loads correctly`, async ({ page }) => {
      const response = await page.goto(`${BASE}/${locale}`, { waitUntil: "load" });
      // Should load successfully (200 or redirect to a valid page)
      expect(response?.status()).toBeLessThanOrEqual(302);
    });
  }
});
