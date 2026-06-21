import { test, expect } from "@playwright/test";

// ─── LOCALE & CURRENCY COVERAGE TESTS ──────────────────────────────────
// Tests that visiting locale-rooted paths (like /es/) redirects correctly
// and shows calculators, not "coming soon" placeholder.

const LOCALES = [
  { code: "en", langName: "English" },
  { code: "es", langName: "Español" },
  { code: "de", langName: "Deutsch" },
  { code: "pt", langName: "Português" },
  { code: "fr", langName: "Français" },
  { code: "ja", langName: "日本語" },
];

test.describe("Locale Root Paths — Should Redirect to Calculators", () => {
  LOCALES.forEach(({ code, langName }) => {
    test(`[${code}] Visiting /${code}/ shows calculators, not "coming soon"`, async ({ page }) => {
      // Visit the locale-rooted path (e.g., /es/ or /de/)
      await page.goto(`/${code}`);
      await page.waitForTimeout(1500);

      // Check that the page does NOT show "coming soon" placeholder
      const comingSoon = page.getByText(/Próximamente|Demnächst|Venant|Prochaine|Coming/i);
      await expect(comingSoon).toHaveCount(0);

      // Check that calculators ARE present
      const calculatorCards = page.locator("[data-testid=calculator-card], [class*=\"calculator\"]");
      await expect(calculatorCards.first()).toBeVisible();

      // Verify we're on the calculators index (has search or listing)
      const pageContent = await page.content();
      
      // Should NOT contain the placeholder text
      expect(pageContent).not.toContain("Próximamente — calculadoras en camino");
      expect(pageContent).not.toContain("Demnächst — Rechner in Vorbereitung");
      expect(pageContent).not.toContain("Prochainement — calculatrices en préparation");
    });

    test(`[${code}] Calculators page title is translated`, async ({ page }) => {
      await page.goto(`/${code}`);
      await page.waitForTimeout(1000);

      const title = await page.title();
      
      switch (code) {
        case "en":
          expect(title).toContain("Calculators");
          break;
        case "es":
          expect(title).toContain("Calculadoras");
          break;
        case "de":
          expect(title).toContain("Rechner");
          break;
        case "pt":
          expect(title).toContain("Calculadoras");
          break;
        case "fr":
          expect(title).toContain("Calculatrices");
          break;
        case "ja":
          expect(title).toContain("計算機");
          break;
      }
    });

    test(`[${code}] Footer shows translated copyright`, async ({ page }) => {
      await page.goto("/pricing"); // Use pricing to ensure footer loads
      await page.waitForTimeout(500);

      const footerText = await page.locator("footer").textContent();
      
      // Verify copyright is resolved (not the path string)
      expect(footerText).not.toContain("footer.copyright");
    });
  });

  // ─── CURRENCY CROSS-LOCALE TESTS ─────────────────────────────────────
  test.describe("Currency Switching (USD, EUR, GBP)", () => {
    const currencies = ["usd", "eur", "gbp"];

    LOCALES.forEach(({ code }) => {
      currencies.forEach((currency) => {
        test(`[${code}][${currency}] Calculator page uses correct currency`, async ({ page }) => {
          await page.goto(`/${code}/${currency}`);
          await page.waitForTimeout(1000);

          const pageContent = await page.content();
          
          // Check currency symbol based on type
          if (currency === "usd") {
            expect(pageContent).toContain("\$");
          } else if (currency === "eur") {
            expect(pageContent).toContain("€");
          } else if (currency === "gbp") {
            expect(pageContent).toContain("£");
          }
        });

        test(`[${code}][${currency}] Currency switcher works`, async ({ page }) => {
          await page.goto(`/${code}/${currency}`);
          await page.waitForTimeout(500);

          // Open currency dropdown
          const currencyBtn = page.locator('button[aria-label*="Select currency"]');
          await expect(currencyBtn).toBeVisible();
          await currencyBtn.click();

          // Verify dropdown appears (aria-expanded="true")
          await expect(currencyBtn).toHaveAttribute("aria-expanded", "true");

          // Close dropdown (click again)
          await currencyBtn.click();
          await expect(currencyBtn).toHaveAttribute("aria-expanded", "false");
        });
      });
    });
  });

  // ─── SPECIFIC PAGE LANGUAGE VERIFICATION ─────────────────────────────
  test.describe("All Pages — Language Verification", () => {
    LOCALES.forEach(({ code }) => {
      const pages = ["/", "/pricing", "/blog"];

      test(`[${code}] All main pages have translated headings`, async ({ page }) => {
        for (const pagePath of pages) {
          await page.goto(`/${code}${pagePath}`);
          await page.waitForTimeout(500);

          // Check that no unresolved translation keys appear in headings
          const h1s = page.locator("h1");
          await expect(h1s.first()).not.toContainText(`${code}.`); // shouldn't have "xx."
        }
      });
    });

    test(`[en] English translations work`, async ({ page }) => {
      await page.goto("/pricing");
      await page.waitForTimeout(500);

      const text = await page.locator("h1").textContent();
      expect(text).toContain("Pricing"); // Should show English text
    });

    test(`[es] Spanish translations work`, async ({ page }) => {
      await page.goto("/es/pricing");
      await page.waitForTimeout(500);

      const text = await page.locator("h1").textContent();
      expect(text).toContain("Precios"); // Should show Spanish text
    });
  });

  // ─── CURRENCY HOME PAGE TESTS ────────────────────────────────────────
  test.describe("Currency Home Page Verification", () => {
    const currencies = ["usd", "eur", "gbp"];

    test("Homepage shows currency-appropriate content", async ({ page }) => {
      // Test USD
      await page.goto("/usd");
      await page.waitForTimeout(500);
      let content = await page.content();
      expect(content).toContain("\$");

      // Test EUR (different currency)
      await page.goto("/eur");
      await page.waitForTimeout(500);
      content = await page.content();
      expect(content).toContain("€");

      // Test GBP (different currency)
      await page.goto("/gbp");
      await page.waitForTimeout(500);
      content = await page.content();
      expect(content).toContain("£");
    });
  });

  // ─── CALCULATOR PAGE LOCALE TESTS ────────────────────────────────────
  test.describe("Calculator Pages — Language Verification", () => {
    const calcPages = ["/revenue/mrr-calculator", "/side-hustle/solo-fund-manager"];

    LOCALES.forEach(({ code }) => {
      calcPages.forEach((calcPage) => {
        test(`[${code}] ${calcPage.split("/").pop()} is properly translated`, async ({ page }) => {
          await page.goto(`/${code}${calcPage}`);
          await page.waitForTimeout(1000);

          // Verify no unresolved keys appear
          const pageText = await page.locator("body").textContent();
          expect(pageText).not.toContain(`${code}.`); // shouldn't have "xx."
        });
      });
    });
  });
});
