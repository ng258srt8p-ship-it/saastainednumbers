import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "burn-rate-calculator",
  category: "growth-efficiency",
  meta: {
    title: "Burn Rate Calculator",
    description: "Calculate your monthly gross burn, net burn, and cash runway to understand how long your capital will last.",
    keywords: ["burn rate", "cash runway", "saas metrics", "startup", "runway"],
  },
  inputs: [
    { id: "monthlyExpenses", label: "Monthly Operating Expenses", type: "currency" as const, defaultValue: 50000 },
    { id: "monthlyRevenue", label: "Monthly Revenue", type: "currency" as const, defaultValue: 30000 },
    { id: "cashReserves", label: "Cash Reserves", type: "currency" as const, defaultValue: 500000 },
  ],
  outputs: [
    { id: "netBurnRate", label: "Net Burn Rate", type: "currency" as const, isPrimary: true, prefix: "-" },
    { id: "grossBurnRate", label: "Gross Burn Rate", type: "currency" as const, isPrimary: false },
    { id: "runwayMonths", label: "Cash Runway", type: "number" as const, isPrimary: false, suffix: " months" },
  ],
  content: {
    intro: "Burn rate measures how quickly a company spends its capital to fund operations before generating positive cash flow. Gross burn is total monthly operating expenses, while net burn is expenses minus revenue  -  the actual cash being consumed each month. Cash runway tells you how many months until you run out of money at your current burn rate. This is the single most important metric for early-stage startups, founders raising capital, and any business managing limited resources. Investors scrutinize burn rate to assess runway, efficiency, and the urgency of the next funding round. This calculator helps you compute all three metrics instantly.",
    howToUse: "Enter your total monthly operating expenses (including payroll, rent, software, marketing) and your monthly revenue. Add your current cash reserves to see your runway. Adjust inputs to model different spending scenarios and see how cost reductions extend your runway.",
    formulaExplanation: "Gross Burn = Total Monthly Operating Expenses. Net Burn = Monthly Expenses - Monthly Revenue. Cash Runway = Cash Reserves ÷ Net Burn (if net burn > 0). For example: $50K expenses - $30K revenue = $20K net burn. With $500K reserves: $500K ÷ $20K = 25 months runway",
    benchmarks: "According to CB Insights and First Round Capital, startups typically have 12-18 months of runway post-Seed round. Top VCs recommend maintaining at least 12-18 months of runway at all times. The median Seed-stage startup burns $15-25K/month pre-revenue and $30-50K/month post-revenue. Companies with net burn exceeding $100K/month need strong growth to justify the burn rate.",
    benchmarkData: [
      { metric: "Recommended Minimum Runway", value: "12 - 18 months", source: "First Round Capital" },
      { metric: "Seed Stage Pre-Revenue Burn", value: "$15K - $25K / month", source: "CB Insights" },
      { metric: "Seed Stage Post-Revenue Burn", value: "$30K - $50K / month", source: "CB Insights" },
      { metric: "Series A Average Burn", value: "$100K - $250K / month", source: "SaaS Capital" },
      { metric: "Healthy Gross Burn (Seed)", value: "< $50K / month", source: "Y Combinator" },
    ],
    relatedCalculators: ["mrr-calculator", "nrr-calculator", "quick-ratio-calculator"],
    faq: [
      { question: "What is the difference between gross burn and net burn?", answer: "Gross burn is total monthly operating expenses. Net burn is expenses minus revenue. Gross burn shows how much you're spending; net burn shows how quickly you're consuming cash reserves. Investors focus on net burn." },
      { question: "How much runway should a startup have?", answer: "12-18 months is standard. If you have less than 6 months of runway, you need to cut costs or raise capital urgently. VCs rarely invest in companies with less than 6 months of runway." },
      { question: "Does burn rate include one-time expenses?", answer: "Include all operating expenses: payroll, rent, software, marketing, professional services, and overhead. Exclude one-time capital expenditures (equipment purchases) unless material." },
      { question: "How does burn rate affect fundraising?", answer: "Higher burn requires faster growth to justify. Investors calculate months of remaining runway and evaluate whether you can hit key milestones before needing more capital." },
      { question: "What is a healthy burn rate for a SaaS company?", answer: "At Seed stage: $20-50K/month gross burn. At Series A: $100-200K/month. The key metric is burn multiple = Net Burn ÷ Net New ARR. A burn multiple below 1x is excellent; below 2x is healthy." },
      { question: "How can I extend my runway without raising money?", answer: "Reduce non-essential spending, freeze hiring, negotiate vendor contracts, focus on high-margin revenue, and prioritize features that drive retention over new features. Consider [Vercel](https://vercel.com) or [DigitalOcean](https://digitalocean.com) for cost-effective infrastructure." },
      { question: "What is the burn multiple?", answer: "Burn Multiple = Net Burn ÷ Net New ARR. It measures how much you spend to generate each dollar of new recurring revenue. Top-quartile public SaaS companies have a burn multiple below 1.5x." },
      { question: "Should I include founder salaries in burn rate?", answer: "Yes. Include all cash compensation including founder salaries, even if below market rate. The true cost of operations includes what everyone is paid." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
