# Implementation Plan: Calculator Suite  -  WebCalc MVP

**Branch**: `main` | **Date**: 2026-05-21 | **Spec**: [/specs/001-calculator-suite/spec.md](./spec.md)
**Input**: Feature specification from [spec.md](./spec.md)

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a SaaS & Business Operations Calculator Suite  -  20 interconnected
calculators at MVP, scaling to 50+ over 12 months. Market-validated demand
(: 1.3M calculations/mo, 38% MoM growth; OnlineCalcAI: 65K
sessions/mo, ~$10K/mo revenue). Key differentiators: embeddable widgets and
API access (zero competitors offer either). Config-driven SSG architecture
with full SEO content (500+ words + schema per page). Revenue from ads +
freemium ($7-15/mo) + affiliate + API/embed licensing. Target $1,000-2,000/mo
by month 20-24 with $12 domain + $29/mo tools investment.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui,
  Stripe (payments), PostHog (analytics), NextAuth.js (auth), Resend (email)
**Storage**: SQLite via Turso (edge-reads for calculator config) + PostgreSQL
  via Neon (user accounts, saved calculations)
**Testing**: Vitest (unit + integration), Playwright (e2e), Lighthouse CI (perf)
**Target Platform**: Web browser  -  desktop (primary) and mobile (responsive)
**Project Type**: web-service
**Performance Goals**: LCP < 1.5s, FCP < 1s, TTI < 2s, Lighthouse ≥ 95,
  JS bundle ≤ 80KB gzipped per page
**Constraints**: $0-30/mo hosting/tools until revenue > $500/mo; Vercel Hobby
  tier for MVP; zero paid ads in year one
**Scale/Scope**: 20 calculators at MVP (4 categories), 50 calculators within
  12 months, 5 languages within 6 months, 100K sessions/month within 24 months

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Config-Driven)**: ✅ Spec requires 20+ calculators built from
  shared config (FR-023). Calculation engines must be pure logic decoupled from
  UI. Embed and API both reuse the same engines  -  verified by design.
- **Principle II (SEO-First)**: ✅ Spec requires 500+ words content (SC-003),
  full schema markup (SC-004), per-calcula or OG images (FR-005), FAQ with
  schema (FR-006). Blog content baseline of 2 posts/week is documented in
  the sprint plan from v1.10.
- **Principle III (Moat Through Distribution)**: ✅ Spec requires embeddable
  widgets (FR-008, FR-009, SC-006) and developer API (FR-017, FR-018, FR-019,
  SC-011). No competitor offers either.
- **Principle IV (Capital Efficiency)**: ✅ No ongoing cost increase from this
  feature. Vercel Hobby tier is free. All tools (Stripe, PostHog, Resend) have
  free tiers at MVP scale.
- **Principle V (Data-Driven)**: ✅ All assumptions documented in spec
  Assumptions section. Revenue projections, RPM, conversion rates all sourced
  from v2.0/v2.1 competitor research and industry benchmarks (RevenueCat 2026,
  Backlinko 2026, OnlineCalcAI case study).
- **Monetization**: ✅ Spec supports all four tiers  -  ads (US1-US2), freemium
  (US5), affiliate (integrated into calculator results), API/embed (US4, US7).

**Gate result: PASS**  -  no violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-calculator-suite/
├── spec.md              # Feature specification (source)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
webcalc/
├── calculators/
│   ├── config/           # TypeScript configs, one per calculator
│   │   ├── mrr-calculator.ts
│   │   ├── cac-calculator.ts
│   │   ├── ltv-calculator.ts
│   │   └── ...
│   ├── engine/           # Pure math functions, zero framework dependency
│   │   ├── mrr.ts
│   │   ├── cac.ts
│   │   ├── ltv.ts
│   │   └── ...
│   └── ui/               # Shared React presentation components
│       ├── CalculatorShell.tsx
│       ├── ResultCard.tsx
│       ├── InputSlider.tsx
│       └── Chart.tsx
├── app/                  # Next.js App Router
│   ├── [category]/
│   │   └── [slug]/
│   │       └── page.tsx  # Single dynamic route for all calculators
│   ├── embed/
│   │   └── [slug]/
│   │       └── page.tsx  # Lightweight embed route (no nav, no sidebar)
│   ├── dashboard/
│   │   └── page.tsx      # Interconnected multi-calculator dashboard
│   ├── api/
│   │   └── v1/
│   │       ├── calculators/
│   │       └── auth/
│   ├── layout.tsx
│   └── page.tsx          # Landing / category hub
├── lib/
│   ├── registry.ts       # Calculator config loader + validation
│   └── seo.ts            # Metadata + JSON-LD generators
├── public/
│   └── calculators/      # OG images, static assets per calc
├── specs/
│   └── 001-calculator-suite/
│       └── ...           # Documentation artifacts
├── tests/
│   ├── calculators/      # Unit tests for engine modules
│   ├── e2e/              # Playwright end-to-end tests
│   └── lighthouse/       # Performance regression tests
└── i18n/                 # Multi-language locale files
    ├── en/
    ├── es/
    ├── de/
    ├── pt/
    ├── fr/
    └── ja/
```

**Structure Decision**: Single project (Option 1 adapted for Next.js frontend
app). The `calculators/` top-level directory groups all calculator-specific
code (config, engine, UI) above the Next.js `app/` layer to ensure the
calculation engines remain framework-agnostic and extractable as a standalone
npm package for API/embed customers.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations  -  Constitution Check passed. Complexity tracking not required.
