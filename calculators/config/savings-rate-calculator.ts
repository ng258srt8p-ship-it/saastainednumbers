import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "savings-rate-calculator",
  category: "personal-finance",
  meta: {
    title: "Savings Rate Calculator",
    description: "Calculate your savings rate and how long it will take to reach your savings goals based on income and expenses.",
    keywords: ["savings rate", "savings goal", "personal finance", "budgeting", "financial planning", "monthly savings"],
  },
  inputs: [
    { id: "monthlyIncome", label: "Monthly After-Tax Income ($)", type: "currency" as const, defaultValue: 5000, min: 0 },
    { id: "monthlyExpenses", label: "Monthly Expenses ($)", type: "currency" as const, defaultValue: 3500, min: 0 },
    { id: "currentSavings", label: "Current Savings ($)", type: "currency" as const, defaultValue: 10000, min: 0 },
    { id: "targetSavings", label: "Savings Goal ($)", type: "currency" as const, defaultValue: 50000, min: 0 },
  ],
  outputs: [
    { id: "monthlySavings", label: "Monthly Savings", type: "currency" as const, isPrimary: false },
    { id: "savingsRate", label: "Savings Rate", type: "percentage" as const, isPrimary: true },
    { id: "monthsToTarget", label: "Months to Goal", type: "number" as const, isPrimary: false, suffix: " months" },
    { id: "yearsToTarget", label: "Years to Goal", type: "number" as const, isPrimary: false, suffix: " years" },
  ],
  content: {
    intro: "Your savings rate  -  the percentage of after-tax income you save  -  is the single most important metric for building wealth. A higher savings rate means more money working for you in investments, faster progress toward financial goals, and earlier retirement. The beauty of the savings rate is that it's entirely within your control: you can increase income, decrease expenses, or both. Small changes compound dramatically over time. This calculator shows your current savings rate and exactly how long it will take to reach your savings goal.",
    howToUse: "Enter your monthly after-tax income, monthly expenses, current savings balance, and target savings goal. The calculator shows your monthly savings, savings rate percentage, and the time needed to reach your goal. Try adjusting expenses or income to see how different savings rates affect your timeline.",
    formulaExplanation: "Monthly Savings = Monthly Income  -  Monthly Expenses. Savings Rate = (Monthly Savings ÷ Monthly Income) × 100. Months to Target = (Target  -  Current Savings) ÷ Monthly Savings. For example, with $5K income and $3.5K expenses: Monthly Savings = $1,500. Rate = 30%. To reach $50K from $10K: 40,000 ÷ 1,500 = 26.7 months.",
    benchmarks: "The average US personal savings rate is 3-5%. Financial experts recommend saving at least 15-20% of income for retirement. The FIRE community saves 50-70%. A 10% savings rate is a great starting point. At 15% you're on track for a comfortable retirement. At 25% you're accelerating. At 50% you can retire in 17 years. Use [Mint](https://mint.intuit.com) or [YNAB](https://www.ynab.com) to automate savings tracking.",
    benchmarkData: [
      { metric: "Average US Savings Rate", value: "3-5%", source: "Bureau of Economic Analysis 2025" },
      { metric: "Retirement Recommended Rate", value: "15-20%", source: "Fidelity" },
      { metric: "FIRE Community Rate", value: "50-70%", source: "r/financialindependence" },
      { metric: "Years to Retire at 15% Savings Rate", value: "~43 years", source: "Mr. Money Mustache" },
      { metric: "Years to Retire at 50% Savings Rate", value: "~17 years", source: "Mr. Money Mustache" },
      { metric: "Years to Retire at 75% Savings Rate", value: "~7 years", source: "Mr. Money Mustache" },
    ],
    relatedCalculators: ["fire-calculator", "break-even-calculator"],
    faq: [
      { question: "What is a good savings rate for my age?", answer: "General rule: save 15-20% of income from your 20s onward. If starting in your 30s, aim for 20-25%. If starting in your 40s, aim for 30-40%. The later you start, the higher your rate needs to be due to lost compounding time. The best savings rate is the highest one you can sustain." },
      { question: "Should I count employer 401k match in my savings rate?", answer: "Yes. Employer match is part of your total compensation and counts toward savings. If you save 10% and your employer matches 5%, your total savings rate is 15%. Always contribute enough to get the full match  -  it's free money with instant 100% return." },
      { question: "How does savings rate compound over time?", answer: "A 10% savings rate with 7% returns grows to 1x annual expenses saved in ~5 years, 5x in ~18 years, 10x in ~27 years, and 25x (FIRE) in ~43 years. Doubling the rate to 20% cuts FIRE time to ~32 years. At 50%, FIRE in ~17 years. Rate matters more than returns." },
      { question: "Should I pay off debt or save?", answer: "High-interest debt (credit cards over 15% APR): pay it off first (guaranteed return). Mid-interest debt (student loans 4-7%): invest if expected returns exceed interest rate. Low-interest debt (mortgage under 4%): invest, especially in tax-advantaged accounts. Emergency fund (3-6 months expenses): save before investing." },
      { question: "What is the 50/30/20 budget rule?", answer: "The 50/30/20 rule allocates 50% of after-tax income to needs (housing, food, utilities), 30% to wants (entertainment, travel, dining out), and 20% to savings and debt repayment. It's a simple starting point  -  adjust based on your goals and cost of living." },
      { question: "How do I increase my savings rate without feeling deprived?", answer: "Focus on the big three: housing (30% of income or less), transportation, and food. Automate savings so you never see the money. Cut subscriptions you don't use. Use cash-back apps. The goal is mindful spending, not deprivation  -  spend extravagantly on what you love and cut mercilessly on what you don't." },
      { question: "What savings vehicles should I use?", answer: "Order of priority: 1) Emergency fund (3-6 months in HYSA), 2) 401k up to employer match, 3) Roth IRA (or Traditional IRA), 4) Max out 401k, 5) HSA (triple tax-advantaged), 6) Taxable brokerage. Each has different tax advantages and withdrawal rules." },
      { question: "How does inflation affect my savings goals?", answer: "Cash savings lose purchasing power to inflation (~3% annually). A $50K goal today will need $67K in 10 years at 3% inflation. That's why long-term savings should be invested in assets that outpace inflation (stocks, real estate) rather than sitting in a savings account earning 1-4%." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "貯蓄率計算機",
        description: "収入と支出に基づいて貯蓄率と目標達成までの期間を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
