import { test, expect } from "@playwright/test";
import { BASE, LOCALES, MOBILE, currencyBtn, currencyDropdown, switchCurrency, ALL_CURRENCIES } from "./helpers";

// ─── LOCALE ROOT PATH REDIRECT ──────────────────────────────────────────
test.describe("Locale Root Paths — Should Redirect to Calculators", () => {
  LOCALES.forEach(({ code }) => {
    test(`[${code}] Visiting /${code} shows calculators, not "coming soon"`, async ({ page }) => {
      await page.goto(`/${code}`);
      await page.waitForTimeout(1500);

      // Check that the page does NOT show "coming soon" placeholder
      const comingSoon = page.getByText(/Próximamente|Demnächst|Venant|Prochaine|Coming/i);
      await expect(comingSoon).toHaveCount(0);

      // Check that calculators ARE present
      const calculatorCards = page.locator("[data-testid=calculator-card], [class*=\"calculator\"]");
      await expect(calculatorCards.first()).toBeVisible();

      // Should NOT contain placeholder text
      const pageContent = await page.content();
      expect(pageContent).not.toContain("Próximamente — calculadoras en camino");
      expect(pageContent).not.toContain("Demnächst — Rechner in Vorbereitung");
      expect(pageContent).not.toContain("Prochainement — calculatrices en préparation");
    });

    test(`[${code}] Calculators page title is translated`, async ({ page }) => {
      await page.goto(`/${code}`);
      await page.waitForTimeout(1000);
      const title = await page.title();

      const expectedTerms: Record<string, RegExp> = {
        en: /Calculators/i,
        es: /Calculadoras/i,
        de: /Rechner/i,
        pt: /Calculadoras/i,
        fr: /Calculatrices/i,
        ja: /計算機/,
      };
      expect(title).toMatch(expectedTerms[code]);
    });
  });
});

// ─── CURRENCY SWITCHER ACROSS LOCALES ──────────────────────────────────
test.describe("Currency Switching (All 20 currencies)", () => {
  // Test 3 representative currencies per locale rather than full 120 variant explosion
  const testCurrencies = ["EUR", "GBP", "JPY"];

  LOCALES.forEach(({ code: localeCode }) => {
    testCurrencies.forEach((currencyCode) => {
      test(`[${localeCode}][${currencyCode}] Calculator page currency switcher works`, async ({ page }) => {
        const prefix = localeCode === "en" ? "" : `/${localeCode}`;
        await page.goto(`${BASE}${prefix}/revenue/mrr-calculator`, { waitUntil: "load" });
        await page.waitForTimeout(500);

        // Open currency dropdown
        const btn = currencyBtn(page);
        await expect(btn).toBeVisible();
        await btn.click();
        await expect(btn).toHaveAttribute("aria-expanded", "true");

        // Select target currency
        await currencyDropdown(page).locator('button[role="option"]', { hasText: currencyCode }).click();
        await page.waitForTimeout(300);
        await expect(btn).toContainText(new RegExp(currencyCode));
      });
    });
  });
});

// ─── ALL PAGES LANGUAGE VERIFICATION ───────────────────────────────────
test.describe("All Pages — Language Verification", () => {
  LOCALES.forEach(({ code }) => {
    const paths = ["/", "/pricing", "/blog"];

    test(`[${code}] All main pages have translated headings`, async ({ page }) => {
      for (const pagePath of paths) {
        await page.goto(`/${code}${pagePath}`);
        await page.waitForTimeout(500);

        const h1s = page.locator("h1");
        await expect(h1s.first()).not.toContainText(`${code}.`);
      }
    });
  });

  const langTests: Record<string, { path: string; expected: string }> = {
    en: { path: "/pricing", expected: "Pricing" },
    es: { path: "/es/pricing", expected: "Precios" },
    de: { path: "/de/pricing", expected: "Preise" },
    pt: { path: "/pt/pricing", expected: "Preços" },
    fr: { path: "/fr/pricing", expected: "Tarifs" },
    ja: { path: "/ja/pricing", expected: "料金" },
  };

  Object.entries(langTests).forEach(([code, { path, expected }]) => {
    test(`[${code}] Pricing page heading is translated: ${expected}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForTimeout(500);
      const text = await page.locator("h1").textContent();
      expect(text).toContain(expected);
    });
  });
});

// ─── CALCULATOR PAGE LOCALE TESTS ──────────────────────────────────────
test.describe("Calculator Pages — Language Verification", () => {
  const calcPaths = ["/revenue/mrr-calculator", "/side-hustle/solo-fund-manager"];

  LOCALES.forEach(({ code }) => {
    calcPaths.forEach((calcPath) => {
      test(`[${code}] ${calcPath.split("/").pop()} has no unresolved keys`, async ({ page }) => {
        await page.goto(`/${code}${calcPath}`);
        await page.waitForTimeout(1000);
        const pageText = await page.locator("body").textContent();
        expect(pageText).not.toContain(`${code}.`);
        expect(pageText).not.toContain("footer.copyright");
      });
    });
  });
});
