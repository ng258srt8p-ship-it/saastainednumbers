import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "cash-runway-calculator",
  category: "general-business",
  meta: {
    title: "Cash Runway Calculator",
    description: "Calculate how many months your startup can operate before running out of cash based on burn rate and revenue growth.",
    keywords: ["cash runway", "burn rate", "startup runway", "runway calculation", "cash run out", "startup cash", "financial runway"],
  },
  inputs: [
    { id: "currentCash", label: "Current Cash ($)", type: "currency" as const, defaultValue: 500000, min: 0 },
    { id: "monthlyRevenue", label: "Monthly Revenue ($)", type: "currency" as const, defaultValue: 50000, min: 0 },
    { id: "monthlyExpenses", label: "Monthly Expenses ($)", type: "currency" as const, defaultValue: 80000, min: 0 },
    { id: "monthlyGrowthRate", label: "Monthly Revenue Growth Rate (%)", type: "percentage" as const, defaultValue: 5, min: 0, max: 100 },
  ],
  outputs: [
    { id: "grossBurn", label: "Gross Burn Rate", type: "currency" as const, isPrimary: false },
    { id: "netBurn", label: "Net Burn Rate", type: "currency" as const, isPrimary: false },
    { id: "runwayMonths", label: "Runway (Months)", type: "number" as const, isPrimary: true },
    { id: "revenueRunwayMonths", label: "Revenue Runway (Months)", type: "number" as const, isPrimary: false },
  ],
  content: {
    intro: "Cash runway is the single most important metric for any early-stage startup. It tells you exactly how many months your business can continue operating at current spending levels before your bank account hits zero. When you're spending more than you earn (which is normal for most startups), understanding your burn rate and runway is survival-critical. This calculator projects your runway month-by-month, accounting for growing revenue as you scale. Gross burn is your total monthly spending. Net burn is spending minus revenue  -  the actual amount of cash leaving your account each month. If your net burn is positive (spending more than earning), your runway is finite and every day counts. If your net burn is negative (earning more than spending), you're profitable and your runway is essentially infinite. The calculator also shows your revenue runway  -  how long your cash would last if revenue went to zero, which is a conservative stress-test metric every founder should track.",
    howToUse: "Enter your current cash balance, monthly revenue, monthly expenses, and expected monthly revenue growth rate. The calculator shows your gross burn, net burn, the number of months until you run out of cash (accounting for revenue growth), and a conservative runway assuming zero future revenue. If your business is profitable (revenue exceeds expenses), the runway displays as 999+ months  -  effectively infinite. Adjust the growth rate to see how faster or slower growth changes your runway.",
    formulaExplanation: "Gross Burn = Monthly Expenses. Net Burn = Monthly Expenses  -  Monthly Revenue. If Net Burn ≤ 0 (profitable): Runway = 999+ months. If Net Burn > 0: Runway is calculated via simulation  -  each month cash decreases by (expenses minus revenue), and revenue grows by the monthly growth rate. The simulation continues until cash reaches zero. Revenue Runway = Current Cash ÷ Gross Burn (a worst-case scenario). For example, $500K cash, $50K revenue, $80K expenses, 5% monthly growth: Month 1 net burn = $30K, cash = $470K, revenue grows to $52.5K. Month 2 net burn = $27.5K, cash = $442.5K, revenue = $55.1K. Runway continues until cash is exhausted, typically lasting longer than simple division would suggest because revenue grows each month and reduces the net burn over time.",
    benchmarks: "Most venture-backed startups target 12-18 months of runway at all times. If your runway drops below 6 months, it's time to raise capital or cut costs aggressively. According to CB Insights, 38% of startups fail because they run out of cash. The average seed-stage startup has 16-20 months of runway at the time of funding. Series A companies typically have 18-24 months. Use [Pilot](https://pilot.com) or [Bench](https://bench.co) for bookkeeping and burn tracking.",
    benchmarkData: [
      { metric: "Minimum Safe Runway", value: "12-18 months", source: "YC Startup School" },
      { metric: "Critical Runway Threshold", value: "<6 months", source: "VC Industry Standard" },
      { metric: "Startups That Fail Due to Cash Run Out", value: "38%", source: "CB Insights" },
      { metric: "Average Seed-Stage Runway", value: "16-20 months", source: "Carta 2025" },
      { metric: "Average Series A Runway", value: "18-24 months", source: "Carta 2025" },
    ],
    relatedCalculators: ["break-even-calculator", "business-valuation-calculator", "pricing-strategy-calculator"],
    faq: [
      { question: "What is the difference between gross burn and net burn?", answer: "Gross burn is your total monthly operating expenses  -  everything you spend regardless of revenue. Net burn is gross burn minus monthly revenue  -  the actual amount of cash leaving your bank account each month. If you earn $50K and spend $80K, gross burn is $80K but net burn is only $30K. Net burn is what actually reduces your cash balance. Most founders should track both." },
      { question: "How much runway should a startup have?", answer: "VC-backed startups should maintain 12-18 months of runway at all times. This gives you enough time to hit milestones, raise the next round, or make strategic adjustments. If you dip below 12 months, start fundraising or cutting costs. Below 6 months is critical  -  you're operating in crisis mode and may not have time to close a funding round before running out." },
      { question: "What happens if my net burn is negative (profitable)?", answer: "If revenue exceeds expenses, your net burn is negative and your runway is effectively infinite  -  you're not depleting cash, you're accumulating it. This calculator returns 999+ months for profitable scenarios. Congratulations  -  you've achieved profitability! Now focus on sustainable growth and reinvesting profits into scaling the business." },
      { question: "How does revenue growth extend runway?", answer: "Growing revenue reduces your net burn each month. If you're spending $80K with $50K revenue burning $30K/mo, but revenue grows 5% monthly, after 12 months revenue is ~$90K and you're cash-flow positive. The compounding effect means runway extends much further than a simple cash ÷ net burn division would suggest. Growth is the best way to extend runway without cutting costs." },
      { question: "What should I do if my runway is too short?", answer: "Two options: increase cash (raise funding, generate more revenue) or decrease spending. For cost cuts, focus on non-essential spending first  -  marketing, contractors, software subscriptions, office space. The most impactful cuts are usually headcount (largest expense) and marketing (highly variable). Every dollar of monthly savings extends runway by roughly cash ÷ savings months." },
      { question: "How often should I recalculate runway?", answer: "Monthly at minimum. Many founders review runway weekly during the early stages. Recalculate any time revenue, expenses, or growth rate change significantly. If you're close to running out (under 12 months), track it weekly and model scenarios for fundraising, cost cuts, or revenue acceleration. Cash forecasting should be a living document, not a one-time calculation." },
      { question: "What is revenue runway and why does it matter?", answer: "Revenue runway (cash ÷ gross burn) is a conservative worst-case scenario assuming revenue drops to zero. It shows how long you'd survive if all customers churned or stopped paying. This is a stress test  -  early-stage startups should track it because revenue is never guaranteed. If your revenue runway is under 6 months, even with strong current revenue, you're in a risky position." },
      { question: "How do different funding stages affect expected runway?", answer: "Seed stage: 16-20 months average runway  -  enough to build product, find product-market fit, and reach key metrics for Series A. Series A: 18-24 months  -  enough to scale team, grow revenue, and reach Series B metrics. Series B+: 18-24 months  -  focused on growth at scale and path to profitability. If you raise less, expect less runway between rounds. Plan your fundraising timing carefully." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
