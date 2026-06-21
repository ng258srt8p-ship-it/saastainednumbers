import { test, expect } from "@playwright/test";
import {
  MOBILE, LOCALES, REP_CURRENCIES, DEFAULT_CURRENCY,
  currencyBtn, switchCurrency, gotoCalculator, getCurrentLocale,
  CALC_SLUGS,
} from "./helpers";

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Symbol lookup for representative currencies */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  BRL: "R$",
  INR: "₹",
};

/** Unique nav "Pricing" text per locale — used to verify locale preservation */
const NAV_PRICING_TEXT: Record<string, string> = {
  en: "Pricing",
  es: "Precios",
  de: "Preise",
  pt: "Preços",
  fr: "Tarifs",
  ja: "料金",
};

/** All supported locales (6) × representative currencies (5) = 30 combinations */
const CROSS_PRODUCT = LOCALES.flatMap((l) =>
  REP_CURRENCIES.map((c) => ({ locale: l.code, currency: c as string }))
);

const SAMPLE_CALC = CALC_SLUGS[0]; // revenue/mrr-calculator
const ALT_CALC = CALC_SLUGS[1];    // churn/churn-rate-calculator

/**
 * Navigate to a calculator page for the given locale and switch to the given
 * currency via the dropdown.
 */
async function navigateAndSwitch(
  page: import("@playwright/test").Page,
  locale: string,
  currency: string,
) {
  await gotoCalculator(page, SAMPLE_CALC.category, SAMPLE_CALC.slug, locale);
  if (DEFAULT_CURRENCY[locale] !== currency) {
    await switchCurrency(page, currency);
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────

test.describe("Default Currency Per Locale", () => {
  for (const { code } of LOCALES) {
    test(`[${code}] Default currency is ${DEFAULT_CURRENCY[code]}`, async ({ page }) => {
      await gotoCalculator(page, SAMPLE_CALC.category, SAMPLE_CALC.slug, code);

      const btn = currencyBtn(page);
      await expect(btn).toBeVisible();

      const defaultCur = DEFAULT_CURRENCY[code];
      const symbol = CURRENCY_SYMBOLS[defaultCur];
      await expect(btn).toContainText(new RegExp(`${symbol}${defaultCur}`));
    });
  }
});

test.describe("Locale × Currency Switching", () => {
  // ── 1. All 30 combinations: button display update ──────────────────────
  test.describe("Currency button display (30 combinations)", () => {
    for (const { locale, currency } of CROSS_PRODUCT) {
      test(`[${locale}] → [${currency}] button shows symbol+code`, async ({ page }) => {
        await navigateAndSwitch(page, locale, currency);

        const symbol = CURRENCY_SYMBOLS[currency];
        await expect(currencyBtn(page)).toContainText(new RegExp(`${symbol}${currency}`));
      });
    }
  });

  // ── 2. Locale preservation after switch ────────────────────────────────
  test.describe("Locale preserved after currency switch", () => {
    for (const locale of LOCALES.map((l) => l.code)) {
      for (const currency of [...REP_CURRENCIES].filter((c) => c !== DEFAULT_CURRENCY[locale])) {
        test(`[${locale}] → [${currency}] locale stays ${locale}`, async ({ page }) => {
          await navigateAndSwitch(page, locale, currency);

          // (a) URL locale preserved
          expect(getCurrentLocale(page)).toBe(locale);

          // (b) Translated nav text present (locale preserved in UI)
          const navText = NAV_PRICING_TEXT[locale];
          await expect(page.locator("nav")).toContainText(navText);
        });
      }
    }
  });

  // ── 3. Locale preservation using secondary navigation ──────────────────
  test.describe("Locale preserved on navigation after switch", () => {
    for (const locale of LOCALES.map((l) => l.code)) {
      for (const currency of [...REP_CURRENCIES].filter((c) => c !== DEFAULT_CURRENCY[locale])) {
        test(`[${locale}] → [${currency}] navigate to another calc, locale preserved`, async ({ page }) => {
          await navigateAndSwitch(page, locale, currency);

          // Navigate to a different calculator page
          await gotoCalculator(page, ALT_CALC.category, ALT_CALC.slug, locale);

          // Currency should persist
          const symbol = CURRENCY_SYMBOLS[currency];
          await expect(currencyBtn(page)).toContainText(new RegExp(`${symbol}${currency}`));

          // Locale preserved in URL
          expect(getCurrentLocale(page)).toBe(locale);

          // Translated content visible
          await expect(page.locator("nav")).toContainText(NAV_PRICING_TEXT[locale]);
        });
      }
    }
  });
});

test.describe("Locale × Currency Persistence", () => {
  // ── 4. Persistence after page reload ──────────────────────────────────
  test.describe("Currency + locale persist on reload", () => {
    for (const locale of LOCALES.map((l) => l.code)) {
      for (const currency of [...REP_CURRENCIES].filter((c) => c !== DEFAULT_CURRENCY[locale])) {
        test(`[${locale}] → [${currency}] survives reload`, async ({ page }) => {
          await navigateAndSwitch(page, locale, currency);

          // Reload
          await page.reload({ waitUntil: "load" });

          // Currency persists
          const symbol = CURRENCY_SYMBOLS[currency];
          await expect(currencyBtn(page)).toContainText(new RegExp(`${symbol}${currency}`));

          // Locale preserved in URL
          expect(getCurrentLocale(page)).toBe(locale);
        });
      }
    }
  });

  // ── 5. Currency updates input prefix ───────────────────────────────────
  test.describe("Currency updates calculator input", () => {
    for (const locale of LOCALES.map((l) => l.code)) {
      for (const currency of [...REP_CURRENCIES].filter((c) => c !== DEFAULT_CURRENCY[locale])) {
        test(`[${locale}] → [${currency}] input prefix shows ${CURRENCY_SYMBOLS[currency]}`, async ({ page }) => {
          await navigateAndSwitch(page, locale, currency);

          // Check that at least one input prefix has the currency symbol
          const prefix = page.locator("span.pointer-events-none").first();
          const symbol = CURRENCY_SYMBOLS[currency];
          await expect(prefix).toContainText(new RegExp(symbol.replace("$", "\\$")));
        });
      }
    }
  });
});

test.describe("Locale × Currency Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  // ── 6. Default currency on mobile ──────────────────────────────────────
  test.describe("Default currency on mobile", () => {
    for (const { code } of LOCALES) {
      test(`[${code}] default currency on mobile is ${DEFAULT_CURRENCY[code]}`, async ({ page }) => {
        await gotoCalculator(page, SAMPLE_CALC.category, SAMPLE_CALC.slug, code);

        // Open mobile menu
        await page.locator('button[aria-label*="Open navigation"]').click();
        await expect(page.locator("div[role=\"dialog\"]")).toBeVisible();

        const defaultCur = DEFAULT_CURRENCY[code];
        const symbol = CURRENCY_SYMBOLS[defaultCur];
        const menuCurrency = page.locator("div[role=\"dialog\"] button[aria-label=\"Select currency\"]");
        await expect(menuCurrency).toContainText(new RegExp(`${symbol}${defaultCur}`));
      });
    }
  });

  // ── 7. Switch currency on mobile via menu ──────────────────────────────
  test.describe("Switch currency on mobile", () => {
    for (const locale of LOCALES.map((l) => l.code)) {
      for (const currency of [...REP_CURRENCIES].filter((c) => c !== DEFAULT_CURRENCY[locale])) {
        test(`[${locale}] → [${currency}] mobile switch works`, async ({ page }) => {
          await gotoCalculator(page, SAMPLE_CALC.category, SAMPLE_CALC.slug, locale);

          // Open mobile menu
          await page.locator('button[aria-label*="Open navigation"]').click();
          await expect(page.locator("div[role=\"dialog\"]")).toBeVisible();

          // Click currency button inside mobile menu
          const menuCurrency = page.locator("div[role=\"dialog\"] button[aria-label=\"Select currency\"]");
          await menuCurrency.click();

          // Select currency
          const dropdown = page.locator("div[aria-label=\"Select currency\"][role=\"listbox\"]");
          await dropdown.locator("button[role=\"option\"]", { hasText: currency }).click();
          await page.waitForTimeout(300);

          // Verify header currency button updated
          const symbol = CURRENCY_SYMBOLS[currency];
          await expect(currencyBtn(page)).toContainText(new RegExp(`${symbol}${currency}`));

          // Locale preserved
          expect(getCurrentLocale(page)).toBe(locale);
        });
      }
    }
  });

  // ── 8. Mobile: persistence after navigation ────────────────────────────
  test.describe("Mobile persistence", () => {
    for (const locale of LOCALES.map((l) => l.code)) {
      for (const currency of [...REP_CURRENCIES].filter((c) => c !== DEFAULT_CURRENCY[locale])) {
        test(`[${locale}] → [${currency}] mobile nav + reload`, async ({ page }) => {
          await navigateAndSwitch(page, locale, currency);

          // Navigate to another page
          await gotoCalculator(page, ALT_CALC.category, ALT_CALC.slug, locale);

          const symbol = CURRENCY_SYMBOLS[currency];
          await expect(currencyBtn(page)).toContainText(new RegExp(`${symbol}${currency}`));

          // Reload
          await page.reload({ waitUntil: "load" });
          await expect(currencyBtn(page)).toContainText(new RegExp(`${symbol}${currency}`));
          expect(getCurrentLocale(page)).toBe(locale);
        });
      }
    }
  });
});
