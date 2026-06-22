# WebCalc E2E Testing Plan

## Architecture

15 focused spec files organized by feature area. Numbered for deterministic execution order. No redundancy between files — each file owns one concern.

All tests use shared helpers from `helpers.ts` (locators, actions, constants).

## Test Files

| # | File | Coverage | Tests |
|---|------|----------|-------|
| 01 | `01-smoke.spec.ts` | Homepage load, nav links, all page routes 200, 404 handling, /about and /contact removed | ~20 |
| 02 | `02-calculators.spec.ts` | All 86 calculators: load, inputs, results, stages, compare, reset | ~25 |
| 03 | `03-embed.spec.ts` | All 86 embeds: no nav/footer, attribution, URL params, postMessage | ~20 |
| 04 | `04-navigation.spec.ts` | Nav, breadcrumbs, mobile hamburger, footer links, no about/contact | ~18 |
| 05 | `05-locale-i18n.spec.ts` | All 6 locales: lang attrs, translations, currency×locale, persistence | ~22 |
| 06 | `06-theme.spec.ts` | Dark/light toggle, localStorage persistence, cross-page, embed themes | ~12 |
| 07 | `07-currency.spec.ts` | All 20 currencies, switching, persistence, mobile, dropdown behavior | ~15 |
| 08 | `08-seo.spec.ts` | robots.txt, sitemap, titles, meta, OG, canonical, JSON-LD, /about & /contact 404 | ~15 |
| 09 | `09-accessibility.spec.ts` | axe-core WCAG 2.1 AA on 6 page types, skip-to-content, form labels | ~10 |
| 10 | `10-interactions.spec.ts` | Share, feedback, insights, compare toggle, search filtering | ~15 |
| 11 | `11-canvas.spec.ts` | Workspace: add/remove, templates, exec summary, persistence, mobile | ~15 |
| 12 | `12-blog.spec.ts` | Listing, post pages, navigation, dates, mobile, cross-locale | ~12 |
| 13 | `13-pricing.spec.ts` | Free tier, $0, features, CTA, FAQ accordion, no about/contact links | ~12 |
| 14 | `14-dashboard.spec.ts` | Widgets, empty state, add calc, dark mode, share, mobile | ~10 |
| 15 | `15-analytics.spec.ts` | GA4 script injection, dataLayer, gtag, no duplicates across pages | ~10 |

**Total: ~221 test cases across 15 files**

## Key Design Principles

- **One concern per file** — no mixing locale tests with interaction tests
- **All 86 calculators covered** in `02-calculators.spec.ts` (smoke + input/output)
- **All 86 embeds covered** in `03-embed.spec.ts`
- **No redundant locale tests** — consolidated from 8+ files into one
- **No redundant nav tests** — consolidated from 5+ files into one
- **Helper-driven** — reuse `helpers.ts` locators and actions
- **No fabricated page references** — no `/about` or `/contact` in tests (except to verify 404)

## Shared Helpers (`helpers.ts`)

| Helper | Purpose |
|--------|---------|
| `BASE` | Base URL constant (`http://localhost:3000`) |
| `MOBILE` | Mobile viewport dimensions (390×844) |
| `LOCALES` | All 6 supported locales with codes and names |
| `ALL_CURRENCIES` | All 20 supported currencies with codes and symbols |
| `REP_CURRENCIES` | 5 representative currencies for deep testing |
| `DEFAULT_CURRENCY` | Default currency per locale |
| `CALC_SLUGS` | 8 representative calculator slugs across categories |
| `currencyBtn(page)` | Currency switcher button locator |
| `localeSwitcherBtn(page)` | Language switcher button locator |
| `hamburgerBtn(page)` | Mobile hamburger button locator |
| `themeToggle(page)` | Theme toggle button locator |
| `switchCurrency(page, code)` | Switch currency via dropdown |
| `toggleDarkMode(page, theme)` | Toggle to target dark/light mode |
| `gotoCalculator(page, cat, slug, locale?)` | Navigate to calculator with optional locale |
| `clearCanvasStorage(page)` | Clear canvas workspace localStorage |
| `addCalculatorToCanvas(page, name)` | Add calculator to canvas by name |

## Setup

```bash
# Install browsers
npx playwright install --with-deps chromium

# Run all E2E tests (starts Next.js dev server automatically)
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/06-theme.spec.ts

# Run with UI mode
npm run test:e2e:ui

# Run with headed browser
npm run test:e2e:headed

# Serve static export and run tests (CI-like)
./scripts/build-static.sh
npx serve out -l 3000 &
npx playwright test

# Generate report
npx playwright show-report
```

## CI Integration

The `e2e-tests` job in `.github/workflows/deploy.yml`:
- Runs after `quality` passes (parallel to `deploy`)
- Builds static export via `build-static.sh`
- Installs Playwright Chromium + system deps
- Serves static files with `serve` and runs all e2e tests
- Uploads Playwright HTML report as artifact on failure

## Migration Notes

This plan replaces the previous 55+ overlapping spec files. The old files tested many features multiple times across redundant locale/nav/embed combinations. The new plan tests each feature once thoroughly, with locale/currency variants consolidated into dedicated files.
