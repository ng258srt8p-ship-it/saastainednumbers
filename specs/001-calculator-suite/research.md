# Research: Calculator Suite — WebCalc MVP

**Input**: Spec requirements from [spec.md](./spec.md)
**Output**: Consolidated findings from `/Research/` (v1.1 through v2.1)

## 1. Market Validation

### Demand Evidence

- **HustleCalcs** (leading competitor): 54 calculators, 1.3M calculations/month,
  38% MoM growth, 50-100K sessions/month. Proves SaaS calculator demand exists
  and is growing rapidly.
- **CalculatorCove**: 700+ calculators across 14 categories, 50-100K
  sessions/month, display-ad-only monetization. Proves breadth-of-catalog
  strategy scales.
- **OnlineCalcAI**: 206 calculators × 30 languages, ~65K sessions/month,
  ~$10K/month at blended CPM $4.50. Proves multi-language is the highest-ROI
  traffic multiplier.

**Decision**: Build a SaaS/B2B focused suite, not general calculators.

### Competitive Gaps (Our Differentiators)

| Gap | Confirmed By | Our Approach |
|-----|-------------|-------------|
| Embeddable widgets | No competitor offers them (HustleCalcs, CalculatorCove, OnlineCalcAI, SaaSMetricsCalc all checked in v2.1) | iframe widget on every calculator |
| Developer API | No competitor offers programmatic access | REST API with free + paid tiers |
| SaaS-only focus | HustleCalcs mixes categories, CalculatorCove is general consumer | Pure SaaS metrics + business ops |
| Content depth + schema | HustleCalcs has 200 words + no schema. CalculatorCove has depth but for consumer tools | 500-1,000 words + full schema per page |
| Multi-language | Only OnlineCalcAI does this (but for generic tools) | 5 languages starting month 3 |
| Interconnected dashboard | Only SaaSMetricsCalculator (but no content depth or monetization) | Dashboard + deep content + freemium |

## 2. Technical Architecture Decisions

### Stack Choice

| Layer | Selected | Rationale | Alternatives Considered |
|-------|----------|-----------|------------------------|
| Framework | Next.js 16 (App Router) | SSG-first, best SEO for content-driven tools, Server Components for minimal JS | HustleCalcs uses vanilla HTML/CSS/JS (faster but less scalable for 50+ calculators) |
| Styling | Tailwind CSS v4 + shadcn/ui | Tree-shakeable, zero-runtime CSS, consistent design | CalculatorCove uses global CSS with per-category theming |
| Hosting | Vercel (Hobby → Pro) | Free tier for MVP, seamless Next.js, edge CDN | CalculatorCove uses Cloudflare |
| Analytics | PostHog | Privacy-respecting, event-based, self-hostable | HustleCalcs uses no analytics (privacy choice) |
| Database | Turso (SQLite edge) + Neon (PostgreSQL) | Turso for config reads at edge, Neon for user data | Supabase (more expensive at scale) |
| Auth | NextAuth.js | Free, OAuth + email magic link | Clerk (paid at scale) |

### Competitor Architecture Takeaways

- **HustleCalcs** uses vanilla HTML/CSS/JS — no framework, no analytics scripts,
  no build pipeline. Pages are 15-30KB. Proves framework-free is fast but limits
  scalability beyond 54 calculators.
- **CalculatorCove** uses static HTML + Cloudflare + full schema markup. Best
  SEO in the market. Demonstrates that static pages + schema are sufficient for
  top rankings.
- **OnlineCalcAI** likely uses Next.js for i18n routing. 30-language
  implementation proves multi-language is technically feasible at scale.
- **SaaSMetricsCalculator** uses a React SPA dashboard. Proves the
  interconnected UX pattern works.

**Our decision**: Next.js SSG to match HustleCalcs' speed while enabling the
config-driven approach needed for 50+ calculators + 5-30 languages.

### Content Depth Benchmark

- CalculatorCove's Stripe Fee page: 3,500 words, full schema, data tables,
  formula boxes, FAQ with schema, verified badge with source citations.
- HustleCalcs' average page: 200-300 words, no schema.
- **Target**: 500-1,000 words minimum per page, matching CalculatorCove's
  pattern but with SaaS metrics content.

### Ad Network Progression

| Phase | Sessions/mo | Network | RPM | Notes |
|-------|-------------|---------|-----|-------|
| Launch (months 3-6) | 1K-5K | AdSense Auto Ads | $3-5 | Google publisher share dropped to 10% in 2025 |
| Growth (months 6-12) | 5K-30K | AdSense Optimized | $5-8 | Improve ad placement + Tier 1 geo targeting |
| Scale (months 12-18) | 30K-60K | Mediavine Journey | $8-15 | 75% rev share, 1K session minimum |
| Mature (months 18-24) | 60K-100K+ | Full Mediavine | $15-25 | Requires $5K/yr ad revenue |

### Freemium Conversion Data

- RevenueCat 2026 median freemium conversion across all app categories: 2.1%
- For calculator tools specifically: expected 1-2% (lower stickiness than
  platforms like Notion or Figma)
- HustleCalcs uses $9/mo Pro and $19/mo AI tiers
- **Our pricing**: Start at $7/mo Pro and $15/mo AI (undercut HustleCalcs
  while our calculator library is smaller), increase to $9-19 as we reach
  40+ calculators

## 3. SEO & Keyword Strategy

### Keyword Tiers

| Tier | KD Range | Timeline | Examples |
|------|----------|----------|----------|
| Ultra-low | < 10 | Months 1-6 | "burn rate calculator" (600/mo), "ARPU calculator" (350/mo) |
| Low | 10-25 | Months 6-12 | "MRR calculator" (1,600/mo), "CAC calculator" (1,300/mo) |
| Medium | 25-45 | Months 12-18 | "SaaS metrics calculator" (2K-5K/mo) |
| High | 45+ | Avoid or late | "breakeven calculator" (50K-100K/mo, KD 60-70) |

### Content Requirements Per Page

- 500-1,000 words unique content (30-40% minimum uniqueness vs other pages)
- Formula box with worked example
- Industry benchmarks/data tables
- 5-12 FAQ items with FAQPage schema
- WebApplication + BreadcrumbList + FAQPage schemas
- Per-calculator OG image
- Verified badge with source citation

### Blog Content Velocity

Target: 2-3 posts/week from month 1 (competitors have zero blog content —
this is our window). Each post targets a supporting long-tail keyword and
links to 2-4 related calculator pages.

## 4. Multi-Language Strategy

- **Launch order**: Spanish, German, Portuguese, French, Japanese
  (based on SaaS market size + OnlineCalcAI's highest-traffic locales)
- **Timeline**: Start month 3-4 after English suite is stable
- **Translation approach**: Config-driven — calculator labels and content
  blocks are locale files, refreshed via the same config schema

## 5. Revenue Model

| Stream | Share Target | Assumptions |
|--------|-------------|-------------|
| Display ads | 40-50% | $3-8 RPM starting, $15-25 at scale |
| Freemium | 30-40% | 1-2% conversion at $7-15/mo |
| Affiliate | 10-15% | SaaS tool referrals in calculator results |
| API/Embed | 5-10% | Developer subscriptions + white-label agencies |

## 6. Timeline & Milestones (from v1.10)

| Phase | Timeline | Key Deliverable |
|-------|----------|-----------------|
| Sprint 1 | Weeks 1-4 | 5 calculators, config schema, dynamic route, URL state |
| Sprint 2 | Weeks 4-8 | 15 more calculators, 500+ words content, FAQ schema, blog |
| Sprint 3 | Weeks 8-12 | AdSense, freemium auth, embed widgets, PostHog |
| Sprint 4 | Weeks 12-24 | 10 more calculators, 2 blog posts/week, embed outreach |
| Sprints 5-8 | Months 6-12 | 10 more calculators, Mediavine Journey, ads bypass, 5 languages |
| Scale | Months 12-24 | API, white-label, full Mediavine, 10 languages |

## 7. Ad Blocker Mitigation

- Tech/B2B audience ad blocker rate: 45-65% (Backlinko, EarthWeb 2026)
- Server-side ad injection planned for month 9-12 (bypasses blockers, 95%
  recovery rate)
- Immediate approach: ad block detection → prompt to disable or upgrade to Pro
- Fallback: shift to affiliate-heavy model if recovery fails
