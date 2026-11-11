# Revenue Roadmap — SaaStainedNumbers · 2026-11-11

Principles from research (see evidence.md): keep everything free for end users (brand promise on /pricing), stack revenue rails in margin-order (affiliate > newsletter > premium ads > embed licensing), measurement first, and build the embed/backlink flywheel that makes traffic growth compound.

## Phase 0 — This week (foundation, $0 → instrumented)

> **STATUS 2026-11-11 (same day):** Items 1 and 3 are LIVE (deployed version 8398942f, verified via Playwright: single H1, styled 404, cookie-banner mount-gate, "9 categories, 87 calculators" subtitle, footer About/Advertise/Contact, embed snippets now include the attribution anchor). Also shipped: static `og-default.png` replacing the dead `/api/og` references (social previews were broken site-wide since the Workers migration), CI + `scripts/deploy.sh` retargeted from the deleted Pages project to `wrangler deploy` (Workers), dead `functions/` dir and stale `/dashboard` spec + i18n section removed. Item 2 remains blocked on a Zone Analytics:Read token. Item 4: footer links are live; advertisers pricing tiers still to write.

1. Deploy the audit fixes already committed (404 page, single H1, cookie-banner flash, footer links, category counts, em-dash sweep). ✅ LIVE 2026-11-11.
2. Re-provision Cloudflare Analytics (Zone Analytics:Read token) **or** enable CF Web Analytics token; confirm GA4 events fire post-consent. KPI: a weekly traffic email to self by Nov 18.
3. Fix `lib/embed.ts`: attribution anchor + keyword-rich text in every copied embed snippet. KPI: first external embed with visible "Powered by" link within 30 days (share /advertisers + canvas as showcase).
4. Footer/nav now point to /advertisers and /contact (done) — add real offers + pricing tiers to /advertisers (see Phase 2 EthicalAds numbers: sell tier-1 attention at ~$5 CPM equivalent).

## Phase 1 — Weeks 2-6 (highest margin per visitor: affiliate)
5. Post-result affiliate blocks on churn/CAC/LTV/NRR/MRR calculators. Programs with best EPC for this audience: Baremetrics (20% recurring), ProfitWell/Paddle, ConvertKit (30% lifetime), HubSpot (30%×12mo), Kinsta. Apply to 5-8 programs; use existing `?via=` pattern. KPI: first $100 affiliate month by Dec.
6. Wire EmailCapture below every result card + home; monthly benchmark newsletter (launch issue = "median LTV:CAC by stage" data story). KPI: 500 subs by Jan; finance-niche CPM $35-75 → first $100-300 sponsorship at ~2-3k subs.

## Phase 2 — Months 2-4 (authority + ad ladder)
7. Benchmark data layer: sourced, dated "median by stage" tables per core calculator; annual refresh cadence (stale tools lose links); publish methodology page. This is the AIO-era moat: become the citation, not the squeezed snippet.
8. Digital-PR quarter: "State of SaaS Metrics 2027" from anonymized aggregate patterns; pitch to the sites already linking similar tools (5 links from DR60+ > 50 from DR20).
9. Ads ladder: stay AdSense until 1,000 tier-1 sessions/30d → apply JOURNEY by Mediavine (no revenue floor); $5k/yr ad revenue → Mediavine full; consider direct EthicalAds-style deals ($5.25 tier-1 CPM) via /advertisers once traffic justifies it.

## Phase 3 — Months 4-6 (product revenue)
10. Embed licensing: free tier keeps attribution; paid white-label ($19-49/mo) for agencies/course-creators — same code, one query param. Keeps site $0 for users while monetizing redistribution.
11. Only revisit paid "pro calculator" tiers if newsletter + embed data shows demand; research says ungated tools grow faster [7].

## Guardrails
- Google scaled-content policy (Aug 2026): every templated page must carry differentiated value — enforce `lib/content-uniqueness.ts` per release; no bulk AI FAQ expansion.
- No dark patterns: consent banner must respect choice (already does; fixed the re-show bug).

## KPI dashboard (weekly, once Phase 0.2 lands)
visits · top paths · embed copies (analytics.embed) · affiliate clicks/EPC · subs · ad RPM · referring domains.
