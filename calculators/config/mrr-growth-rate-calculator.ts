import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "mrr-growth-rate-calculator",
  category: "revenue",
  meta: {
    title: "MRR Growth Rate Calculator",
    description: "Calculate your month-over-month MRR growth rate to measure your SaaS company's growth trajectory.",
    keywords: ["mrr growth rate", "monthly growth", "saas growth", "revenue growth", "saas metrics"],
  },
  inputs: [
    { id: "previousMrr", label: "Previous Month MRR", type: "currency" as const, defaultValue: 80000 },
    { id: "currentMrr", label: "Current Month MRR", type: "currency" as const, defaultValue: 100000 },
  ],
  outputs: [
    { id: "growthRate", label: "Month-over-Month MRR Growth", type: "percentage" as const, isPrimary: true },
    { id: "mrrChange", label: "Net MRR Change", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "MRR Growth Rate is the most important leading indicator for SaaS companies. It measures the month-over-month change in your Monthly Recurring Revenue, capturing both the addition of new customers and the impact of churn, expansion, and contraction. MRR growth rate is the single best predictor of future company value — investors use it alongside the Rule of 40 to evaluate company health. Tracking MRR growth rate helps you understand whether your business is accelerating, decelerating, or stagnating, and it serves as the foundation for financial forecasting.",
    howToUse: "Enter your previous month's MRR and current month's MRR. The calculator will compute your month-over-month growth rate and net change. Track this monthly to identify growth trends and evaluate the impact of growth initiatives.",
    formulaExplanation: "MRR Growth Rate = (Current MRR - Previous MRR) ÷ Previous MRR × 100. MRR Change = Current MRR - Previous MRR. Example: Previous = $80K, Current = $100K. Growth = ($100K - $80K) ÷ $80K × 100 = 25%. Change = +$20K",
    benchmarks: "According to KeyBanc Capital Markets 2025 SaaS Survey and Pacific Crest, top-quartile SaaS companies grow MRR 20-25% month-over-month in early stages. Median growth for Seed-stage companies is 15-20% MoM. At Series A, median growth drops to 10-15% MoM. At growth stage ($5M+ ARR), 5-10% MoM is strong. Companies growing below 5% MoM at scale risk stagnation.",
    benchmarkData: [
      { metric: "Top Quartile Early Stage", value: "20 - 25% / month", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Median Seed Stage", value: "15 - 20% / month", source: "Pacific Crest" },
      { metric: "Median Series A", value: "10 - 15% / month", source: "Pacific Crest" },
      { metric: "Growth Stage ($5M+ ARR)", value: "5 - 10% / month", source: "SaaS Capital" },
      { metric: "Signs of Stagnation", value: "< 5% / month", source: "Industry Standard" },
    ],
    relatedCalculators: ["mrr-calculator", "nrr-calculator", "quick-ratio-calculator"],
    faq: [
      { question: "What is a good MRR growth rate?", answer: "Depends on stage. Early-stage: 15-25% MoM is excellent. Growth stage ($5M+ ARR): 5-10% MoM is strong. Below 5% MoM at any stage warrants investigation." },
      { question: "How is MRR growth rate different from revenue growth rate?", answer: "MRR growth tracks recurring revenue only, excluding one-time fees. YoY revenue growth is a lagging indicator; MoM MRR growth is a leading indicator." },
      { question: "How do I calculate annual growth from monthly growth?", answer: "Annual Growth = (1 + Monthly Growth Rate)^12 - 1. Monthly 10% = Annual ~214%. Monthly 5% = Annual ~80%. Monthly 15% = Annual ~435%." },
      { question: "What causes declining MRR growth rate?", answer: "Market saturation, increased competition, product maturity, sales team inefficiency, or churn acceleration. Analyze new MRR vs churn MRR to identify the root cause." },
      { question: "Should I include one-time fees in MRR?", answer: "No. MRR should only include recurring subscription revenue. One-time fees, setup fees, and professional services should be excluded from MRR calculations." },
      { question: "How does pricing affect MRR growth rate?", answer: "Higher prices increase MRR per customer, improving growth rate. But higher prices may reduce new customer acquisition. Find the optimal price point that maximizes net MRR growth." },
      { question: "How often should I track MRR growth rate?", answer: "Monthly is standard. Calculate on the same day each month for consistency. Track the 3-month and 6-month moving averages to identify trends." },
      { question: "What is a healthy MRR growth rate for a mature company?", answer: "For companies with $10M+ ARR, 5-10% MoM (60-120% annually) is excellent. 3-5% MoM (36-60% annually) is good. Below 2-3% MoM suggests the company is approaching maturity." },
    ],
  },
  premium: true,
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
