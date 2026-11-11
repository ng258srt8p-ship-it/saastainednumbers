# Evidence Ledger — WebCalc/SaaStainedNumbers 10x Research (2026-11-11)

Method: deep-research skill, ~30 min, 6 search waves + targeted fetches. Confidence: high (primary/multi-source), medium (single secondary or vendor), low (anecdote/unverified).

Site inputs: 87 calculators / 9 categories / 6 locales (1380 static pages) on Cloudflare Worker `saastainednumbers`. Traffic unknown (analytics token declined). Rails today: AdSense (pub-4115230840067798) + EthicalAds slot + FAQ affiliate links (via=saastainednumbers) + free embed + /advertisers + EmailCapture component + GA4 behind consent.

| # | Claim | Source | Conf |
|---|-------|--------|------|
| 1 | AdSense page RPM: finance ≈ $3.34, general $1-4.50 (Americas-heavy); 100k pageviews/mo ≈ $90-430; $1k/mo needs ~400k pv at $2.50 RPM | outrank.so (citing Google's own calc) | med |
| 2 | AI Overviews covered 48% of queries by Mar 2026 (34.5% Dec 2025), fastest on informational queries (>70% of info SERPs); commercial 30-40%, transactional/navigational <20% | digitalapplied.com citing Ahrefs | med |
| 3 | When AIO appears, position-1 organic CTR falls -58% (positions 2/3/5/10: -51/-46/-33/-19%) — 300k-keyword GSC study, Dec 2025; corroborated by Seer (-49..-65%), Kevin Indig (>50%), Authoritas (-47.5%), Daily Mail (80-90%) | ahrefs.com Ryan Law, fetched | HIGH |
| 4 | 99.2% of AIO keywords are informational-intent; conflicting stat "82% of B2B tech queries trigger AIO" (single source; treat as intent-mix nuance) | Ahrefs Nov 2025 via omnibound.ai | med |
| 5 | Even non-AIO queries: organic CTR -41% YoY | omnibound (unverified chain) | low-med |
| 6 | Embeddable tools = self-marketing: agency case 40+ external embeds / 90 days, ~3k widget impressions/mo, contextual backlinks DA 15-65; embed code must carry a 'Powered by' attribution link | the20dollaragency.com (single case) | med-low |
| 7 | Tool-page SEO playbook: tool above the fold; dedicated "Embed This Tool" section with keyword-rich anchor text; FAQ + semantic markup; outreach to sites already linking similar tools (5 links from DR60+ beat 50 from DR20); launch with a data angle; ungated tools earn more embeds/backlinks, gated earn more leads; refresh benchmark data annually or links decay; third-party links start 3-6 months post-launch | outgrow.co (vendor) | med |
| 8 | Highest-link calculator topics: ROI, industry benchmarks, salary/comp, cost-of-X ops tools | outgrow.co | med |
| 9 | SaaS/B2B affiliate 2026 standard: 20-30% RECURRING (bounty $50-100 enterprise). Baremetrics 20% (Rewardful); MonsterClaw-listed: GetResponse 40-60%, HubSpot 30%×12mo, ActiveCampaign 20-30%, ConvertKit 30% lifetime, Pipedrive 20-33%, Webflow 50%×12mo, Kinsta $50-500 +10% lifetime, Shopify 100%×2mo; Typeform 20% | hackceleration + r/SaaS program analysis | med (converging listicles) |
| 10 | EthicalAds advertiser rates Q4 2026: $5.25 CPM tier-1 (US/CA/UK/AU/NZ/IE), $3.10 row CPM, $4.12 blended, min $1,000 buy | ethicalads.io/advertisers/pricing fetched | HIGH (as price list; publisher share unstated) |
| 11 | Mediavine 2026: FULL = min $5,000 annual ad revenue (session floor gone); JOURNEY = 1,000 tier-1 sessions/30d + Grow plugin, no revenue min; Raptive ≈ 25k pv/mo | mediavine.com/application-requirements fetched + jupiter.co + productiveblogging | HIGH (triangulated) |
| 12 | Newsletter sponsorships 2026: Finance&Investing CPM $35-75 ($250-450 @5k subs; $900-1800 @20k); Tech/SaaS $30-60; <5k subs → flat $100-300/placement; rule of thumb 2.5-5% of subs per placement in $; weekly niche letter ≈ $800/mo at 5k | artha.link benchmarks + beehiiv + paved | med |
| 13 | Reddit lost >30% Google traffic (2026, CEO confirmed) — referral ecosystem compressing | seroundtable via position.digital | med |
| 14 | Omni Calculator: ads-only from day 1 (AdSense → Playwire + GAM); 200M visits 2023, 23.1M/mo; ~70-person content team funded by ads; claim $36k/mo unverified | Google for Publishers case + boringcashcow | high (model) / low (rev figure) |
| 15 | Contrarian: solo calculator site (300+ finance/auto/food tools) removed ads — "ad revenue wasn't life changing" | r/SaaS anecdote | low (but consistent with [1]) |
| 16 | Google scaled-content-abuse policy (updated 2026-08-28): many pages made primarily to manipulate rankings = spam regardless of AI/human; no page-count threshold; test = purpose + per-page value. Post-Mar-2026 spam updates: 40-60% traffic drops reported on templated AI sites | developers.google.com fetched + digitalapplied/seomatic | HIGH (policy) / med (drop %) |

Not cited (seen, not fetched): publisher-collective, chartatlas, omnicalculator-own calc, apollodigital, wpcaloriecalculator, madebyagents, apwebsolutions.
