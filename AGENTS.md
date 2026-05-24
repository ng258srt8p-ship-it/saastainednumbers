# WebCalc  -  Agent Context

## Current Build Status
- TypeScript: ✅ Passes (0 errors)
- Lint: ✅ Passes (0 errors, 0 warnings)
- Build: ✅ Passes (Next.js 16.2.6, Turbopack)
- Unit Tests: ✅ 231/231 (Vitest, 75 test files)
- E2E Tests: ✅ 215/215 (Playwright)

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
│   ├── api/auth/[...nextauth]/  # NextAuth v5 route handler
│   ├── api/calculations/save/   # Calculation save to DB
│   ├── api/analytics/capture/   # PostHog analytics proxy
│   ├── account/calculations/ # Saved calculations
│   ├── account/settings/  # Account settings (language display only)
│   ├── blog/              # Blog listing + [slug] routes
│   ├── dashboard/         # Interconnected SaaS dashboard
│   ├── embed/             # Embed layout (no nav)
│   │   └── [slug]/        # Embed route + EmbedClient (75 engines, postMessage)
│   ├── prelaunch/         # Email capture landing page
│   ├── pricing/           # Pricing page ($0 forever  -  all free)
│   ├── request-calculator/ # Request form page
│   ├── layout.tsx         # Root layout (Nav, AdScripts, skip-to-content)
│   ├── not-found.tsx      # Styled 404 page
│   ├── robots.ts          # Robots.txt
│   ├── sitemap.ts         # Dynamic sitemap (100+ URLs)
│   └── page.tsx           # Homepage with category grid
├── lib/
│   ├── auth.ts            # NextAuth v5 (Google + Resend, Prisma adapter)
│   ├── prisma.ts          # Prisma client singleton
│   ├── ads.ts             # Ad network config + constants
│   ├── affiliates.ts      # Affiliate program registry (9 categories)
│   ├── getTranslations.ts # Server-side i18n loader
│   ├── useLocale.ts       # Client-side i18n hook
│   ├── embed.ts, i18n.ts, posthog.ts, registry.ts, seo.ts
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
│   ├── calculators/       # 75 test files, 231 tests
│   └── e2e/               # 215 Playwright tests (smoke + link + embed + behavior)
├── components/
│   ├── AdSlot.tsx          # Ad placement (mobile sticky footer, responsive)
│   ├── AdScripts.tsx       # Ad network scripts (EthicalAds, AdSense)
│   ├── AnalyticsClient.tsx # PostHog pageview tracking
│   ├── AuthNav.tsx         # Server component nav (sign-in removed)
│   ├── AuthProvider.tsx    # SessionProvider wrapper
│   ├── FeedbackWidget.tsx  # User feedback
│   ├── LocaleSwitcher.tsx  # Language dropdown (EN/ES/DE/PT/FR/JA)
│   ├── Nav.tsx             # Server component nav with i18n
│   ├── VerifiedBadge.tsx   # Accuracy badge
│   ├── AffiliateTools.tsx  # Recommended tools section
│   └── ui/button.tsx       # shadcn/ui button
├── middleware.ts           # Locale detection (Accept-Language → cookie)
├── types/next-auth.d.ts    # Session user type augmentation
└── public/logo.svg         # Brand logo
```

## Key Stats
- **75 calculators** across 9 categories
- **231 unit tests** across 75 test files
- **215 E2E tests**
- **107+ pages** generated
- **6 languages** (EN, ES, DE, PT, FR, JA)
- **Revenue model**: Display ads (EthicalAds primary, AdSense fallback) + affiliate links
- **Brand**: Teal/navy (`#008387` / `#143562`), dark hero sections, glassmorphism nav

## Categories
1. **Revenue** (MRR, ARR, ARPU, LTV, NRR, etc.)
2. **Churn & Retention** (Churn Rate, NPS, Customer Health, Engagement)
3. **Growth & Efficiency** (CAC, Quick Ratio, Magic Number, Rule of 40)
4. **Unit Economics** (Gross Margin, Contribution Margin, Payback, Burn Rate)
5. **AI Cost** (Claude, ChatGPT, Gemini, Grok, Image Gen, Fine-tuning, Perplexity, Model Comparison)
6. **Side Hustle** (YouTube, Twitch, Podcast, Newsletter, FBA, Affiliate, Blogging, Etsy, POD, Dropshipping, TikTok, Subscription Content, Side Income Tax, Freelance, Gig Worker)
7. **Personal Finance** (FIRE, Savings Rate, Investment Returns, Debt Payoff, Emergency Fund, Mortgage, Student Loan, Rent vs Buy, Credit Card, 401k, Dividend Income)
8. **General Business** (Break-Even, ROI, Employee Cost, Pricing Strategy, Contractor vs Employee, Valuation, Cash Runway)
9. **SaaS Deepen** (Unit Economics Dashboard, Feature Adoption, Time to Value, ARPU Trend, Quick Ratio, Cohort Analysis, Capital Efficiency, CAC Payback Enhanced)

## Revenue Model
- 100% free — no paywalls, no gating, no subscription tiers
- Display ads: EthicalAds primary, AdSense fallback
- Two ad slots per calc page (below results, between sections)
- Mobile sticky footer ad for high viewability
- No ads on /embed/* (embeds are distribution)
- Contextual affiliate links in calculator content

## Key Conventions
- Calculator engines are pure TS (no React/framework deps)
- Use `@/` path aliases for all imports
- Embed postMessage sends `{source: "webcalc-embed", slug, inputs, results}` to parent
- i18n uses cookie-based locale detection with Accept-Language fallback
- Ad slots: 3 placements per page (below-results, between-sections, sticky-footer mobile-only)
- Affiliate links: contextual links within calculator content + FAQ sections
- All calculators follow pattern: engine (pure TS) + config (registerCalculator) + unit tests + E2E smoke tests
- Barrel import file `calculators/config/_all.ts` imports all 75 config files

## Env Vars Required
- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_RESEND_KEY`
- `DATABASE_URL` (Neon/postgres)
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_ETHICAL_ADS_ID` (EthicalAds publisher ID)
- `NEXT_PUBLIC_ADSENSE_ID` (Google AdSense publisher ID, fallback)
- `NEXT_PUBLIC_BASE_URL`

## Signed Out UX
- Sign-in page removed; sign-in button removed from nav
- Auth infrastructure kept (auth.ts, AuthProvider, Prisma adapter) for admin login and calculation saving
- Account pages show "sign in is currently disabled" when not authenticated
- All calculators fully functional without sign-in
