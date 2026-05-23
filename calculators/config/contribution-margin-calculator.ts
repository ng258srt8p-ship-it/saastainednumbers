import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "contribution-margin-calculator",
  category: "unit-economics",
  meta: {
    title: "Contribution Margin Calculator",
    description: "Calculate your contribution margin — revenue minus variable costs — to understand per-unit profitability.",
    keywords: ["contribution margin", "variable costs", "profitability", "unit economics", "saas metrics"],
  },
  inputs: [
    { id: "revenue", label: "Total Revenue", type: "currency" as const, defaultValue: 100000 },
    { id: "variableCosts", label: "Total Variable Costs", type: "currency" as const, defaultValue: 30000 },
  ],
  outputs: [
    { id: "contributionMargin", label: "Contribution Margin ($)", type: "currency" as const, isPrimary: false },
    { id: "contributionMarginPct", label: "Contribution Margin (%)", type: "percentage" as const, isPrimary: true },
  ],
  content: {
    intro: "Contribution margin measures the profitability of each unit of revenue after accounting for variable costs. Unlike gross margin (which only subtracts COGS), contribution margin subtracts all variable costs including sales commissions, variable support costs, and payment processing fees. This makes it a more accurate measure of per-unit profitability. Contribution margin is essential for pricing decisions, channel evaluation, and understanding how much revenue is available to cover fixed costs and generate profit. This calculator computes both dollar and percentage contribution margin.",
    howToUse: "Enter your total revenue and total variable costs for any period. Variable costs should include all costs that change proportionally with revenue. The calculator will compute contribution margin in dollars and percentage.",
    formulaExplanation: "Contribution Margin = Revenue - Variable Costs. Contribution Margin % = (Revenue - Variable Costs) ÷ Revenue × 100. Example: Revenue = $100K, Variable Costs = $30K. Contribution Margin = $70K. Contribution Margin % = 70%",
    benchmarks: "Healthy SaaS companies maintain contribution margins of 65-80%. Below 50% suggests variable costs are too high relative to revenue. Above 80% is excellent and indicates a scalable business model. According to SaaS Capital, median SaaS contribution margin is approximately 70%. Companies with low contribution margins struggle to scale profitably.",
    benchmarkData: [
      { metric: "Excellent Contribution Margin", value: "80%+", source: "SaaS Capital" },
      { metric: "Good Contribution Margin", value: "65 - 80%", source: "Industry Standard" },
      { metric: "Median SaaS", value: "~70%", source: "SaaS Capital" },
      { metric: "Needs Improvement", value: "50 - 65%", source: "Industry Standard" },
      { metric: "Concerning", value: "< 50%", source: "Industry Standard" },
    ],
    relatedCalculators: ["gross-margin-calculator", "operating-margin-calculator", "mrr-calculator"],
    faq: [
      { question: "What is the difference between contribution margin and gross margin?", answer: "Gross margin only subtracts COGS (hosting, support). Contribution margin subtracts ALL variable costs including sales commissions, variable marketing costs, and payment processing. Contribution margin is more comprehensive." },
      { question: "What costs should be included as variable costs?", answer: "Sales commissions, payment processing fees, variable hosting costs, customer support per-ticket costs, contractor costs, and any other costs that scale directly with revenue." },
      { question: "How is contribution margin used for pricing?", answer: "Contribution margin helps determine minimum pricing. If each sale has 40% contribution margin, you know 60% of revenue goes to variable costs. Set pricing to ensure positive contribution after all variable costs." },
      { question: "How does contribution margin affect scalability?", answer: "Higher contribution margins mean more revenue is available for fixed costs and profit. A 80% contribution margin company can scale profitably much faster than a 50% contribution margin company." },
      { question: "Should I calculate contribution margin by product line?", answer: "Yes. Different products and services have dramatically different contribution margins. Product-level analysis reveals which offerings are truly profitable." },
      { question: "Can contribution margin be negative?", answer: "Yes, if variable costs exceed revenue. This means each additional sale loses money. Products with negative contribution margin destroy value and need restructuring or price increases." },
      { question: "How does contribution margin relate to break-even?", answer: "Break-even point = Fixed Costs ÷ Contribution Margin %. Higher contribution margin means fewer sales needed to break even. This is critical for financial planning." },
      { question: "How often should I track contribution margin?", answer: "Monthly for operational decisions. Quarterly for strategic planning. Track trends: declining contribution margins signal rising variable costs or pricing pressure." },
    ],
  },
  premium: true,
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
