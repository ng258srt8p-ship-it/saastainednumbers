import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "net-cash-flow-calculator",
  category: "unit-economics",
  meta: {
    title: "Net Cash Flow Calculator",
    description: "Calculate your net cash flow, burn rate, and determine whether your business is cash flow positive or negative.",
    keywords: ["net cash flow", "burn rate", "cash flow", "operating cash", "saas finance"],
  },
  benchmarkMetric: "burn-multiple",
  inputs: [
    { id: "cashIn", label: "Cash In (revenue + collections)", type: "currency" as const, defaultValue: 80000 },
    { id: "cashOut", label: "Cash Out (expenses + payables)", type: "currency" as const, defaultValue: 95000 },
  ],
  outputs: [
    { id: "netCashFlow", label: "Net Cash Flow", type: "currency" as const, isPrimary: true },
    { id: "burnRate", label: "Burn Rate (if negative)", type: "currency" as const, isPrimary: false },
    { id: "isPositive", label: "Cash Flow Positive", type: "text" as const, isPrimary: false },
  ],
  content: {
    intro: "Net Cash Flow is the difference between cash entering and leaving your business over a period. Unlike revenue (which may include deferred or uncollected amounts), cash flow measures actual liquidity  -  the real money available to run your business. Positive cash flow means you're generating more cash than you consume; negative cash flow means you're burning through reserves. For SaaS businesses, net cash flow is particularly important because upfront acquisition costs are paid in cash while revenue is recognized over time. This calculator helps you understand your true cash position and whether your business model is sustainable.",
    howToUse: "Enter your total cash inflows (customer payments, collections, interest) and total cash outflows (operating expenses, payroll, vendor payments) for the period. The calculator will show your net cash flow and burn rate. A positive net cash flow means the business generates excess cash.",
    formulaExplanation: "Net Cash Flow = Cash In - Cash Out. Burn Rate = Cash Out - Cash In (if cash flow is negative). For example: $80K in minus $95K out = -$15K net cash flow. Burn rate = $15K/month. Cash flow positive = No (0).",
    benchmarks: "According to SaaS industry benchmarks, high-growth SaaS companies typically operate at negative cash flow during growth phases, with median net cash flow margins of -10% to -30%. Profitable mature SaaS companies target 20-40% FCF margins. Companies with net cash flow margins above 30% are considered highly efficient.",
    benchmarkData: [
      { metric: "High-Growth SaaS", value: "-10% to -30%", source: "SaaS Capital / Industry Benchmarks" },
      { metric: "Profitable Mature SaaS", value: "20-40% FCF Margin", source: "SaaS Capital / Industry Benchmarks" },
      { metric: "Highly Efficient", value: "30%+ FCF Margin", source: "SaaS Capital / Industry Benchmarks" },
    ],
    relatedCalculators: ["burn-rate-calculator", "operating-margin-calculator", "revenue-per-employee-calculator"],
    faq: [
      { question: "What is the difference between net cash flow and net income?", answer: "Net income includes non-cash items like depreciation and deferred revenue. Net cash flow only tracks actual cash movements. A company can be profitable on paper but cash flow negative." },
      { question: "How long can a company operate with negative cash flow?", answer: "Depends on cash reserves. Divide cash reserves by monthly burn rate to find runway. Most investors expect 18-24 months of runway. Negative cash flow is sustainable during growth phases with adequate funding." },
      { question: "What causes negative net cash flow in SaaS?", answer: "High upfront CAC paid in cash before revenue is recognized, large R&D investments, sales team expansion, and infrastructure costs that scale ahead of revenue." },
      { question: "How do I improve net cash flow?", answer: "Reduce CAC efficiency, move to annual prepaid contracts, cut non-essential spending, improve gross margins, raise prices, and optimize payment terms with vendors." },
      { question: "Should I track operating cash flow or free cash flow?", answer: "Both. Operating cash flow excludes capital expenditures. Free cash flow (FCF) includes CapEx and is the more conservative measure of cash generation." },
      { question: "How does subscription billing affect cash flow?", answer: "Annual billing improves cash flow by collecting 12 months upfront. Monthly billing spreads cash collection evenly. Moving customers to annual plans is the fastest way to improve cash flow." },
      { question: "What is a healthy net cash flow margin?", answer: "Above 20% FCF margin is excellent for mature SaaS. Growth-stage companies may accept -20% to -30% during investment phases. Track the trend  -  declining cash flow requires attention." },
      { question: "How does cash flow differ from burn rate?", answer: "Net cash flow is the actual difference (positive means generating cash). Burn rate is specifically how fast you consume cash when cash flow is negative. Burn rate = absolute value of negative cash flow." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "純キャッシュフロー計算機",
        description: "純キャッシュフロー、バーンレートを計算し、キャッシュフローがプラスかマイナスかを判断します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
