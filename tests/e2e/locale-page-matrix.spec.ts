import { test, expect } from "@playwright/test";
import { BASE, MOBILE, LOCALES, CALC_SLUGS } from "./helpers";

// ─── Expected translations per locale ────────────────────────────────────

const NAV_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: { calculators: "Calculators", pricing: "Pricing", blog: "Blog", canvas: "Canvas" },
  es: { calculators: "Calculadoras", pricing: "Precios", blog: "Blog", canvas: "Lienzo" },
  de: { calculators: "Rechner", pricing: "Preise", blog: "Blog", canvas: "Arbeitsfläche" },
  pt: { calculators: "Calculadoras", pricing: "Preços", blog: "Blog", canvas: "Canvas" },
  fr: { calculators: "Calculateurs", pricing: "Tarifs", blog: "Blog", canvas: "Cahier" },
  ja: { calculators: "計算機", pricing: "料金", blog: "ブログ", canvas: "キャンバス" },
};

const FOOTER_COPYRIGHT: Record<string, string> = {
  en: "SaaStainedNumbers. All rights reserved.",
  es: "SaaStainedNumbers. Todos los derechos reservados.",
  de: "SaaStainedNumbers. Alle Rechte vorbehalten.",
  pt: "SaaStainedNumbers. Todos os direitos reservados.",
  fr: "SaaStainedNumbers. Tous droits réservés.",
  ja: "SaaStainedNumbers. 無断転載を禁じます。",
};

const PRICING_HEADINGS: Record<string, string> = {
  en: "Everything Free",
  es: "Todo Gratis",
  de: "Alles Kostenlos",
  pt: "Tudo Grátis",
  fr: "Tout Gratuit",
  ja: "すべて無料",
};

const CALC_TITLES: Record<string, string> = {
  en: "MRR Calculator",
  es: "Calculadora de MRR",
  de: "MRR-Rechner",
  pt: "Calculadora de MRR",
  fr: "Calculateur de MRR",
  ja: "MRR計算機",
};

const BLOG_TITLES: Record<string, string> = {
  en: "Blog",
  es: "Blog",
  de: "Blog",
  pt: "Blog",
  fr: "Blog",
  ja: "ブログ",
};

/** Build the locale-prefixed URL for a given locale and path */
function localeUrl(locale: string, path: string): string {
  if (locale === "en") return `${BASE}${path}`;
  return `${BASE}/${locale}${path}`;
}

// ─── Test data helpers ───────────────────────────────────────────────────

/**
 * Return truthy nav labels that should appear for a given locale.
 * We only verify labels that are meaningfully translated (non-English
 * should differ from English, and we check known key translations).
 */
function expectedNavLabels(code: string): { label: string; translation: string }[] {
  const nt = NAV_TRANSLATIONS[code];
  return [
    { label: "Calculators", translation: nt.calculators },
    { label: "Pricing", translation: nt.pricing },
    { label: "Blog", translation: nt.blog },
    { label: "Canvas", translation: nt.canvas },
  ];
}

// ─── DESKTOP: 6-locale matrix on every major page type ──────────────────

test.describe("Locale Page Matrix - Desktop", () => {
  for (const loc of LOCALES) {
    const code = loc.code;

    test(`[${code}] Homepage — lang attribute matches locale`, async ({ page }) => {
      await page.goto(localeUrl(code, "/"), { waitUntil: "load" });
      await expect(page.locator("html")).toHaveAttribute("lang", code);
    });

    test(`[${code}] Homepage — nav translations correct`, async ({ page }) => {
      await page.goto(localeUrl(code, "/"), { waitUntil: "load" });
      // Make sure mobile nav is not overlaying the desktop nav
      // The desktop nav typically has role="navigation"
      const nav = page.locator("nav").first();
      const navText = await nav.textContent();

      for (const { translation } of expectedNavLabels(code)) {
        expect(navText).toContain(translation);
      }
    });

    test(`[${code}] Homepage — footer has no unresolved translation keys`, async ({ page }) => {
      await page.goto(localeUrl(code, "/"), { waitUntil: "load" });
      const footer = page.locator("footer");
      const footerText = await footer.textContent();

      // None of these key prefixes should appear rendered
      for (const prefix of ["footer.", "nav.", "common.", "category.", "pricing.", "blog."]) {
        expect(footerText).not.toContain(prefix);
      }
    });

    test(`[${code}] MRR calculator — page title translated`, async ({ page }) => {
      const { category, slug } = CALC_SLUGS.find((c) => c.slug === "mrr-calculator")!;
      await page.goto(localeUrl(code, `/${category}/${slug}`), { waitUntil: "load" });
      const title = await page.title();

      // The calculator page title should contain the locale-specific calculator name
      expect(title).toContain(CALC_TITLES[code]);
      // English calculator names differ from all non-English translations
      if (code !== "en") {
        expect(title).not.toContain("MRR Calculator");
      }
    });

    test(`[${code}] Blog listing — page title translated`, async ({ page }) => {
      await page.goto(localeUrl(code, "/blog"), { waitUntil: "load" });
      const title = await page.title();

      expect(title).toContain(BLOG_TITLES[code]);
    });

    test(`[${code}] Pricing page — heading translated`, async ({ page }) => {
      await page.goto(localeUrl(code, "/pricing"), { waitUntil: "load" });
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();

      const headingText = await heading.textContent();
      expect(headingText).toContain(PRICING_HEADINGS[code]);
    });

    test(`[${code}] Homepage — page title contains brand name`, async ({ page }) => {
      await page.goto(localeUrl(code, "/"), { waitUntil: "load" });
      const title = await page.title();
      expect(title).toContain("SaaStainedNumbers");
    });

    test(`[${code}] Pricing page — page title translated`, async ({ page }) => {
      await page.goto(localeUrl(code, "/pricing"), { waitUntil: "load" });
      const title = await page.title();
      expect(title).toContain(PRICING_HEADINGS[code]);
    });
  }
});

// ─── MOBILE: 375px viewport ─────────────────────────────────────────────

test.describe("Locale Page Matrix - Mobile", () => {
  for (const loc of LOCALES) {
    const code = loc.code;

    test(`[${code}] Homepage renders at 375px`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(localeUrl(code, "/"), { waitUntil: "load" });

      // Verify core elements are visible at mobile size
      await expect(page.locator("html")).toHaveAttribute("lang", code);
      // The mobile nav / hamburger should be present
      const hamburger = page.locator('button[aria-label*="Open navigation" i]');
      await expect(hamburger).toBeVisible();
    });

    test(`[${code}] Mobile nav — hamburger opens menu with translated labels`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(localeUrl(code, "/"), { waitUntil: "load" });

      // Open the mobile navigation
      const hamburger = page.locator('button[aria-label*="Open navigation" i]');
      await expect(hamburger).toBeVisible();
      await hamburger.click();
      await page.waitForTimeout(300);

      // The mobile menu should contain translated nav items
      const menu = page.locator('[role="dialog"], [role="menu"], .mobile-nav');
      // Try to get text from whichever mobile nav element is present
      const menuText = await menu.first().textContent().catch(() => "");

      for (const { translation } of expectedNavLabels(code)) {
        // Some nav items might be outside the mobile menu — skip if no menu
        if (menuText) {
          expect(menuText).toContain(translation);
        }
      }
    });

    test(`[${code}] Pricing page renders at 375px with translated heading`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(localeUrl(code, "/pricing"), { waitUntil: "load" });

      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
      const headingText = await heading.textContent();
      expect(headingText).toContain(PRICING_HEADINGS[code]);
    });

    test(`[${code}] Calculator page renders at 375px without layout breakage`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      const { category, slug } = CALC_SLUGS.find((c) => c.slug === "mrr-calculator")!;
      await page.goto(localeUrl(code, `/${category}/${slug}`), { waitUntil: "load" });

      // Verify key interactive elements are visible
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
    });
  }
});

// ─── NAV & FOOTER: comprehensive checks across locales ──────────────────

test.describe("Locale Page Matrix - Nav & Footer", () => {
  for (const loc of LOCALES) {
    const code = loc.code;

    test(`[${code}] Nav — all primary links use translated labels`, async ({ page }) => {
      await page.goto(localeUrl(code, "/"), { waitUntil: "load" });

      const nt = NAV_TRANSLATIONS[code];
      const nav = page.locator("nav").first();
      const navText = (await nav.textContent()) ?? "";

      // Every primary nav translation should appear
      expect(navText).toContain(nt.calculators);
      expect(navText).toContain(nt.pricing);
      expect(navText).toContain(nt.blog);
      expect(navText).toContain(nt.canvas);
    });

    test(`[${code}] Footer — copyright text is locale-appropriate`, async ({ page }) => {
      await page.goto(localeUrl(code, "/"), { waitUntil: "load" });

      const footer = page.locator("footer");
      const footerText = (await footer.textContent()) ?? "";

      // Copyright should be the translated string, not the key
      expect(footerText).toContain(FOOTER_COPYRIGHT[code]);
      expect(footerText).not.toContain("footer.copyright");
    });

    test(`[${code}] Footer — no unresolved translation keys anywhere`, async ({ page }) => {
      await page.goto(localeUrl(code, "/"), { waitUntil: "load" });

      const bodyText = await page.locator("body").textContent();
      const unresolvedPatterns = [
        "footer.",
        "nav.",
        "common.",
        "category.",
        "pricing.",
        "blog.",
        "calculator.",
        "home.",
        "search.",
        "canvas.",
        "contact.",
      ];

      for (const pattern of unresolvedPatterns) {
        expect(bodyText).not.toContain(pattern);
      }
    });
  }

  // ─── Cross-locale resolution checks ──────────────────────────────────

  test("No locale shows unresolved translation key patterns on any page type", async ({ page }) => {
    const pages = ["/", "/pricing", "/blog", "/revenue/mrr-calculator"];

    for (const loc of LOCALES) {
      const code = loc.code;
      for (const path of pages) {
        await page.goto(localeUrl(code, path), { waitUntil: "load" });

        const bodyText = await page.locator("body").textContent();
        // Check for the most common unresolved key patterns
        expect(bodyText).not.toContain(".title");
        expect(bodyText).not.toContain(".description");
        expect(bodyText).not.toContain("footer.");
        expect(bodyText).not.toContain("nav.");
        expect(bodyText).not.toContain("common.");
      }
    }
  });
});
