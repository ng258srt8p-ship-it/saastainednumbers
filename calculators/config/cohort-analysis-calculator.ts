import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "cohort-analysis-calculator",
  category: "saas-deepen",
  meta: {
    title: "Cohort Analysis Calculator",
    description: "Perform cohort retention analysis by tracking how many users from an initial cohort remain active over multiple months and calculating your average retention rate.",
    keywords: ["cohort analysis", "retention analysis", "saas metrics", "user retention", "cohort retention"],
  },
  benchmarkMetric: "churn-rate",
  inputs: [
    { id: "initialCohortSize", label: "Initial Cohort Size", type: "number" as const, defaultValue: 1000, min: 1 },
    { id: "month1Retention", label: "Month 1 Retention Rate", type: "percentage" as const, defaultValue: 80, min: 0, max: 100 },
    { id: "month2Retention", label: "Month 2 Retention Rate", type: "percentage" as const, defaultValue: 70, min: 0, max: 100 },
    { id: "month3Retention", label: "Month 3 Retention Rate", type: "percentage" as const, defaultValue: 60, min: 0, max: 100 },
  ],
  outputs: [
    { id: "month1Retained", label: "Month 1 Retained Users", type: "number" as const, isPrimary: false },
    { id: "month2Retained", label: "Month 2 Retained Users", type: "number" as const, isPrimary: false },
    { id: "month3Retained", label: "Month 3 Retained Users", type: "number" as const, isPrimary: false },
    { id: "averageRetention", label: "Average Retention Rate", type: "percentage" as const, isPrimary: true },
  ],
  content: {
    intro: "Cohort Analysis is one of the most powerful tools in the SaaS analytics toolkit. It tracks a group of users who signed up in the same time period (a cohort) and measures how many remain active in each subsequent month. Unlike overall retention averages that mix users of different ages, cohort analysis reveals whether each new group of customers is retaining better or worse than previous groups. This distinction is critical because it can uncover trends in product quality, onboarding effectiveness, and customer fit. A declining retention rate across cohorts is a warning sign that your product experience is degrading or your marketing is attracting less qualified users. An improving retention rate validates that your product and onboarding improvements are working. This calculator simulates cohort retention over up to 3 months, showing how many users from an initial cohort remain at each month and calculating the average retention across the period. Use it to model retention scenarios and understand the impact of retention rate changes on your active user base.",
    howToUse: "Enter your initial cohort size and the retention rate percentage for months 1, 2, and 3. The calculator shows the retained user count at each month and the average retention rate across the period. Adjust the retention rates to model different scenarios and see how they affect long-term user retention.",
    formulaExplanation: "Retained Users Month 1 = Initial Cohort Size × (Month 1 Retention / 100). Retained Users Month N = Retained Users Month N-1 × (Month N Retention / 100). Average Retention Rate = (Month 1 Retention + Month 2 Retention + Month 3 Retention) / 3. Example: 1,000 users, 80% M1, 70% M2, 60% M3 → 800 M1, 560 M2, 336 M3 retained with 70% average retention.",
    benchmarks: "Best-in-class SaaS companies maintain month 1 retention above 80% and month 12 retention above 50%. According to Reforge and Mixpanel, median SaaS month 1 retention is 60-70% and month 12 retention is 25-35%. Consumer social apps have lower retention benchmarks (30-50% M1). Enterprise SaaS typically achieves higher retention (85%+ M1, 70%+ M12). Cohorts with month 3 retention below 40% typically indicate product-market fit issues.",
    benchmarkData: [
      { metric: "Best-in-Class Month 1 Retention", value: "80%+", source: "Reforge" },
      { metric: "Median Month 1 Retention", value: "60 - 70%", source: "Mixpanel" },
      { metric: "Best-in-Class Month 12 Retention", value: "50%+", source: "Reforge" },
      { metric: "Median Month 12 Retention", value: "25 - 35%", source: "Mixpanel" },
      { metric: "Enterprise Month 1 Retention", value: "85%+", source: "OpenView" },
    ],
    relatedCalculators: ["churn-calculator", "nrr-calculator", "customer-health-score-calculator"],
    faq: [
      { question: "Why is cohort analysis important for SaaS?", answer: "Cohort analysis reveals whether your product is getting better or worse over time. If newer cohorts retain worse than older ones, something is degrading  -  possibly your product experience, onboarding, or marketing quality. If cohorts improve, your changes are working." },
      { question: "What is a good retention rate for SaaS?", answer: "Month 1 retention above 80% is excellent. Month 12 retention above 50% is world-class. Median SaaS sees month 1 at 60-70% and month 12 at 25-35%. Retention benchmarks vary significantly by business model, customer type, and product category." },
      { question: "How many cohorts should I track?", answer: "Track monthly cohorts for at least 12-24 months to see meaningful patterns. Weekly cohorts are useful for products with rapid onboarding cycles. Quarterly cohorts smooth out seasonal variation but provide less granular data for trend analysis." },
      { question: "What is the difference between average retention and cumulative retention?", answer: "Average retention is the mean of retention rates across all tracked months. Cumulative retention tracks the percentage of the original cohort still active at each month, accounting for compounding losses. Both are useful but tell different stories about user behavior." },
      { question: "How do I improve cohort retention?", answer: "Improve onboarding to drive faster time-to-value, enhance core features based on usage data, implement re-engagement campaigns for dormant users, improve customer support responsiveness, and refine your ideal customer profile to attract higher-retention segments." },
      { question: "What causes retention to decline across cohorts?", answer: "Marketing targeting less ideal customer profiles, product changes that degrade the user experience, increased competition, market saturation, onboarding process regressions, or growing complexity that makes the product harder to adopt." },
      { question: "How does cohort analysis inform product decisions?", answer: "Cohort analysis helps you identify which product changes improve or harm retention. By comparing retention before and after a product launch, you can measure the true impact of your feature releases. It also reveals which features correlate with higher retention." },
      { question: "What tools help with cohort analysis?", answer: "Amplitude, Mixpanel, Heap, and PostHog all offer built-in cohort analysis. Google Analytics 4 has basic cohort capabilities. For SQL-savvy teams, writing custom cohort queries against your data warehouse provides maximum flexibility and customization." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "コホート分析計算機",
        description: "コホート維持率分析を行い、初期コホートのユーザーが複数月にわたってどの程度維持されているかを追跡します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
