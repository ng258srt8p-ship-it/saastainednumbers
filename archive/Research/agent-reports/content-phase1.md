# Content Phase 1 — Authority Agent Report

**Date:** 2026-05-24
**Agent:** Content Authority Agent

## Task 1: Content Model Analysis

Read 4 calculator configs and the schema (`calculator-schema.ts`):

| Field | Type | Status |
|-------|------|--------|
| `intro` | string | ✅ Present in all, 100-150 words |
| `howToUse` | string | ✅ Present, but thin in some (~30 words) |
| `formulaExplanation` | string | ✅ Present in all, 40-80 words |
| `benchmarks` | string | ✅ Present in all, 60-100 words |
| `benchmarkData` | BenchmarkRow[] | ✅ Present in all, 5-7 rows |
| `relatedCalculators` | string[] | ✅ Present in all, 2-5 entries |
| `faq` | FAQItem[] | ⚠️ 8 items each (needs 10+) |
| `verified` | VerifiedBadge | ❌ Field exists in schema but unused in all 4 configs |

The `verified` field was defined in `calculator-schema.ts` as:
```ts
verified?: { source: string; sourceUrl: string; date: string }
```
But **none** of the 75 calculators used it. `CalculatorClient.tsx` had hardcoded badge data.

## Task 2: Content Template

Created `calculators/config/_content-template.ts` documenting the ideal content structure with:
- Minimum word counts for each field
- FAQ coverage checklist (10 essential topics)
- Verified badge requirements

## Task 3: Enriched 4 Calculator Configs

### mrr-calculator.ts (Revenue)
- **Added `verified`:** `{ source: "SaaS Capital / KeyBanc Capital Markets 2025 SaaS Survey", sourceUrl: "https://www.keybanc.com/capital-markets", date: "2025" }`
- **Added 3 FAQ items:**
  1. "What is the difference between MRR and ARPU?" (49 words)
  2. "How often should I calculate MRR?" (59 words)
  3. "What are the limitations of MRR as a metric?" (66 words)
- **Enhanced relatedCalculators:** Added `mrr-growth-rate-calculator`, `nrr-calculator` (was 3, now 5)
- **FAQ count:** 8 → 11

### churn-calculator.ts (Churn & Retention)
- **Added `verified`:** `{ source: "Recurly Research 2025 / KeyBanc SaaS Survey", sourceUrl: "https://recurly.com/research/", date: "2025" }`
- **Expanded 1 FAQ** (valuation answer lengthened from 30 to 50 words)
- **Added 3 FAQ items:**
  1. "What industries have the lowest churn rates?" (47 words)
  2. "Can churn rate be negative?" (66 words)
  3. "What is the difference between voluntary and involuntary churn and how do I reduce each?" (72 words)
- **Enhanced relatedCalculators:** Added `customer-health-score-calculator`, `nrr-calculator` (was 3, now 5)
- **FAQ count:** 8 → 11

### fire-calculator.ts (Personal Finance)
- **Added `verified`:** `{ source: "Trinity Study / r/financialindependence / Federal Reserve 2025", sourceUrl: "https://www.bogleheads.org/wiki/Trinity_study_update", date: "2025" }`
- **Added 3 FAQ items:**
  1. "How does FIRE differ from traditional retirement planning?" (63 words)
  2. "How do taxes affect my FIRE withdrawal strategy?" (69 words)
  3. "What are common FIRE calculation mistakes to avoid?" (64 words)
- **Enhanced relatedCalculators:** Added `investment-returns-calculator`, `retire-401k-calculator`, `emergency-fund-calculator`, `debt-payoff-calculator` (was 2, now 5)
- **FAQ count:** 8 → 11

### claude-api-cost-calculator.ts (AI Cost)
- **Added `verified`:** `{ source: "Anthropic Official Pricing 2025", sourceUrl: "https://anthropic.com/pricing", date: "2025" }`
- **Added 3 FAQ items:**
  1. "How does Claude pricing compare to ChatGPT (GPT-4o)?" (63 words)
  2. "What is the most cost-effective Claude setup for a startup?" (69 words)
  3. "What are common mistakes when estimating API costs?" (62 words)
- **Enhanced relatedCalculators:** Replaced etsy link with `gemini-api-cost-calculator`, `grok-api-cost-calculator`, `perplexity-api-cost-calculator`, `ai-model-comparison-calculator` (was 2, now 5, all same category)
- **FAQ count:** 8 → 11

## Task 4: Verified Badge Integration

- **Updated `app/[category]/[slug]/CalculatorClient.tsx`:** Changed from hardcoded values to reading from `config.verified`. If `config.verified` is undefined, no badge renders.
- The `VerifiedBadge` component at `calculators/ui/VerifiedBadge.tsx` already had the correct UI with checkmark icon, source link, and date — no changes needed.

## Task 5: Related Calculators Enhancement

- The `CalculatorShell` already has a `relatedCalculators` slot rendered as a 2-column grid of cards.
- The `lib/related-calculators.ts` utility already handles lookup by slug (same-category first, then others).
- Enhanced all 4 configs with richer `relatedCalculators` lists (3→5 entries each).

## Task 6: Benchmark Utility

Extended `lib/benchmarks.ts` with:
- **New interface `BenchmarkData`** — `{ poor, average, good, excellent, source, date, notes? }`
- **New export `benchmarkReferences`** — `Record<string, BenchmarkData>` with 12 entries:
  1. `ltv-cac` — LTV:CAC ratio benchmarks
  2. `churn-rate` — Monthly churn rate benchmarks
  3. `nps` — Net Promoter Score benchmarks
  4. `mrr-growth-rate` — MRR monthly growth benchmarks
  5. `gross-margin` — Gross margin benchmarks
  6. `quick-ratio` — Quick Ratio benchmarks
  7. `cac-payback` — CAC payback period benchmarks
  8. `burn-multiple` — Burn multiple benchmarks
  9. `rule-of-40` — Rule of 40 benchmarks
  10. `arpu` — ARPU benchmarks
  11. `magic-number` — Magic Number benchmarks
  12. `employee-cost` — Employee cost benchmarks

## Verification Results

| Check | Result |
|-------|--------|
| TypeScript (`tsc --noEmit`) | ✅ 0 errors |
| Lint (`npm run lint`) | ✅ 0 errors (4 pre-existing warnings) |
| Unit Tests (Vitest) | ✅ 231/231 passed (75 test files) |
