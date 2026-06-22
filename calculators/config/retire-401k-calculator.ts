import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "retire-401k-calculator",
  category: "personal-finance",
  meta: {
    title: "401k Retirement Calculator",
    description: "Project your 401k balance at retirement including employer match, compound growth, and estimate your retirement income.",
    keywords: ["401k calculator", "retirement calculator", "employer match", "401k planning", "retirement savings", "compound growth"],
  },
  inputs: [
    { id: "currentBalance", label: "Current 401k Balance ($)", type: "currency" as const, defaultValue: 50000, min: 0 },
    { id: "annualContribution", label: "Annual Contribution ($)", type: "currency" as const, defaultValue: 23500, min: 0 },
    { id: "employerMatchPercent", label: "Employer Match (%)", type: "percentage" as const, defaultValue: 100, min: 0, max: 100 },
    { id: "employerMatchCap", label: "Employer Match Cap ($)", type: "currency" as const, defaultValue: 11750, min: 0 },
    { id: "annualReturn", label: "Expected Annual Return (%)", type: "percentage" as const, defaultValue: 7, min: 0, max: 30 },
    { id: "currentAge", label: "Current Age", type: "number" as const, defaultValue: 30, min: 18, max: 80 },
    { id: "retirementAge", label: "Retirement Age", type: "number" as const, defaultValue: 65, min: 18, max: 100 },
  ],
  outputs: [
    { id: "balanceAtRetirement", label: "Balance at Retirement", type: "currency" as const, isPrimary: true },
    { id: "totalContributions", label: "Total Contributions", type: "currency" as const, isPrimary: false },
    { id: "totalEmployerMatch", label: "Total Employer Match", type: "currency" as const, isPrimary: false },
    { id: "totalEarnings", label: "Total Investment Earnings", type: "currency" as const, isPrimary: false },
    { id: "annualIncomeAtRetirement", label: "Est. Annual Income (4%)", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "A 401k is the most effective retirement savings tool available to most American workers. Contributions are made pre-tax (reducing your taxable income now), earnings grow tax-deferred, and employer matching is essentially free money. The maximum employee contribution for 2026 is $23,500 (plus $7,500 catch-up for ages 50+), and total contributions (employer + employee) can reach $70,000. The single most important 401k strategy: always contribute enough to get the full employer match  -  it's an immediate 50-100% return on your money. Beyond the match, a 401k offers tax-deferred compounding, creditor protection under ERISA, and the option to roll over funds when changing jobs. This calculator projects your 401k balance at retirement, breaking down how much comes from your contributions, your employer's match, and investment earnings. It also estimates your annual retirement income using the 4% Rule  -  a widely accepted guideline for sustainable withdrawals. The difference between starting at age 25 vs 35 is staggering: starting earlier means half the monthly contribution for the same retirement outcome. Use this tool to model different contribution rates, employer match scenarios, and retirement ages to find the optimal path for your goals. For detailed 401k guidance, visit [Investopedia](https://investopedia.com) and [Fool.com](https://fool.com).",
    howToUse: "Enter your current 401k balance, annual personal contribution amount (up to the IRS limit), your employer's match percentage and cap, expected annual return based on your asset allocation, current age, and target retirement age. The calculator shows projected balance, contribution breakdown, and estimated annual retirement income. If you're unsure about your employer match, check your benefits summary  -  typical matches are 50-100% of contributions up to 3-6% of salary. For annual return assumptions, use 7% for stock-heavy portfolios, 5-6% for balanced, 3-4% for conservative. Consult the IRS website or a financial advisor for current 401k contribution limits and catch-up provisions.",
    formulaExplanation: "This calculator uses monthly compounding: balance = currentBalance × (1 + r)^n + (annualContribution + match) / 12 × ((1 + r)^n  -  1) / r, where r = monthly return rate (annual return / 12 / 100) and n = months until retirement (age difference × 12). Employer Match = min(annualContribution × matchPercent / 100, matchCap). Total Contributions = currentBalance + annualContribution × years. Total Employer Match = employerMatch × years. Total Earnings = balanceAtRetirement  -  totalContributions  -  totalEmployerMatch. Annual Income = balanceAtRetirement × 0.04 (the 4% Rule).",
    benchmarks: "The average 401k balance varies by age and income level. A 30-year-old with $50K saved, contributing $19,500/year with a 100% match on the first $9,750, earning 7% annual returns, would have approximately $2.8M by age 65  -  providing $112K/year in retirement income. The IRS allows catch-up contributions of $7,500/year for those 50+. Only 32% of workers contribute enough to receive the full employer match (Vanguard). Fidelity recommends saving 15% of your income (including employer match) for retirement. For more benchmarks, visit [NerdWallet](https://nerdwallet.com) or [Fool.com](https://fool.com).",
    benchmarkData: [
      { metric: "Average 401k Balance (All Ages)", value: "$100K - $140K", source: "Vanguard / Industry data" },
      { metric: "Average 401k Balance (Age 30-39)", value: "$42,000", source: "Fidelity 2025" },
      { metric: "2026 Employee Contribution Limit", value: "$23,500", source: "IRS" },
      { metric: "Catch-Up Contribution (Age 50+)", value: "$7,500", source: "IRS" },
      { metric: "Workers Getting Full Match", value: "32%", source: "Vanguard" },
      { metric: "Recommended Savings Rate", value: "15% of income", source: "Fidelity" },
    ],
    relatedCalculators: ["investment-returns-calculator", "fire-calculator", "dividend-income-calculator"],
    faq: [
      { question: "How much should I contribute to my 401k?", answer: "At minimum, contribute enough to get the full employer match  -  that's an immediate 50-100% return on your money. Beyond that, the general recommendation is to save 15% of your pre-tax income (including employer match) toward retirement. For 2025, you can contribute up to $23,000 ($30,500 if 50+). If you can max out your 401k, also consider a Roth IRA and HSA for additional tax-advantaged savings." },
      { question: "What happens to my 401k when I change jobs?", answer: "You have four options: 1) Leave it in your former employer's plan (if balance > $5,000 and plan permits), 2) Roll it into your new employer's 401k, 3) Roll it into a Traditional IRA (more investment options, often lower fees), or 4) Cash out (worst option  -  you'll pay income tax plus a 10% early withdrawal penalty). Rolling to an IRA is usually the best choice, offering broader investment options and consolidated management." },
      { question: "What is the difference between Traditional and Roth 401k?", answer: "Traditional 401k: contributions are pre-tax (lower taxable income now), earnings grow tax-deferred, and withdrawals are taxed as ordinary income in retirement. Roth 401k: contributions are post-tax (no immediate tax break), earnings grow tax-free, and qualified withdrawals in retirement are tax-free. If you expect to be in a higher tax bracket in retirement, Roth is better. If you're in a high bracket now, Traditional is usually better. Many employers offer both options." },
      { question: "How does the employer match actually work?", answer: "Common match formulas: 100% match on the first 3% of salary (you contribute 3%, employer adds 3%), or 50% match on the first 6% (you contribute 6%, employer adds 3%). Vesting schedules determine when the employer match becomes yours  -  some are immediate, others vest over 3-6 years. Always contribute at least enough to get the full match. Not doing so is leaving free money on the table  -  potentially tens of thousands of dollars over your career." },
      { question: "What asset allocation should I use in my 401k?", answer: "A simple rule of thumb: 110 minus your age = percentage in stocks. At 30: 80% stocks / 20% bonds. At 50: 60% stocks / 40% bonds. At 65: 45% stocks / 55% bonds. Within the stock portion, diversify across US large-cap, US small-cap, and international stocks using low-cost index funds (0.03-0.10% expense ratio). Target-date funds are a good hands-off option that automatically adjusts allocation as you approach retirement." },
      { question: "What is the 4% Rule and how does it apply to 401k?", answer: "The 4% Rule states you can withdraw 4% of your portfolio in the first year of retirement, adjusting for inflation each subsequent year, with a low probability of running out of money over 30 years. Applied to your 401k: multiply your projected balance by 0.04 to estimate sustainable annual retirement income. For a $1M balance, that's $40K/year. This rule is a guideline, not a guarantee  -  adjust based on your expected retirement length and risk tolerance." },
      { question: "Can I withdraw from my 401k before age 59.5 without penalty?", answer: "Generally, early withdrawals are subject to income tax plus a 10% penalty. Exceptions include: separation from service at age 55+ (Rule of 55), substantially equal periodic payments (SEPP/72t), disability, medical expenses exceeding 10% of AGI, and up to $50K for a first-time home purchase (via 401k loan). 401k loans (up to 50% of vested balance or $50K, whichever is less) are also penalty-free but must be repaid or treated as a distribution." },
      { question: "How do 401k fees impact my retirement savings?", answer: "401k fees  -  including expense ratios on funds, administration fees, and advisory fees  -  can significantly erode your savings. A 1% fee on a $500K portfolio costs $5K/year and $150K+ over 30 years. Choose low-cost index funds (0.03-0.10% ER) and favor plans with low administrative fees. If your employer's plan has high fees, contribute enough to get the match, then maximize an IRA (where you have full control over fund selection) before contributing more to the 401k." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "401k退職資金計算機",
        description: "企業マッチ、複利成長を含む401k残高を予測し、退職後の収入を見積もります。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
