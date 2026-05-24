import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "ltv-calculator",
  category: "revenue",
  meta: {
    title: "LTV Calculator",
    description: "Calculate Customer Lifetime Value (LTV) and LTV:CAC ratio for your SaaS business.",
    keywords: ["ltv", "customer lifetime value", "ltv cac ratio", "saas metrics", "unit economics"],
  },
  inputs: [
    { id: "arpu", label: "Avg Revenue Per User (ARPU)", type: "currency" as const, defaultValue: 50 },
    { id: "grossMargin", label: "Gross Margin (%)", type: "percentage" as const, defaultValue: 80 },
    { id: "churnRate", label: "Monthly Churn Rate (%)", type: "percentage" as const, defaultValue: 5 },
  ],
  outputs: [
    { id: "ltv", label: "Customer Lifetime Value", type: "currency" as const, isPrimary: true },
    { id: "ltvCacRatio", label: "LTV:CAC Ratio", type: "ratio" as const, isPrimary: false },
  ],
  content: {
    intro: "Customer Lifetime Value (LTV) predicts the total revenue a business can expect from a single customer account throughout their entire relationship. LTV is a cornerstone metric for SaaS companies because it directly informs how much you can afford to spend on acquisition, which customer segments are most valuable, and where to focus retention efforts. Understanding LTV helps you make strategic decisions about pricing, product development, customer success, and sales compensation. When combined with CAC, it gives you the complete picture of your unit economics and business model sustainability.",
    howToUse: "Enter your ARPU, gross margin percentage, and monthly churn rate to calculate LTV. The calculator automatically computes the LTV:CAC ratio when you provide CAC data. Adjust churn rate to see how retention improvements dramatically increase lifetime value.",
    formulaExplanation: "LTV = ARPU × Gross Margin % ÷ Monthly Churn Rate. For example: ARPU of $50/month with 80% gross margin and 5% monthly churn: Net profit per month = $50 × 0.80 = $40. Average customer lifetime = 1/0.05 = 20 months. LTV = $40 × 20 = $800.",
    benchmarks: "SaaS LTV varies widely by segment: SMB SaaS averages $500-5,000 LTV, mid-market averages $5,000-50,000, and enterprise averages $50,000-500,000+. A healthy LTV:CAC ratio is 3:1 or higher according to SaaS capital benchmarks. Companies with LTV:CAC below 1:1 are spending more to acquire customers than they'll ever earn back. Top-quartile public SaaS companies maintain LTV:CAC ratios of 5:1 or higher.",
    benchmarkData: [
      { metric: "SMB SaaS LTV", value: "$500 - $5,000", source: "OpenView 2025" },
      { metric: "Mid-Market SaaS LTV", value: "$5,000 - $50,000", source: "OpenView 2025" },
      { metric: "Enterprise SaaS LTV", value: "$50,000 - $500,000+", source: "OpenView 2025" },
      { metric: "Healthy LTV:CAC Ratio", value: "3:1 or higher", source: "SaaS Capital" },
      { metric: "Top-Quartile LTV:CAC", value: "5:1 or higher", source: "KeyBanc 2025" },
    ],
    relatedCalculators: ["mrr-calculator", "cac-calculator", "churn-calculator"],
    faq: [
      { question: "What is a good LTV:CAC ratio?", answer: "A ratio of 3:1 or higher is considered healthy. Below 1:1 means you're spending more to acquire than you'll earn back. Top SaaS companies aim for 5:1 or higher." },
      { question: "Can LTV change over time?", answer: "Yes. LTV changes as your ARPU, margins, and churn rate evolve. Track it monthly to spot trends. Improving retention or increasing pricing both increase LTV. Track LTV trends automatically with [Baremetrics](https://baremetrics.com) or [ChartMogul](https://chartmogul.com)." },
      { question: "How does churn rate affect LTV?", answer: "Dramatically. Reducing monthly churn from 5% to 3% increases average customer lifetime from 20 to 33 months, boosting LTV by 65%. Small retention improvements produce outsized LTV gains. Monitor churn and LTV together with [ChurnZero](https://churnzero.com)." },
      { question: "What is the difference between LTV and LTV:CAC?", answer: "LTV is the absolute dollar value of a customer. LTV:CAC is the ratio comparing that value to what you spent acquiring them. LTV alone doesn't tell you if you're spending efficiently." },
      { question: "Should I use gross margin in LTV calculation?", answer: "Yes. Using gross margin (revenue minus cost of goods sold) gives you the true profit per customer. Revenue-only LTV overstates value because it ignores service delivery costs." },
      { question: "How do expansion revenue and upsells affect LTV?", answer: "Expansion revenue increases LTV significantly. Companies with strong expansion revenue (existing customers buying more) often have 2-3x higher LTV than those relying solely on initial sale revenue." },
      { question: "What factors reduce LTV?", answer: "Higher churn rate, lower gross margin, price reductions, and increased support costs all reduce LTV. Monitor these factors monthly to identify negative trends early." },
      { question: "How do I segment LTV by customer type?", answer: "Calculate LTV separately for each customer segment (by plan tier, acquisition channel, company size). Segment-level LTV reveals which customers are most valuable and where to focus retention." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
