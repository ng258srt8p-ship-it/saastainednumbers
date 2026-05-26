import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "saas-quick-ratio-calculator",
  category: "saas-deepen",
  meta: {
    title: "SaaS Quick Ratio Calculator",
    description: "Calculate your SaaS quick ratio to measure sales efficiency by comparing new and expansion MRR against churned and contraction MRR.",
    keywords: ["quick ratio", "saas metrics", "sales efficiency", "mrr", "growth efficiency"],
  },
  inputs: [
    { id: "newMRR", label: "New MRR", type: "currency" as const, defaultValue: 10000, min: 0 },
    { id: "expansionMRR", label: "Expansion MRR", type: "currency" as const, defaultValue: 3000, min: 0 },
    { id: "churnedMRR", label: "Churned MRR", type: "currency" as const, defaultValue: 2000, min: 0 },
    { id: "contractionMRR", label: "Contraction MRR", type: "currency" as const, defaultValue: 1000, min: 0 },
  ],
  outputs: [
    { id: "quickRatio", label: "Quick Ratio", type: "number" as const, isPrimary: true },
    { id: "isHealthy", label: "Is Healthy", type: "text" as const, isPrimary: false },
    { id: "category", label: "Category", type: "text" as const, isPrimary: false },
  ],
  content: {
    intro: "The SaaS Quick Ratio measures how efficiently your company is growing by comparing the revenue you add through new customers and expansion against the revenue you lose through churn and contraction. It was popularized by Jason Lemkin of SaaStr and is considered one of the most important SaaS health metrics alongside the Rule of 40. The quick ratio answers a simple but powerful question: for every dollar of revenue you lose, how many dollars do you add? A ratio above 4 is considered excellent and indicates a highly efficient growth engine. A ratio below 1 means your company is shrinking  -  you are losing more revenue than you are adding each month. Unlike raw growth rate, the quick ratio accounts for both the quality and the efficiency of your growth. Two companies growing at the same rate can have very different quick ratios, revealing which one is growing more sustainably. This metric is particularly important for board reporting, investor updates, and benchmarking against peer companies.",
    howToUse: "Enter your new MRR from new customers, expansion MRR from upsells and cross-sells, churned MRR from lost customers, and contraction MRR from downgrades. The calculator computes your quick ratio, determines if it is healthy (≥ 4), and provides a category from Critical to Excellent.",
    formulaExplanation: "Quick Ratio = (New MRR + Expansion MRR) / (Churned MRR + Contraction MRR). A ratio of 4 means you add $4 for every $1 lost. Ratios above 4 are excellent, 2-4 are good, 1-2 need attention, and below 1 is critical (company is shrinking). Infinite ratio occurs when churn and contraction are zero, representing perfect retention.",
    benchmarks: "Best-in-class public SaaS companies maintain quick ratios above 4. According to KeyBanc 2025 SaaS Survey and SaaStr data, the median quick ratio for high-growth private SaaS is 2.5-3.5. Top-quartile companies exceed 4.0. Companies with quick ratios below 2.0 typically have churn problems that impede growth. Late-stage companies often have slightly lower quick ratios as they optimize for profitability over raw growth, but should still maintain at least 2.0.",
    benchmarkData: [
      { metric: "Excellent (Best-in-Class)", value: "> 4.0", source: "SaaStr / KeyBanc 2025" },
      { metric: "Good", value: "2.0 - 4.0", source: "SaaStr" },
      { metric: "Needs Attention", value: "1.0 - 2.0", source: "SaaStr" },
      { metric: "Critical (Shrinking)", value: "< 1.0", source: "SaaStr" },
      { metric: "Median Private SaaS", value: "2.5 - 3.5", source: "KeyBanc 2025 SaaS Survey" },
    ],
    relatedCalculators: ["quick-ratio-calculator", "churn-calculator", "mrr-growth-rate-calculator"],
    faq: [
      { question: "What is a good quick ratio for SaaS?", answer: "Above 4.0 is excellent and indicates highly efficient growth. Between 2.0 and 4.0 is good. Below 1.0 means your company is shrinking  -  you lose more revenue each month than you add. Most high-growth private SaaS companies have quick ratios between 2.5 and 3.5." },
      { question: "How is quick ratio different from churn rate?", answer: "Churn rate only measures customer or revenue loss. Quick ratio measures the balance between revenue gained (new + expansion) and revenue lost (churned + contraction). Two companies with the same churn rate can have very different quick ratios depending on their acquisition and expansion velocity." },
      { question: "What causes a low quick ratio?", answer: "High churn rates, excessive contraction from downgrades, slowing new customer acquisition, or insufficient expansion revenue from existing customers. Diagnose which component is weak by comparing new MRR growth rate to churn rate independently." },
      { question: "How do I improve quick ratio?", answer: "Reduce churn through better onboarding and customer success, increase expansion revenue through upsells and cross-sells, accelerate new customer acquisition, and minimize contraction by right-sizing plans and reducing downgrade incentives. Track quick ratio automatically with [Baremetrics](https://baremetrics.com?via=saastainednumbers)." },
      { question: "What is considered an excellent quick ratio for public SaaS companies?", answer: "Public SaaS companies like Zoom, Atlassian, and Shopify maintain quick ratios well above 4.0. The best companies achieve 5.0-10.0+ by combining low churn with strong expansion revenue through land-and-expand strategies." },
      { question: "Does quick ratio apply to all SaaS business models?", answer: "Yes, but the interpretation varies. Usage-based pricing models often have higher expansion MRR, inflating the quick ratio. Consumption-based models may show more volatile quick ratios. Enterprise SaaS with long contracts often has lower and more stable quick ratios." },
      { question: "How often should I calculate quick ratio?", answer: "Monthly is standard for active SaaS companies. Track the 3-month and 6-month rolling averages to smooth out seasonal variations. Report quick ratio alongside MRR growth rate and churn rate in monthly board and investor updates." },
      { question: "What is the relationship between quick ratio and growth rate?", answer: "A high quick ratio enables sustainable high growth. If your quick ratio is low, growth requires increasingly more new customer acquisition to compensate for churn losses, which becomes unsustainable. The Rule of 40 and quick ratio together give a complete growth efficiency picture." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
