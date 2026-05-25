# Monetization Phase 1 — Agent Report

Date: May 24, 2026

## Summary

Implemented affiliate link infrastructure, created a registry of 12 affiliate programs spanning all 9 calculator categories, and added contextual affiliate links across 11 calculator configs. Built a recommended tools component that auto-populates based on calculator category. All ad infrastructure was already in place (AdSense via `AdSlot.tsx`).

## Tasks Completed

### TASK 1 — Ad Audit
- **Networks**: AdSense only (`NEXT_PUBLIC_ADSENSE_ID` env var). EthicalAds planned but not implemented.
- **Slots**: 2 placements (`below-results`, `sticky-footer`). 3rd slot (`between-sections`) referenced in AGENTS.md but not in current types.
- **Placement strategy**: `below-results` styled dark (gray-800/30), `sticky-footer` fixed on mobile/inline on desktop with dismiss button via localStorage. No ads on `/embed/*`.
- **CLS**: `minHeight` dimensions (90px / 50px) applied via `AD_DIMENSIONS`.
- **File**: `lib/ads.ts` — straightforward config with publisher ID, enabled flag, and no-ads paths.

### TASK 2 — Affiliate Audit
- `lib/affiliates.ts` — did not exist (created)
- `components/AffiliateLink.tsx` — did not exist (created)
- `components/AffiliateTools.tsx` — did not exist (created)
- Some calculator configs already had markdown links to Baremetrics, ChartMogul, ProfitWell, ChurnZero, Patreon, SponsorSpot, NerdWallet (existing pre-phase1 content)

### TASK 3 — Affiliate Registry (`lib/affiliates.ts`)
Created `AffiliateProgram` interface and `affiliatePrograms` array with 12 programs:
| Program | Categories | Commission |
|---|---|---|
| ChartMogul | revenue, churn-retention, growth-efficiency | 20% recurring 12mo |
| Baremetrics | revenue, churn-retention | 30% recurring |
| ProfitWell | revenue, churn-retention, unit-economics | 20% recurring |
| Stripe | general-business | Varies |
| HubSpot | growth-efficiency, general-business | 30% recurring 12mo |
| Intercom | churn-retention, growth-efficiency | 25% recurring |
| NerdWallet | personal-finance | Varies |
| Gumroad | side-hustle | Varies |
| Patreon | side-hustle | Varies |
| Shopify | side-hustle, general-business | Varies |
| OpenView | revenue, growth-efficiency | Referral |
| First Round Capital | general-business | Referral |

Plus `getAffiliatesByCategory()` helper function.

### TASK 4 — AffiliateLink Component (`components/AffiliateLink.tsx`)
Client component wrapper for centralized affiliate link rendering with `data-affiliate` and `data-category` attributes.

### TASK 5 — Contextual Affiliate Links
Added markdown affiliate links to FAQ sections in 11 calculator configs:
- `break-even-calculator.ts` — Stripe
- `roi-calculator.ts` — HubSpot
- `nps-calculator.ts` — Intercom
- `pricing-strategy-calculator.ts` — HubSpot
- `etsy-profit-calculator.ts` — Shopify
- `amazon-fba-calculator.ts` — Shopify
- `blogging-income-calculator.ts` — Gumroad
- `podcast-revenue-calculator.ts` — Patreon (converted plain text to markdown link)
- `affiliate-income-calculator.ts` — Gumroad
- `emergency-fund-calculator.ts` — NerdWallet
- `fire-calculator.ts` — NerdWallet

Links render via existing `renderContent.tsx` which converts `[text](url)` to `<a>` tags with `rel="sponsored"`.

### TASK 6 — AffiliateTools Component (`components/AffiliateTools.tsx`)
Server component that displays a "Recommended Tools" card grid filtered by calculator category. Shows tool name, description, and commission info. Returns `null` when no programs match the category. Styled with border/gray-50 background.

### TASK 7 — CalculatorClient Integration
Added `AffiliateTools` to the `faqSection` in `CalculatorClient.tsx` (after FAQ accordions). Auto-filters tools by `config.category`.

## Verification
- TypeScript: ✅ 0 errors (`npx tsc --noEmit`)
- Lint: ✅ 0 errors, 4 pre-existing warnings (Google fonts in layout)
- Build: ✅ Success (Next.js, all 20 routes generated)

## Files Created
1. `lib/affiliates.ts` — Affiliate program registry + helper
2. `components/AffiliateLink.tsx` — Client component for affiliate links
3. `components/AffiliateTools.tsx` — Server component for recommended tools section

## Files Modified
1. `app/[category]/[slug]/CalculatorClient.tsx` — Added AffiliateTools import + usage in faqSection
2. `calculators/config/break-even-calculator.ts` — Stripe link in FAQ
3. `calculators/config/roi-calculator.ts` — HubSpot link in FAQ
4. `calculators/config/nps-calculator.ts` — Intercom link in FAQ
5. `calculators/config/pricing-strategy-calculator.ts` — HubSpot link in FAQ
6. `calculators/config/etsy-profit-calculator.ts` — Shopify link in FAQ
7. `calculators/config/amazon-fba-calculator.ts` — Shopify link in FAQ
8. `calculators/config/blogging-income-calculator.ts` — Gumroad link in FAQ
9. `calculators/config/podcast-revenue-calculator.ts` — Patreon link in FAQ
10. `calculators/config/affiliate-income-calculator.ts` — Gumroad link in FAQ
11. `calculators/config/emergency-fund-calculator.ts` — NerdWallet link in FAQ
12. `calculators/config/fire-calculator.ts` — NerdWallet link in FAQ

## Next Steps (from v5.0-monetization-plan.md)
- Phase 2a: Reduce to 2 ad slots per calculator page (remove `between-sections`)
- Phase 2b: CLS fixes (already done — min-height applied)
- Phase 2c: Mobile sticky footer close button (already done — close button + localStorage dismiss)
- Phase 2e: Add ad slots to non-calculator pages (homepage, blog, calculators listing)
- Phase 3: Sign up for AdSense and set `NEXT_PUBLIC_ADSENSE_ID` env var
- Phase 4: Migrate to EthicalAds at 50k+ monthly pageviews
