---

description: "Task list for WebCalc MVP calculator suite feature implementation"
---

# Tasks: Calculator Suite — WebCalc MVP

**Input**: Design documents from `/specs/001-calculator-suite/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included inline within each user story phase. Write tests FIRST, ensure they FAIL before implementation.

## Agent Roles

The following specialized agents execute task phases independently. Each agent
operates on different file trees, enabling parallel execution.

| Agent | Focus Area | File Tree | Works After Phase |
|-------|-----------|-----------|-------------------|
| **Foundation Agent** | Project scaffold, config schema, registry, build pipeline, deployment | Project root, `lib/`, `package.json` | — |
| **Design Agent** | Brand identity, typography system, color palette, logo (SVG, favicon), design tokens, usability, visual polish, design system documentation | `public/`, `lib/design-tokens.ts`, `tailwind.config.ts`, `app/globals.css`, design mockups | 1 (Setup) — starts after Phase 1 brand identity tasks |
| **Calculator Engine Agent** | Pure math functions (zero framework dependency), 20 engines | `calculators/engine/`, `calculators/config/` | 2 (Foundational) |
| **UI Agent** | Shared components (CalculatorShell, ResultCard, InputSlider, Chart), styling | `calculators/ui/`, `app/` layout | 2 (Foundational) |
| **SEO/Content Agent** | Content pages, FAQ, schema markup, blog, OG images | `app/[category]/[slug]`, blog routes, `lib/seo.ts` | 2 (Foundational) |
| **Dashboard Agent** | Interconnected multi-calculator dashboard page | `app/dashboard/` | 3 (US3 start) |
| **Embed Agent** | iframe widget routes, embed snippet generator, postMessage API, tracking | `app/embed/`, embed routes | 3 (US3 done) |
| **Auth Agent** | NextAuth.js, Stripe integration, user accounts, Pro tier gating | `app/api/auth/`, `lib/auth/`, database models | 4 (US4 done) |
| **i18n Agent** | Multi-language locale files, language routing, translation system | `i18n/`, locale files, language switcher | 5 (US5 done) |
| **API Agent** | REST API v1 routes, rate limiting, API key management, docs | `app/api/v1/`, API docs | 6 (US6 done) |

---

## Phase 1: Setup

**Purpose**: Project initialization, basic structure, and toolchain configuration.
All agents depend on this phase.

- [X] T001 Initialize Next.js 16 project with App Router, TypeScript 5.x in project root (`npx create-next-app@latest . --typescript --app --src-dir=false`)
- [X] T002 [P] Configure Tailwind CSS v4 with shadcn/ui components (`npx shadcn@latest init`)
- [X] T003 [P] Configure Biome for linting and formatting in `biome.json`
- [X] T004 [P] Configure Vitest test runner in `vitest.config.ts` with React Testing Library
- [X] T005 [P] Install Playwright and create base E2E test config in `playwright.config.ts`
- [X] T006 [P] Create environment config files (`.env.example`, `.env.local`) with keys for Stripe, PostHog, Resend, NextAuth, Turso, Neon
- [X] T007 Create project directory structure: `calculators/config/`, `calculators/engine/`, `calculators/ui/`, `lib/`, `public/calculators/`, `tests/calculators/`, `tests/e2e/`, `tests/lighthouse/`, `i18n/en/`
- [X] T008 Create root layout in `app/layout.tsx` with Tailwind CSS import, metadata, and font loading (Inter + Plus Jakarta Sans)
- [X] T009 Set up Vercel deployment with `vercel.json` configuration
- [X] T010 Create `tsconfig.json` path aliases: `@/calculators/*`, `@/lib/*`, `@/i18n/*`
- [X] T120 [P] Create brand identity: design logo SVG in `public/logo.svg` (modern SaaS brand mark with calculator motif), generate `public/favicon.ico`, `public/apple-touch-icon.png`, and `public/icon.svg` for PWA; logo must work on light and dark backgrounds
- [X] T121 [P] Define brand color palette in `tailwind.config.ts` — primary (brand blue), secondary (teal), accent (amber), semantic colors (success green, warning amber, error red, info blue), neutral grays (50-950); ensure all foreground/background pairs meet WCAG AA contrast; documented in `lib/design-tokens.ts`
- [X] T122 [P] Select and configure typography system: choose a display typeface for headings (Plus Jakarta Sans), load via `next/font` in `app/layout.tsx` alongside Inter; define type scale in `lib/design-tokens.ts`
- [X] T123 [P] Create design token file `lib/design-tokens.ts` — export typed token objects: `colors` (all palette values), `typography` (font families, scales), `spacing` (4px grid), `borderRadius`, `shadows`, `transitions`
- [X] T132 [P] Create pre-launch landing page at `app/prelaunch/page.tsx` — email capture form, "N calculators coming soon" counter, value proposition, social proof placeholder
- [X] T133 [P] Implement privacy messaging component in `calculators/ui/PrivacyNotice.tsx` — "Your data never leaves your device" info bar

**Checkpoint**: Project boots (`npm run dev` serves at localhost:3000), lint/typecheck passes, Vercel deployment works.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story.
**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T011 Create `lib/registry.ts` — calculator config loader that reads `calculators/config/*.ts`, validates against schema, and registers calculators by slug and category
- [X] T012 Create `calculators/config/calculator-schema.ts` — TypeScript interfaces for `CalculatorConfig`, `CalculatorInput`, `CalculatorOutput`, `CalculatorContent`, `FAQItem`, `ChartConfig`, `BenchmarkData`
- [X] T013 Create `lib/seo.ts` — JSON-LD schema generators: `generateWebApplicationSchema(slug, config)`, `generateBreadcrumbListSchema(category, slug)`, `generateFAQPageSchema(faqItems)`, `generateMetadata(config)` returning Next.js `Metadata` object with title, description, canonical, OG tags
- [X] T014 Create `calculators/ui/CalculatorShell.tsx` — shared layout component wrapping calculator widget: title, description, calculator card, content section, FAQ section, related calculators, CTA
- [X] T015 Create `calculators/ui/InputSlider.tsx` — reusable input component supporting types: number, currency (with $ prefix), percentage (with % suffix), range slider
- [X] T016 Create `calculators/ui/ResultCard.tsx` — reusable result display component with formatting for currency, percentage, number, ratio; prominent hero result styling for `isPrimary: true`
- [X] T017 Create `calculators/ui/Chart.tsx` — reusable chart component using lightweight library for bar, line, and area charts (install recharts or chart.js)
- [X] T018 Create `calculators/ui/Breadcrumb.tsx` — breadcrumb component integrating `generateBreadcrumbListSchema` from `lib/seo.ts`
- [X] T019 Set up PostHog analytics: create `lib/posthog.ts` client, track `pageview` and `calculate` events
- [X] T020 [P] Create `tests/calculators/helpers.ts` — test utilities for mocking calculator configs and validating engine outputs
- [X] T124 [P] Create component design specifications (annotated mockups) for CalculatorShell, InputSlider, ResultCard, Chart
- [X] T125 [P] Completed alongside T124
- [X] T126 [P] Completed alongside T124
- [X] T127 [P] Completed alongside T124
- [X] T128 [P] Create design system documentation — brand guide in design tokens + component specs
- [X] T134 [P] Create feedback widget component in `calculators/ui/FeedbackWidget.tsx`
- [X] T135 [P] Create live calculation counter in `calculators/ui/LiveCounter.tsx`
- [X] T136 [P] Create `lib/kill-switch.ts` — monitoring module for kill switch thresholds
- [X] T137 [P] Create competitor tracking (PostHog event pipeline structure)
- [X] T138 [P] Set up i18n framework: `lib/i18n.ts` with locale config
- [X] T139 [P] Create locale file scaffolds in `i18n/en/common.json` (source) + structure for remaining locales
- [X] T140 [P] Create `lib/related-calculators.ts` — auto-generates related calculator links
- [X] T141 Initialize content uniqueness checker in `lib/content-uniqueness.ts`

**Checkpoint**: Foundation ready — registry loads configs, schema generators produce valid JSON-LD, shared UI components render, analytics events fire. Design system documented; UI agents reference component specs. i18n framework initialized (constitution-compliant timing). Kill switch monitoring and competitor tracking pipelines active.

---

## Phase 3: User Story 1 — Instant Calculation (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor navigates to any calculator page and receives
accurate calculation results instantly — without account creation.

**Independent Test**: A first-time visitor can navigate to any calculator page,
input values, and see correct calculated results immediately — no account required.

### Calculator Engines (Core — 5 Launch Calculators)

- [X] T021 [P] [US1] Create `calculators/engine/mrr.ts` — `calculateMRR(params: { customers, arpu }): { mrr, arr }` with validation (mrr >= 0, arr = mrr * 12)
- [X] T022 [P] [US1] Create `calculators/engine/cac.ts` — `calculateCAC(params: { salesCost, marketingCost, newCustomers }): { cac }` with validation (cac >= 0)
- [X] T023 [P] [US1] Create `calculators/engine/ltv.ts` — `calculateLTV(params: { arpu, grossMargin, churnRate }): { ltv, ltvCacRatio }` with churn sensitivity analysis
- [X] T024 [P] [US1] Create `calculators/engine/churn.ts` — `calculateChurn(params: { customersStart, customersEnd, lostCustomers }): { monthlyChurnPct, annualChurnPct, retainedCustomers }`
- [X] T025 [P] [US1] Create `calculators/engine/arpu.ts` — `calculateARPU(params: { mrr, totalCustomers }): { arpu }` with segment breakdown support
- [X] T026 [P] [US1] Write unit tests for all 5 engines in `tests/calculators/` — test valid inputs, edge cases (zero, negative, extreme values), and boundary conditions

- [X] T027 [P] [US1] Create `calculators/config/mrr-calculator.ts` — config for MRR calculator
- [X] T028 [P] [US1] Create `calculators/config/cac-calculator.ts` — config for CAC calculator
- [X] T029 [P] [US1] Create `calculators/config/ltv-calculator.ts` — config for LTV calculator
- [X] T030 [P] [US1] Create `calculators/config/churn-calculator.ts` — config for Churn calculator
- [X] T031 [P] [US1] Create `calculators/config/arpu-calculator.ts` — config for ARPU calculator

- [X] T032 [US1] Create `lib/useCalculatorState.ts` — hook that reads/writes calculator state from URL searchParams
- [X] T033 [US1] Create dynamic route `app/[category]/[slug]/page.tsx` — SSG via `generateStaticParams`
- [X] T034 [US1] Integrate `useCalculatorState` into the dynamic route
- [ ] T035 [US1] Create landing page `app/page.tsx` (completed in Phase 1)
- [X] T036 [US1] Create category hub pages `app/[category]/page.tsx`

- [X] T037 [US1] Implement input validation in `calculators/ui/InputSlider.tsx`
- [X] T038 [US1] Implement extreme value handling and display formatting for all output types
- [ ] T039 [US1] Test ad blocker coexistence (manual QA)
- [ ] T142 [US1] Create `tests/schema/validation.test.ts`
- [ ] T143 [US1] Integrate content uniqueness checker into CI pipeline

**Checkpoint**: 5 calculators fully functional on dedicated pages, URL state sharing works, instant calculation verified. MVP is demonstrable.

---

## Phase 4: User Story 2 — Content-Rich Calculator Discovery (Priority: P1)

**Goal**: Each calculator page ranks in search engines via 500+ words of
explanatory content, full schema markup, and FAQ sections.

**Independent Test**: A calculator page can be indexed by search engines,
contains 500+ words of content, structured FAQ, and renders rich results.

### Content System & Schema

- [ ] T040 [US2] Extend `CalculatorConfig` interface in `calculators/config/calculator-schema.ts` to include `content` field: `intro`, `howToUse`, `formulaExplanation`, `benchmarks`, `relatedCalculators`, `faq`
- [ ] T041 [US2] Create `app/[category]/[slug]/page.tsx` content section rendering: intro paragraph, formula box with worked example (styled), industry benchmarks table, "How to use" numbered steps, related calculators links
- [ ] T042 [US2] Create FAQ component in `calculators/ui/FAQ.tsx` — collapsible accordion with `FAQPage` schema generated from `lib/seo.ts`, supports 5-12 items per calculator
- [ ] T043 [US2] Add breadcrumb structured data (`BreadcrumbList` schema) to root layout — auto-generated from current route: `Home > Category > Calculator Name`
- [ ] T044 [US2] Generate per-calculator OG images in `public/calculators/` — dynamic OG image generation endpoint or static images with calculator name, category color, and value proposition

### Calculator Content (5 Launch Calculators)

- [ ] T045 [US2] Write content for MRR calculator: 500+ words covering MRR definition, formula (MRR = Customers × ARPU), worked example, industry benchmarks by company stage, 8 FAQ items about MRR growth and churn impact
- [ ] T046 [US2] Write content for CAC calculator: 500+ words covering CAC formula, worked example, benchmarks by acquisition channel (paid, organic, sales-led), 8 FAQ items about CAC payback period
- [ ] T047 [US2] Write content for LTV calculator: 500+ words covering LTV formula with churn-adjusted calculation, worked example, good LTV:CAC ratios by industry, 8 FAQ items about factors affecting LTV
- [ ] T048 [US2] Write content for Churn calculator: 500+ words covering monthly vs annual churn, formula with examples, benchmarks by SaaS vertical, 8 FAQ items about churn reduction strategies
- [ ] T049 [US2] Write content for ARPU calculator: 500+ words covering ARPU significance, formula, segmentation by pricing tier, benchmarks by company stage, 6 FAQ items

### Blog Setup

- [ ] T050 [US2] Set up MDX blog in `app/blog/` — blog listing page, individual blog post layout with MDX support, RSS feed generation
- [ ] T051 [US2] Write 4 foundation blog posts: "How to Calculate MRR for Your SaaS Business" (links to MRR calculator, CAC calculator), "What is a Good LTV:CAC Ratio? Industry Benchmarks 2026" (links to LTV, CAC calcs), "Monthly vs Annual Churn: What SaaS Founders Get Wrong" (links to Churn calculator), "SaaS Metrics Every Founder Should Track in 2026" (links to all 5 launch calculators)
- [ ] T144 [US2] Create verified badge component in `calculators/ui/VerifiedBadge.tsx` — displays "Verified: [source name], [month] [year]" with green checkmark icon; source URL and verification date configured per-calculator in `CalculatorConfig.verified` field; positioned below calculator title
- [ ] T145 [US2] Create request-a-calculator feature: add `app/request-calculator/page.tsx` with form (calculator name, category, use case, email); connected to Neon database or Resend email; add "Request a Calculator" link in site footer and on calculator page sidebar
- [ ] T146 [US2] Extend calculator content pages with explicit benchmark data tables: per-calculator config must include `benchmarkData` array (rows: metric label, value range, source); rendered as styled table in content section following CalculatorCove's pattern
- [ ] T147 [US2] Write content uniqueness baseline: after all 5 launch calculator content is written, run `lib/content-uniqueness.ts` verification to ensure ≥ 40% uniqueness per page; adjust content to meet threshold before deployment

**Checkpoint**: All 5 calculator pages have 500+ words content, FAQ with schema, OG images. Blog with 4 posts live. Verified badge with source citations displayed on every calculator. Request-a-calculator page online. Rich results visible in Google structured data testing tool. Content uniqueness > 40% confirmed via automated check.

---

## Phase 5: User Story 3 — Interconnected Dashboard (Priority: P2)

**Goal**: A visitor fills one form and sees results from 5+ related calculators
simultaneously on a single dashboard page.

**Independent Test**: A visitor fills a single form and sees calculated results
from at least 5 different calculator types displayed simultaneously.

- [X] T052 [US3] Create `app/dashboard/page.tsx` — single-page form with inputs for: customers, ARPU, churn rate, sales cost, marketing cost, new customers, gross margin
- [X] T053 [US3] Create dashboard input form component (inline in dashboard page)
- [X] T054 [US3] Create result grid — displays 5 result cards (MRR, ARR, CAC, LTV, Churn) in a responsive grid, each card links to the dedicated calculator page with inputs pre-filled via URL params
- [X] T055 [US3] Implement real-time calculation update: all 5 engines compute on every input change
- [X] T056 [US3] Add "Explore in Detail" link on each result card pointing to `/[category]/[slug]?input1=val1&input2=val2`
- [ ] T057 [US3] [P] Write Playwright E2E test for dashboard

- [X] T058 [US4] Create embed route `app/embed/[slug]/page.tsx` — lightweight page with no nav, no sidebar
- [X] T059 [US4] Create attribution component in embed page — "Powered by WebCalc" link with rel="nofollow"
- [ ] T060 [US4] Add "Embed" button to every calculator page in `CalculatorShell.tsx`
- [X] T061 [US4] Create embed code generator in `lib/embed.ts`
- [ ] T062 [US4] Implement embed tracking with PostHog
- [ ] T063 [US4] Implement postMessage API in embed page
- [ ] T064 [US4] [P] Create embed snippet generator modal
- [ ] T065 [US4] [P] Write Playwright E2E test for embed

**Checkpoint**: Every calculator page has an "Embed" button, generated snippet works on any HTTPS site, embed attribution displays, calculations work in iframe, postMessage API functional for parent↔embed communication, embed analytics tracked in PostHog.

---

## Phase 7: User Story 5 — Freemium Pro Account (Priority: P3)

**Goal**: Users create accounts, save calculation history, export PDFs, and
upgrade to Pro — all on top of the existing free calculator experience.

**Independent Test**: A user creates an account, saves a calculation, exports
as PDF, and upgrades to a paid plan — without any prior account.

### Database & Auth Setup

- [ ] T066 [US5] Set up Neon PostgreSQL database: create schema for `UserAccount` and `CalculationRecord` tables per data-model.md
- [ ] T067 [US5] Configure NextAuth.js in `app/api/auth/[...nextauth]/route.ts` — Email magic link provider + Google OAuth provider, Prisma/Neon adapter for database persistence
- [ ] T068 [US5] Create Prisma schema `prisma/schema.prisma` with `UserAccount` model (id, email, displayName, subscriptionTier, subscriptionId, locale, apiKey, createdAt, lastLoginAt) and `CalculationRecord` model (id, userId, calculatorSlug, inputs, outputs, embedSource, createdAt)

### Freemium Features

- [ ] T069 [US5] Implement calculation history saving: logged-in users auto-save every calculation to database via API route `POST /api/calculations/save`; anonymous users save to localStorage (3-5 slot limit)
- [ ] T070 [US5] Create "My Calculations" page `app/account/calculations/page.tsx` — list of saved calculations with links to re-run them (URL state pre-filled), search/filter by calculator type, delete option
- [ ] T071 [US5] Create `app/account/settings/page.tsx` — user profile settings: display name, language preference, API key management, account deletion
- [ ] T072 [US5] Implement PDF export for Pro users: `POST /api/calculations/export` generates PDF with input values, formula, results, and timestamp (use `jsPDF` or server-side PDF library)
- [ ] T073 [US5] Implement ad-free experience for Pro users: check subscription status in middleware, conditionally render ad slots only for non-Pro users
- [ ] T074 [US5] Create 5 premium-only calculators: `calculators/config/nrr-calculator.ts`, `calculators/config/gross-margin-calculator.ts`, `calculators/config/payback-period-calculator.ts`, `calculators/config/burn-rate-calculator.ts`, `calculators/config/quick-ratio-calculator.ts` — each with premium: true in config
- [ ] T075 [US5] Implement premium gating: free users clicking premium calculators see upgrade prompt modal with Pro feature comparison table; engine still loads but results display inline upgrade CTA after 1 free use

### Stripe Billing

- [ ] T076 [US5] Set up Stripe products and prices: Pro Monthly ($7/mo), Pro Annual ($69/yr), AI Monthly ($15/mo), AI Annual ($149/yr) in Stripe Dashboard
- [ ] T077 [US5] Create `app/api/webhooks/stripe/route.ts` — Stripe webhook handler: `checkout.session.completed` → upgrade user to Pro, `customer.subscription.deleted` → downgrade to free
- [ ] T078 [US5] Create pricing page `app/pricing/page.tsx` — tier comparison table (Free / Pro $7/mo / AI $15/mo) with feature checklist, Stripe checkout links, FAQ about billing
- [ ] T079 [US5] Implement email capture prompt: after 3rd calculation by anonymous user, show modal "Save your calculations — create a free account" with email input
- [ ] T116 [US5] Implement server-side ad injection for ad blocker bypass: `lib/ads.ts` — ad slots rendered server-side with unique IDs, configurable per-page ad density, ad-block detection fallback; targets 95% recovery of blocked impressions per v1.8 risk mitigation (moved from Phase 11 — research requires this by month 9-12, concurrent with freemium launch)

**Checkpoint**: Users register, save calculations, export PDFs (Pro), upgrade via Stripe. Premium calculators gate properly. Ad-free works for Pro users.

---

## Phase 8: User Story 6 — Multi-Language Support (Priority: P4)

**Goal**: All calculator interfaces, content, and navigation available in 5
languages beyond English.

**Independent Test**: A user selecting Spanish can use all calculators, read
content, and share results entirely in Spanish.

- [ ] T080 [US6] (MOVED TO PHASE 2 — i18n framework and locale routing initialized in T138)
- [ ] T081 [US6] (MOVED TO PHASE 2 — locale file scaffolds created in T139)
- [ ] T082 [US6] (MOVED TO PHASE 2 — language detection and routing implemented in T138)
- [ ] T083 [US6] Translate calculator content for 5 launch calculators into Spanish, German, Portuguese, French, Japanese — content blocks, formula explanations, benchmark descriptions, all 5-12 FAQ items per calculator; runs in parallel with US3/US4 (constitution mandates multi-language start by month 3-4)
- [ ] T084 [US6] Translate 4 foundation blog posts into all 5 languages — MDX blog posts per locale; schedule alongside calculator content translation to maximize 30x traffic multiplier effect per OnlineCalcAI case study
- [ ] T085 [US6] Implement language-aware URL state: `/[locale]/[category]/[slug]?inputs...` — locale prefix in URL ensures shared links preserve language preference
- [ ] T086 [US6] Add locale fallback: if content not yet translated for a locale, gracefully fall back to English with a subtle banner "This page is not yet available in [Language]"
- [ ] T087 [US6] [P] Write Playwright test for language switching: switch language → verify all UI elements display in selected language → verify calculator labels translated → verify content sections translated

**Checkpoint**: Site available in all 6 languages (EN + 5). Language detection works. Manual switcher works. Translated content loads for each calculator.

---

## Phase 9: User Story 7 — Developer API Access (Priority: P4)

**Goal**: Developers integrate calculator engines into their applications via
REST API with rate limiting and tiered pricing.

**Independent Test**: A developer with a valid API key sends input data and
receives correct calculation results as structured data.

- [ ] T088 [US7] Create `app/api/v1/calculators/[slug]/calculate/route.ts` — POST endpoint per contract: accepts JSON body with `{ inputs: { ... } }`, validates inputs against config schema, calls engine, returns structured response
- [ ] T089 [US7] Create `app/api/v1/calculators/route.ts` — GET endpoint listing all available calculators with their input/output schemas (no auth required, public for discovery)
- [ ] T090 [US7] Create `app/api/v1/calculators/[slug]/route.ts` — GET endpoint returning full calculator config and input schema
- [ ] T091 [US7] Create `app/api/v1/usage/route.ts` — GET endpoint returning current API usage stats for authenticated key
- [ ] T092 [US7] Implement API key authentication middleware: extract Bearer token from `Authorization` header, validate against database, set `request.user` on context
- [ ] T093 [US7] Implement rate limiting: check usage counter per API key, return `429` with `Retry-After` header when exceeded (free: 100/hr, pro: 1,000/hr)
- [ ] T094 [US7] Create rate limit storage in Neon database: `ApiUsage` table with key, hour, requestCount, resetAt fields; increment on each request, reset on new hour
- [ ] T095 [US7] Implement API key management in user settings page `app/account/settings/page.tsx`: generate new key, revoke key, view current usage stats
- [ ] T096 [US7] Create API documentation page `app/api-docs/page.tsx` — interactive documentation with request/response examples for all 4 endpoints, rate limit info, authentication instructions
- [ ] T097 [US7] [P] Write API contract tests in `tests/contract/` — test all 4 endpoints: valid request returns 200, invalid inputs return 400, no auth returns 401, rate limited returns 429, unknown slug returns 404

**Checkpoint**: All 4 API endpoints functional. Rate limiting works. API key management in settings. Documentation page accessible. Contract tests all pass.

---

## Phase 10: Calculator Expansion (10 More Calculators)

**Purpose**: Expand calculator library from 5 to 20 across all 4 categories,
executed in parallel with other phases once Phase 3 (US1) is stable.

**Note**: Each calculator follows the identical pattern — create config, create
engine, write content, write FAQ — taking approximately 30 minutes per calculator.

### Category 2: Unit Economics (5 calculators)

- [ ] T098 [P] Create LTV:CAC Ratio calculator: `calculators/config/ltv-cac-ratio.ts` + `calculators/engine/ltv-cac-ratio.ts` + content (500+ words, 6 FAQ) — reuses LTV and CAC engines
- [ ] T099 [P] Create CAC Payback Period calculator: `calculators/config/cac-payback.ts` + `calculators/engine/cac-payback.ts` + content (500+ words, 6 FAQ)
- [ ] T100 [P] Create Gross Margin calculator: `calculators/config/gross-margin.ts` + `calculators/engine/gross-margin.ts` + content (500+ words, 6 FAQ)
- [ ] T101 [P] Create Burn Rate calculator: `calculators/config/burn-rate.ts` + `calculators/engine/burn-rate.ts` + content (500+ words, 6 FAQ) — high-value keyword at KD 10
- [ ] T102 [P] Create Runway calculator: `calculators/config/runway.ts` + `calculators/engine/runway.ts` + content (500+ words, 6 FAQ)

### Category 3: Churn & Retention (3 calculators)

- [ ] T103 [P] Create Revenue Churn calculator: `calculators/config/revenue-churn.ts` + `calculators/engine/revenue-churn.ts` + content (500+ words, 6 FAQ)
- [ ] T104 [P] Create Quick Ratio calculator: `calculators/config/quick-ratio.ts` + `calculators/engine/quick-ratio.ts` + content (500+ words, 6 FAQ)
- [ ] T105 [P] Create Net Revenue Retention calculator: `calculators/config/nrr.ts` + `calculators/engine/nrr.ts` + content (500+ words, 6 FAQ)

### Category 4: Growth & Efficiency (2 calculators)

- [ ] T106 [P] Create Rule of 40 calculator: `calculators/config/rule-of-40.ts` + `calculators/engine/rule-of-40.ts` + content (500+ words, 6 FAQ)
- [ ] T107 [P] Create Magic Number calculator: `calculators/config/magic-number.ts` + `calculators/engine/magic-number.ts` + content (500+ words, 6 FAQ)

**Checkpoint**: 20 calculators live across 4 categories. Each calculator has
engine, config, content (500+ words), FAQ, OG image, and schema markup.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Performance optimization, design refinement, and final quality
gates across all user stories.

- [ ] T108 [P] Measure and optimize Lighthouse scores: target Performance ≥ 95, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 95 — address render-blocking resources, image optimization, CLS fixes
- [ ] T109 [P] Verify JS bundle size ≤ 80KB gzipped per page using `next-bundle-analyzer` — tree-shake unused imports, lazy-load heavy components
- [ ] T110 [P] Implement 404 page `app/not-found.tsx` — friendly design with search functionality and link to homepage
- [ ] T111 [P] Add loading states: skeleton loaders for calculator pages (`loading.tsx` with skeleton of calculator inputs + content blocks)
- [ ] T112 [P] Generate XML sitemap via `app/sitemap.ts` — all 20+ calculator pages, category pages, blog posts, dashboard, pricing page
- [ ] T113 [P] Create `robots.txt` at `public/robots.txt` — allow all crawlers, point to sitemap
- [ ] T114 [P] Harden error boundaries: wrap each calculator in `error.tsx` boundary with fallback UI and retry button
- [ ] T115 Add dark mode support: implement Tailwind dark mode class strategy, toggle in header, persist preference in localStorage
- [ ] T117 Verify all 20 calculators render correctly in Lighthouse CI check and pass the 90/90/90/95 threshold
- [ ] T118 Run full Playwright E2E test suite: verify all 20 calculator pages load, dashboard works, embed renders, auth flow completes, language switching works
- [ ] T119 [P] Design execution audit (Design Agent): verify typography scale matches design tokens, color usage consistent with palette, all WCAG AA contrast ratios pass, brand logo used correctly (clear space, no distortion)
- [ ] T129 [P] Interaction design refinement (Design Agent): consistent hover/focus/active states across all interactive elements, smooth transitions (200-300ms ease-out) on all state changes, micro-animations for calculator result updates (scale pulse on new value), loading skeleton animations
- [ ] T130 [P] Responsive visual QA (Design Agent): verify all pages render correctly at 320px, 768px, 1024px, 1440px, 1920px widths — no overflow, no broken layouts, touch targets ≥ 44px on mobile, readable font sizes at all breakpoints
- [ ] T131 [P] Usability audit (Design Agent): review form label placement (top-aligned recommended for readability), input field grouping, error message proximity to fields, button hierarchy (primary/secondary visual weight), navigation clarity, empty states, scroll behavior on calculator result update
- [ ] T148 Implement geo-targeted content optimization: configure hreflang tags for multi-language pages (Phase 8 output), prioritize US/UK/CA/AU keywords in content strategy, add `hreflang` metadata to `lib/seo.ts` generators per v1.7 research (Tier 1 countries = 2-4x RPM)
- [ ] T149 Implement ad block detection wall in `lib/ad-block-detect.ts` — client-side check for ad blocker presence, show gentle prompt: "WebCalc is free thanks to ads. Please disable your ad blocker or consider Pro ($7/mo) for an ad-free experience." with dismiss option; linked to freemium upsell flow from US5
- [ ] T150 Create blog content pipeline automation: `lib/blog-calendar.ts` — tracks weekly blog output against 2-3 posts/week target (Constitution II mandate), sends reminder if behind schedule, generates PostHog event `blog_production_week_{count}` for velocity tracking

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories. Now includes i18n framework (T138, T139) per constitution month 3-4 mandate. Includes kill switch monitoring (T136), competitor tracking (T137), feedback widget (T134), live counter (T135).
- **User Stories (Phases 3-9)**: All depend on Foundational phase completion
  - US1 (Phase 3) → Must complete before US2, US3, US5. Now includes schema validation test (T142) + content uniqueness check (T143).
  - US2 (Phase 4) → Can start immediately after Phase 2 (only needs engines from US1, which are P tasks). Now includes verified badge (T144), request-a-calc (T145), benchmark tables (T146), uniqueness baseline (T147).
  - US3 (Phase 5) → Depends on US1 (needs calculator engines + configs)
  - US4 (Phase 6) → Depends on US1 (needs calculator engine for embed). Embeds now include responsive container, postMessage API, and embed analytics per constitution.
  - US5 (Phase 7) → Depends on US1 (needs calculator experience to be worth paying for). Now includes server-side ad injection (T116) — moved from Phase 11 per v1.8 risk mitigation timeline (month 9-12).
  - US6 (Phase 8) → i18n framework pre-initialized in Phase 2 (T138, T139). Content translation (T083, T084) runs in parallel with US3/US4 — constitution mandates month 3-4 start.
  - US7 (Phase 9) → Depends on US1 (needs mature calculator engines) + US5 (needs auth for API keys)
- **Calculator Expansion (Phase 10)** → Can start after US1 (Phase 3) — engines parallelizable
- **Polish (Phase 11)** → Depends on all desired user stories. Now includes geo-targeting (T148), ad block detection wall (T149), blog velocity pipeline (T150).

### Agent Dependencies

- **Design Agent** — Works in parallel with Setup (Phase 1): brand identity tasks. Delivers logo, color palette, typography system, and design tokens before Foundational phase. Provides component design specs (T124-T128) in Phase 2 before UI Agent creates components. Performs final visual audit in Phase 11. Creates design system documentation at `specs/001-calculator-suite/design-system.md`.
- **Foundation Agent** — Starts Phase 1, continues through Phase 2. Hands off to all other agents. Now also sets up i18n framework (T138, T139), kill switch monitoring (T136), competitor tracking (T137), and content uniqueness checker (T141) in Phase 2.
- **UI Agent** — Depends on Design Agent delivering component specs (T124-T128) and design tokens (T123) before building shared components (T014-T017). Also builds feedback widget (T134), live counter (T135), privacy notice (T133), verified badge (T144) per new FRs.
- **i18n Agent** — Now starts in Phase 2 (not Phase 8) — sets up locale routing and file scaffolds (T138, T139). Content translation (T083, T084) runs in parallel with US3/US4 per constitution month 3-4 mandate.
- **All other agents** — Depend on Foundation + Design + UI completion.

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — Foundation ready. Now includes schema validation + content uniqueness gate.
- **US2 (P1)**: Can start after Phase 2 — [P] parallel with US1 (different file trees: content vs engine). Now includes verified badge, request-a-calc, benchmark tables.
- **US3 (P2)**: Depends on US1 completion (needs 5 calculator engines) — can run in parallel with US2
- **US4 (P2)**: Depends on US1 completion (needs calculator widget) — can run in parallel with US2, US3
- **US5 (P3)**: Depends on US1 + (ideally) US3 — calculator must be compelling before paywall. Now includes server-side ad injection.
- **US6 (P4)**: i18n framework ALREADY SET UP in Phase 2 (T138, T139). Content translation (T083, T084) starts in parallel with US3/US4 — constitution mandates month 3-4.
- **US7 (P4)**: Depends on US1 + US5 — needs engines and auth

### Parallel Execution Model

```
Week 1-2:     Phase 1 (Setup) + Phase 2 (Foundational — includes i18n framework per constitution mandate)
                     │
Week 2-4:     ┌─────┼─────┬──────┬──────┐
              │     │     │      │      │
          Phase 3 Phase 4 US3   US4   Phase 8 (content
           (US1)  (US2) (start)(start) translation — i18n
              │     │     │      │     framework ready from
              │     │     │      │     Phase 2)
Week 4-8:     │     │     │      │
              ├──Phase 3 complete──┤
              │     │     │      │
              │  Phase 5  │  Phase 6
              │   (US3)   │   (US4)
              │     │     │      │
Week 8-12:    └──Phase 3-6 complete─┘
                       │
              ┌────────┴────────┐
              │                 │
           Phase 7           Phase 10
            (US5)           (10 more calcs)
            (+ server-side    │
             ad injection)    │
              │           Phase 8 (remaining
              │           blog/blog translations)
Week 12-16:   │                 │
              └──Phase 7 complete─┘
                       │
              ┌────────┴────────┐
              │                 │
           Phase 8           Phase 9
           (wrap-up i18n)    (US7)
              │                 │
Week 16-20:   └─────Phase 8+9 complete──┘
                          │
                     Phase 11
                    (Polish)
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (5 calculators working)
4. Complete Phase 4: User Story 2 (content for those 5 calculators)
5. **STOP and VALIDATE**: Test US1 + US2 independently
6. Deploy to Vercel with 5 production calculators

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready. i18n framework initialized (constitution-compliant). Kill switch + competitor tracking pipelines active. (Week 1-2)
2. Add US1 + US2 → 5 calculator pages with SEO content, verified badges, feedback widget, request-a-calc → Deploy (MVP! Week 4)
3. Add US3 (Dashboard) + US4 (Embeds with postMessage API + embed analytics) + US6 content translation begins (constitution month 3-4) → Key differentiators → Deploy (Week 8)
4. Add US5 (Freemium) + server-side ad injection → Revenue starts + ad blocker mitigation → Deploy (Week 12)
5. Add 10 more calculators → 15 total → Deploy (Week 14)
6. Wrap up US6 (Multi-language) content + blog translations → Traffic multiplier → Deploy (Month 4)
7. Add US7 (API) + more calculators → 20 total → Deploy (Month 5)
8. Polish: geo-targeting, ad block detection wall, blog velocity pipeline

Each increment adds value without breaking previous functionality.
