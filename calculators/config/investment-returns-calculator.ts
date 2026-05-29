import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "investment-returns-calculator",
  category: "personal-finance",
  meta: {
    title: "Investment Returns Calculator",
    description: "Project your investment growth with compound returns, regular contributions, and customizable time horizons.",
    keywords: ["investment returns", "compound interest", "investment calculator", "retirement savings", "stock market returns"],
  },
  inputs: [
    { id: "initialInvestment", label: "Initial Investment ($)", type: "currency" as const, defaultValue: 10000, min: 0 },
    { id: "monthlyContribution", label: "Monthly Contribution ($)", type: "currency" as const, defaultValue: 500, min: 0 },
    { id: "annualReturn", label: "Expected Annual Return (%)", type: "percentage" as const, defaultValue: 7, min: 0, max: 30 },
    { id: "years", label: "Years", type: "number" as const, defaultValue: 10, min: 0 },
  ],
  outputs: [
    { id: "totalContributions", label: "Total Contributions", type: "currency" as const, isPrimary: false },
    { id: "totalValue", label: "Total Value", type: "currency" as const, isPrimary: true },
    { id: "totalEarnings", label: "Total Earnings", type: "currency" as const, isPrimary: false },
    { id: "annualizedReturn", label: "Annualized Return", type: "percentage" as const, isPrimary: false },
  ],
  content: {
    intro: "Compound interest is the eighth wonder of the world. Your investment returns depend on three levers: the amount you invest, the return you earn, and the time you give it to grow. Time is the most powerful factor  -  starting early and staying invested consistently matters more than timing the market. This calculator shows the projected growth of your investments using the standard compound interest formula with monthly contributions.",
    howToUse: "Enter your initial investment, monthly contribution amount, expected annual return, and investment time horizon. Use 7-10% for stock market historical returns, 4-6% for balanced portfolios, and 2-4% for conservative bonds/CDs. The calculator shows your total contributions, projected value, earnings, and annualized return.",
    formulaExplanation: "Future Value = Initial × (1 + r)^n + Monthly × ((1 + r)^n  -  1) ÷ r, where r = monthly return rate (annual ÷ 12) and n = total months. Total Contributions = Initial + Monthly × 12 × Years. Earnings = Future Value  -  Contributions.",
    benchmarks: "Historical S&P 500 average return is ~10% before inflation (7% after inflation). A $10K initial investment with $500/month at 7% grows to $93K in 10 years ($70K contributed, $23K earnings) and $407K in 20 years ($130K contributed, $277K earnings). Time is the critical variable  -  20 years generates 12x more earnings than 10 years. Use [Vanguard](https://vanguard.com) or [Fidelity](https://fidelity.com) for low-cost index fund investing.",
    benchmarkData: [
      { metric: "S&P 500 Historical (Before Inflation)", value: "~10% annualized", source: "Morningstar" },
      { metric: "S&P 500 Historical (After Inflation)", value: "~7% annualized", source: "Morningstar" },
      { metric: "Balanced Portfolio (60/40)", value: "6-8% annualized", source: "Vanguard" },
      { metric: "Bond Market Historical", value: "2-5% annualized", source: "Morningstar" },
      { metric: "10-Year Return ($10K + $500/mo @ 7%)", value: "~$93K", source: "Calculated" },
      { metric: "20-Year Return ($10K + $500/mo @ 7%)", value: "~$407K", source: "Calculated" },
    ],
    relatedCalculators: ["fire-calculator", "savings-rate-calculator"],
    faq: [
      { question: "What rate of return should I use for projections?", answer: "Use 7% for stock-heavy portfolios (after inflation), 10% for nominal projections. Conservative: 5-6% for balanced portfolios. Aggressive: 10-12% for growth portfolios. For short-term goals (under 5 years), use 2-4% (bonds/HYSA). Never use past returns as a guarantee  -  they're projections, not promises." },
      { question: "How does compounding work over different time periods?", answer: "Compounding snowballs. A $10K investment at 7% grows to $19.7K in 10 years, $38.7K in 20 years, $76.1K in 30 years, and $149.7K in 40 years. The last decade generates more growth than the first three decades combined. This is why starting early is the most important factor in investing success." },
      { question: "What is the difference between simple and compound interest?", answer: "Simple interest earns returns only on the principal. Compound interest earns returns on both the principal and accumulated returns. Over 20 years, $10K at 7% simple interest = $24K. Same investment with compound interest = $38.7K  -  61% more. Always seek compound growth for long-term investments." },
      { question: "Should I invest a lump sum or dollar-cost average?", answer: "Lump sum investing outperforms dollar-cost averaging approximately 70% of the time because markets trend upward. However, DCA reduces psychological regret if the market drops immediately after investing. If you have a large sum, invest 50% immediately and DCA the rest over 6-12 months." },
      { question: "What investment vehicles should I use?", answer: "Order of priority: 1) 401k up to employer match (free money), 2) Roth IRA (tax-free growth), 3) HSA (triple tax-advantaged), 4) Max out 401k, 5) Traditional IRA, 6) Taxable brokerage. Within each, use low-cost index funds (VTI, VOO, VT) for broad market exposure with minimal fees." },
      { question: "How do fees affect investment returns?", answer: "Fees destroy compounding. A 1% annual fee on a $100K portfolio earning 7% costs you $28K over 20 years and $119K over 30 years. This is why low-cost index funds (0.03% expense ratio) vastly outperform actively managed funds (1%+ fees) over long time horizons." },
      { question: "What is the impact of increasing monthly contributions?", answer: "Increasing contributions has a linear effect on the final value (doubling contributions = roughly doubles the contribution portion). Increasing returns has an exponential effect. In practice, focus on both: increase your savings rate AND invest in diversified, low-cost assets for the best results." },
      { question: "How does inflation affect investment returns?", answer: "Inflation reduces purchasing power. At 3% inflation, $100 today will purchase only $55 in 20 years. Use real returns (after inflation) for projections  -  7% for stocks instead of 10%. Your investments need to outpace inflation to grow purchasing power over time." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "投資収益計算機",
        description: "複利リターンと定期的な貢献額、カスタマイズ可能な期間で投資成長を予測します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
