import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "burn-rate-calculator",
  category: "growth-efficiency",
  meta: {
    title: "Burn Rate & Burn Multiple Calculator",
    description: "Calculate your monthly gross burn, net burn, cash runway, and burn multiple to understand your capital efficiency.",
    keywords: ["burn rate", "burn multiple", "cash runway", "saas metrics", "startup", "runway", "capital efficiency"],
  },
  benchmarkMetric: "burn-multiple",
  inputs: [
    { id: "monthlyExpenses", label: "Monthly Operating Expenses", type: "currency" as const, defaultValue: 50000 },
    { id: "monthlyRevenue", label: "Monthly Revenue", type: "currency" as const, defaultValue: 30000 },
    { id: "netNewARR", label: "Net New ARR (Monthly)", type: "currency" as const, defaultValue: 20000 },
    { id: "cashReserves", label: "Cash Reserves", type: "currency" as const, defaultValue: 500000 },
  ],
  outputs: [
    { id: "netBurnRate", label: "Net Burn Rate", type: "currency" as const, isPrimary: true, prefix: "-" },
    { id: "burnMultiple", label: "Burn Multiple", type: "number" as const, isPrimary: false, suffix: "x" },
    { id: "grossBurnRate", label: "Gross Burn Rate", type: "currency" as const, isPrimary: false },
    { id: "runwayMonths", label: "Cash Runway", type: "number" as const, isPrimary: false, suffix: " months" },
  ],
  content: {
    intro: "Burn rate measures how quickly a company spends its capital to fund operations before generating positive cash flow. Gross burn is total monthly operating expenses, while net burn is expenses minus revenue  -  the actual cash being consumed each month. Cash runway tells you how many months until you run out of money. The burn multiple (net burn ÷ net new ARR) tells you how efficiently you're converting spend into revenue  -  the defining capital efficiency metric for 2025/2026. This calculator helps you compute all four metrics instantly.",
    howToUse: "Enter your total monthly operating expenses, monthly revenue, monthly net new ARR, and current cash reserves. Adjust inputs to model different spending and growth scenarios. A burn multiple below 1x means you're generating more than $1 of ARR for every $1 burned  -  that's top-quartile efficiency.",
    formulaExplanation: "Gross Burn = Total Monthly Operating Expenses. Net Burn = Monthly Expenses - Monthly Revenue. Burn Multiple = Net Burn ÷ Net New ARR (monthly). Cash Runway = Cash Reserves ÷ Net Burn (if net burn > 0). For example: $50K expenses - $30K revenue = $20K net burn. With $20K net new ARR: $20K ÷ $20K = 1.0x burn multiple. With $500K reserves: $500K ÷ $20K = 25 months runway.",
    benchmarks: "According to KeyBanc Capital Markets 2025 survey, the median public SaaS company has a burn multiple of 1.8x. Top-quartile companies achieve below 1.5x, and elite operators (Snowflake, HubSpot) are below 1.0x. Startups typically have 12-18 months of runway post-Seed round. Companies with a burn multiple above 3x need strong growth to justify the burn.",
    benchmarkData: [
      { metric: "Burn Multiple  -  Elite", value: "< 1.0x", source: "KeyBanc 2025" },
      { metric: "Burn Multiple  -  Top Quartile", value: "< 1.5x", source: "KeyBanc 2025" },
      { metric: "Burn Multiple  -  Median", value: "1.8x", source: "KeyBanc 2025" },
      { metric: "Burn Multiple  -  Needs Attention", value: "> 3.0x", source: "SaaS Capital" },
      { metric: "Recommended Minimum Runway", value: "12 - 18 months", source: "First Round Capital" },
      { metric: "Seed Stage Post-Revenue Burn", value: "$30K - $50K / month", source: "CB Insights" },
    ],
    relatedCalculators: ["mrr-calculator", "nrr-calculator", "quick-ratio-calculator", "saas-quick-ratio-calculator"],
    faq: [
      { question: "What is the difference between gross burn and net burn?", answer: "Gross burn is total monthly operating expenses. Net burn is expenses minus revenue. Gross burn shows how much you're spending; net burn shows how quickly you're consuming cash reserves. Investors focus on net burn." },
      { question: "How much runway should a startup have?", answer: "12-18 months is standard. If you have less than 6 months of runway, you need to cut costs or raise capital urgently. VCs rarely invest in companies with less than 6 months of runway." },
      { question: "What is the burn multiple?", answer: "Burn Multiple = Net Burn ÷ Net New ARR (monthly). It measures how much you spend to generate each dollar of new recurring revenue. A burn multiple of 1.0x means you spend $1 to generate $1 of new ARR. Below 1.0x is elite efficiency; above 3.0x needs attention." },
      { question: "Why is burn multiple important in 2026?", answer: "In the current fundraising environment, capital efficiency matters more than growth at all costs. Investors screen on burn multiple before ARR growth. A burn multiple below 1.5x signals disciplined growth; above 3x signals potential cash problems." },
      { question: "How does burn rate affect fundraising?", answer: "Higher burn requires faster growth to justify. Investors calculate months of remaining runway and evaluate whether you can hit key milestones before needing more capital. A high burn multiple signals inefficiency." },
      { question: "What is a healthy burn multiple?", answer: "Below 1.0x is elite (Snowflake, HubSpot). 1.0-1.5x is top-quartile. 1.5-2.5x is average. 2.5-3.5x needs attention. Above 3.5x is concerning unless growth is exceptional." },
      { question: "How can I improve my burn multiple?", answer: "Reduce non-essential spend, focus on higher-margin revenue streams, improve pricing, reduce churn (which boosts net new ARR without additional spend), and prioritize features that drive retention." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
