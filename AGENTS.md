# WebCalc — Agent Context

## Current Build Status
- TypeScript: ✅ Passes (0 errors)
- Lint: ✅ Passes (0 errors, 0 warnings)
- Build: ✅ Passes (Next.js 16.2.6, Turbopack) — 78 pages
- Unit Tests: ✅ 71/71 (Vitest, 25 test files)
- E2E Tests: ✅ 46/46 (Playwright)

## Project Structure
```
webcalc/
├── calculators/
│   ├── config/            # 26 files: schema + 25 calculator configs
│   ├── engine/            # 25 pure TS engine functions
│   └── ui/                # 8 shared React components + EmbedModal
├── app/
│   ├── [category]/        # Category listing (SSG)
│   │   └── [slug]/        # Calc pages + CalculatorClient (25 engines)
│   ├── api/og/            # Dynamic OG image generation
│   ├── api/auth/[...nextauth]/  # NextAuth v5 route handler
│   ├── api/calculations/save/   # Calculation save to DB
│   ├── api/analytics/capture/   # PostHog analytics proxy
│   ├── api/stripe/        # Checkout, webhook, portal routes
│   ├── auth/signin/       # Sign-in page (Google OAuth + magic link)
│   ├── account/calculations/ # Saved calculations (auth required)
│   ├── account/settings/  # Account settings
│   ├── blog/              # Blog listing + [slug] routes
│   ├── dashboard/         # Interconnected SaaS dashboard
│   ├── embed/             # Embed layout (no nav)
│   │   └── [slug]/        # Embed route + EmbedClient (25 engines, postMessage)
│   ├── prelaunch/         # Email capture landing page
│   ├── pricing/           # Pricing page (Free vs $9/mo Pro)
│   ├── request-calculator/ # Request form page
│   ├── layout.tsx         # Root layout (AuthProvider, Nav, skip-to-content)
│   ├── not-found.tsx      # Styled 404 page
│   ├── robots.ts          # Robots.txt
│   ├── sitemap.ts         # Dynamic sitemap (100+ URLs)
│   └── page.tsx           # Homepage with category grid
├── lib/
│   ├── auth.ts            # NextAuth v5 (Google + Resend, Prisma adapter)
│   ├── prisma.ts          # Prisma client singleton
│   ├── stripe.ts          # Stripe server client + price constants
│   ├── getTranslations.ts # Server-side i18n loader
│   ├── useLocale.ts       # Client-side i18n hook
│   ├── embed.ts, i18n.ts, posthog.ts, registry.ts, seo.ts
│   ├── content-uniqueness.ts, design-tokens.ts, kill-switch.ts
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
│   ├── calculators/       # 25 test files, 71 tests
│   └── e2e/               # 46 Playwright tests (smoke + link + embed + dashboard)
├── components/
│   ├── AnalyticsClient.tsx # PostHog pageview tracking
│   ├── AuthNav.tsx         # Server component nav (auth()-based)
│   ├── AuthProvider.tsx    # SessionProvider wrapper
│   ├── FeedbackWidget.tsx  # User feedback
│   ├── LocaleSwitcher.tsx  # Language dropdown (EN/ES/DE/PT/FR/JA)
│   ├── Nav.tsx             # Server component nav with i18n
│   ├── PremiumGate.tsx     # Pro paywall overlay component
│   ├── VerifiedBadge.tsx   # Accuracy badge
│   └── ui/button.tsx       # shadcn/ui button
├── middleware.ts           # Locale detection (Accept-Language → cookie)
├── types/next-auth.d.ts    # Session user type augmentation
└── public/logo.svg         # Brand logo
```

## Completed Phases (All 11)
- **Phase 1** (Scaffold): ✅ Project scaffold, config schema, homepage, nav, footer
- **Phase 2** (Input/UX): ✅ Input components, URL state, SEO, i18n, PostHog
- **Phase 3** (Original 5): ✅ 5 engines + configs + dynamic route + tests
- **Phase 4** (Content): ✅ OG images, blog scaffold, request-a-calc, benchmark data
- **Phase 5** (Dashboard): ✅ Dashboard + 5 calculators
- **Phase 6** (Embed): ✅ Embed route + postMessage API + embed button/modal + Playwright tests
- **Phase 7** (Auth): ✅ NextAuth v5, Prisma schema, auth pages, AuthNav, calculation save API
- **Phase 8** (Monetization): ✅ Stripe integration, pricing page, checkout/webhook/portal APIs, premium gating (20 premium calculators)
- **Phase 9** (i18n): ✅ 5 locale files (ES/DE/PT/FR/JA), middleware, locale switcher, server/client translation
- **Phase 10** (Expansion): ✅ 5 new calculators (Activation Rate, Trial-to-Paid, Expansion Revenue Rate, Net Cash Flow, Lead Conversion) — 25 total
- **Phase 11** (Polish): ✅ 0 lint/TS errors, skip-to-content, aria-live, glassmorphism nav, SaaStify-inspired brand (purple gradient), clean ESLint

## Post-Phase Enhancements
- ✅ **5 blog posts** with rich content (SaaS metrics guide, MRR growth, customer health score, pricing strategies, activation rate)
- ✅ **All 25 calculators covered** in E2E tests (5 full test, 20 light smoke tests)
- ✅ **All 25 calculators covered** in embed E2E tests
- ✅ **Prelaunch page form** now functional (captures email, shows success)
- ✅ **Settings page** with real Prisma subscription lookup, Stripe portal link, language display
- ✅ **OG images** use new purple brand gradient
- ✅ **@tailwindcss/typography** installed for prose blog content
- ✅ **Sitemap** includes 5 blog posts
- ✅ **Links.spec.ts** broken selector fixed

## Key Stats
- **25 calculators** (5 free + 20 premium) with 500+ words content, 8 FAQ items, benchmark data each
- **78 pages** generated
- **71 unit tests** across 25 test files
- **46 E2E tests** (Playwright) covering all 25 calculators + embeds
- **6 languages** (EN, ES, DE, PT, FR, JA)
- **5 blog posts** with 4000+ words total content
- **Stripe monetization** ($9/mo Pro tier)

## Key Conventions
- Calculator engines are pure TS (no React/framework deps)
- Use `@/` path aliases for all imports
- Embed postMessage sends `{source: "webcalc-embed", slug, inputs, results}` to parent
- Prisma v5.22.0 (v7 broke `url` in schema datasource)
- NextAuth v5 with `auth()` server function (not `getServerSession`)
- i18n uses cookie-based locale detection with Accept-Language fallback
- Premium calculators gated via PremiumGate component
- Brand: Purple/violet gradient (`#7c5cfc` → `#5b3cc4`), dark hero sections, glassmorphism nav

## Env Vars Required
- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_RESEND_KEY`
- `DATABASE_URL` (Neon/postgres)
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_BASE_URL`
