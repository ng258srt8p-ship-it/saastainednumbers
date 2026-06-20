# WebCalc E2E Testing Plan

## Test Files

| Test File | Coverage | Status |
|-----------|----------|--------|
| `smoke.spec.ts` | Homepage loads, nav links, calculator pages 200, embed pages 200, category pages 200 | ✅ Done |
| `calculator-behavior.spec.ts` | Stage selector (16 calculators), calculator inputs/outputs | ✅ Done |
| `locale.spec.ts` | Locale cookie → nav text rendering | ✅ Done |
| `locale-prefixed.spec.ts` | Locale-prefixed pages 200, lang attributes, content differences | ✅ Done |
| `locale-switching.spec.ts` | LocaleSwitcher UI (dropdown, highlight, close behaviors) | ✅ Done |
| `links.spec.ts` | All links return 200, all calculator/embed/category pages 200 | ✅ Done |
| `analytics.spec.ts` | GA4 script injection, config events on calc/embed/category/home | ✅ Done |
| `accessibility.spec.ts` | WCAG 2.1 AA audit on 30+ pages (axe-core) | ✅ Done |
| `mobile-nav.spec.ts` | Hamburger, dialog, aria-expanded, mobile viewport | ✅ Done |
| `check-layout.spec.ts` | Homepage section alignment | ✅ Done |
| `theme.spec.ts` | Theme toggle, dark/light mode, localStorage persistence, embed theme params | ✅ Done |
| `currency.spec.ts` | Currency switcher, dropdown, symbol updates, mobile menu integration | ✅ Done |
| `embed.spec.ts` | Embed page structure, postMessage, theme/height/hideHeader params, all 75 embeds | ✅ Done |
| `calculator-interaction.spec.ts` | Input sliders update results, range sync, primary/secondary results, error handling, share button | ✅ Done |
| `breadcrumbs.spec.ts` | Breadcrumb hierarchy (Home > Category > Calculator), JSON-LD | ✅ Done |
| `seo.spec.ts` | robots.txt, sitemap.xml, page titles, meta descriptions, OG tags, canonical, JSON-LD | ✅ Done |
| `pricing.spec.ts` | Pricing page content, $0/forever, features, CTA | ✅ Done |
| `blog.spec.ts` | Blog listing, featured post, article cards, post pages, navigation | ✅ Done |
| `categories.spec.ts` | All 9 category pages, calculator cards, search, empty/unknown state | ✅ Done |
| `not-found.spec.ts` | 404 page rendering, Go Home/Dashboard navigation, deeply nested routes | ✅ Done |
| `homepage.spec.ts` | Hero section, category grid, CTAs, section containers, no console errors | ✅ Done |
| `dashboard.spec.ts` | Dashboard widgets, input fields, URL state, reset defaults, add calculator, share | ✅ Done |
| `share.spec.ts` | Share button on calculators + dashboard, clipboard copy, Copied state reversion | ✅ Done |
| `insights.spec.ts` | Get Insights button, loading state, insights content, dismiss | ✅ Done |
| `feedback.spec.ts` | Was this helpful?, Yes/No buttons, thanks message, buttons hidden after submit | ✅ Done |
| `search.spec.ts` | Calculator search on category + /calculators pages, filtering, ARIA attributes | ✅ Done |

## Setup

```bash
# Install browsers
npx playwright install --with-deps chromium

# Run all E2E tests (starts Next.js dev server automatically)
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/theme.spec.ts

# Run with UI mode
npm run test:e2e:ui

# Run with headed browser
npm run test:e2e:headed

# Serve static export and run tests (for CI-like run)
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
