import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "payback-period-calculator",
  category: "unit-economics",
  meta: {
    title: "CAC Payback Period Calculator",
    description: "Calculate how many months it takes to recover your customer acquisition cost through gross margin contribution.",
    keywords: ["payback period", "cac", "ltv", "unit economics", "saas metrics"],
  },
  inputs: [
    { id: "cac", label: "Customer Acquisition Cost (CAC)", type: "currency" as const, defaultValue: 300 },
    { id: "arpu", label: "Avg Revenue Per User (ARPU)", type: "currency" as const, defaultValue: 50 },
    { id: "grossMargin", label: "Gross Margin (%)", type: "percentage" as const, defaultValue: 80 },
  ],
  outputs: [
    { id: "paybackPeriodMonths", label: "CAC Payback Period", type: "number" as const, isPrimary: true, suffix: " months" },
    { id: "yearlyProfit", label: "Yearly Profit Per Customer", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "CAC Payback Period measures how many months it takes to earn back the cost of acquiring a customer through their gross margin contribution. It's a critical unit economics metric that reveals the efficiency of your go-to-market engine. A shorter payback period means faster ROI on acquisition spend and less capital required to fund growth. SaaS investors typically look for payback periods under 12 months for healthy businesses. This metric directly influences how much you can invest in growth and how quickly you can scale. This calculator computes your payback period and yearly profit per customer.",
    howToUse: "Enter your customer acquisition cost (CAC), average revenue per user (ARPU), and gross margin percentage. The calculator will show how many months to recover CAC and the yearly profit each customer generates after payback.",
    formulaExplanation: "Monthly Contribution = ARPU × (Gross Margin ÷ 100). Payback Period = CAC ÷ Monthly Contribution. Yearly Profit = (Monthly Contribution × 12) - CAC. For example: CAC = $300, ARPU = $50, Gross Margin = 80%. Monthly Contribution = $40. Payback = $300 ÷ $40 = 7.5 months. Yearly Profit = $40 × 12 - $300 = $180",
    benchmarks: "Best-in-class SaaS companies achieve CAC payback under 6 months. Good is 6-12 months. Acceptable is 12-18 months. Above 18 months signals poor unit economics. Enterprise SaaS companies typically have longer payback periods (12-24 months) but higher LTV. According to Pacific Crest SaaS Survey, median CAC payback is 12-18 months across all SaaS companies.",
    benchmarkData: [
      { metric: "Best-in-Class Payback", value: "< 6 months", source: "OpenView Partners" },
      { metric: "Good Payback", value: "6 - 12 months", source: "SaaS Capital" },
      { metric: "Acceptable Payback", value: "12 - 18 months", source: "Pacific Crest SaaS Survey" },
      { metric: "Needs Improvement", value: "18 - 24 months", source: "SaaS Capital" },
      { metric: "Enterprise SaaS Median", value: "12 - 24 months", source: "Pacific Crest SaaS Survey" },
    ],
    relatedCalculators: ["cac-calculator", "ltv-calculator", "mrr-calculator"],
    faq: [
      { question: "What is a good CAC payback period?", answer: "Under 12 months is good for most SaaS companies. Under 6 months is best-in-class. Enterprise SaaS can go to 18-24 months due to higher contract values and longer sales cycles." },
      { question: "How is CAC payback period different from simple payback?", answer: "CAC payback uses gross margin contribution, not raw revenue. This accounts for the cost of delivering the product. Simple payback using revenue alone overstates recovery speed." },
      { question: "Can payback period be negative?", answer: "No. If your gross margin or ARPU is too low relative to CAC, payback extends indefinitely. This indicates poor unit economics that need correction before scaling." },
      { question: "How does pricing affect payback period?", answer: "Higher pricing directly improves payback by increasing monthly contribution. A 20% price increase can reduce payback by 15-25% assuming same conversion rates." },
      { question: "Should I calculate payback by customer segment?", answer: "Yes. Different segments (SMB vs Enterprise, self-serve vs sales-assisted) have dramatically different CAC and ARPU. Segment-level payback reveals which customer types are most efficient." },
      { question: "How does churn affect payback?", answer: "Payback assumes the customer stays at least that long. If median customer lifetime is shorter than payback period, you never recover CAC — a critical business model problem." },
      { question: "What is the relationship between payback and growth?", answer: "Shorter payback allows faster reinvestment. If payback is 6 months, you recycle each dollar of acquisition spend twice per year. At 12 months payback, you recycle once per year." },
      { question: "How do I improve my payback period?", answer: "Increase ARPU through pricing or upsells, reduce CAC through channel optimization, improve gross margin, or target higher-value customer segments." },
    ],
  },
  premium: true,
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
