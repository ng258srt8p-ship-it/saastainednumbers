import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "expansion-revenue-rate-calculator",
  category: "revenue",
  meta: {
    title: "Expansion Revenue Rate Calculator",
    description: "Calculate the percentage of revenue growth from existing customers through upsells, cross-sells, and upgrades.",
    keywords: ["expansion revenue", "net retention", "upsell", "cross-sell", "saas growth"],
  },
  benchmarkMetric: "nrr",
  inputs: [
    { id: "beginningMrr", label: "Beginning MRR (start of period)", type: "currency" as const, defaultValue: 100000 },
    { id: "expansionMrr", label: "Expansion MRR (upsells + cross-sells)", type: "currency" as const, defaultValue: 15000 },
  ],
  outputs: [
    { id: "expansionRevenueRate", label: "Expansion Revenue Rate", type: "percentage" as const, isPrimary: true },
  ],
  content: {
    intro: "Expansion Revenue Rate measures the percentage of revenue growth driven by existing customers through upsells, cross-sells, and plan upgrades. It is the most important sign of product-market fit because it shows that customers find increasing value in your product over time. High expansion rates compound growth  -  companies with 120%+ NRR grow without acquiring a single new customer. This metric is particularly important for investors evaluating SaaS companies because expansion revenue is higher-margin and more predictable than new business. This calculator helps you track how effectively you're growing your existing customer base.",
    howToUse: "Enter your beginning MRR at the start of the period and the expansion MRR generated during that period from existing customers. The calculator will show your expansion revenue rate as a percentage. Track this monthly alongside churn rate to understand net revenue retention.",
    formulaExplanation: "Expansion Revenue Rate = (Expansion MRR ÷ Beginning MRR) × 100. For example: $15K expansion MRR on $100K beginning MRR = 15% expansion revenue rate. This means existing customers grew their spending by 15% during the period through upgrades and cross-sells.",
    benchmarks: "According to KeyBanc 2025 SaaS Survey, median expansion revenue rate for public SaaS companies is 12-15% annually. Top-quartile companies achieve 20-30%+ expansion. Usage-based pricing models typically see higher expansion rates (20-40%) than flat-fee subscriptions (5-15%).",
    benchmarkData: [
      { metric: "Top Quartile", value: "20-30%+", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Median", value: "12-15%", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Usage-Based Pricing", value: "20-40%", source: "General benchmark" },
      { metric: "Flat-Fee Subscription", value: "5-15%", source: "General benchmark" },
    ],
    relatedCalculators: ["nrr-calculator", "mrr-calculator", "mrr-growth-rate-calculator"],
    faq: [
      { question: "What is a good expansion revenue rate?", answer: "Above 20% annually is excellent. 12-15% is median. Below 5% suggests limited upsell opportunities or product limitations." },
      { question: "How is expansion revenue rate different from NRR?", answer: "NRR includes both expansion revenue and churn/contraction. Expansion revenue rate only measures the positive side  -  growth from existing customers." },
      { question: "What drives high expansion revenue?", answer: "Usage-based pricing (customers spend more as they grow), multi-product strategy (cross-sell adjacent products), and tiered plans with natural upgrade paths." },
      { question: "How do I increase expansion revenue?", answer: "Build usage-based pricing components, create clear upgrade paths between tiers, develop adjacent product features, implement a customer success team focused on growth, and identify power users for upsell. Monitor expansion revenue trends with [Baremetrics](https://baremetrics.com?via=saastainednumbers)." },
      { question: "How often should I track expansion revenue rate?", answer: "Monthly. Track alongside logo expansion rate (percentage of customers who expanded) for a complete picture of expansion effectiveness." },
      { question: "Does expansion revenue rate vary by customer segment?", answer: "Yes. Enterprise customers typically have higher expansion potential (20-40% annually) than SMB (5-15%). Segment by customer size for accurate benchmarking." },
      { question: "What is the relationship between expansion and churn?", answer: "Even modest expansion can offset churn. A 10% expansion rate can offset 10% revenue churn, resulting in 100% NRR. High expansion is the strongest predictor of long-term SaaS success." },
      { question: "How does product-led growth affect expansion?", answer: "PLG companies with usage-based pricing naturally drive expansion as customers grow. This creates a powerful flywheel: more usage → more value → more spend → more product investment." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "拡大収益率計算機",
        description: "アップセル、クロスセル、アップグレードによる既存顧客からの収益成長率を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
