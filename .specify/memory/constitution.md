<!--
  Sync Impact Report
  ==================
  Version change: (template) → 1.0.0
  Modified principles: All new — replaced 5 placeholder principles with WebCalc-specific principles
  Added sections:
    - I. Configuration-Driven Product Architecture
    - II. SEO-First Content Architecture
    - III. Competitive Moat Through Distribution
    - IV. Capital-Efficient Bootstrapping
    - V. Data-Driven Decision Making & Reality Checking
    - Monetization & Revenue Model
    - Development Workflow & Quality Gates
    - Governance
  Removed sections: None (all placeholders replaced)
  Templates requiring updates:
    - .specify/templates/plan-template.md: ⚠ pending (Constitution Check gates need principle references)
    - .specify/templates/spec-template.md: ✅ no changes needed (generic enough)
    - .specify/templates/tasks-template.md: ✅ no changes needed (generic enough)
  Follow-up TODOs: None — all placeholders resolved.
-->

# WebCalc Constitution

## Core Principles

### I. Configuration-Driven Product Architecture

Every calculator MUST be built from a shared configuration schema —
not hand-coded as a bespoke page. The calculation engine MUST be
pure domain logic (zero React/framework dependency), stored in
`calculators/engine/`, and decoupled from the UI layer in
`calculators/ui/`. This enables three critical capabilities:
rapid addition of new calculators, extraction of engines into a
standalone npm package for API/embed customers, and automatic
generation of per-language calculator pages for multi-language
support (target: 5 languages by month 4, 10 by month 12).

The config schema MUST support: slug, category, meta (title,
description, keywords), inputs, outputs, engine reference, charts,
premium gating flag, and unique content blocks per page (intro,
formula, benchmarks, FAQ). Content uniqueness MUST be 30-40%
minimum per calculator page to avoid Google's scaled-content
enforcement.

### II. SEO-First Content Architecture

Every calculator page MUST include:
- 500+ words of unique supporting content (formulas, examples,
  benchmarks, tables) following CalculatorCove's proven depth model
- Full JSON-LD structured data: `WebApplication` + `BreadcrumbList`
  + `FAQPage` on every calculator page
- Unique `<title>`, `<meta description>`, canonical URL, and
  per-calculator OG image
- FAQ section with 5-12 questions marked up with `FAQPage` schema
- Verified badge with source citations and last-verified date
- Formula box with worked example
- Data tables for comparative benchmarks

Blog content MUST be published at minimum 2 posts/week from month 1.
Target KD < 15 keywords for months 1-6, then KD < 25 thereafter.
Internal linking between calculators and blog posts is mandatory.
Multi-language pages (5-30 languages) are treated as the primary
traffic multiplier and MUST be started by month 3-4, not deferred.

### III. Competitive Moat Through Distribution

Zero competitors offer embeddable widgets or API access. These are
our primary technical differentiators and MUST be implemented early.

Every calculator MUST have an embed option generating a lightweight
iframe snippet. The embed MUST:
- Load in <500ms with minimal JS payload
- Be responsive to container width (no fixed dimensions)
- Include a "Powered by WebCalc" attribution link (for referral
  traffic and brand exposure, NOT SEO link equity — iframes pass
  none)
- Function without authentication (embeds are always free — they
  are a distribution channel, not a monetization channel)
- Be embeddable on any site via iframe + postMessage API

The developer API MUST provide REST access to all calculation
engines with rate-limited free tier and paid tiers for commercial
use. API documentation and SDK MUST be maintained as a first-class
product artifact.

### IV. Capital-Efficient Bootstrapping

This business MUST remain capital-efficient until revenue exceeds
$2,000/month:
- Zero spend on paid advertising in year one
- Maximum $30/month on tools (Ahrefs, hosting) until revenue
  exceeds $500/month
- Vercel Hobby tier for MVP; upgrade to Pro ($20/mo) only when
  revenue justifies it
- No employee or contractor hires until revenue exceeds
  $2,000/month
- Freelance writers ($50-100/post) considered only after
  $500/month revenue and only if ROAS exceeds 3x within 90 days
- Founder time is the primary investment: target 35-46 hrs/week
  months 1-6, 26-37 hrs/week months 7-12
- Kill switches: if RPM < $3 at 10K sessions, pivot to
  subscription-primary model; if traffic < 500 sessions at month 6,
  invest in paid link-building or pivot keyword strategy

### V. Data-Driven Decision Making & Reality Checking

Every quantitative claim in plans, specs, and tasks MUST be
traceable to a verifiable source (industry benchmark, competitor
data, or published case study). Assumptions MUST be challenged with
second-order analysis before implementation.

Track weekly:
- Monthly recurring revenue (North Star metric)
- Sessions, RPM, ad blocker rate, freemium conversion rate
- Keywords ranking, indexed pages, referring domains
- Embed sites live, embed calculations served
- Competitor activity (HustleCalcs, CalculatorCove, OnlineCalcAI)

Kill switch thresholds are non-negotiable: when triggered, the
associated workstream is paused or pivoted within one sprint.

## Monetization & Revenue Model

Revenue is diversified across four tiers to avoid reliance on any
single stream:

| Tier | Share Target | Starting RPM/Conv | Mature RPM/Conv |
|------|-------------|-------------------|-----------------|
| Display ads | 40-50% | $3-8 (AdSense) | $15-25 (Mediavine) |
| Freemium | 30-40% | 1-2% conversion at $7-15/mo | 2-3% at $9-19/mo |
| Affiliate | 10-15% | SaaS tools, cloud, payment processors | Scaled with traffic |
| API/Embed | 5-10% | $29-99/mo | Developer subscriptions + white-label |

Ad network progression MUST follow: AdSense (months 3-12) →
Mediavine Journey (months 12-18, 75% rev share, requires 1K
sessions) → Full Mediavine (months 18-24, requires $5K/yr ad
revenue, 80-100K sessions) → Raptive (month 24+).

Freemium pricing MUST start at $7/mo and $15/mo (below HustleCalcs'
$9-19 to account for our smaller calculator library), then increase
to $9-15 as the calculator base reaches 40+.

## Development Workflow & Quality Gates

### Sprint Cadence (from v1.10 Executive Blueprint)

- **Sprint 1** (Weeks 1-4): Foundation — project scaffold, config
  schema, dynamic route, 5 starter calculators, calculation
  engines, URL-driven state, Vercel deployment
- **Sprint 2** (Weeks 4-8): Content & SEO — 15 more calculators,
  500+ words per page, FAQ schema, blog setup, 4 foundation posts,
  XML sitemap, internal linking
- **Sprint 3** (Weeks 8-12): Monetization — AdSense, freemium
  auth (NextAuth + Stripe), embed widget generator, PostHog
  analytics, 4 blog posts
- **Sprint 4** (Weeks 12-24): Growth — 10 more calculators,
  2 blog posts/week, embed outreach, guest posting, directory
  listings, Product Hunt launch
- **Sprints 5-8** (Months 6-12): Scale — 10 more calculators,
  weekly newsletter, Mediavine Journey, server-side ad injection,
  A/B test pricing, part-time writer

### Quality Gates

Every PR MUST pass before merge:
- `tsc --noEmit` (zero TypeScript errors)
- `biome check` (linting + formatting)
- Lighthouse CI: Performance ≥ 90, Accessibility ≥ 90, Best
  Practices ≥ 90, SEO ≥ 95
- JS bundle size ≤ 80KB gzipped per page
- No duplicated content across calculator pages (30-40% minimum
  uniqueness per page)

### Adding a New Calculator (Standard Process)

1. Create config in `calculators/config/new-calc.ts`
2. Create pure engine in `calculators/engine/new-calc.ts`
3. Register in `lib/registry.ts`
4. Run `npm run generate` — SSG builds all pages
5. Automated checks: schema validation, broken link check, OG
   image generation
6. Manual review: content uniqueness threshold, keyword targeting,
   FAQ coverage, internal linking

## Governance

This Constitution supersedes all other process documents. It is a
living document that evolves with the project.

### Amendment Procedure

1. **Proposal**: Any contributor may propose an amendment via
   pull request to `.specify/memory/constitution.md`.
2. **Review**: Amendments MUST include rationale, impact analysis
   on dependent artifacts (templates, plans, specs), and version
   increment.
3. **Approval**: The project owner (bootstrapped solo founder)
   reviews and approves/rejects. For multi-person teams,
   majority approval required.
4. **Migration**: When amending a principle that affects existing
   plans or specifications, those documents MUST be updated within
   one sprint cycle.

### Versioning Policy

- **MAJOR**: Backward-incompatible governance changes — principle
  removal, revenue model restructuring, technology stack
  replacement.
- **MINOR**: New principle/section added, materially expanded
  guidance (e.g., adding a sixth principle, expanding monetization
  section).
- **PATCH**: Clarifications, wording improvements, typo fixes,
  non-semantic refinements.

### Compliance Review

- Every plan template includes a "Constitution Check" gate that
  MUST pass before Phase 0 research begins.
- Every PR to the main branch MUST verify compliance with all
  applicable principles.
- Complexity (unnecessary abstractions, overengineering) MUST be
  justified with documented rationale in the Complexity Tracking
  section of the plan.
- The constitution is reviewed monthly during the "Watch Items"
  check from the Risk Dashboard. Any principle that has caused
  friction or failed to prevent a problem is flagged for
  amendment.

**Version**: 1.0.0 | **Ratified**: 2026-05-21 | **Last Amended**: 2026-05-21
