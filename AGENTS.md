# WebCalc  -  Agent Context

## Current Build Status
- TypeScript: ✅ Passes (0 errors)
- Lint: ✅ Passes (0 errors, 0 warnings)
- Build: ✅ Passes (Next.js 16.2.6, Turbopack)
- Unit Tests: ✅ 258/258 (Vitest, 76 test files)

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
│   ├── pricing/           # Pricing page ($0 forever  -  all free)
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
- **75 calculators** across 9 categories
- **258 unit tests** across 76 test files
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
- Display ads: EthicalAds primary, AdSense fallback (infrastructure not yet deployed)
- Ad components removed during cleanup; ad slot placeholder preconnect hints survive in layout
- Affiliate links: contextual links within calculator FAQ sections (markdown only, no dedicated component)
- No ads on /embed/* (embeds are distribution)

## Key Conventions
- Calculator engines are pure TS (no React/framework deps)
- Use `@/` path aliases for all imports
- Embed postMessage sends `{source: "webcalc-embed", slug, inputs, results}` to parent
- i18n uses cookie-based locale detection with Accept-Language fallback
- All calculators follow pattern: engine (pure TS) + config (registerCalculator) + unit tests + E2E smoke tests
- Barrel import file `calculators/config/_all.ts` imports all 75 config files

## Env Vars Required
- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_RESEND_KEY`
- `DATABASE_URL` (Neon/postgres)
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_ETHICAL_ADS_ID` (EthicalAds publisher ID)
- `NEXT_PUBLIC_ADSENSE_ID` (Google AdSense publisher ID, fallback)
- `NEXT_PUBLIC_BASE_URL`

## Email Capture
- Component at `components/EmailCapture.tsx` POSTs to `/api/subscribe`
- Requires a Cloudflare Pages Function at `functions/api/subscribe.js` (not yet created — see instructions below)
- Falls back to local state if endpoint unavailable

## Deployment Instructions for Email Capture
To make the email capture work, create `functions/api/subscribe.js` in the project root:

```js
export async function onRequest(context) {
  const { request } = context;
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Store the email — add KV or external service here
    console.log("New subscriber:", email);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

Then the deploy workflow will auto-deploy it alongside the static assets. Subscribers are logged to Cloudflare Pages logs by default. Connect a KV namespace or forward to an email service for permanent storage.

## Signed Out UX
- Sign-in page removed; sign-in button removed from nav
- Auth infrastructure kept (auth.ts, AuthProvider, Prisma adapter) for admin login and calculation saving
- Account pages show "sign in is currently disabled" when not authenticated
- All calculators fully functional without sign-in

## Session Summary (May 25, 2026)

### Done
- **Footer centering**: Changed footer from `grid grid-cols-3` to `flex flex-wrap justify-center` with gap-based spacing for centered 3-column layout
- **Search icon**: Replaced emoji 🔍 with Material Symbols "search" icon
- **Content currency audit**: Comprehensive audit (32 items across 5 phases + 4 deployment)
- **Phase 1-6 implementation**:
  - Pricing page metadata, language support text, meta description expansion
  - 401k defaults, side-income-tax config, benchmarks update
  - Removed AnalyticsClient, cleaned AGENTS.md
  - Cleaned translation keys from all 6 locale files, removed dead i18n code
  - Removed dead AI code from insights route, cleaned i18n.ts
  - Updated deploy workflow
- **Git email fix**: Rebated 18 commits to replace `privaterelay.appleid.com` with `users.noreply.github.com`; force-pushed to remote
