# WebCalc  -  Agent Context

## Current Build Status
- TypeScript: ✅ Passes (0 errors)
- Lint: ✅ Passes (0 errors, 23 warnings — pre-existing)
- Build: ✅ Passes (Next.js 16.2.6, Turbopack, static export)
- Unit Tests: ✅ 355/355 (Vitest, 90 test files)

## Project Structure
```
webcalc/
├── calculators/
│   ├── config/            # 76 files: schema + 75 calculator configs
│   ├── engine/            # 75 pure TS engine functions
│   └── ui/                # 8 shared React components + EmbedModal
├── app/
│   ├── [category]/        # Category listing (SSG, 9 categories)
│   │   └── [slug]/        # Calc pages + CalculatorClient (75 engines)
│   ├── api/og/            # Dynamic OG image generation
│   ├── blog/              # Blog listing + [slug] routes
│   ├── dashboard/         # Interconnected SaaS dashboard
│   ├── embed/             # Embed layout (no nav)
│   │   └── [slug]/        # Embed route + EmbedClient (75 engines, postMessage)
│   ├── pricing/           # Pricing page ($0 forever — all free)
│   ├── layout.tsx         # Root layout (Nav, skip-to-content)
│   ├── not-found.tsx      # Styled 404 page
│   ├── robots.ts          # Robots.txt
│   ├── sitemap.ts         # Dynamic sitemap (100+ URLs)
│   └── page.tsx           # Homepage with category grid
├── lib/
│   ├── auth.ts            # NextAuth v5 (Google + Resend, Prisma adapter)
│   ├── prisma.ts          # Prisma client singleton
│   ├── getTranslations.ts # Server-side i18n loader
│   ├── useLocale.ts       # Client-side i18n hook
│   ├── embed.ts, insights-engine.ts, posthog.ts, registry.ts, seo.ts
│   ├── content-uniqueness.ts, kill-switch.ts
│   ├── related-calculators.ts, useCalculatorState.ts, utils.ts
├── i18n/
│   ├── en/common.json     # English locale
│   ├── es/common.json     # Spanish locale
│   ├── de/common.json     # German locale
│   ├── pt/common.json     # Portuguese locale
│   ├── fr/common.json     # French locale
│   └── ja/common.json     # Japanese locale
├── prisma/schema.prisma   # UserAccount, CalculationRecord, Account, Session, VerificationToken
├── tests/
│   └── calculators/       # 76 test files, 258 tests
├── components/
│   ├── EmailCapture.tsx    # Email subscription below calc results
│   ├── FeedbackWidget.tsx  # User feedback
│   ├── Nav.tsx             # Server component nav with i18n
│   ├── ThemeToggle.tsx     # Dark mode toggle
│   ├── MobileNav.tsx       # Mobile hamburger nav
│   ├── ShareButton.tsx     # Share/Copy result URLs
│   ├── HealthBadge.tsx     # Benchmark indicator badges
│   ├── Insights.tsx        # AI-powered insights (rule-based engine)
│   └── PostHogProvider.tsx # Analytics provider
├── middleware.ts           # Locale detection (Accept-Language → cookie)
├── types/next-auth.d.ts    # Session user type augmentation
└── public/logo.svg         # Brand logo
```

## Key Stats
- **75 calculators** across 9 categories (Revenue, Churn, Growth, Unit Economics, AI Cost, Side Hustle, Personal Finance, General Business, SaaS Deepen)
- **258 unit tests** across 76 test files
- **107+ pages** generated · **6 languages** (EN, ES, DE, PT, FR, JA)
- **1326 pages** per full build (221 × 6 locales)

## Revenue Model
- 100% free — no paywalls. Display ads (EthicalAds primary, AdSense fallback).
- Affiliate links: contextual links within calculator FAQ sections (markdown only).
- No ads on `/embed/*` (embeds are distribution).

## Key Conventions
- Calculator engines are pure TS (no React/framework deps)
- Use `@/` path aliases for all imports
- Embed postMessage sends `{source: "webcalc-embed", slug, inputs, results}` to parent
- i18n uses cookie-based locale detection with Accept-Language fallback
- All calculators: engine (pure TS) + config (`registerCalculator`) + unit tests + E2E smoke tests
- Barrel import: `calculators/config/_all.ts` imports all 75 configs

## Env Vars Required
- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_RESEND_KEY`
- `DATABASE_URL` (Neon/postgres)
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_ETHICAL_ADS_ID`, `NEXT_PUBLIC_ADSENSE_ID`, `NEXT_PUBLIC_BASE_URL`

## Current State (June 2026)
- **12 of 13 page files** call `getTranslations()` (legal excluded)
- **107 keys × 6 locales** = 642 translated strings across all UI sections
- Sign-in disabled; all calculators functional without auth
- All 5 non-English locales have natural, idiomatic translations for all UI sections
