import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "fire-calculator",
  category: "personal-finance",
  meta: {
    title: "FIRE Calculator",
    description: "Calculate your path to Financial Independence, Retire Early (FIRE) based on savings, contributions, and investment returns.",
    keywords: ["fire", "financial independence", "retire early", "fire number", "coast fire", "retirement planning"],
  },
  verified: {
    source: "Trinity Study / r/financialindependence / Federal Reserve 2025",
    sourceUrl: "https://www.bogleheads.org/wiki/Trinity_study_update",
    date: "2025",
  },
  inputs: [
    { id: "currentSavings", label: "Current Savings ($)", type: "currency" as const, defaultValue: 50000, min: 0 },
    { id: "monthlyContribution", label: "Monthly Contribution ($)", type: "currency" as const, defaultValue: 2000, min: 0 },
    { id: "annualReturn", label: "Annual Return (%)", type: "percentage" as const, defaultValue: 7, min: 0, max: 30 },
    { id: "desiredMonthlyWithdrawal", label: "Desired Monthly Withdrawal ($)", type: "currency" as const, defaultValue: 4000, min: 0 },
    { id: "currentAge", label: "Current Age", type: "number" as const, defaultValue: 30, min: 18, max: 80 },
    { id: "retirementAge", label: "Target Retirement Age", type: "number" as const, defaultValue: 55, min: 18, max: 100 },
  ],
  outputs: [
    { id: "savingsAtRetirement", label: "Savings at Retirement", type: "currency" as const, isPrimary: false },
    { id: "fireNumber", label: "FIRE Number (25x Expenses)", type: "currency" as const, isPrimary: true },
    { id: "yearsToFI", label: "Years to Financial Independence", type: "number" as const, isPrimary: false, suffix: " years" },
    { id: "ageAtFI", label: "Age at Financial Independence", type: "number" as const, isPrimary: false, suffix: " years old" },
  ],
  content: {
    intro: "Financial Independence, Retire Early (FIRE) is a movement focused on saving aggressively  -  typically 50-70% of income  -  to achieve financial independence and retire decades earlier than traditional retirement age. The core principle is the 4% Rule: if you can live on 4% of your savings per year, you have enough to retire indefinitely. Your FIRE number is simply 25 times your annual expenses. This calculator projects your savings growth, calculates your FIRE number, and tells you how many years until you reach financial independence.",
    howToUse: "Enter your current savings, monthly contribution, expected annual return, desired monthly withdrawal in retirement, current age, and target retirement age. The calculator shows your projected savings at retirement, your FIRE number, and the years until you reach financial independence at your current savings rate.",
    formulaExplanation: "FIRE Number = Desired Monthly Withdrawal × 12 × 25 (the 4% Rule). Future Savings = Current Savings × (1 + r)^n + Monthly Contribution × ((1 + r)^n - 1) / r, where r = monthly return rate and n = number of months until retirement. Years to FI is calculated iteratively  -  the number of years needed for your savings to reach your FIRE number.",
    benchmarks: "The FIRE community recommends saving 50-70% of income for early retirement in 5-10 years. A 30-year-old saving $2,000/month at 7% returns with $50K saved reaches $1.2M by age 55  -  enough for $4,000/month withdrawals. The median US household has $65K in retirement savings. Coast FI (when your current savings will grow to your FIRE number without additional contributions) is achieved when Savings at Retirement >= FIRE Number. Track your progress with [Personal Capital](https://www.personalcapital.com) or [YNAB](https://www.ynab.com).",
    benchmarkData: [
      { metric: "FIRE Number Rule", value: "25x Annual Expenses", source: "Trinity Study (4% Rule)" },
      { metric: "Typical FIRE Savings Rate", value: "50-70% of income", source: "r/financialindependence" },
      { metric: "Median US Retirement Savings", value: "$65,000", source: "Federal Reserve 2025" },
      { metric: "Average 401k Balance (Age 30-39)", value: "$42,000", source: "Fidelity 2025" },
      { metric: "Historical S&P 500 Return", value: "10% before inflation", source: "Morningstar" },
      { metric: "Safe Withdrawal Rate", value: "4% annually", source: "Trinity Study" },
    ],
    relatedCalculators: ["savings-rate-calculator", "investment-returns-calculator", "retire-401k-calculator", "emergency-fund-calculator", "debt-payoff-calculator"],
    faq: [
      { question: "What is the 4% Rule and is it still valid?", answer: "The 4% Rule states you can withdraw 4% of your portfolio annually with a low risk of running out of money over 30 years. Recent research (the Trinity Study update and Bengen's work) suggests 4% is still valid for 30-year retirements, but a 3-3.5% withdrawal rate is safer for longer retirements (50+ years). Adjust based on your timeline." },
      { question: "What is the difference between Lean FIRE, Fat FIRE, and Coast FIRE?", answer: "Lean FIRE means retiring on a minimal budget ($20-40K/year). Fat FIRE means retiring with a higher standard of living ($80K+/year). Coast FIRE means having enough saved that it will grow to your FIRE number by traditional retirement age without additional contributions  -  you can 'coast' working a less stressful job." },
      { question: "How does inflation affect my FIRE plans?", answer: "Inflation erodes purchasing power over time. When calculating, use real returns (after inflation)  -  typically 5-7% for stocks instead of 10%. Your FIRE number should also increase with inflation. The 4% Rule already accounts for inflation-adjusted withdrawals." },
      { question: "What withdrawal strategy should I use in retirement?", answer: "Common strategies: Fixed Percentage (withdraw X% of portfolio each year), Dollar Amount Plus Inflation (withdraw fixed amount adjusted annually), and Bucket Strategy (keep 1-2 years of cash, 5-7 years in bonds, rest in stocks). The Variable Percentage Withdrawal method adjusts spending to market conditions." },
      { question: "Should I include Social Security in my FIRE plan?", answer: "Yes, but conservatively. Assume reduced benefits (75-80% of projected) and delayed claiming (age 67-70) for safety. Social Security acts as a longevity hedge  -  if you live longer than expected, benefits provide a floor. Young FIRE followers should treat Social Security as a bonus, not a requirement." },
      { question: "How does asset allocation change in retirement?", answer: "Accumulation phase: 80-100% stocks for growth. Early retirement: 60-80% stocks, 20-40% bonds for stability. Late retirement: 40-60% stocks, 40-60% bonds. The key is having 5-7 years of expenses in bonds/cash to avoid selling stocks during market downturns." },
      { question: "How do healthcare costs affect FIRE plans?", answer: "Healthcare is often the largest unplanned FIRE expense. Pre-65: budget $500-1,500/month for ACA marketplace plans with subsidies. Post-65: $300-500/month for Medicare plus supplemental coverage. Consider health savings accounts (HSAs) as a triple-tax-advantaged retirement tool." },
      { question: "What is the optimal savings rate for early retirement?", answer: "10% savings rate → retire in ~51 years. 25% → ~32 years. 50% → ~17 years. 75% → ~7 years. The relationship is nonlinear  -  doubling your savings rate from 10% to 20% cuts 15 years off your working career. Use tools like [WalletBurst](https://walletburst.com) or [Networthify](https://networthify.com) for personalized projections." },
      { question: "How does FIRE differ from traditional retirement planning?", answer: "Traditional retirement planning assumes you work until age 65 and save 10-15% of income. FIRE involves saving 50-70% of income to retire in 5-15 years. Traditional planning uses a 4% withdrawal rate for 30-year retirements. FIRE needs a more conservative 3-3.5% rate for potentially 50+ year retirements. Traditional investing is 60/40 stocks/bonds; FIRE is often 80-100% stocks for longer growth horizons. Compare retirement strategies with [NerdWallet](https://nerdwallet.com)." },
      { question: "How do taxes affect my FIRE withdrawal strategy?", answer: "Tax-efficient withdrawal sequencing is critical in FIRE. Withdraw from taxable accounts first, then tax-deferred (Traditional IRA/401k), then tax-free (Roth IRA). Consider Roth conversion ladders to access retirement funds early without penalties. Capital gains tax rates apply to taxable account withdrawals. Health insurance subsidies under the ACA are based on MAGI, so managing taxable income keeps healthcare affordable. Consult a tax professional for your specific situation." },
      { question: "What are common FIRE calculation mistakes to avoid?", answer: "Common mistakes include: using nominal returns instead of real (inflation-adjusted) returns; underestimating healthcare costs before Medicare age; ignoring sequence of return risk (poor market returns in early retirement); not accounting for major life expenses like children's education or home purchases; assuming constant spending in retirement; and failing to include taxes in withdrawal calculations. Use conservative assumptions and revisit your plan annually." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
