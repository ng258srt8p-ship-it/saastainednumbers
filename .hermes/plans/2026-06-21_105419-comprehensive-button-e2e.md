# Comprehensive Button E2E Test Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Achieve 100% Playwright coverage of every clickable interactive element (buttons, links acting as buttons, toggles, dropdown triggers, floating action buttons) across the entire WebCalc application (all 75 calculators, 6 locales, 20 currencies, 9 categories, canvas, embed, dashboard, blog, pricing, contact pages). Every button must be verified for: visibility, correct label/text (in each supported locale), functional correctness (click produces expected behaviour), and absence of UI issues (overflow, clipping, layout shift, colour contrast, dark mode parity). Currency rendering correctness must be verified for every supported currency symbol, and locale-specific number formatting must be validated.

**Architecture:** Extension of the existing `tests/e2e/` Playwright test suite (40 existing spec files, ~3,000 lines). New spec files organised by page/component domain, following existing conventions (`const BASE = "http://localhost:3000"`, `test.describe`, `waitUntil: "load"`). Tests cover both desktop (1280px) and mobile (375px) viewports. CI runs via `npx playwright test` using the existing `playwright.config.ts`.

**Tech Stack:** Playwright (already installed, 40 existing spec files), Next.js 16.2.6 (dev server), TypeScript.

---

## Definition of Done

### Investigation Gates
- [ ] Button inventory cross-referenced with existing spec coverage (gaps identified)
- [ ] Dev server starts and all 40 existing E2E tests pass
- [ ] Each new spec file compiles with zero TS errors
- [ ] **404 redirect bug**: Visiting `http://localhost:3000` redirects to `/es/calculators/` (404). Root cause identified, fix applied, and regression test written for ALL 6 locale root paths.

### Technical Gates
- [ ] `npx playwright test` passes with 0 failures (all new + existing tests)
- [ ] `npm run lint` passes with zero new errors (only pre-existing 23 warnings)
- [ ] `npm run build` passes with zero errors
- [ ] All tests pass on BOTH 1280px (desktop) and 375px (mobile) viewports
- [ ] No flaky tests: each test retry-3 passes consistently

### Content/QA Gates
- [ ] Every interactive button has at minimum: visibility check + click interaction + post-click state assertion
- [ ] Dark mode toggled + re-checked for every visual button (where applicable)
- [ ] Cross-category coverage: at least 2 category tokens for button types that appear on every calc page
- [ ] No test uses hard-coded timeouts > 500ms for visibility checks (use `waitUntil: "load"` or `expect().toBeVisible()`)

### Locale Coverage Gates
- [ ] **All 6 locales (EN, ES, DE, PT, FR, JA)** verified for: nav translations, calculator page button labels, content text, number formatting, HTML `lang` attribute, and absence of unresolved translation keys
- [ ] **All 20 currencies (USD, EUR, GBP, JPY, CAD, AUD, BRL, CHF, INR, CNY, MXN, SEK, NOK, NZD, KRW, SGD, HKD, TWD, ZAR, DKK)** verified: switcher shows all options, symbol renders correctly, currency persists across nav/reload, all monetary inputs update
- [ ] **Locale × Currency cross-product**: Each locale renders its correct default currency, all currencies work correctly from each locale page
- [ ] **404 redirect fix verified for EVERY locale**: `/en/`, `/es/`, `/de/`, `/pt/`, `/fr/`, `/ja/` all redirect correctly (no 404)

### Verification Gates

### Pages & Their Interactive Elements

#### `// Homepage` (/) — 9+ buttons
| Button | Type | Existing Coverage |
|---|---|---|
| 9 category cards (links to `/category/`) | Link/card | `homepage.spec.ts` (exists, but not per-category) |
| Theme toggle (header) | Toggle button | `theme-toggle.spec.ts` |
| Mobile nav hamburger | Toggle button | `nav.spec.ts` (basic) |
| Desktop nav links (About, Blog, Canvas, Pricing, Calculators, Contact) | Nav links | `nav.spec.ts`, `navigation.spec.ts` (basic) |
| Logo/home link | Link | None specific |
| Locale switcher dropdown | Dropdown trigger | `nav-dropdowns.spec.ts` |
| Currency switcher dropdown | Dropdown trigger | `nav-dropdowns.spec.ts` |

#### `// Category pages` (/[category]) — 4+ buttons
| Button | Type | Existing Coverage |
|---|---|---|
| Calculator cards (varies by category, ~75 total) | Link to calc | `category.spec.ts`, `categories.spec.ts` |
| Search input (filter) | Text input | `search.spec.ts` |
| Breadcrumb links | Nav links | `breadcrumbs.spec.ts` |
| Search clear/results | Text + results | `search.spec.ts` (partial) |

#### `// Calculator pages` (/[category]/[slug]) — 12+ buttons
| Button | Type | Existing Coverage |
|---|---|---|
| Input sliders (number input + range) | Dual input | `calculator-interaction.spec.ts` |
| Get Insights button | Action button | `insights.spec.ts` |
| Regenerate Insights button | Action button | `insights.spec.ts` |
| Dismiss Insights button | Action button | `insights.spec.ts` |
| Try Again (on error) | Action button | None explicit |
| Share button | Action → clipboard | `share.spec.ts` |
| Embed button | Action → modal | None (only embed page tests exist) |
| Embed modal close button | Action | None |
| Stage selector (5 buttons: Seed → Growth) | Radio-like group | None |
| Compare toggle | Toggle | None explicit |
| Delta mode toggle (3: $, %, Both) | Radio-like group | None |
| Feedback Yes/No buttons | Action | `feedback.spec.ts` |
| FAQ accordion items (2-6) | Disclosure/accordion | None |
| Related calculators cards (links) | Links | None |
| AI Chat toggle button | Toggle | `ai-chat-widget.spec.ts` |
| AI Chat send/close buttons | Action | `ai-chat-widget.spec.ts` |
| Dark mode toggle | Toggle | `theme-toggle.spec.ts` |

#### `// Canvas page` (/canvas) — 15+ buttons
| Button | Type | Existing Coverage |
|---|---|---|
| Catalog calculator buttons (75) | Add-to-workspace | `canvas.spec.ts` (MRR + Churn only) |
| Template buttons (6 templates) | Load template | `canvas-templates.spec.ts` (partial) |
| + (Add) button on templates | Additive load | `canvas-add-template.spec.ts` |
| Remove (X) on widget | Remove | `canvas.spec.ts` |
| Clear all button | Action | `canvas.spec.ts` |
| Open full calculator link | Link in widget | None |
| AI Chat toggle | Toggle | None on canvas |
| Category collapse/expand in catalog | Disclosure | None |
| Canvas search input | Input | None |
| Stage selector in widget (embedded) | Radio-like | None |

#### `// Blog listing` (/blog) + `// Blog post` (/blog/[slug]) — 4+ buttons
| Button | Type | Existing Coverage |
|---|---|---|
| Blog card links (list) | Links | `blog.spec.ts` (exists) |
| Breadcrumb links | Nav links | `breadcrumbs.spec.ts` |
| Pagination (if any) | Links | None |

#### `// Contact page` (/contact) — 3+ buttons
| Button | Type | Existing Coverage |
|---|---|---|
| Subject dropdown | Select | None |
| Submit button | Submit | None |
| Name/Email/Message inputs | Text inputs | None |

#### `// Pricing page` (/pricing) — 2+ buttons
| Button | Type | Existing Coverage |
|---|---|---|
| CTA buttons / plan cards | Links | None |

#### `// Embed page` (/embed/[slug]) — 4+ buttons
| Button | Type | Existing Coverage |
|---|---|---|
| Input sliders (2-6 per calc) | Dual input | `embed.spec.ts` (partial) |
| Share button | Action | None on embed |

#### `// Footer (global)` — 7+ buttons
| Button | Type | Existing Coverage |
|---|---|---|
| About, Blog, Canvas, Pricing, Contact, Privacy, Terms, Advertisers links | Links | `nav.spec.ts` (partial) |

#### `// Canvas Catalog components` — 5+ buttons
| Button | Type | Existing Coverage |
|---|---|---|
| Category headers (collapse/expand) | Disclosure | None |
| Individual calc buttons in each category | Add-to-workspace | `canvas.spec.ts` (partial) |
| Quick Start Templates (6 rows) | Load | `canvas-templates.spec.ts`, `canvas-add-template.spec.ts` |
| Template add (+) mini-buttons | Additive | `canvas-add-template.spec.ts` |
| Workspace search input | Input | None |

#### `// Widget (embedded calc in canvas)` — 8+ buttons
| Button | Type | Existing Coverage |
|---|---|---|
| Input sliders (2-6) | Dual input | None in canvas context |
| Get Insights | Action | None in canvas context |
| Remove (X) | Remove | `canvas.spec.ts` |
| Open Full Page link icon | Link | None |
| Share | Action | None in canvas context |
| Stage selector (when metricKey) | Radio group | None in canvas context |
| Dark mode toggle | Toggle | Only global |
| AI Chat toggle | Toggle | None in canvas context |

---

## Gap Analysis

### Fully Covered (by existing tests)
- ✅ Theme toggle visibility + click + dark mode check (`theme-toggle.spec.ts`)
- ✅ Share button visibility + click + clipboard + revert (`share.spec.ts`)
- ✅ Feedback Yes/No + thanks message (`feedback.spec.ts`)
- ✅ Get Insights + loading + content appearing (`insights.spec.ts`)
- ✅ Breadcrumb navigation (`breadcrumbs.spec.ts`)
- ✅ Search input on category pages (`search.spec.ts`)
- ✅ AI Chat toggle + send + close (`ai-chat-widget.spec.ts`)
- ✅ Canvas: add calc + remove calc + clear all + templates (`canvas.spec.ts`, `canvas-templates.spec.ts`, `canvas-add-template.spec.ts`)
- ✅ Nav links basic (`nav.spec.ts`, `navigation.spec.ts`)
- ✅ Nav dropdowns (locale, currency) (`nav-dropdowns.spec.ts`)
- ✅ Homepage basic (`homepage.spec.ts`, `home.spec.ts`)
- ✅ Embed page input interaction (`embed.spec.ts`)
- ✅ Accessible labels/ARIA (`accessibility.spec.ts`)

### Partially Covered (gap exists)
- ⚠️ **Category calculator cards** — only exists for homepage, not for per-category card rendering
- ⚠️ **Blog page** — basic test exists but doesn't test card link navigation
- ⚠️ **Calculator interaction** — exists but doesn't test ALL 75 calc engines, only MRR/CAC/Churn/FIRE

### Not Covered (gaps to fill)
- ❌ **Stage selector buttons** (Seed, Series A, Series B, Series C, Growth) — click each, verify active state changes, verify benchmark values update
- ❌ **Compare toggle** — click to enable compare mode, verify Scenario A/B inputs appear, verify chart renders
- ❌ **Delta mode buttons** ($, %, Both) — click each, verify delta label changes in compare mode
- ❌ **Embed button** on calculator pages — click opens EmbedModal, verify modal content
- ❌ **Embed modal close** — click close/X, verify modal dismisses
- ❌ **FAQ accordion** — click each FAQ item, verify it expands/collapses, verify chevron rotates
- ❌ **Calculator embed modal copy button** — click copy, verify "Copied!" feedback
- ❌ **Contact form** — fill all fields + submit button click + validation
- ❌ **Pricing page CTA buttons** — visibility + click → correct navigation
- ❌ **Logo/home link** — click → navigates to `/`
- ❌ **Footer links** — each footer link navigates to correct page
- ❌ **Related calculator cards** — click → navigates to correct calculator
- ❌ **Regenerate Insights button** — after insights shown, click Regenerate
- ❌ **Dismiss Insights button** — after insights shown, click Dismiss
- ❌ **Try Again button** (on insights error state) — simulate error, click Try Again
- ❌ **Empty canvas state** — verify "Your Workspace is Empty" + "Drag calculators from catalog"
- ❌ **Canvas catalog category collapse/expand** — click category header, verify calc list toggles
- ❌ **Canvas search** — type in catalog search, verify filtering
- ❌ **Canvas "Open Full Calculator" icon link** — click, navigates to full calc page
- ❌ **Canvas stage selector in widgets** — when metricKey present, clicking stage changes benchmark
- ❌ **Canvas dark mode parity** — all canvas elements render correctly in darkmode
- ❌ **Embed page share button** — visibility + click behaviour on embed pages
- ❌ **Mobile nav** — hamburger toggle + all mobile nav links visible + navigations
- ❌ **Desktop nav** — each nav link navigates correctly + active state
- ❌ **All 75 calculator engine E2E coverage** — smoke test each calculator's input rendering + output display
- ❌ **Canvas widget share button** — share from within canvas widget
- ❌ **Canvas widget AI chat** — open/close chat from widget
- ❌ **Currency: Full 20-currency switcher** — dropdown shows all 20 currencies, each is clickable, symbol renders correctly in button and inputs
- ❌ **Currency: Input prefix update** — changing currency from USD→EUR updates `$` to `€` on all number inputs with monetary prefix
- ❌ **Currency: Cross-locale default** — each locale's default currency (EN→USD, ES→EUR, JA→JPY etc.) auto-selected on first visit
- ❌ **Currency: Persistence** — currency survives page navigation, reload, and locale switching
- ❌ **Currency: Canvas** — widgets in canvas workspace display correct currency symbol after switching
- ❌ **Currency: Embed pages** — embed plays well with currency selection
- ❌ **Locale: Button label translation** — all interactive button labels (Embed, Share, Get Insights, Compare, etc.) show translated text in each locale
- ❌ **Locale: Number formatting** — large numbers formatted per locale conventions (1,000.50 vs 1.000,50)
- ❌ **Locale: Calculator output values** — calculated results display correct locale-formatted numbers
- ❌ **Locale × Currency** — switching locale updates default currency; manually overridden currency persists across locale switches
- ❌ **404 redirect: Every locale** — only `/es/` was reported, but all 6 locale root paths may have the same bug

---

## Tasks

### Task A: [CRITICAL] 404 Redirect Bug — `/` → `/es/calculators/` (404)

**Objective:** Fix the bug where navigating to `http://localhost:3000` redirects to `http://localhost:3000/es/calculators/` and returns a 404. Root-cause the redirect chain, apply the fix, and add a regression E2E test.

**Bug symptoms reported:**
1. User visits `http://localhost:3000`
2. Browser ends up at `http://localhost:3000/es/calculators/`
3. Page shows 404 error

**Investigation steps:**

**Step 1: Trace the redirect chain**
- Start dev server: `npx next dev -p 3000`
- Use Playwright to navigate to `/` and capture the full redirect chain with `page.waitForURL()` or browser console network logs
- Determine each redirect hop: `/` → `???` → `/es/calculators/`
- Check both initial page load and any client-side redirects

**Step 2: Examine locale detection flow**
- Read: `lib/getTranslations.ts` — extracts `locale` from cookie (set via `useLocale.ts`)
- Read: `lib/useLocale.ts` — client-side `getLocale()` reads `locale` cookie, sets it
- Check if `Accept-Language` header or `NEXT_PUBLIC_LOCALE` env var is involved
- The homepage (`app/page.tsx`) renders with translated content but does NOT redirect based on locale
- **Hypothesis:** Some other component may be performing a client-side redirect to locale-prefixed path

**Step 3: Examine locale-prefix route handler**
- Read: `app/[category]/page.tsx` lines 44-48 — if `category` matches a locale (like `es`), it redirects to `/calculators`
- The hardcoded `redirect("/calculators")` is a bare path — does NOT include locale prefix
- **Test:** Does `redirect("/calculators")` produce a 307 to `/calculators` or to `/es/calculators/`?
- **Check:** Are there any `localeHref` wrappers or middleware that rewrites bare redirects to locale-prefixed paths?

**Step 4: Examine why `/es/calculators/` 404s**
- The route pattern `app/[category]/[slug]/` expects `[category]/[slug]` two segments
- `/es/calculators/` has ONLY one segment after the locale: `calculators` acts as the `category` param
- This matches `app/[category]/page.tsx` where `category = "calculators"`
- `calculators` is NOT in the known categories list (`getAllKnownCategories()` in `lib/registry.ts` has 9 categories)
- The page calls `getCalculatorsByCategory("calculators")` which returns empty array → renders empty state
- **But `app/calculators/page.tsx` exists** as a separate route, so `/calculators` (bare, no locale prefix) works fine
- The bug is that the redirect lands on `/es/calculators/` instead of `/calculators`

**Root cause analysis:** Likely one of:
1. **Missing `middleware.ts`**: AGENTS.md mentions middleware.ts for locale detection, but no middleware file exists on disk. If middleware was previously responsible for stripping locale prefix before route matching, its absence could cause locale-prefixed paths to fall through to wrong routes.
2. **Client-side redirect**: A component (LocaleSwitcher, Nav link, or something in layout) may be rewriting bare paths to locale-prefixed paths when it detects the locale cookie.
3. **Hardcoded redirect path**: The `redirect("/calculators")` in `[category]/page.tsx` should instead redirect to the EN locale path (bare `/calculators`), but something on the receiving end re-adds the locale prefix.

**Fix implementation:**
1. Determine the correct fix — options:
   a. Remove the locale-prefix redirection in `[category]/page.tsx` and instead make locale-prefixed paths work correctly (maybe create a catch-all route or middleware)
   b. Ensure the redirect from `/es/` goes to `/calculators` (bare) and that NO code re-adds the locale prefix
   c. Create a proper `[locale]/calculators/page.tsx` route that serves the calculators page with locale
2. Apply fix using bare minimum changes

**Step 5: Add regression E2E test**
- Create: `tests/e2e/404-redirect.spec.ts`
- **Test ALL 6 locale root paths:** Using data-driven `test.each` with locale codes `["en", "es", "de", "pt", "fr", "ja"]`
- Test case 1 (×6 locales): Navigate to each `/{locale}/` → assert 200 (not 404), no "coming soon" placeholder
- Test case 2 (×6 locales): Navigate to each `/{locale}/calculators` → assert 200 (not 404), calculators listing visible
- Test case 3 (×6 locales): Navigate to each `/{locale}/{category}` (e.g. `/es/revenue/`) → assert category page renders with translated content (not 404)
- Test case 4: Navigate to `/` → assert no unexpected redirect loop
- Test case 5: Navigate to bare `/calculators` → assert 200
- Test case 6: Navigate to bare `/{category}` (e.g. `/revenue`) → assert 200

**Verification:**
- `npm run build` passes
- `npx playwright test` — new regression tests pass
- Manual: navigate to `localhost:3000` → should not redirect to `/es/calculators/`

**Files modified:** `app/[category]/page.tsx`, possibly new route file or middleware, `tests/e2e/404-redirect.spec.ts` (new)

---

### Task B: Comprehensive Currency Switcher Testing — All 20 Currencies

**Objective:** Verify the currency switcher dropdown lists all 20 currencies, each renders the correct symbol, switching updates all monetary displays, and selection persists across navigation and reload. Test on desktop and mobile viewports.

**Files:**
- Create: `tests/e2e/currency-matrix.spec.ts`
- Reference: `components/CurrencySwitcher.tsx`, `components/CurrencyProvider.tsx`
- Reference: `lib/currencies.ts` (defines all 20 currencies)

**Supported currencies (20):** USD ($), EUR (€), GBP (£), JPY (¥), CAD (C$), AUD (A$), BRL (R$), CHF (Fr), INR (₹), CNY (¥), MXN (MX$), SEK (kr), NOK (kr), NZD (NZ$), KRW (₩), SGD (S$), HKD (HK$), TWD (NT$), ZAR (R), DKK (kr)

**Test cases (data-driven approach):**

**Part A: Currency dropdown completeness**
1. Open currency switcher on calculator page → dropdown renders with aria-expanded toggling
2. Dropdown contains exactly 20 option items
3. For each currency code in ALL_CURRENCIES: verify option exists with correct symbol+code text (e.g. "$ USD", "€ EUR", "¥ JPY", "R$ BRL")
4. Default currency matches locale: EN→"$USD", ES→"€EUR", DE→"€EUR", PT→"€EUR", FR→"€EUR", JA→"¥JPY" (data-driven × 6 locales)
5. Click outside overlay → dropdown closes

**Part B: Currency switching behaviour (5 representative currencies)**
6. Switch to EUR → button displays "€EUR", input currency prefix changes to `€`
7. Switch to GBP → button displays "£GBP", input currency prefix changes to `£`
8. Switch to JPY → button displays "¥JPY", input currency prefix changes to `¥`
9. Switch to BRL → button displays "R$BRL", input currency prefix changes to `R$`
10. Switch to INR → button displays "₹INR", input currency prefix changes to `₹`

**Part C: Currency persistence**
11. Switch to EUR → navigate to different calculator page → EUR persists
12. Switch to GBP → reload page → GBP persists
13. Switch to JPY → navigate to canvas → JPY persists

**Part D: Cross-page currency verification**
14. Currency changes affect calculator result output (MRR calculator: switch EUR, verify € in output/input prefix)
15. Currency changes affect canvas widget monetary inputs
16. Currency changes affect dashboard widget (if monetary)

**Part E: Dark mode**
17. Currency dropdown renders correctly in dark mode
18. Selected currency option has correct dark mode highlight

**Part F: Mobile (375px viewport)**
19. Currency switcher accessible inside hamburger menu
20. Can change currency from mobile menu dropdown
21. Currency persists after mobile nav navigation

**Test data approach:**
```typescript
const ALL_CURRENCIES = [
  { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" }, { code: "CAD", symbol: "C$" }, { code: "AUD", symbol: "A$" },
  { code: "BRL", symbol: "R$" }, { code: "CHF", symbol: "Fr" }, { code: "INR", symbol: "₹" },
  { code: "CNY", symbol: "¥" }, { code: "MXN", symbol: "MX$" }, { code: "SEK", symbol: "kr" },
  { code: "NOK", symbol: "kr" }, { code: "NZD", symbol: "NZ$" }, { code: "KRW", symbol: "₩" },
  { code: "SGD", symbol: "S$" }, { code: "HKD", symbol: "HK$" }, { code: "TWD", symbol: "NT$" },
  { code: "ZAR", symbol: "R" }, { code: "DKK", symbol: "kr" },
];
const REPRESENTATIVE = ["EUR", "GBP", "JPY", "BRL", "INR"];
```

**Verification:**
- All 20 currency options present in dropdown
- 5 representative currencies: symbol renders in button + input prefix
- Persistence across navigation and reload
- Mobile access works
- Dark mode renders correctly

---

### Task C: Full Locale × Page Type Matrix — All 6 Locales

**Objective:** Verify every major page type renders with correct translations in ALL 6 locales (EN, ES, DE, PT, FR, JA). Extends existing `comprehensive-locale-tests.spec.ts` and `locale-coverage.spec.ts` coverage to include page-specific interactive elements with full locale parameterization.

**Files:**
- Create: `tests/e2e/locale-page-matrix.spec.ts`
- Reference: `i18n/{locale}/common.json` files for all 6 locales

**Test cases (data-driven by locale × page type):**

**Part A: Locale root paths — all 6**
1. For each locale: navigate to `/{locale}/` → assert 200, no 404, no "coming soon" placeholder
2. For each locale: page title contains locale-appropriate word for "Calculators" (Calculators / Calculadoras / Rechner / Calculatrices / 計算機)
3. For each locale: HTML lang attribute matches locale code

**Part B: Nav translations — all 6**
4. For each locale: nav link labels translated (Calculators, Pricing, Blog, Canvas specific keys)
5. Theme toggle aria-label translated
6. For each locale: no "common." or "nav." text visible (unresolved keys)

**Part C: Calculator page button labels — all 6 × MRR calculator**
7. "Get Insights" button text matches locale
8. "Share" button text matches locale
9. "Embed" / "Embed Chart" button text matches locale
10. "Compare" toggle label matches locale
11. Stage selector labels match locale (if translated)
12. FAQ section headings translated
13. Related calculators heading translated

**Part D: Category pages — all 6 × 2 sample categories**
14-15. Each category heading rendered in locale-appropriate text
16-17. Calculator card titles translated

**Part E: Footer translations — all 6**
18. Footer copyright text translated for each locale
19. Footer link labels translated
20. No "footer." key strings visible

**Part F: Embed pages — all 6**
21. Embed page body text translated
22. Embed page has no nav or footer in any locale

**Verification:**
- All 6 locales: 0 unresolved translation keys on any page
- All 6 locales: calculator button labels translated
- All 6 locales: locale-specific UI text renders correctly
- Combined matrix: 6 locales × ~8 page types = ~48 data-driven test combinations

---

### Task D: Locale × Currency Cross-Product Testing

**Objective:** Verify the interaction between locale switching and currency selection — the correct default currency for each locale, manual currency override surviving locale changes, and all currency symbols rendering correctly from every locale page.

**Files:**
- Create: `tests/e2e/locale-currency-cross-product.spec.ts`
- Reference: `lib/currencies.ts` (default per locale: EN→USD, EU locales→EUR, JA→JPY)

**Test cases (data-driven using locale × currency pairs):**

**Part A: Default currency by locale**
1. EN locale → currency button shows "$USD" (USD)
2. ES locale → currency button shows "€EUR" (EUR)
3. DE locale → currency button shows "€EUR" (EUR)
4. PT locale → currency button shows "€EUR" (EUR)
5. FR locale → currency button shows "€EUR" (EUR)
6. JA locale → currency button shows "¥JPY" (JPY)

**Part B: Override currency within each locale**
7. EN→GBP: button shows "£GBP"
8. ES→JPY: button shows "¥JPY"
9. DE→USD: button shows "$USD"
10. FR→BRL: button shows "R$BRL"
11. JA→EUR: button shows "€EUR"

**Part C: Currency persistence across locale switches**
12. Set EUR on EN page → switch locale to DE → EUR persists (not reset to EUR default)
13. Set GBP on EN page → switch locale to ES → GBP persists (not reset to EUR default)
14. Set JPY on EN page → switch locale to JA → JPY persists
15. Set BRL on EN page → navigate to different page → BRL persists
16. Switch locale while on a calculator → manually chosen currency carries over

**Part D: Visual verification across locale × currency matrix**
17. For each locale × representative currency (EUR, GBP, JPY): visit MRR calculator → verify input prefix shows correct currency symbol
18. For each locale × non-default currency: verify calculator outputs update with new currency symbol
19. Ambiguous-symbol currencies (¥ for JPY & CNY, kr for SEK/NOK/DKK) verified by CODE text, not just symbol

**Verification:**
- Default currency per locale matches `lib/currencies.ts` DEFAULT_CURRENCY mapping
- Manually overridden currency survives locale switches
- All currency symbols render correctly when viewed from any locale page
- No empty/undefined currency display in any combination

---

### Task 3: Investigation & Setup — Benchmark Existing Tests

**Objective:** Establish baseline — all 40 existing E2E tests pass, dev server runs, button inventory confirmed.

**Files:**
- Read: `playwright.config.ts`
- Run: `npx playwright test` (verify all 40 existing pass)

**Step 1: Run full existing E2E suite to confirm green baseline**
Run: `cd /Users/georgetozer/Development/WebCalc && npx playwright test`
Expected: All 40+ existing spec files pass (0 failures, 0 flaky)

**Step 2: Start dev server in background**
Run: `npx next dev -p 3000` (background, wait for "ready" signal)

**Step 3: Confirm no pre-existing failures**
Run: `npx playwright test --reporter=list`
Expected: 0 failed, 0 flaky

**Step 4: Create shared test helpers file**
Create: `tests/e2e/helpers.ts`
- `const BASE = "http://localhost:3000";`
- `async function clearCanvasStorage(page: Page)`
- Helper: `async function toggleDarkMode(page: Page, targetTheme: "dark" | "light")`
- Helper: `async function addCalculatorToCanvas(page: Page, calcName: string)`
- Helper: `async function getCalcSlugs(category: string): Promise<string[]>`

---

### Task 4: Stage Selector Buttons (Calculator Pages)

**Objective:** Verify all 5 stage buttons on calculator pages with benchmark metrics. Click each stage, verify visual active state changes (active button has `bg-brand-600` class), verify benchmark value updates accordingly.

**Files:**
- Create: `tests/e2e/stage-selector.spec.ts`
- Reference: `app/[category]/[slug]/CalculatorClient.tsx:170-192`

**Test cases:**
1. Stage selector visible on MRR calculator — locate all 5 stage buttons
2. Default stage is "Series A" (active state has `bg-brand-600`)
3. Click "Seed" → active moves to Seed button
4. Click "Growth" → active moves to Growth button
5. Verify benchmark metric text changes when stage changes (if metricKey present)
6. Stage selector NOT visible on calculators without metricKey
7. **Mobile (375px)**: Stage selector wraps correctly, buttons still clickable
8. **Dark mode**: Stage selector buttons have correct hover/active colours

**Step 1: Write test for stage selector visibility + default state**

```typescript
test("stage selector visible on MRR calculator with 5 stage buttons", async ({ page }) => {
  await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
  const stages = page.locator("button").filter({ hasText: /Seed|Series A|Series B|Series C|Growth/ });
  await expect(stages).toHaveCount(5);
});
```

**Step 2: Write test for stage click behaviour**

```typescript
test("clicking Growth stage activates Growth and deactivates Series A", async ({ page }) => {
  await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
  const growthBtn = page.locator("button").filter({ hasText: "Growth" });
  await growthBtn.click();
  await expect(growthBtn).toHaveClass(/bg-brand-600/);
  const seriesA = page.locator("button").filter({ hasText: "Series A" });
  await expect(seriesA).not.toHaveClass(/bg-brand-600/);
});
```

**Step 3: Test on 2 more calculator types** (CAC, FIRE) with mobile + dark mode variants

**Step 4: Run tests, verify pass**

---

### Task 5: Compare Toggle Button

**Objective:** Verify the compare toggle switches between single-input and dual-input mode. When compare is on, verify Scenario A/B column headers appear, delta mode buttons appear, and comparison chart renders.

**Files:**
- Create: `tests/e2e/compare-toggle.spec.ts`
- Reference: `CalculatorClient.tsx:83,190-210`
- Reference: `calculators/ui/CompareToggle.tsx`

**Test cases:**
1. Compare toggle visible (label "Compare" or icon)
2. Toggle ON → Scenario A + B labels appear
3. Toggle OFF → labels disappear, single input mode
4. When compare ON, delta mode buttons ($, %, Both) appear
5. Click delta modes → active state changes
6. Sliders in scenario A and scenario B operate independently
7. **Mobile**: compare toggle and delta buttons wrap correctly, still clickable
8. **Dark mode**: visual styles applied correctly

**Step 1: Write compare toggle visibility + click + dual mode test**
**Step 2: Write delta mode button test**
**Step 3: Run tests on 2 calculator types**

---

### Task 6: Embed Button + Embed Modal

**Objective:** Click Embed button on calculator page → EmbedModal opens with embed code. Verify modal content, close button functionality.

**Files:**
- Create: `tests/e2e/embed-button.spec.ts`
- Reference: `calculators/ui/EmbedModal.tsx`
- Reference: `CalculatorClient.tsx:291-302`

**Test cases:**
1. Embed button visible on MRR calculator
2. Click Embed → modal opens with embed iframe/code
3. Modal close button (X) → modal dismisses
4. Embed modal copy button → copies embed code
5. **Cross-calc**: verify on CAC + FIRE calculators
6. **Cross-locale**: visit Spanish `/es/revenue/mrr-calculator` → Embed button text is translated, modal still opens
7. **Dark mode**: modal renders correctly

**Step 1: Write embed button visibility + click + modal test**
**Step 2: Write embed modal close test**
**Step 3: Write copy-to-clipboard test**
**Step 4: Cross-calc verification (CAC, FIRE)**

---

### Task 7: FAQ Accordion Buttons

**Objective:** Each FAQ `<details>` element is a clickable interactive button. Click toggles open/close state, chevron rotates. Verify on multiple calculator types.

**Files:**
- Create: `tests/e2e/faq-accordion.spec.ts`
- Reference: `CalculatorClient.tsx:276-290`

**Test cases:**
1. FAQ section present on MRR calculator
2. FAQ items are initially collapsed
3. Click first FAQ item → it expands (content visible)
4. Click same FAQ item again → it collapses
5. Chevron rotates when open (check `rotate-180` class or equivalent)
6. FAQ items with affiliate links render links inside
7. **Cross-calc**: verify on 2 more calculators with different FAQ counts (CAC, FIRE)
8. **Mobile**: accordion items fill full width
9. **Dark mode**: visual styles correct

**Step 1: Write FAQ accordion open/close test**
**Step 2: Write chevron rotation visual test**
**Step 3: Cross-calc verification**

---

### Task 8: Insights Button States — Regenerate, Dismiss, Try Again

**Objective:** After "Get Insights" generates content, verify "Regenerate" and "Dismiss" buttons appear and function. Simulate error state and verify "Try Again" button.

**Files:**
- Create: `tests/e2e/insights-states.spec.ts`
- Reference: `components/Insights.tsx`

**Test cases:**
1. Click "Get Insights" → insights content appears
2. "Regenerate" button visible after insights load
3. Click "Regenerate" → loading state shows again, new insights appear
4. "Dismiss" button visible → click → insight panel closes
5. After dismissing, "Get Insights" button visible again
6. **Error state**: (if possible to simulate) or verify error UI has "Try Again" button
7. **Cross-calc**: MRR + CAC + FIRE
8. **Dark mode**: all insight states render correctly

**Step 1: Write Regenerate button test**
**Step 2: Write Dismiss button test**
**Step 3: Write Try Again error state test (or verify error UI exists)**

---

### Task 9: Contact Form Buttons

**Objective:** The contact page's form submit button and subject dropdown. Verify form validation (required fields), submit states (success/error), and input interactions.

**Files:**
- Create: `tests/e2e/contact-form.spec.ts`
- Reference: `app/contact/page.tsx`
- Reference: `components/ContactForm.tsx`

**Test cases:**
1. Contact page loads with form visible
2. Subject dropdown has options and is selectable
3. Name, email, message inputs accept text
4. Submit button visible with correct label
5. Submit with empty required fields → HTML validation triggers
6. Fill all fields → submit → success state appears
7. **Mobile**: form renders at 375px, inputs + submit still functional

**Step 1: Write form visibility + input fill test**
**Step 2: Write submit button + success state test**
**Step 3: Write mobile layout test**

---

### Task 10: Logo/Home + Footer Links

**Objective:** The logo/home link in the header navigates to `/`. All footer links navigate to correct pages.

**Files:**
- Create: `tests/e2e/logo-footer-links.spec.ts`
- Reference: `components/Nav.tsx` (logo)
- Reference: `components/FooterShow.tsx`

**Test cases:**
1. Logo link visible on homepage
2. Click logo → stays on `/`
3. Click logo from calculator page → navigates to `/`
4. Footer contains links: About, Blog, Canvas, Pricing, Contact, Privacy, Terms, Advertisers
5. Each footer link navigates to correct page
6. Footer link on mobile — same links exist and are not truncated
7. **Dark mode**: footer links readable

**Step 1: Write logo link navigation test**
**Step 2: Write each footer link navigation test**

---

### Task 11: Related Calculator Links

**Objective:** Related calculators section shows 2+ card links. Click navigates to correct calculator.

**Files:**
- Create: `tests/e2e/related-calculators.spec.ts`
- Reference: `CalculatorClient.tsx:303-320`

**Test cases:**
1. Related calculators section visible on MRR calculator
2. At least 1 related calculator card shown
3. Click first related calc → navigates to its page
4. **Cross-calc**: verify related section on 3 different calculator types
5. **Mobile**: cards stack correctly
6. **Dark mode**: hover states correct

**Step 1: Write related calc visibility + count test**
**Step 2: Write click navigation test**
**Step 3: Cross-calc verification**

---

### Task 12: Pricing Page CTA Buttons

**Objective:** Pricing page has call-to-action buttons. Each CTA is visible and clickable.

**Files:**
- Create: `tests/e2e/pricing-buttons.spec.ts`
- Reference: `app/pricing/page.tsx`

**Test cases:**
1. Pricing page loads with CTAs visible
2. Each CTA button has correct text
3. Click CTA → navigates to calculators or sign-up flow
4. **Mobile**: CTAs stack correctly
5. **Dark mode**: button styles render correctly

**Step 1: Write CTA visibility + click test**

---

### Task 13: Canvas Catalog Category Collapse/Expand + Canvas Search

**Objective:** Canvas catalog sidebar has collapsible category sections and a search input. Verify toggling works and search filters catalog.

**Files:**
- Create: `tests/e2e/canvas-catalog-interaction.spec.ts`
- Reference: `components/canvas/CalculatorCatalog.tsx`

**Test cases:**
1. Catalog shows category headers (collapsible)
2. Click category header → collapses/expands its calculator list
3. Chevron/icon changes on collapse
4. Multiple categories can be expanded simultaneously
5. Catalog search input visible
6. Type search → filters displayed calculators
7. Clear search → all calculators displayed again
8. Search with no results → empty state shown
9. **Mobile**: catalog still navigable
10. **Dark mode**: all states render correctly

**Step 1: Write category collapse/expand test**
**Step 2: Write canvas search + filter test**

---

### Task 14: Canvas Widget — Stage Selector, Share, Open Full Page, AI Chat

**Objective:** Widgets inside the canvas workspace have interactive controls: Open Full Page link, Share, AI Chat, Remove, and stage selector (if applicable). Verify each.

**Files:**
- Create: `tests/e2e/canvas-widget-interactions.spec.ts`
- Reference: `components/canvas/CalculatorWidget.tsx`

**Test cases:**
1. Widget has "Open Full Calculator" link/icon → click navigates to full calc page
2. Widget share button visible → click copies widget URL
3. Widget AI Chat toggle button visible → click opens Canvas chat
4. Widget dark mode renders correctly
5. **Mobile**: widget controls wrap correctly

**Step 1: Write Open Full Calculator link test**
**Step 2: Write widget share button test**
**Step 3: Write AI chat toggle test**

---

### Task 15: Cross-Calculator Smoke Test — 75 Calculator Button Rendering

**Objective:** Quick button presence check across ALL calculator types to catch rendering regressions on any calc page.

**Files:**
- Create: `tests/e2e/calculator-button-presence.spec.ts`
- Reference: `calculators/config/_all.ts`

**Test cases (data-driven using test.each):**
1. For each of the 75 calculators, verify:
   - Page loads without 404
   - At least 1 input slider renders
   - Get Insights button visible
   - Share button visible
   - Embed button visible
   - Stage selector (if metricKey) or its absence
2. Sampling: test 15 calculators in depth (inputs work, outputs compute)
3. Verify no "undefined" or "NaN" visible in any output

**Step 1: Create calculator slug list (from `_all.ts` or import)**
**Step 2: Write data-driven test.each for button presence on all 75**
**Step 3: Write deep interaction test on 15 sampled calculators**

---

### Task 16: Mobile Viewport — All Nav Buttons (Hamburger + Nav Links)

**Objective:** At 375px viewport, the desktop nav hides and the hamburger menu appears. Verify hamburger toggle + all nav links visible and functional.

**Files:**
- Create: `tests/e2e/mobile-nav-buttons.spec.ts`
- Reference: `components/MobileNav.tsx`

**Test cases:**
1. At 375px, hamburger button is visible
2. Desktop nav links are hidden
3. Click hamburger → mobile nav menu opens with all links
4. All mobile nav links visible: About, Blog, Canvas, Pricing, Calculators, Contact
5. Click a mobile nav link → navigates correctly
6. After navigation, mobile menu closes
7. Locale switcher still functional on mobile
8. Currency switcher still functional on mobile
9. Dark mode: mobile menu renders correctly
10. **Edge case**: hamburger → click outside → menu closes

**Step 1: Write hamburger visibility + toggle test**
**Step 2: Write mobile nav link navigation for each link**
**Step 3: Write locale/currency switcher on mobile test**

---

### Task 17: Locale Switcher — Navigate All Locales

**Objective:** The locale switcher dropdown changes the page locale. Verify switching between all 6 locales from buttons on multiple page types.

**Files:**
- Create: `tests/e2e/locale-switcher-navigation.spec.ts`
- Reference: `components/LocaleSwitcher.tsx`

**Test cases (data-driven):**
1. Locale switcher has 6 options: EN, ES, DE, PT, FR, JA
2. Click each locale → URL reflects new locale (e.g., `/es/`)
3. Page content switches to translated text
4. Locale switcher works from: homepage, category page, calculator page, canvas, blog
5. Switching locale preserves calculator state on same calc page

**Step 1: Write data-driven test for locale selection on homepage (all 6)**
**Step 2: Write locale switching from calculator page test**
**Step 3: Write locale persistence test (navigate after switching)**

---

### Task 18: Dark Mode Toggle Parity — All Buttons

**Objective:** Ensure ALL button types render correctly in dark mode, not just the toggle itself. Cross-component sweep.

**Files:**
- Modify: `tests/e2e/theme-toggle.spec.ts` (extend to cover all button types)
- Or Create: `tests/e2e/dark-mode-buttons.spec.ts`

**Test cases:**
1. Dark mode toggle switches from light → dark → light
2. In dark mode, verify:
   - Nav links have correct dark-mode text colours
   - Input slider backgrounds are dark
   - Stage selector buttons have correct dark bg/text
   - Compare toggle renders correctly
   - Insights panel buttons visible
   - Share/Embed buttons visible
   - Feedback Yes/No buttons visible
   - FAQ accordion items visible
   - Canvas catalog buttons visible
   - Footer links visible
   - Contact form inputs have dark backgrounds
3. Toggle back to light mode → all elements light-visible again

**Step 1: Write dark mode + nav button check**
**Step 2: Write dark mode + calculator button check**
**Step 3: Write dark mode + canvas button check**
**Step 4: Write dark mode + footer/contact button check**

---

### Task 19: AI Chat State Buttons — Calculator Page & Canvas

**Objective:** AI Chat widget has toggle, minimize, send, close buttons. Verify all states on both calculator pages and canvas.

**Files:**
- Create: `tests/e2e/ai-chat-buttons.spec.ts`
- Reference: `components/AiChatWidget.tsx`

**Test cases:**
1. AI Chat toggle button visible on calculator page
2. Click toggle → chat panel opens
3. Send button disabled when input empty
4. Type message → Send button becomes enabled
5. Click send → message appears in chat
6. Close button → chat panel closes
7. Re-open chat → previous messages preserved (if designed)
8. **Canvas**: AI Chat toggle in canvas workspace
9. **Mobile**: chat panel fits viewport correctly

**Step 1: Write open/close toggle test**
**Step 2: Write send button + input test**
**Step 3: Write canvas AI chat widget test**
**Step 4: Write mobile viewport chat test**

---

### Task 20: Visual/Layout Regression — Button Clipping, Overflow, Alignment

**Objective:** Use pixel measurement to verify every button type has no clipping, overflow, or alignment issues at both viewports.

**Files:**
- Create: `tests/e2e/button-visual-regression.spec.ts`

**Test cases (pixel-measurement based):**
1. **Desktop nav links**: measure `boundingBox()` → verify no overflow, all visible
2. **Stage selector**: measure bounding rect → buttons align in row, no overlap
3. **Canvas catalog buttons**: measure height consistency across all calc buttons
4. **Footer links**: measure spacing → all links equally distributed
5. **Mobile nav links**: measure each link's bounding box → visible within viewport
6. **Mobile hamburger**: verify no overlap with header elements
7. **FAQ accordions**: measure full height when expanded → content not clipped
8. **Input sliders**: measure number input + range slider → aligned and visible

**Step 1: Write bounding box measurement for nav buttons (desktop + mobile)**
**Step 2: Write canvas catalog button alignment test**
**Step 3: Write FAQ expanded height test**

```typescript
test("stage selector buttons have no overflow at 1280px", async ({ page }) => {
  await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
  const stageGroup = page.locator("button").filter({ hasText: /Seed|Series A|Series B|Series C|Growth/ });
  const count = await stageGroup.count();
  for (let i = 0; i < count; i++) {
    const box = await stageGroup.nth(i).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.width).toBeGreaterThan(20);
    expect(box!.height).toBeGreaterThan(20);
  }
});
```

**Step 4: Run pixel measurement for all button types and log results**

---

### Task 21: Embed Page Buttons

**Objective:** The embed route (`/embed/[slug]`) has no nav/header but still has calculator input sliders + share button. Verify these buttons exist and work.

**Files:**
- Modify: `tests/e2e/embed.spec.ts` (extend for button coverage)
- Reference: `app/embed/[slug]/EmbedClient.tsx`

**Test cases:**
1. Embed page loads with calculator inputs (MRR embed)
2. Input sliders are functional on embed
3. Embed page has NO nav/header/footer buttons (verify absence)
4. Share button visible on embed page (if present)
5. Click share on embed → copies embed URL

**Step 1: Write embed input interaction test**
**Step 2: Write embed share button test**
**Step 3: Write embed "no nav" verification test**

---

### Task 22: Edge Case Buttons — Empty, Error, Loading States

**Objective:** Verify buttons in edge cases: empty canvas, empty search results, loading states, error states.

**Files:**
- Create: `tests/e2e/button-edge-cases.spec.ts`

**Test cases:**
1. **Canvas empty state**: "No calculators yet" message visible + "Add calculators from catalog" prompt visible
2. **Canvas clear all from non-empty → empty**: buttons disappear
3. **Search with no results**: "No calculators found" state
4. **Insights error state**: error message + "Try Again" button
5. **Compare mode edge**: toggle compare, then toggle off again → single mode restored
6. **Canvas + with 25+ calculators**: verify scroll, no layout explosion
7. **Dark mode + compare mode**: rendering correct

**Step 1: Write empty canvas + clear all test**
**Step 2: Write empty search test**
**Step 3: Write compare toggle round-trip test**

---

### Task 23: Final Verification — Full Suite Run

**Objective:** Run entire E2E suite to verify all new tests pass alongside existing 40 spec files. No regressions.

**Step 1: Run full suite**
Run: `npx playwright test --reporter=list`
Expected: 0 failures, all ~58 files pass (40 existing + ~18 new)

**Step 2: Run with retries to check flakiness**
Run: `npx playwright test --retries=3`
Expected: 0 failures after retries

**Step 3: Run lint check**
Run: `npm run lint`
Expected: 0 new errors (only pre-existing 23 warnings in `scripts/*` and `workers/`)

**Step 4: Run build check**
Run: `npm run build`
Expected: 0 errors

**Step 5: Run unit tests**
Run: `npm run test`
Expected: 1040/1040 passing

---

## Files Changed Summary

| File | Action | Content |
|---|---|---|
| `tests/e2e/helpers.ts` | **Create** | Shared test helpers (BASE, clearCanvasStorage, toggleDarkMode, getCalcSlugs) |
| `tests/e2e/404-redirect.spec.ts` | **Create** | Regression tests for 404 redirect bug — all 6 locale root paths |
| `tests/e2e/currency-matrix.spec.ts` | **Create** | Full 20-currency switcher — dropdown, switching, persistence, mobile, dark mode (Task B) |
| `tests/e2e/locale-page-matrix.spec.ts` | **Create** | Full 6-locale × page type matrix — nav/button labels, translations, number formatting (Task C) |
| `tests/e2e/locale-currency-cross-product.spec.ts` | **Create** | Locale × Currency cross-product — defaults, overrides, persistence (Task D) |
| `tests/e2e/stage-selector.spec.ts` | **Create** | Stage selector buttons (5 stages × 3 calc types × 2 viewports) — locale parameterized |
| `tests/e2e/compare-toggle.spec.ts` | **Create** | Compare toggle + delta mode buttons — locale parameterized |
| `tests/e2e/embed-button.spec.ts` | **Create** | Embed button + modal open/close/copy — locale parameterized |
| `tests/e2e/faq-accordion.spec.ts` | **Create** | FAQ accordion expand/collapse — locale parameterized |
| `tests/e2e/insights-states.spec.ts` | **Create** | Regenerate, Dismiss, Try Again buttons |
| `tests/e2e/contact-form.spec.ts` | **Create** | Contact form submit + validation |
| `tests/e2e/logo-footer-links.spec.ts` | **Create** | Logo link + footer link navigation — locale parameterized |
| `tests/e2e/related-calculators.spec.ts` | **Create** | Related calc card navigation |
| `tests/e2e/pricing-buttons.spec.ts` | **Create** | Pricing CTA buttons |
| `tests/e2e/canvas-catalog-interaction.spec.ts` | **Create** | Canvas catalog collapse/expand + search |
| `tests/e2e/canvas-widget-interactions.spec.ts` | **Create** | Canvas widget stage selector, share, open full page, AI Chat |
| `tests/e2e/calculator-button-presence.spec.ts` | **Create** | Data-driven button presence across all 75 calculators — locale parameterized |
| `tests/e2e/mobile-nav-buttons.spec.ts` | **Create** | Mobile hamburger + nav links at 375px |
| `tests/e2e/locale-switcher-navigation.spec.ts` | **Create** | 6-locale switching from each page type (Task 17) |
| `tests/e2e/dark-mode-buttons.spec.ts` | **Create** | Dark mode parity for all button types |
| `tests/e2e/ai-chat-buttons.spec.ts` | **Create** | AI Chat toggle/send/close on calc page + canvas |
| `tests/e2e/button-visual-regression.spec.ts` | **Create** | Pixel measurement for clipping/overflow/all |
| `tests/e2e/embed.spec.ts` | **Modify** | Extend for share button, embed input interaction |
| `tests/e2e/button-edge-cases.spec.ts` | **Create** | Empty/error/loading states |
| `tests/e2e/comprehensive-locale-tests.spec.ts` | **Modify** | Extend with currency × locale combination tests beyond existing 3 currencies |
| `tests/e2e/locale-coverage.spec.ts` | **Modify** | Fix URL paths (/{code}/{currency} are not valid routes); extend to all 20 currencies via switcher interaction |
| `tests/e2e/currency.spec.ts` | **Modify** | Extend to test all 20 currencies in dropdown (not just EUR/GBP) |

---

## Risks, Tradeoffs & Open Questions

### Risks
1. **Flaky tests**: Tests with clipboard access (`navigator.clipboard.readText()`) may fail in headless CI. Mitigation: use `browserContext.grantPermissions(['clipboard-read', 'clipboard-write'])` or mock clipboard write and verify via DOM change instead.
2. **Stage selector only visible on calculators with `metricKey`**: ~15 of 75 calculators have this. Must detect metricKey dynamically and skip tests where absent.
3. **Insights API dependency**: "Get Insights" makes an AI API call. Test might time out if API is slow. Mitigation: use shorter timeout, test the "loading UI" state rather than waiting for real completion, or intercept the network request.
4. **Contact form actual submission**: Submitting the contact form may fire a real API call. Use Playwright network intercept (`page.route()`) to stub the POST and test the UI flow.
5. **LocaleSwitcher `href` patterns**: Locale routes change URL structure (`/es/revenue/mrr-calculator`). Tests must account for the locale prefix in URL assertions.
6. **Test execution time**: Adding ~26 new spec files (~350 new tests) will increase E2E run time from ~3 minutes to potentially ~15-20 minutes. Mitigation: run in CI with `--workers=4`, tag slow tests, use data-driven `test.each` to consolidate file count.
7. **Locale × Currency matrix explosion**: 6 locales × 20 currencies = 120 combinations per test. NOT all combinations are needed — use representative subsets: 6 locales × 5 representative currencies (EUR, GBP, JPY, BRL, INR) for deep tests, and smoke-test all 20 currencies only in the dropdown presence check.
8. **Data-driven test clarity**: Nested `test.each` with many combinations produces hard-to-read failure output. Use nested describe blocks (locale outer, currency inner) for readable test names like `[es][GBP] Currency displays correctly`.
9. **Currency symbol ambiguity**: JPY and CNY both use the same symbol (¥), NOK/SEK/DKK all use "kr". Tests must verify by CURRENCY CODE, not just symbol, to avoid false passes.
10. **Currency in embedded calculators**: The embed route has no nav header, so the currency switcher element may not exist. Tests must account for embed's different structure.### Tradeoffs
1. **70 calculators × deep interaction** is too slow for E2E. Tradeoff: run button-presence smoke test on ALL 75 (fast, data-driven), but deep interaction test on only 15 representative calculators.
2. **Pixel-perfect visual regression** (screenshot diffing) vs. boundingBox measurements. Screenshot diffing is more sensitive but also more flaky. This plan uses boundingBox + class assertions for reliability, with optional screenshot-on-failure for debugging.

### Open Questions
1. Should insights error state tests mock the API response via `page.route()` to reliably trigger the "Try Again" button, or rely on real API timeout?
2. For canvas with 25+ calculators, what's the actual max limit? Should we test boundary?
3. Does the AI Chat widget in canvas share state with the AI Chat on calculator pages, or are they separate instances?
4. Are there any reusable `<select>` components on the pricing page (monthly/yearly toggle), or are they buttons?
5. Does the locale switcher persist across page navigations?
6. **Currency on embed pages**: The embed layout has no nav — is there an alternate way to set the currency cookie, or should embed tests always use the default (USD)?
7. **Currency formatting in calculator outputs**: Do ALL 75 calculators display their results with the currency prefix from CurrencyProvider, or only monetary calculators?
8. **Locale number formatting**: Does `Intl.NumberFormat` get used consistently across all calculator engine outputs, or is formatting handled differently per engine?## Execution Handoff

Plan complete and saved. Ready to execute using subagent-driven-development — I'll dispatch a fresh subagent per task with two-stage review (spec compliance then code quality). Each subagent gets the full context of the button inventory, the existing test patterns, and the exact cases to implement.

**Critical dependency chain:**
1. Task A (404 redirect fix) — MUST run FIRST (critical routing fix affects all locale-rooted tests)
2. Task B (Currency Matrix) — after A is verified
3. Task C (Locale Page Matrix) — after A is verified
4. Task D (Locale × Currency Cross-Product) — after B + C are verified
5. Tasks 3-22 — after A (any order, parallel where possible)
6. Task 23 (Final full-suite verification) — MUST run LAST

After Tasks A-D are complete, run Tasks 4-9 (independent calculator page tests), Tasks 10-12 (independent page tests), Tasks 13-14 (canvas-specific), and Tasks 15-22 (cross-cutting) in parallel where possible. Task 3 (setup) provides baseline verification but can run concurrently with Task A.