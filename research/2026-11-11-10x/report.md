# 10x Report — SaaStainedNumbers (WebCalc) · 2026-11-11

**Context:** 87 free calculators, 9 categories, 6 locales (1380 static pages) on a Cloudflare Worker. Traffic is currently unmeasured (Cloudflare Analytics token was declined; GA4 loads only after consent). All revenue estimates below assume the honest range from ~0 to low-ten-thousands of monthly pageviews — the first unlock is measurement.

## What the evidence says (headline findings)

1. **Ads alone will not pay** at any realistic near-term traffic. Finance RPM ≈ $3.34; 100k pageviews/month ≈ $90-430. [1] A solo calculator site with 300 pages removed its ads because "ad revenue wasn't life changing". [15] Omni Calculator's ad model only worked at 20M+ visits/month with a 70-person content operation. [14] Treat display ads as a topping, not the meal.
2. **AI Overviews are cannibalizing exactly your traffic type.** 48% of queries now trigger AIO and it is heaviest on informational queries [2] — which is 99.2% of AIO keywords [4] and precisely what "calculate my LTV:CAC" is. Position-1 CTR drops 58% when AIO shows [3], and even non-AIO CTR is down 41% YoY [5]. **Being the #1 blue link is no longer the prize; being the cited/embedded/linked-to *tool* is.**
3. **Embeds and benchmark data are the compounding asset.** Ungated embeddable tools with a "Powered by" attribution line earn contextual backlinks (DA 15-65 in a 90-day case [6]); outreach works best on sites already linking similar tools [7]; journalists love personalized-vs-benchmark angles [8]. **Currently broken:** our embed code [lib/embed.ts] has NO attribution anchor — the link is rendered *inside* the iframe, where crawlers cannot see it. This is a one-line fix on the highest-leverage growth loop the site has.
4. **Affiliate economics are the best margin per visitor today.** SaaS/B2B programs now pay 20-30% recurring (Baremetrics 20%, ConvertKit 30% lifetime, HubSpot 30%×12mo...). [9] A visitor who just computed a brutal churn number is the hottest lead on the internet.
5. **Premium ad networks are a milestone ladder, not a now thing:** JOURNEY by Mediavine admits you at 1,000 tier-1 sessions/mo; Mediavine full at $5,000/yr ad revenue; EthicalAds sells $5.25 tier-1 CPM directly [10][11]. Roadmap: AdSense → JOURNEY → Mediavine.
6. **Risk: templated content.** Google's scaled-content policy (Aug 2026) punishes mass pages made to rank, not to help — 40-60% drops observed. [16] Our defense: unique benchmark data + differentiated FAQ/copy per calculator + annual data refresh ([7]: stale tools lose links). The repo already has `lib/content-uniqueness.ts` — enforce it per release.

## Ranked backlog (impact × effort, evidence-linked)

> **Shipped 2026-11-11:** embed attribution anchor (P0 row 1) ✅ live; plus fixes not in the original audit scope: dead OG images (static `/og-default.png`), empty-body 404s, CI deploying to a deleted Pages project. Measurement (P0 row 2) still blocked on token scope.

| P | Item | Why | Effort |
|---|------|-----|--------|
| P0 | **Fix embed attribution**: add `Powered by [Keyword-rich anchor](https://saastainednumbers.com/{cat}/{slug})` to the copied iframe code in `lib/embed.ts` | Unlocks the backlink flywheel [6][7]; currently leaking 100% of embed link equity | 30 min |
| P0 | **Turn on measurement**: re-grant CF Analytics:Read token, add CF Web Analytics beacon; report monthly on paths/referrers/countries | The task "evaluate what users use and maximize it" is impossible blind today | 1 h |
| P1 | **Benchmark layer**: per-calculator "Median by stage (Seed/Series A/B/Growth)" data block, refreshed annually, sourced and dated | The AIO-era moat: be the *data source* cited, not the snippet squeezed [2][3][7][8][16] | 1-2 wk |
| P1 | **Post-result affiliate blocks** ("Tracking this live? → Baremetrics/ProfitWell" contextual, 5-8 programs @ 20-30% recurring) | Highest $/visitor available today [9]; FAQ links already exist, promote placement to result state | 2-3 d |
| P1 | **Email capture → benchmark newsletter** (monthly, SaaS metrics) | Finance newsletter CPM $35-75 [12]; EmailCapture.tsx exists but isn't on home; list = owned audience immune to AIO [3] | 1 wk |
| P2 | **Tool-page SEO pass**: tool above the fold, "Embed this calculator on your site" visible section with anchor-rich copy, FAQ/HowTo JSON-LD audit [7] | Converts the 1380 pages we already have | 1 wk |
| P2 | **Digital-PR launch**: quarterly "State of SaaS Metrics" data story from anonymized aggregate canvas patterns | Launch-as-product pattern with data angle [7][8]; earns DR60+ links [7] | 2 wk/q |
| P2 | **Ad ladder**: JOURNEY application at 1k tier-1 sessions/mo; keep AdSense until then; EthicalAds direct deals if inventory arrives [10][11] | +30-400% ad RPM uplift at milestones | 1 d |
| P3 | **Localized benchmark content** (JA/DE/PT/FR/ES data + copy) | 6 locales exist, likely thin; non-EN SERPs less AIO-cannibalized | ongoing |
| P3 | **Embed licensing SKU**: free w/ attribution, paid white-label ("Powered by" removable, priority support) for agencies/Bootstrapped-founder tool stacks | Natural revenue line from the embed loop; site stays $0 for end users (pricing page promise) | 1 wk |

## Expected economics (rough, stated honestly)

- Ads at 50k pv/mo ≈ $125-170/mo (finance RPM [1]) — symbolic until ~250k pv/mo.
- Affiliate at 50k pv/mo, 0.4% click-through to 5-8 result blocks × 8% conversion × ~$25/mo recurring share × 6-mo retention ≈ **$200-600/mo** and compounding.
- Newsletter at 3k subs (from 50k pv/mo capture ≈ 2-3%/mo) ≈ $150-450/mo sponsorships [12].
- The backlink flywheel [6][7] is what makes the 100k+ pv/mo case reachable; everything above scales with it.
