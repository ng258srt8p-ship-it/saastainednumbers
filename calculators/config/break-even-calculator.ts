import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "break-even-calculator",
  category: "general-business",
  meta: {
    title: "Break-Even Analysis Calculator",
    description: "Calculate how many units you need to sell to break even based on fixed costs, variable costs, and price.",
    keywords: ["break even", "break even analysis", "break even point", "contribution margin", "cost analysis", "business planning"],
  },
  inputs: [
    { id: "fixedCosts", label: "Fixed Costs per Month ($)", type: "currency" as const, defaultValue: 10000, min: 0 },
    { id: "variableCostPerUnit", label: "Variable Cost per Unit ($)", type: "currency" as const, defaultValue: 15, min: 0 },
    { id: "pricePerUnit", label: "Price per Unit ($)", type: "currency" as const, defaultValue: 39, min: 0.01 },
  ],
  outputs: [
    { id: "breakEvenUnits", label: "Break-Even Units (per month)", type: "number" as const, isPrimary: true },
    { id: "breakEvenRevenue", label: "Break-Even Revenue (per month)", type: "currency" as const, isPrimary: true },
    { id: "contributionMargin", label: "Contribution Margin per Unit", type: "currency" as const, isPrimary: false },
    { id: "contributionMarginPercent", label: "Contribution Margin (%)", type: "percentage" as const, isPrimary: false },
  ],
  content: {
    intro: "Break-even analysis tells you how many units of a product or service you need to sell to cover all your costs. It's one of the most fundamental business calculations  -  every founder, product manager, and entrepreneur should know their break-even point. The analysis separates costs into fixed costs (rent, salaries, insurance  -  costs that don't change with volume) and variable costs (materials, shipping, transaction fees  -  costs per unit). By understanding your contribution margin (price minus variable cost), you can determine the exact sales volume needed to stop losing money and start profiting.",
    howToUse: "Enter your monthly fixed costs, variable cost per unit, and selling price per unit. The calculator shows how many units you need to sell each month to break even, the revenue required, and your contribution margin. Adjust any input to see how pricing or cost changes affect your break-even point.",
    formulaExplanation: "Contribution Margin = Price per Unit  -  Variable Cost per Unit. Break-Even Units = Fixed Costs ÷ Contribution Margin. Break-Even Revenue = Break-Even Units × Price per Unit. For example, with $10K fixed costs, $15 variable cost, and $39 price: Contribution Margin = $24. Break-Even = $10,000 ÷ $24 = 417 units/month. Revenue = 417 × $39 = $16,263/month.",
    benchmarks: "Healthy SaaS companies aim for contribution margins above 70%. Physical products target 40-60% contribution margin. Service businesses often have 50-80% margins. A lower break-even point means less risk. Most startups target break-even within 12-18 months of launch. Use [QuickBooks](https://quickbooks.intuit.com) or [Wave](https://waveapps.com) for ongoing cost tracking.",
    benchmarkData: [
      { metric: "SaaS Contribution Margin", value: "70-85%", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Physical Product Margin", value: "40-60%", source: "General benchmark" },
      { metric: "Service Business Margin", value: "50-80%", source: "General benchmark" },
      { metric: "Typical Startup Break-Even Target", value: "12-18 months", source: "CB Insights" },
      { metric: "Retail Break-Even Threshold", value: "60-70% sell-through", source: "General benchmark" },
    ],
    relatedCalculators: ["roi-calculator", "fire-calculator"],
    faq: [
      { question: "What is the difference between break-even and profitability?", answer: "Break-even is the point where revenue equals costs (zero profit). Profitability begins after break-even. Break-even is a threshold; profitability is a sustained state. Most businesses aim to break even within 12-18 months and reach profitability within 24-36 months." },
      { question: "How does pricing affect break-even point?", answer: "A 10% price increase can reduce your break-even units by 20-30% while maintaining revenue. Small price changes have a leveraged effect on break-even because they drop straight to contribution margin. Test pricing regularly  -  most founders underprice their products. Process payments efficiently with [Stripe](https://stripe.com) to minimize transaction fees that impact your contribution margin." },
      { question: "What are common fixed costs for small businesses?", answer: "Common fixed costs include: rent/lease, salaries and payroll taxes, insurance, software subscriptions, equipment leases, marketing retainers, accounting/legal fees, and utilities. Fixed costs typically represent 30-50% of total costs for most businesses." },
      { question: "How do I lower my break-even point?", answer: "Reduce fixed costs (negotiate rent, outsource, work remotely), increase price (even 5-10% helps significantly), reduce variable costs (negotiate with suppliers, buy in bulk), or offer higher-margin products alongside your core offering. Each strategy compounds." },
      { question: "What is contribution margin and why does it matter?", answer: "Contribution margin = Price  -  Variable Cost. It's the amount each unit contributes to covering fixed costs and generating profit. Higher contribution margin means fewer units needed to break even. SaaS companies love this metric because their variable costs are near zero." },
      { question: "How often should I recalculate break-even?", answer: "Monthly for early-stage startups, quarterly for established businesses. Recalculate whenever you change pricing, sign a new lease, hire, or change suppliers. Break-even is a dynamic metric that shifts with every business decision." },
      { question: "What is a cash break-even vs accounting break-even?", answer: "Cash break-even only counts actual cash outflows (excludes non-cash expenses like depreciation). Accounting break-even includes all expenses. Cash break-even is more relevant for short-term survival analysis. Most startups should track both." },
      { question: "How does seasonality affect break-even analysis?", answer: "Seasonal businesses may break even in peak months but lose money in off-peak months. Calculate both monthly break-even (to manage cash flow) and annual break-even (to assess overall business health). Build a cash reserve to cover off-peak periods." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "損益分岐点分析計算機",
        description: "固定費、変動費、価格に基づいて損益分岐点に達するために必要な販売単位数を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
