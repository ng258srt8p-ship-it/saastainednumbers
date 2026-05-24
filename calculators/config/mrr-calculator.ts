import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "mrr-calculator",
  category: "revenue",
  meta: {
    title: "MRR Calculator",
    description: "Calculate your Monthly Recurring Revenue (MRR) and Annual Recurring Revenue (ARR) instantly.",
    keywords: ["mrr", "arr", "recurring revenue", "saas metrics", "monthly revenue"],
  },
  inputs: [
    { id: "customers", label: "Number of Customers", type: "number" as const, defaultValue: 100 },
    { id: "arpu", label: "Avg Revenue Per User (ARPU)", type: "currency" as const, defaultValue: 50 },
  ],
  outputs: [
    { id: "mrr", label: "Monthly Recurring Revenue", type: "currency" as const, isPrimary: true },
    { id: "arr", label: "Annual Recurring Revenue", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Monthly Recurring Revenue (MRR) is the lifeblood of any subscription business. It measures the predictable revenue a company generates from its active subscribers each month, excluding one-time fees, credits, or non-recurring charges. MRR is the single most important metric for SaaS companies because it reveals the health, growth trajectory, and sustainability of your business model. Unlike traditional businesses where revenue fluctuates unpredictably, SaaS companies with strong MRR can forecast future earnings, plan hiring, and make strategic investments with confidence. Tracking MRR over time also helps identify trends in customer acquisition, retention, and expansion revenue. This calculator helps you measure your predictable revenue stream instantly.",
    howToUse: "Enter your total number of paying customers and your average revenue per user (ARPU). The calculator will instantly compute your MRR and ARR. Adjust the inputs to see how changes in customer count or pricing affect your recurring revenue.",
    formulaExplanation: "MRR = Number of Customers × ARPU. ARR = MRR × 12. For example, if you have 100 customers each paying $50/month: MRR = 100 × $50 = $5,000, ARR = $5,000 × 12 = $60,000.",
    benchmarks: "Early-stage SaaS startups typically range from $0-10K MRR in their first 6-12 months. Companies at $10K-100K MRR have established product-market fit. $100K-1M MRR indicates scaling operations. Top-quartile SaaS companies grow MRR at 15-20% month-over-month in early stages, stabilizing to 5-10% monthly growth at scale according to KeyBanc Capital Markets 2025 SaaS Survey. Track your own MRR automatically with [Baremetrics](https://baremetrics.com) or [ChartMogul](https://chartmogul.com).",
    benchmarkData: [
      { metric: "Seed Stage MRR", value: "$0 - $10K / month", source: "SaaS Capital 2025" },
      { metric: "Series A Stage MRR", value: "$10K - $100K / month", source: "SaaS Capital 2025" },
      { metric: "Growth Stage MRR", value: "$100K - $1M+ / month", source: "SaaS Capital 2025" },
      { metric: "Top Quartile MoM Growth (Early)", value: "15 - 20%", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Median MoM Growth (Scaling)", value: "5 - 10%", source: "KeyBanc 2025 SaaS Survey" },
    ],
    relatedCalculators: ["cac-calculator", "ltv-calculator", "arpu-calculator"],
    faq: [
      { question: "What is a good MRR for a SaaS startup?", answer: "It depends on your stage. Early-stage startups ($0-10K MRR) focus on product-market fit; $10K-100K MRR indicates traction; $100K+ MRR signals scaling. What matters more than absolute MRR is your growth rate. Aim for 15-20% monthly MRR growth in early stages." },
      { question: "Should I include free trial users in MRR?", answer: "No. MRR should only include paying customers. Free trials, paused subscriptions, and one-time fees should be excluded. Include only active, paying subscribers generating recurring revenue." },
      { question: "What is the difference between MRR and ARR?", answer: "MRR (Monthly Recurring Revenue) is your revenue on a monthly basis. ARR (Annual Recurring Revenue) is simply MRR multiplied by 12, representing your annualized run rate. ARR is commonly used by enterprise SaaS companies and investors." },
      { question: "How do I calculate MRR growth rate?", answer: "MRR growth rate = (Current Month MRR - Previous Month MRR) / Previous Month MRR × 100. Track this monthly to measure your company's growth trajectory. Tools like [Baremetrics](https://baremetrics.com) and [ChartMogul](https://chartmogul.com) automate this tracking." },
      { question: "What is net new MRR?", answer: "Net New MRR = New MRR + Expansion MRR - Churned MRR - Contraction MRR. It reflects overall MRR change from all sources including new customers, upgrades, downgrades, and cancellations." },
      { question: "Should I include usage-based billing in MRR?", answer: "Yes, but average it. For usage-based components, use the average of the last 3 months to smooth out fluctuations and get a more accurate recurring view." },
      { question: "How does churn impact MRR?", answer: "Churn directly reduces MRR. If you acquire $10K in new MRR but lose $8K to churn, your net new MRR is only $2K. Reducing churn by even 1-2% can dramatically improve net MRR growth. Track MRR and churn side-by-side with [ChartMogul](https://chartmogul.com)." },
      { question: "What is the difference between MRR and revenue?", answer: "MRR represents recurring subscription revenue only. Total revenue may include one-time fees, professional services, hardware sales, or other non-recurring items. MRR gives a clearer picture of recurring business health." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
