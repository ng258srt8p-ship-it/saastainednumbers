/**
 * CONTENT AUTHORITY STANDARD
 *
 * Every calculator config must include ALL of the following content fields
 * to meet the Content Authority standard.
 *
 * Minimum content requirements:
 * - intro: ≥ 100 words, explains what the metric is and why it matters
 * - howToUse: ≥ 50 words, step-by-step instructions
 * - formulaExplanation: ≥ 30 words, plain English with example
 * - benchmarks: paragraph with cited data and sources
 * - benchmarkData: ≥ 3 rows of { metric, value, source } with dates
 * - relatedCalculators: ≥ 3 related calculator slugs in same/adjacent category
 * - faq: ≥ 10 Q&As, each ≥ 30 words, covering:
 *   1. What is [metric]?
 *   2. How is [metric] calculated?
 *   3. What is a good/bad [metric] value?
 *   4. How to improve [metric]?
 *   5. What's the difference between [metric] and [related metric]?
 *   6. Industry benchmarks for [metric]
 *   7. Common mistakes when calculating [metric]
 *   8. How often should I track [metric]?
 *   9. What affects [metric] the most?
 *   10. Limitations of [metric]
 * - verified: { source, sourceUrl, date } for the primary data source
 *
 * @see calculator-schema.ts for the full type definition
 */

import type { CalculatorContent } from "./calculator-schema";

export const contentTemplate: CalculatorContent = {
  intro: "", // ≥ 100 words. Explain the metric, why it matters, who uses it.
  howToUse: "", // ≥ 50 words. Numbered steps: what to enter, what you get.
  formulaExplanation: "", // ≥ 30 words. Formula in plain English + worked example.
  benchmarks: "", // ≥ 40 words. Contextual benchmark paragraph with cited data.
  benchmarkData: [], // ≥ 3 rows. Each: { metric, value, source } with year.
  relatedCalculators: [], // ≥ 3 slugs. Same or adjacent category calculators.
  faq: [], // ≥ 10 items. Each: { question, answer } ≥ 30 words each answer.
};

/**
 * FAQ COVERAGE CHECKLIST
 * Ensure your 10+ FAQs cover these topics:
 *
 * 1. Definition: "What is X?"
 * 2. Formula: "How is X calculated?"
 * 3. Benchmark: "What is a good X value?"
 * 4. Improvement: "How to improve X?"
 * 5. Comparison: "X vs Y — what's the difference?"
 * 6. Industry context: "Industry benchmarks for X"
 * 7. Pitfalls: "Common mistakes with X"
 * 8. Frequency: "How often to track X"
 * 9. Drivers: "What affects X the most?"
 * 10. Limitations: "Limitations of X"
 */

/**
 * VERIFIED BADGE REQUIREMENT
 *
 * Every config should include:
 *
 *   verified: {
 *     source: "Name of authoritative source",
 *     sourceUrl: "https://...",
 *     date: "Year or Month Year",
 *   }
 *
 * This renders a green checkmark badge under the page title.
 */
