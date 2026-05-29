import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "revenue-per-employee-calculator",
  category: "growth-efficiency",
  meta: {
    title: "Revenue Per Employee Calculator",
    description: "Calculate your revenue per employee to measure workforce efficiency and compare against industry benchmarks.",
    keywords: ["revenue per employee", "workforce efficiency", "saas metrics", "productivity", "benchmarking"],
  },
  inputs: [
    { id: "totalRevenue", label: "Annual Revenue", type: "currency" as const, defaultValue: 5000000 },
    { id: "headcount", label: "Total Headcount", type: "number" as const, defaultValue: 50 },
  ],
  outputs: [
    { id: "revenuePerEmployee", label: "Revenue Per Employee", type: "currency" as const, isPrimary: true },
  ],
  content: {
    intro: "Revenue Per Employee is a critical efficiency metric that measures how much revenue your company generates per team member. It reveals how effectively you're leveraging your workforce and is widely used to benchmark against industry peers. High revenue per employee suggests efficient operations, strong product-market fit, and scalable systems. Low revenue per employee may indicate over-hiring, process inefficiencies, or a services-heavy business model. This simple but powerful metric is one of the first things investors look at when evaluating operational efficiency.",
    howToUse: "Enter your annual revenue and total headcount (full-time equivalent employees). The calculator will compute your revenue per employee. Compare against industry benchmarks to assess your efficiency.",
    formulaExplanation: "Revenue Per Employee = Annual Revenue ÷ Total Headcount. Example: Annual Revenue = $5M, Headcount = 50. Revenue Per Employee = $5,000,000 ÷ 50 = $100,000 per employee.",
    benchmarks: "According to KeyBanc Capital Markets 2025 SaaS Survey, median public SaaS revenue per employee is $350K. Top-quartile companies achieve $500K+. Early-stage SaaS companies typically generate $50-150K per employee. Product-led growth companies often achieve higher revenue per employee ($400-600K) than sales-led companies ($200-350K). Professional services-heavy companies have lower revenue per employee ($100-200K).",
    benchmarkData: [
      { metric: "Best-in-Class SaaS", value: "$500K+", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Median Public SaaS", value: "$350K", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Product-Led Growth", value: "$400K - $600K", source: "OpenView Partners" },
      { metric: "Sales-Led SaaS", value: "$200K - $350K", source: "OpenView Partners" },
      { metric: "Early-Stage SaaS", value: "$50K - $150K", source: "SaaS Capital" },
    ],
    relatedCalculators: ["mrr-calculator", "gross-margin-calculator", "operating-margin-calculator"],
    faq: [
      { question: "What is a good revenue per employee for SaaS?", answer: "Median public SaaS is $350K/year. Above $500K is best-in-class. Early-stage companies may be $50-150K. Compare against companies at similar stage and business model." },
      { question: "How do I improve revenue per employee?", answer: "Increase revenue without proportional headcount growth  -  improve pricing, automate operations, use product-led growth, eliminate low-value activities, and invest in scalable systems." },
      { question: "Does revenue per employee include contractors?", answer: "Include full-time equivalent (FTE) headcount for both employees and long-term contractors. Exclude short-term contractors and agencies for accurate comparison." },
      { question: "How does business model affect revenue per employee?", answer: "PLG companies (self-serve) have higher revenue per employee because they need fewer salespeople per dollar of revenue. Enterprise sales companies need more people per dollar." },
      { question: "Is this metric used for valuation?", answer: "Yes. Public SaaS companies with higher revenue per employee often trade at higher multiples. It signals operational efficiency and scalability to investors." },
      { question: "How does revenue per employee change as companies scale?", answer: "It typically increases with scale as fixed costs are spread over more revenue. Seed-stage: $50-150K. Series A: $150-300K. Public: $300-500K+." },
      { question: "Should I use ARR or GAAP revenue?", answer: "Use GAAP revenue for consistency with benchmarks. Some companies use ARR for forward-looking analysis. Be consistent when tracking trends over time." },
      { question: "What is a low revenue per employee warning sign?", answer: "Revenue per employee below $100K for a mature SaaS company suggests operational inefficiency, over-hiring, or a business model that doesn't scale (e.g., heavy services component)." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "従業員一人あたりの収益計算機",
        description: "従業員一人あたりの収益を計算し、業界ベンチマークと比較します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
