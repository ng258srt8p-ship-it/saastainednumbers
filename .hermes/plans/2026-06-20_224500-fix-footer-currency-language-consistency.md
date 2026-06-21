# Footer, Currency & Language Consistency Fix

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Fix three site-wide inconsistencies: footer missing on canvas page, currency not applying to all dynamic values, and language switch not applying to page content.

**Architecture:** Single-stream sequential fixes starting with footer (isolation change), then currency propagation hardening, then language-switch content coverage. Each fix is independently testable.

**Tech Stack:** Next.js 16.2.6 (App Router, static export), React 19, TypeScript, Tailwind CSS, Framer Motion

---

## Investigation Phase 0 (Complete)

### State of the Union

| Claim | Verified State | Verdict |
|---|---|---|
| Footer missing on canvas page | `FooterShow` returns `null` for `/canvas` paths — canvas page has no footer | ✅ Real issue |
| Footer differs across other pages | All non-canvas, non-embed pages use identical footer from root `layout.tsx` | ❌ Stale — no action needed |
| Currency doesn't change site-wide | Currency switch works: nav button, input prefixes, calculator results, CurrencyHeroValue all update. Persists across page navigation. | ✅ Works in code — see investigation notes below for hardening |
| Language doesn't change site-wide | Nav and footer switch language correctly. Page content is mixed: translated (nav/footer/calculator UI) + hardcoded English (about, legal, terms, privacy, contact pages) | ✅ Partially works — content pages need translation pass |

### Investigation 0.1: Currency Mechanism Verification

**Tested on live site (saastainednumbers.com):**
1. Navigated to `/revenue/mrr-calculator` — default currency = USD ($)
2. Clicked currency button → selected EUR
3. Nav button updated: "€ EUR" ✅
4. Input prefix updated: "€" instead of "$" ✅
5. Calculator results updated: MRR = "€5,000", ARR = "€60,000" ✅
6. Navigated to `/about` — currency persisted: "€ EUR" ✅
7. Navigated to `/canvas` — currency persisted: "€ EUR" ✅
8. Navigated back to homepage — `CurrencyHeroValue` uses `useCurrency()` to display symbol

**Conclusion:** The `CurrencyProvider` → `useSyncExternalStore` → cookie pattern works correctly. The mechanism has no systemic bug.

**However**, hardening opportunities exist:
- `setCurrency` dispatches a synthetic `new Event("storage")` which triggers `addEventListener("storage")` listeners — this works in modern browsers but is fragile
- Static content (benchmark tables, FAQ examples, calculator config markdown) reference hardcoded `$` values — these cannot change with currency

### Investigation 0.2: Language Switch Verification

**Tested on live site:**
1. On `/about`, clicked language button → selected "Español"
2. URL navigated to `https://saastainednumbers.com/es/about/`
3. Nav labels changed: "Calculadoras", "Precios", "Blog" ✅
4. Footer labels changed: "PRODUCTO", "Inicio", "Acerca de" ✅
5. Skip-to-content changed: "Saltar al contenido" ✅
6. Main content headings stayed in English: "About SaaStainedNumbers" ❌
7. Body paragraphs stayed in English ❌

**Root cause:** Pages like `/about`, `/legal`, `/terms`, `/privacy`, `/contact` use hardcoded English text strings instead of `t()` translation calls. The nav and footer are translated because they come from the root `layout.tsx`, which reads translations server-side. The page-level content is authored directly in English.

**Locale switch flow:**
1. `LocaleSwitcher.switchLocale()` sets `locale` cookie and navigates to `switchLocalePath(pathname, code)`
2. Build script produces separate static HTML per locale (6 builds × `NEXT_PUBLIC_LOCALE`)
3. Server-side `getTranslations()` reads the cookie from the request and loads the correct locale file
4. Components using `t('key')` render translated strings

### Investigation 0.3: Footer Analysis

- Footer defined in `app/layout.tsx` (lines 108-168) wrapped in `<FooterShow>` + `<ShowWhenNotEmbed>`
- `FooterShow` returns `null` for `/canvas`, `/embed`, and `?embed` query param paths
- `ShowWhenNotEmbed` also hides nav on `/embed` paths
- All other pages use the identical footer from the root layout

---

## Definition of Done

### Footer Consistency Gates
- [ ] Canvas page displays the footer (same structure/styling as homepage)
- [ ] Embed page still hides footer (intentional — embed is a widget)
- [ ] `?embed` query param pages still hide footer
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero errors

### Currency Change Gates
- [ ] Currency button updates display immediately on click
- [ ] All calculator input prefixes update (InputSlider, wired inputs)
- [ ] All calculator result cards update (ResultCard primary + secondary)
- [ ] DeltaBadge values update
- [ ] DashboardWidget outputs update
- [ ] CurrencyHeroValue on homepage updates
- [ ] Currency persists across page navigation (cookie-based)
- [ ] No stale `$` symbols remain in dynamic values after currency change

### Language Change Gates
- [ ] Language button navigates to locale-specific URL
- [ ] Nav labels render in target language
- [ ] Footer labels render in target language
- [ ] About page content uses `t()` calls (not hardcoded English)
- [ ] Legal page content uses `t()` calls (not hardcoded English)
- [ ] Terms page content uses `t()` calls (not hardcoded English)
- [ ] Privacy page content uses `t()` calls (not hardcoded English)
- [ ] Contact page headings/labels use `t()` calls
- [ ] Calculator UI buttons/labels render in target language (already works — verify)
- [ ] Site renders correctly at 375px (mobile) and 1280px (desktop)
- [ ] No broken routes after language switch

---

## Tasks

### Task 1: Show Footer on Canvas Page

**Objective:** Remove the `/canvas` exclusion in `FooterShow` so the canvas page has the same footer as all other pages.

**Files:**
- Modify: `components/FooterShow.tsx`

**Step 1: Read current FooterShow implementation**

Already read: `components/FooterShow.tsx` checks `pathname?.startsWith("/canvas")` and returns `null`.

**Step 2: Remove canvas exclusion**

Remove the line:
```tsx
if (pathname?.startsWith("/canvas")) return null;
```

The `FooterShow` component should still hide itself on:
- `/embed` paths (intentional for embed widgets)
- `?embed` query param (intentional for embed widget)

**Step 3: Run build to verify**

Run: `npm run build`
Expected: 0 errors

**Step 4: Run lint to verify**

Run: `npm run lint`
Expected: 0 errors (pre-existing warnings allowed)

**Step 5: Commit**

```bash
git add components/FooterShow.tsx
git commit -m "fix: show footer on canvas page for consistency"
```

---

### Task 2: Check Currency Provider for Resilience

**Objective:** Verify the `CurrencyProvider`'s state update mechanism works in all environments and harden it if needed.

**Files:**
- Read: `components/CurrencyProvider.tsx`
- Read: `components/CurrencySwitcher.tsx`

**Current mechanism:**
- `setCurrency` sets `document.cookie` and dispatches `new Event("storage")`
- `subscribeToCurrency` listens for `"storage"` events and calls React's `callback`
- `useSyncExternalStore` re-reads `getCurrencySnapshot()` when notified

**Potential fragility:** The synthetic `new Event("storage")` dispatch works because `addEventListener("storage", cb)` matches by event type, not by event class. But this is an undocumented behavior and could break in edge cases (e.g., strict CSP, iframe sandboxes, service worker interception).

**Step 1: Verify the mechanism on the live site**

Already verified: Currency switching works end-to-end on saastainednumbers.com across browser navigation.

**Step 2: Add a direct `cookieStore` change listener as fallback**

Modify `subscribeToCurrency` in `CurrencyProvider.tsx` to also listen for `cookieStore` changes when available:

```tsx
function subscribeToCurrency(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  // Also listen for custom currency-changed events as a more explicit signal
  window.addEventListener("currency-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("currency-changed", callback);
  };
}
```

And update `setCurrency` to dispatch both:

```tsx
const setCurrency = useCallback((code: string) => {
  document.cookie = `currency=${code};path=/;max-age=31536000;SameSite=Lax`;
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("currency-changed"));
}, []);
```

This dual-event approach makes the mechanism more robust without changing behavior.

**Step 3: Run build to verify**

Run: `npm run build`
Expected: 0 errors

**Step 4: Run tests**

Run: `npx playwright test tests/e2e/currency.spec.ts`
Expected: 8+ passed (desktop + mobile tests)

**Step 5: Commit**

```bash
git add components/CurrencyProvider.tsx
git commit -m "fix: harden currency change event dispatch with dual-event approach"
```

---

### Task 3: Add Canvas Link to Footer Navigation

**Objective:** Since the Canvas page now shows the footer, add a "Canvas" link to the footer's Product section so users can navigate back to it from the footer.

**Files:**
- Modify: `app/layout.tsx` (footer links section)

**Step 1: Read current footer links**

The Product column (line 116-123) has: Home, All Calculators, About, Pricing.

**Step 2: Add Canvas link**

Add after the Pricing link:
```tsx
<li><Link href="/canvas" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Canvas</Link></li>
```

**Step 3: Run build to verify**

Run: `npm run build`
Expected: 0 errors

**Step 4: Run lint to verify**

Run: `npm run lint`
Expected: 0 errors (pre-existing warnings allowed)

**Step 5: Commit**

```bash
git add app/layout.tsx
git commit -m "fix: add Canvas link to footer navigation"
```

---

### Task 4: Convert About Page to Use Translation Keys

**Objective:** Replace hardcoded English text in `app/about/page.tsx` with `t()` calls using existing or new translation keys.

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `i18n/en/common.json`
- Modify: `i18n/es/common.json`
- Modify: `i18n/de/common.json`
- Modify: `i18n/pt/common.json`
- Modify: `i18n/fr/common.json`
- Modify: `i18n/ja/common.json`

**Step 1: Determine existing translation keys for about page content**

Search for `about.` keys in common.json files to see what already exists.

**Step 2: Add new translation keys for all hardcoded content**

Add to each locale's `common.json`:

```json
{
  "about": {
    "title": "About SaaStainedNumbers",
    "methodologyTitle": "Our Methodology & Trust",
    "methodologyBody": "Every formula deployed on our network of calculators is verified against established SaaS accounting standards...",
    "editorialTitle": "Editorial Leadership & Authorship",
    "marcusName": "Marcus Vance",
    "marcusRole": "Co-Founder & Lead Financial Architect",
    "marcusBio": "Former Senior B2B SaaS Financial Analyst with over 12 years of experience...",
    "elenaName": "Elena Rostova, PhD",
    "elenaRole": "Technical Director & Systems Architect",
    "elenaBio": "Doctorate in Computational Finance with a specialization in client-side runtime efficiency...",
    "architectureTitle": "Platform Architecture",
    "architectureIntro": "Our platform combines mathematical precision with user privacy...",
    "architectureFeature1": "Complete data privacy and security",
    "architectureFeature2": "Real-time calculation performance",
    "architectureFeature3": "No server-side processing fees",
    "architectureFeature4": "Offline functionality for critical business decisions",
    "architectureFeature5": "Scalable architecture for growing business needs",
    "verificationTitle": "Verification & Compliance",
    "verificationBody": "Our calculators undergo rigorous mathematical validation...",
    "verificationBody2": "This platform is designed for professional use by financial analysts..."
  }
}
```

Note: For non-English locales, use natural idiomatic translations (the existing pattern).

**Step 3: Update about page to use `t()` calls**

Replace all hardcoded strings with `t("about.xxx")` calls.

**Step 4: Verify build and basic rendering**

Run: `npm run build`
Run: `npm run lint`
Expected: 0 errors

**Step 5: Verify language switch changes about page content**

Run E2E test or manual verification:
- Switch to Spanish
- Navigate to `/es/about/`
- Verify all headings and body text appear in Spanish

**Step 6: Commit**

```bash
git add app/about/page.tsx i18n/*/common.json
git commit -m "feat: translate about page content via i18n keys"
```

---

### Task 5: Convert Legal, Terms, and Privacy Pages to Use Translation Keys

**Objective:** Replace hardcoded English text in `app/legal/page.tsx`, `app/terms/page.tsx`, and `app/privacy/page.tsx` with `t()` calls.

**Files:**
- Modify: `app/legal/page.tsx`
- Modify: `app/terms/page.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `i18n/*/common.json` (add legal/terms/privacy sections)

**Step 1: Read current page content for each file**

Identify all hardcoded strings in each page.

**Step 2: Add translation section to common.json files**

```json
{
  "legal": {
    "title": "Legal Information",
    ...
  },
  "terms": {
    "title": "Terms of Service",
    ...
  },
  "privacy": {
    "title": "Privacy Policy",
    ...
  }
}
```

**Step 3: Update each page to use `t()` calls**

Replace hardcoded strings with `t("legal.xxx")`, `t("terms.xxx")`, `t("privacy.xxx")`.

**Step 4: Verify build and rendering**

Run: `npm run build`
Expected: 0 errors

**Step 5: Commit**

```bash
git add app/legal/page.tsx app/terms/page.tsx app/privacy/page.tsx i18n/*/common.json
git commit -m "feat: translate legal/terms/privacy pages via i18n keys"
```

---

### Task 6: Convert Contact Page to Use Translation Keys

**Objective:** Replace any remaining hardcoded English text in `app/contact/page.tsx` with `t()` calls. The contact form component already uses `t()` for form labels.

**Files:**
- Read: `app/contact/page.tsx`
- Modify: `components/ContactForm.tsx` (if needed)
- Modify: `i18n/*/common.json`

**Step 1: Read contact page and ContactForm component**

Check what's already translated vs hardcoded.

**Step 2: Add any missing translation keys**

**Step 3: Update page content to use `t()` calls**

**Step 4: Verify build and rendering**

Run: `npm run build`
Expected: 0 errors

**Step 5: Commit**

```bash
git add app/contact/page.tsx i18n/*/common.json
git commit -m "feat: translate contact page via i18n keys"
```

---

### Task 7: E2E Verification

**Objective:** Run comprehensive Playwright tests to verify all three fixes work correctly.

**Files:**
- Run E2E: `tests/e2e/currency.spec.ts`
- Run custom checks for footer and language

**Step 1: Run existing currency tests**

```bash
npx playwright test tests/e2e/currency.spec.ts
```

Expected: 8+ passed

**Step 2: Run full E2E suite (if available)**

```bash
npx playwright test
```

Expected: All existing tests pass

**Step 3: Verify footer is present on canvas page**

Write a quick Playwright check:
```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:3000/canvas');
  const footer = page.locator('footer').first();
  console.log('Footer visible:', await footer.isVisible());
  await browser.close();
})();
"
```

Expected: Footer visible = true

**Step 4: Verify language switch renders translated content**

Check at least one content page for translated text after language switch.

**Step 5: Commit final verification**

```bash
git add -A
git commit -m "chore: verification — footer, currency, and language consistency verified"
```

---

## Risks, Tradeoffs & Open Questions

| Risk | Mitigation |
|---|---|
| Footer on canvas page may look cramped or overlap workspace | Canvas layout may need bottom padding adjustment. Verify with Playwright bounding box. |
| Non-English translations for legal/terms/privacy pages need expert review | Mark as `[needs review]` in translation files. Use existing natural translation style. |
| Adding translation keys for long text blocks makes JSON files bulky | Acceptable — JSON i18n is designed for this. Consider content-islands pattern if files exceed 500 lines. |
| Currency dispatch change (dual events) could cause double render | The second event is redundant — `useSyncExternalStore` snapshat comparison prevents unnecessary re-renders. |
| Language switch navigates to locale-prefixed URL resulting in full page reload | This is the static export architecture. Acceptable UX impact (< 1s load on cached pages). |

## Files Changed Summary

| File | Action | Task |
|---|---|---|
| `components/FooterShow.tsx` | Modify: remove canvas exclusion | 1 |
| `components/CurrencyProvider.tsx` | Modify: dual-event dispatch | 2 |
| `app/layout.tsx` | Modify: add Canvas footer link | 3 |
| `app/about/page.tsx` | Modify: use `t()` calls | 4 |
| `i18n/en/common.json` | Modify: add about/legal/terms/privacy keys | 4-6 |
| `i18n/es/common.json` | Modify: add translations | 4-6 |
| `i18n/de/common.json` | Modify: add translations | 4-6 |
| `i18n/pt/common.json` | Modify: add translations | 4-6 |
| `i18n/fr/common.json` | Modify: add translations | 4-6 |
| `i18n/ja/common.json` | Modify: add translations | 4-6 |
| `app/legal/page.tsx` | Modify: use `t()` calls | 5 |
| `app/terms/page.tsx` | Modify: use `t()` calls | 5 |
| `app/privacy/page.tsx` | Modify: use `t()` calls | 5 |
| `app/contact/page.tsx` | Modify: use `t()` calls | 6 |
