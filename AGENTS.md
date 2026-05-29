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
project root/
├── functions/
│   └── api/
│       └── subscribe.js    ← auto-deployed as Cloudflare Pages Function
├── out/                    ← static export (from Next.js build)
├── build-static.sh
└── wrangler.jsonc
```

No changes needed to the deploy.yml. On the next push to `main`, the function will be live.

### Test That It Works

After deployment, test from any calculator page (e.g. `https://saastainednumbers.com/revenue/mrr-calculator`):

1. Scroll to the email capture form below the results
2. Enter an email address and click **Subscribe**
3. If successful, you'll see "You're subscribed!" — the function logged the email to Cloudflare Pages logs
4. To view logs: Cloudflare Dashboard → Pages → `saastainednumbers` → **Functions** tab → click `api/subscribe` → **Logs**

### Add Persistent Storage (Optional)

By default, emails are logged but not stored permanently. For persistent storage:

**Option A: Cloudflare KV (recommended)**

1. Create a KV namespace:
   ```
   npx wrangler kv:namespace create "EMAIL_SUBSCRIBERS"
   ```
   Copy the output ID.

2. Add the binding to `wrangler.jsonc`:
   ```jsonc
   {
     // ...existing config
     "kv_namespaces": [
       {
         "binding": "EMAIL_KV",
         "id": "<the-id-from-step-1>"
       }
     ]
   }
   ```

3. Update `functions/api/subscribe.js` to store to KV:
   ```js
   export async function onRequest(context) {
     const { request, env } = context;
     // ...
     const key = `subscriber:${Date.now()}`;
     await env.EMAIL_KV.put(key, email);
     // ...
   }
   ```

**Option B: Forward to email service**

Replace the `console.log` line with a POST to ConvertKit, Mailchimp, or your preferred email API. Pass the API key via a Cloudflare Pages secret:
```
npx wrangler pages secret put EMAIL_API_KEY
```

## Signed Out UX
- Sign-in page removed; sign-in button removed from nav
- Auth infrastructure kept (auth.ts, AuthProvider, Prisma adapter) for admin login and calculation saving
- Account pages show "sign in is currently disabled" when not authenticated
- All calculators fully functional without sign-in

## Session Summary (May 29, 2026)

### Done
- **Root cause identified**: All 5 non-English locale files were ~96% English copies (only 3-5 of 107 keys actually translated per locale). Calculator pages appeared to work because they use separate locale overrides in `resolverLocaleConfig()`, not `getTranslations()`.
- **Natural translations generated**: All 107 i18n keys × 5 locales (ES, DE, FR, PT, JA) — idiomatic translations for nav, common, calculator, category, home, pricing, dashboard, feedback, email, calculators, error, and blog sections
- **`app/pricing/page.tsx`**: Added `getTranslations()`, `generateMetadata` with translations, replaced all 8 hardcoded strings with `t()` calls (heading, subtitle, features, CTA) — total 15 new translation keys across all 6 locales
- **`app/blog/page.tsx`**: Added `getTranslations()`, `generateMetadata` with translations, replaced hardcoded "Blog", "Featured Post", "All Articles", "Read article →", "Read more →" with `t()` calls — 7 new blog translation keys across all 6 locales
- **`app/blog/[slug]/page.tsx`**: Added `getTranslations()`, replaced "← Back to Blog" with `t("blog.backToBlog")`
- **`app/page.tsx` (homepage)**: Replaced hardcoded hero title with `t("home.heroLine1")`/`t("home.heroLine2")` keys with `font-numbers` span styling; replaced hardcoded `$0` with `getCurrencySymbol(locale) + "0"` (removed `"use client"` from `formatNumber.ts` to allow server-side use); replaced hardcoded "categories, calculators. Pick your path." with `t("home.categoriesSubtitle")`; replaced hardcoded "New" badge with `t("common.new")`
- **`app/[category]/page.tsx`**: Made `generateMetadata` use `getTranslations()` for category name; updated h1 to use translated category name + `category.calculatorsLabel` suffix
- **`app/calculators/page.tsx`**: Switched from static `export const metadata` to dynamic `generateMetadata` with `getTranslations()`
- **`app/embed/[slug]/page.tsx` + `EmbedClient.tsx`**: Added `locale` and `strings` props; thread locale to `InputSlider`/`ResultCard`; replaced hardcoded disclaimer with translated `strings.disclaimer`
- **`lib/formatNumber.ts`**: Removed `"use client"` directive and `getLocale()` import — all functions are pure (use `Intl.NumberFormat` which works server-side) and accept explicit `locale` parameter; server components can now safely call `getCurrencySymbol(locale)`
- **TypeScript**: 0 errors; **Lint**: 0 errors; **Build**: passes; **Tests**: 309/309 pass (89 files, up from 258/76)

### Key Stats
- **12 of 13 page files** now call `getTranslations()` (only `legal/page.tsx` intentionally excluded)
- **107 keys × 6 locales** = 642 translated strings (up from 17 real translations)
- All 5 non-English locales now have natural, idiomatic translations for all UI sections
