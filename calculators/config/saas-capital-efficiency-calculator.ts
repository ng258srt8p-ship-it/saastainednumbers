import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "saas-capital-efficiency-calculator",
  category: "saas-deepen",
  meta: {
    title: "SaaS Capital Efficiency Calculator",
    description: "Calculate your SaaS capital efficiency ratio to understand how effectively you convert invested capital into ARR growth, a key metric for founders and investors.",
    keywords: ["capital efficiency", "saas metrics", "arr", "fundraising", "venture capital", "growth efficiency"],
  },
  inputs: [
    { id: "totalRaised", label: "Total Capital Raised", type: "currency" as const, defaultValue: 5000000, min: 0 },
    { id: "arr", label: "Current ARR", type: "currency" as const, defaultValue: 3000000, min: 0 },
    { id: "arrGrowthLastYear", label: "ARR Growth (Last 12 Months)", type: "percentage" as const, defaultValue: 30, min: 0 },
  ],
  outputs: [
    { id: "efficiencyRatio", label: "Capital Efficiency Ratio", type: "number" as const, isPrimary: true },
    { id: "category", label: "Efficiency Category", type: "text" as const, isPrimary: false },
    { id: "arrPerDollarRaised", label: "ARR per Dollar Raised", type: "number" as const, isPrimary: false },
  ],
  content: {
    intro: "Capital Efficiency is one of the most important metrics for SaaS founders and investors. It measures how effectively your company converts every dollar of invested capital into Annual Recurring Revenue (ARR). A high capital efficiency ratio means you are generating significant ARR with relatively little investment  -  the hallmark of a capital-efficient business model. This metric has become increasingly important in the post-zero-interest-rate era where investors prioritize sustainable growth over growth-at-all-costs. The capital efficiency ratio is calculated by multiplying your ARR-per-dollar-raised by your growth rate, giving a composite score that balances current scale with growth trajectory. Companies like Mailchimp and Atlassian built billion-dollar businesses with minimal outside capital by maintaining exceptional capital efficiency. This calculator helps you measure your own efficiency, benchmark against industry standards, and understand what category your company falls into  -  from Poor to Excellent. Use it to inform fundraising strategy, operational priorities, and investor communications.",
    howToUse: "Enter your total capital raised to date, current ARR, and ARR growth rate over the last 12 months. The calculator computes your capital efficiency ratio, an efficiency category, and your ARR per dollar raised  -  a simple measure of how much ARR each invested dollar generates.",
    formulaExplanation: "ARR per Dollar Raised = ARR / Total Capital Raised. Capital Efficiency Ratio = ARR per Dollar Raised × (1 + ARR Growth Rate / 100). The growth component accounts for your trajectory: a company with $3M ARR on $5M raised growing 30% has a ratio of 0.78. Ratios above 1.0 are excellent, 0.5-1.0 are good, 0.25-0.5 are average, and below 0.25 are poor.",
    benchmarks: "According to OpenView and Notion Capital, capital-efficient SaaS companies achieve a ratio above 1.0, meaning each dollar raised generates more than a dollar of ARR when adjusted for growth. Top-quartile efficient companies like Mailchimp and Atlassian historically operated above 2.0. The median SaaS company in the 2025 fundraising climate operates at 0.3-0.7. Companies with ratios below 0.25 typically struggle to raise follow-on funding without demonstrating a clear path to improved efficiency.",
    benchmarkData: [
      { metric: "Excellent Capital Efficiency", value: "> 1.0", source: "OpenView" },
      { metric: "Good Capital Efficiency", value: "0.5 - 1.0", source: "OpenView" },
      { metric: "Average Capital Efficiency", value: "0.25 - 0.5", source: "Notion Capital" },
      { metric: "Poor Capital Efficiency", value: "< 0.25", source: "Notion Capital" },
      { metric: "Median Private SaaS (2025)", value: "0.3 - 0.7", source: "KeyBanc 2025 SaaS Survey" },
    ],
    relatedCalculators: ["cash-runway-calculator", "business-valuation-calculator", "mrr-growth-rate-calculator"],
    faq: [
      { question: "What is capital efficiency and why does it matter?", answer: "Capital efficiency measures how much ARR you generate per dollar of invested capital. It matters because capital-efficient companies can grow faster with less dilution, require less frequent fundraising, and are more resilient during market downturns when capital is scarce." },
      { question: "What is a good capital efficiency ratio?", answer: "Above 1.0 is excellent and indicates a highly capital-efficient business. Between 0.5 and 1.0 is good. Between 0.25 and 0.5 is average. Below 0.25 is poor and may make it difficult to raise additional funding without showing a clear improvement plan." },
      { question: "How does the growth component affect the ratio?", answer: "The efficiency ratio combines your ARR-per-dollar-raised with your growth rate, rewarding companies that not only generate ARR efficiently but also maintain strong growth. A slower-growing company needs higher ARR-per-dollar-raised to achieve the same ratio." },
      { question: "What is ARR per dollar raised?", answer: "It is simply your current ARR divided by total capital raised. For example, $3M ARR / $5M raised = $0.60 ARR for every dollar invested. This metric alone does not account for growth trajectory, which is why the full efficiency ratio includes the growth multiplier." },
      { question: "Why is capital efficiency important for fundraising?", answer: "Investors in the current climate prioritize capital efficiency because it indicates sustainable growth. A capital-efficient company will likely need less future investment to reach profitability, reducing investor risk and improving the terms of any future funding round." },
      { question: "How do I improve capital efficiency?", answer: "Focus on reducing CAC through organic channels and product-led growth, improve retention to maximize LTV without additional spend, increase ARPU through pricing optimization and expansion revenue, and reduce operating expenses that do not directly drive growth." },
      { question: "What benchmarks exist for capital efficiency by stage?", answer: "Seed-stage companies typically have lower ratios (0.1-0.3) since they are early in their capital journey. Series A companies aim for 0.3-0.5. Series B and beyond should target 0.5+. Public companies often exceed 1.0 due to years of compounding ARR on relatively less new capital." },
      { question: "Does capital efficiency vary by SaaS business model?", answer: "Yes. Product-led growth companies with low CAC (like Slack, Zoom, Canva) typically have higher capital efficiency. Sales-led enterprise companies with high-touch acquisition have lower efficiency due to higher upfront investment. Usage-based pricing can improve efficiency by aligning revenue with consumption." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
