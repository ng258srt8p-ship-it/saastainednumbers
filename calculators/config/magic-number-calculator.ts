import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "magic-number-calculator",
  category: "growth-efficiency",
  meta: {
    title: "Magic Number Calculator",
    description: "Calculate your SaaS Magic Number to measure sales and marketing efficiency  -  new ARR divided by prior quarter sales & marketing spend.",
    keywords: ["magic number", "saas magic number", "sales efficiency", "arr", "growth"],
  },
  inputs: [
    { id: "newArr", label: "New ARR this Quarter", type: "currency" as const, defaultValue: 300000 },
    { id: "salesMarketingSpend", label: "Prior Quarter S&M Spend", type: "currency" as const, defaultValue: 200000 },
  ],
  outputs: [
    { id: "magicNumber", label: "Magic Number", type: "number" as const, isPrimary: true },
  ],
  content: {
    intro: "The SaaS Magic Number measures the efficiency of your sales and marketing spend by comparing new Annual Recurring Revenue (ARR) generated to the investment required to generate it. It answers a simple question: for every dollar spent on sales and marketing, how many dollars of new ARR do you generate? A magic number above 1.0 means your GTM engine is highly efficient. Below 0.5 suggests inefficiency. This is a forward-looking metric that investors and management teams use to evaluate go-to-market efficiency and predict future growth capacity.",
    howToUse: "Enter your new ARR added this quarter (excluding expansions from existing customers) and your total sales and marketing spend from the previous quarter. The magic number uses prior quarter spend because current quarter spend drives future quarter revenue.",
    formulaExplanation: "Magic Number = New ARR (Current Quarter) ÷ S&M Spend (Previous Quarter). Example: Q2 New ARR = $300K, Q1 S&M Spend = $200K. Magic Number = $300K ÷ $200K = 1.5. This means each dollar of S&M spend generates $1.50 of new ARR.",
    benchmarks: "According to KeyBanc Capital Markets 2025 SaaS Survey, median public SaaS magic number is 0.8. Top-quartile companies achieve 1.2+. A magic number above 1.0 indicates efficient growth. Below 0.5 suggests the GTM engine needs improvement. Early-stage companies typically have higher magic numbers as they find efficient channels.",
    benchmarkData: [
      { metric: "Excellent", value: "1.0+", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Top Quartile", value: "1.2+", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Median", value: "0.8", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Needs Improvement", value: "0.5 - 0.8", source: "Industry Standard" },
      { metric: "Concerning", value: "< 0.5", source: "Industry Standard" },
    ],
    relatedCalculators: ["cac-calculator", "quick-ratio-calculator", "burn-rate-calculator"],
    faq: [
      { question: "What is a good magic number for SaaS?", answer: "Above 1.0 is excellent  -  each S&M dollar generates $1+ of new ARR. 0.7-1.0 is good. 0.5-0.7 is average. Below 0.5 indicates the GTM engine needs significant improvement." },
      { question: "Why use prior quarter S&M spend?", answer: "Sales and marketing investments take time to convert into revenue. Using prior quarter spend accounts for the sales cycle lag  -  what you spend this quarter drives next quarter's results." },
      { question: "How is magic number different from CAC payback?", answer: "Magic Number measures top-line GTM efficiency (revenue generated per dollar spent). CAC Payback measures unit economics (months to recover acquisition cost). They're complementary metrics." },
      { question: "Should I include expansion revenue in the magic number?", answer: "No. Use only new ARR from new customers. Expansion revenue from existing customers is driven by customer success, not acquisition. Including it inflates the metric." },
      { question: "How does the magic number vary by company stage?", answer: "Early-stage companies often have higher magic numbers (1.5-3.0) as they find efficient channels. As companies scale, the magic number typically decreases due to channel saturation and increased competition." },
      { question: "How do I improve my magic number?", answer: "Increase conversion rates, improve sales productivity, optimize marketing channels, increase average deal size, or shorten sales cycles. Product-led growth can dramatically improve the magic number." },
      { question: "What costs should I include in S&M spend?", answer: "All sales and marketing expenses: salaries, commissions, advertising, content marketing, events, sales tools, and allocated overhead. Include both direct and indirect GTM costs." },
      { question: "How does pricing affect the magic number?", answer: "Higher pricing directly improves the magic number  -  the same acquisition spend generates more ARR. This is why upmarket moves often improve magic numbers despite longer sales cycles." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
