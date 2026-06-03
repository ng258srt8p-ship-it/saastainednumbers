import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "nrr-calculator",
  category: "revenue",
  meta: {
    title: "Net Revenue Retention Calculator (NRR)",
    description: "Calculate your Net Revenue Retention (NRR) rate to measure how much revenue you retain from existing customers including expansions and downgrades.",
    keywords: ["nrr", "net revenue retention", "saas metrics", "retention", "revenue retention"],
  },
  benchmarkMetric: "nrr",
  inputs: [
    { id: "startMrr", label: "Starting MRR", type: "currency" as const, defaultValue: 100000 },
    { id: "expansionMrr", label: "Expansion MRR (upgrades)", type: "currency" as const, defaultValue: 15000 },
    { id: "churnedMrr", label: "Churned MRR (cancellations)", type: "currency" as const, defaultValue: 8000 },
    { id: "contractionMrr", label: "Contraction MRR (downgrades)", type: "currency" as const, defaultValue: 3000 },
  ],
  outputs: [
    { id: "nrr", label: "Net Revenue Retention (NRR)", type: "percentage" as const, isPrimary: true },
    { id: "grossRetentionRate", label: "Gross Revenue Retention", type: "percentage" as const, isPrimary: false },
    { id: "netRetentionRate", label: "Net MRR Change", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Net Revenue Retention (NRR) measures the percentage of recurring revenue retained from existing customers over a period, including expansion revenue from upsells and cross-sells minus churn and contraction. NRR is arguably the most important SaaS metric after MRR because it reveals whether your existing customer base is growing in value (NRR > 100%) or shrinking (NRR < 100%). Companies with NRR above 120% are considered best-in-class and can grow without adding new customers. This calculator computes NRR and gross retention to give you a complete picture of your revenue retention health.",
    howToUse: "Enter your starting MRR, expansion MRR from upgrades, churned MRR from cancellations, and contraction MRR from downgrades. The calculator will compute your NRR percentage. An NRR above 100% means existing customers are growing in value; below 100% means they're shrinking.",
    formulaExplanation: "NRR = (Starting MRR + Expansion MRR - Churned MRR - Contraction MRR) ÷ Starting MRR × 100. Gross Retention = (Starting MRR - Churned - Contraction) ÷ Starting MRR × 100. Example: Starting MRR = $100K, +$15K expansions, -$8K churned, -$3K contractions. NRR = ($100K + $15K - $8K - $3K) ÷ $100K × 100 = 104%",
    benchmarks: "Top-quartile public SaaS companies achieve NRR above 120%. Good NRR is 110-120%. Acceptable is 100-110%. Below 100% means existing customers are shrinking in value. According to KeyBanc Capital Markets 2025 SaaS Survey, median NRR for public SaaS companies is 115%. Gross revenue retention typically ranges from 85-95% for enterprise SaaS.",
    benchmarkData: [
      { metric: "Best-in-Class NRR", value: "120%+", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Good NRR", value: "110 - 120%", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Acceptable NRR", value: "100 - 110%", source: "SaaS Capital" },
      { metric: "Below Par NRR", value: "< 100%", source: "General benchmark" },
      { metric: "Enterprise Gross Retention", value: "85 - 95%", source: "KeyBanc Capital Markets" },
    ],
    relatedCalculators: ["mrr-calculator", "churn-calculator", "arpu-calculator"],
    faq: [
      { question: "What is a good NRR for a SaaS company?", answer: "Above 120% is best-in-class (top quartile of public SaaS companies). 110-120% is good. 100-110% is acceptable but indicates room for improvement in expansion revenue. Below 100% means your customer base is shrinking in value." },
      { question: "How is NRR different from GRR?", answer: "NRR (Net Revenue Retention) includes expansion revenue from upsells and cross-sells. GRR (Gross Revenue Retention) only considers revenue lost to churn and contraction. NRR can exceed 100%, GRR never can." },
      { question: "How do I improve NRR?", answer: "Invest in customer success, implement usage-based pricing that grows with adoption, build expansion features, reduce churn through better onboarding, and create upsell paths from free to paid tiers. Use [ChurnZero](https://churnzero.com) for customer success automation." },
      { question: "What drives NRR above 120%?", answer: "Companies with NRR above 120% typically have land-and-expand business models, usage-based pricing, or multi-product ecosystems. Examples: Snowflake, Atlassian, Canva." },
      { question: "Does NRR matter more than new customer acquisition?", answer: "For mature SaaS companies, NRR matters more. Improving NRR from 100% to 110% has the same growth impact as a 10% increase in new customer acquisition  -  but costs less to achieve." },
      { question: "How often should I calculate NRR?", answer: "Monthly is standard. Track the trend over 6-12 months to identify whether retention dynamics are improving or degrading. [Baremetrics](https://baremetrics.com?via=saastainednumbers) automates NRR tracking." },
      { question: "What is the difference between NRR and DBNRR?", answer: "NRR and DBNRR (Dollar-Based Net Revenue Retention) are the same metric  -  both measure revenue retention including expansion. Different sources use different names for the same concept." },
      { question: "Can NRR exceed 200%?", answer: "Theoretically yes, but it's extremely rare. NRR above 150% requires aggressive land-and-expand dynamics where customers dramatically increase spend over time." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "NRR計算機（純収益維持率）",
        description: "純収益維持率（NRR）を計算して、拡張とダウングレードを含む既存顧客からの収益維持率を測定します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
