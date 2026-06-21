import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const LOCALES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "fr", name: "Français" },
  { code: "ja", name: "日本語" },
];

const CURRENCIES = ["usd", "eur", "gbp"];

// ─── COMPREHENSIVE LOCALE COVERAGE TESTS ──────────────────────────────
test.describe("Full Locale Coverage", () => {
  LOCALES.forEach((locale) => {
    test(`[${locale.code}] Home page renders correctly`, async ({ page }) => {
      await page.goto(`/${locale.code}`);
      await page.waitForTimeout(1000);
      
      // Check HTML lang attribute
      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", locale.code);
      
      // Check footer text doesn't contain unresolved keys
      const footer = page.locator("footer");
      await expect(footer).not.toContainText(`${locale.code}.`); // shouldn't have "[lang]."
      await expect(footer).not.toContainText("footer.copyright");
    });

    test(`[${locale.code}] Footer has all expected keys resolved`, async ({ page }) => {
      await page.goto("/pricing");
      await page.waitForTimeout(500);
      
      const footer = page.locator("footer");
      const footerText = await footer.textContent();
      
      // Verify no unresolved keys appear in footer
      const hasUnresolvedKeys = [
        "footer.",
        "common.",
        "category."
      ].some(key => footerText.includes(key));
      
      expect(hasUnresolvedKeys).toBe(false);
    });

    test(`[${locale.code}] Nav translations match locale`, async ({ page }) => {
      await page.goto(`/${locale.code}`);
      await page.waitForTimeout(1000);

      const navText = await page.locator("nav").textContent();
      
      // Check specific translations based on locale
      switch (locale.code) {
        case "en":
          expect(navText).toContain("Calculators");
          expect(navText).toContain("Pricing");
          expect(navText).toContain("Blog");
          expect(navText).toContain("Canvas");
          break;
        case "es":
          expect(navText).toContain("Calculadoras");
          expect(navText).toContain("Precios");
          break;
        case "de":
          expect(navText).toContain("Rechner");
          expect(navText).toContain("Preise");
          break;
        case "pt":
          expect(navText).toContain("Calculadoras");
          expect(navText).toContain("Preços");
          break;
        case "fr":
          expect(navText).toContain("Calculatrices");
          expect(navText).toContain("Tarifs");
          break;
        case "ja":
          expect(navText).toContain("計算機");
          break;
      }
    });

    test(`[${locale.code}] Currency switcher is present and functional`, async ({ page }) => {
      await page.goto(`/${locale.code}`);
      await page.waitForTimeout(500);

      // Check currency button exists
      const currencyBtn = page.locator('button[aria-label*="Select currency"]');
      await expect(currencyBtn).toBeVisible();

      // Click to open dropdown
      await currencyBtn.click();
      
      // Check dropdown appears (aria-expanded toggles)
      await expect(currencyBtn).toHaveAttribute("aria-expanded", "true");
      
      // Close dropdown by clicking button again (test accessibility)
      await currencyBtn.click();
      await expect(currencyBtn).toHaveAttribute("aria-expanded", "false");
    });
  });

  // ─── CURRENCY CROSS-LOCALE TESTS ─────────────────────────────────────
  test.describe("Currency × Locale Combinations", () => {
    const combinations = LOCALES.flatMap((l) => 
      CURRENCIES.map((c) => ({ locale: l, currency: c }))
    );

    combinations.forEach(({ locale, currency }) => {
      test(`[${locale.code}][${currency}] Currency displays in footer`, async ({ page }) => {
        await page.goto(`/${locale.code}/${currency}`);
        await page.waitForTimeout(1000);

        // Check currency symbol appears in price displays
        const pageContent = await page.content();
        
        // Find currency symbol: USD=$, EUR=€, GBP=£
        const symbols = { usd: "\$", eur: "€", gbp: "£" };
        const symbol = symbols[currency as keyof typeof symbols];
        
        if (symbol) {
          expect(pageContent).toContain(symbol);
        }
      });

      test(`[${locale.code}][${currency}] Currency changes calculator values`, async ({ page }) => {
        await page.goto(`/${locale.code}/${currency}`);
        await page.waitForTimeout(500);
        
        // Navigate to a calculator and check currency is used
        await page.click('[href*="/mrr-calculator"]');
        await page.waitForTimeout(1000);

        const pageContent = await page.content();
        const symbols = { usd: "\$", eur: "€", gbp: "£" };
        const symbol = symbols[currency as keyof typeof symbols];
        
        // Should see currency symbol in calculator
        if (symbol) {
          expect(pageContent).toContain(symbol);
        }
      });
    });
  });

  // ─── FOOTER RESOLUTION ROOT CAUSE TESTS ─────────────────────────────
  test.describe("Footer Key Resolution", () => {
    LOCALES.forEach((locale) => {
      test(`[${locale.code}] All footer keys resolve to values`, async ({ page }) => {
        await page.goto("/pricing");
        await page.waitForTimeout(500);
        
        const footer = page.locator("footer");
        const text = await footer.textContent();
        
        // These should NOT appear (unresolved keys):
        expect(text).not.toContain("footer.copyright");
        expect(text).not.toContain("footer.product");
        expect(text).not.toContain("footer.about");
      });

      test(`[${locale.code}] Footer renders translated copyright text`, async ({ page }) => {
        await page.goto("/pricing");
        await page.waitForTimeout(500);

        const footer = page.locator("footer p");
        const text = await footer.textContent();

        // Verify copyright is translated (not the key)
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
    });
  });

  // ─── NAV COMPLETENESS TESTS ──────────────────────────────────────────
  test.describe("Navigation Completeness", () => {
    LOCALES.forEach((locale) => {
      test(`[${locale.code}] Nav has all expected links`, async ({ page }) => {
        await page.goto(`/${locale.code}`);
        await page.waitForTimeout(500);

        const navLinks = page.locator("nav a[href]");
        const hrefs = await navLinks.getAttribute("href");
        
        // Should have at least 4 main links: /, /calculators, /pricing, /blog
        expect(hrefs.length).toBeGreaterThanOrEqual(4);
      });

      test(`[${locale.code}] Footer navigation links exist`, async ({ page }) => {
        await page.goto("/pricing");
        await page.waitForTimeout(500);

        const footerNavLinks = page.locator("footer a");
        await expect(footerNavLinks.first()).toBeVisible();
      });
    });
  });

  // ─── EMBED PAGE TESTS (no nav/footer) ───────────────────────────────
  test.describe("Embed Pages - No Navigation or Footer", () => {
    LOCALES.forEach((locale) => {
      test(`[${locale.code}] Embed pages have no nav or footer`, async ({ page }) => {
        await page.goto(`/${locale.code}/embed/mrr-calculator?embed=1`);
        await page.waitForTimeout(2000);

        const nav = page.locator("nav");
        const footer = page.locator("footer");

        await expect(nav).toHaveCount(0);
        await expect(footer).toHaveCount(0);
      });
    });
  });

  // ─── CALCULATORS PAGE TESTS ──────────────────────────────────────────
  test.describe("Calculators Index Page", () => {
    LOCALES.forEach((locale) => {
      test(`[${locale.code}] Calculators index page shows translated title`, async ({ page }) => {
        await page.goto(`/${locale.code}/calculators`);
        await page.waitForTimeout(1000);

        const title = await page.title();
        
        if (locale.code === "en") {
          expect(title).toContain("Calculators");
        } else if (locale.code === "es") {
          expect(title).toContain("Calculadoras");
        } else if (locale.code === "de") {
          expect(title).toContain("Rechner");
        } else if (locale.code === "pt") {
          expect(title).toContain("Calculadoras");
        } else if (locale.code === "fr") {
          expect(title).toContain("Calculatrices");
        } else if (locale.code === "ja") {
          expect(title).toContain("計算機");
        }
      });
    });
  });
});
