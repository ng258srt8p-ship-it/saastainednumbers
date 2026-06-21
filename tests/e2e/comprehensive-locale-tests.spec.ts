import { test, expect } from "@playwright/test";
import { BASE, LOCALES, MOBILE, ALL_CURRENCIES, currencyBtn, currencyDropdown, switchCurrency, toggleDarkMode } from "./helpers";

// ─── COMPREHENSIVE LOCALE COVERAGE ─────────────────────────────────────
test.describe("Full Locale Coverage", () => {
  LOCALES.forEach((locale) => {
    test(`[${locale.code}] Home page renders correctly`, async ({ page }) => {
      const prefix = locale.code === "en" ? "" : `/${locale.code}`;
      await page.goto(`${BASE}${prefix}`, { waitUntil: "load" });
      await page.waitForTimeout(1000);

      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", locale.code);

      const footer = page.locator("footer");
      await expect(footer).not.toContainText(`${locale.code}.`);
      await expect(footer).not.toContainText("footer.copyright");
    });

    test(`[${locale.code}] Nav translations match locale`, async ({ page }) => {
      const prefix = locale.code === "en" ? "" : `/${locale.code}`;
      await page.goto(`${BASE}${prefix}`, { waitUntil: "load" });
      await page.waitForTimeout(1000);

      const navText = await page.locator("nav").textContent();
      const navAssertions: Record<string, string[]> = {
        en: ["Calculators", "Pricing", "Blog", "Canvas"],
        es: ["Calculadoras", "Precios"],
        de: ["Rechner", "Preise"],
        pt: ["Calculadoras", "Preços"],
        fr: ["Calculatrices", "Tarifs"],
        ja: ["計算機"],
      };

      for (const term of navAssertions[locale.code]) {
        expect(navText).toContain(term);
      }
    });

    test(`[${locale.code}] Footer renders translated copyright`, async ({ page }) => {
      await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
      await page.waitForTimeout(500);

      const footer = page.locator("footer p");
      const text = await footer.textContent();

      if (locale.code === "en") {
        expect(text).toContain("SaaStainedNumbers");
      } else if (locale.code === "es") {
        expect(text).toContain("Todos los derechos");
      } else if (locale.code === "de") {
        expect(text).toContain("Alle Rechte");
      } else if (locale.code === "pt") {
        expect(text).toContain("Todos os direitos");
      } else if (locale.code === "fr") {
        expect(text).toContain("Tous droits");
      } else if (locale.code === "ja") {
        expect(text).toContain("無断転載");
      }
    });

    test(`[${locale.code}] Currency switcher is present and functional`, async ({ page }) => {
      const prefix = locale.code === "en" ? "" : `/${locale.code}`;
      await page.goto(`${BASE}${prefix}/revenue/mrr-calculator`, { waitUntil: "load" });
      await page.waitForTimeout(500);

      const btn = currencyBtn(page);
      await expect(btn).toBeVisible();
      await btn.click();
      await expect(btn).toHaveAttribute("aria-expanded", "true");
      await btn.click();
      await expect(btn).toHaveAttribute("aria-expanded", "false");
    });
  });
});

// ─── CURRENCY × LOCALE COMBINATIONS (Extended beyond 3) ────────────────
test.describe("Currency × Locale Combinations", () => {
  const testCurrencies = ["EUR", "GBP", "JPY", "BRL", "INR"];
  const localeSubset = [...LOCALES]; // all 6

  localeSubset.forEach((locale) => {
    testCurrencies.forEach((currency) => {
      test(`[${locale.code}][${currency}] Currency can be switched`, async ({ page }) => {
        const prefix = locale.code === "en" ? "" : `/${locale.code}`;
        await page.goto(`${BASE}${prefix}/revenue/mrr-calculator`, { waitUntil: "load" });
        await page.waitForTimeout(500);

        const btn = currencyBtn(page);
        await btn.click();
        await currencyDropdown(page).locator('button[role="option"]', { hasText: currency }).click();
        await page.waitForTimeout(300);
        await expect(btn).toContainText(new RegExp(currency));
      });
    });
  });
});

// ─── EMBED PAGE TESTS ──────────────────────────────────────────────────
test.describe("Embed Pages - No Navigation or Footer", () => {
  LOCALES.forEach((locale) => {
    test(`[${locale.code}] Embed pages have no nav or footer`, async ({ page }) => {
      await page.goto(`${BASE}/${locale.code}/embed/mrr-calculator?embed=1`, { waitUntil: "load" });
      await page.waitForTimeout(2000);

      await expect(page.locator("nav")).toHaveCount(0);
      await expect(page.locator("footer")).toHaveCount(0);
    });
  });
});
