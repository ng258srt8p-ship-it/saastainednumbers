import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "emergency-fund-calculator",
  category: "personal-finance",
  meta: {
    title: "Emergency Fund Calculator",
    description: "Calculate how much you need in your emergency fund and how long it will take to save it based on your expenses.",
    keywords: ["emergency fund", "rainy day fund", "financial safety net", "savings goal", "emergency savings"],
  },
  inputs: [
    { id: "monthlyExpenses", label: "Monthly Expenses ($)", type: "currency" as const, defaultValue: 4000, min: 1 },
    { id: "currentSavings", label: "Current Savings ($)", type: "currency" as const, defaultValue: 5000, min: 0 },
    { id: "monthlySavings", label: "Monthly Savings ($)", type: "currency" as const, defaultValue: 800, min: 0 },
    { id: "targetMonths", label: "Target Months of Coverage", type: "number" as const, defaultValue: 6, min: 0 },
  ],
  outputs: [
    { id: "targetAmount", label: "Target Amount", type: "currency" as const, isPrimary: true },
    { id: "currentCoverageMonths", label: "Current Coverage (Months)", type: "number" as const, isPrimary: false, suffix: " months" },
    { id: "shortfall", label: "Shortfall", type: "currency" as const, isPrimary: false },
    { id: "monthsToGoal", label: "Months to Goal", type: "number" as const, isPrimary: false, suffix: " months" },
  ],
  content: {
    intro: "An emergency fund is your financial safety net  -  cash set aside for unexpected expenses like job loss, medical emergencies, or major car repairs. Financial experts recommend 3-6 months of essential living expenses in a high-yield savings account. This fund isn't an investment; it's insurance. Having a fully funded emergency fund is the foundation of financial stability, preventing you from going into debt when life throws curveballs.",
    howToUse: "Enter your monthly essential expenses, current savings balance, how much you can save each month, and your target number of months of coverage. Standard recommendation is 3-6 months (3 for dual-income households, 6 for single-income or variable income). The calculator shows your target amount, current coverage, shortfall, and timeline to goal.",
    formulaExplanation: "Target Amount = Monthly Expenses × Target Months. Current Coverage = Current Savings ÷ Monthly Expenses. Shortfall = Target  -  Current Savings (if positive). Months to Goal = Shortfall ÷ Monthly Savings (if monthly savings > 0). Example: $4K/month expenses × 6 months = $24K target. At $5K saved: shortfall = $19K. At $800/month savings: 24 months to goal.",
    benchmarks: "Financial experts universally recommend 3-6 months of expenses. Single-income households should aim for 6 months. Dual-income: 3 months. Freelancers and gig workers: 6-12 months due to income variability. The average US household has only $5K in savings  -  far short of the recommended amount. Only 44% of Americans could cover a $1K emergency with savings. Use [Ally Bank](https://ally.com) or [Marcus](https://marcus.com) for high-yield savings accounts.",
    benchmarkData: [
      { metric: "Standard Recommendation", value: "3-6 months of expenses", source: "Financial Experts" },
      { metric: "Single-Income Household", value: "6 months recommended", source: "Financial Experts" },
      { metric: "Freelancer / Variable Income", value: "6-12 months recommended", source: "Financial Experts" },
      { metric: "Average US Household Savings", value: "~$5,000", source: "Federal Reserve 2025" },
      { metric: "US Households Could Cover $1K Emergency", value: "44%", source: "Federal Reserve 2025" },
      { metric: "High-Yield Savings Account Rate", value: "3.5-5.0% APR", source: "Bankrate 2025" },
    ],
    relatedCalculators: ["savings-rate-calculator", "debt-payoff-calculator"],
    faq: [
      { question: "How much should I have in my emergency fund?", answer: "3-6 months of essential expenses (rent/mortgage, utilities, food, insurance, minimum debt payments). Not your full income  -  just essentials. For a single-income household or freelancer, aim for 6-9 months. Dual-income households can manage with 3 months. Calculate your number precisely with this tool." },
      { question: "Where should I keep my emergency fund?", answer: "High-yield savings account (HYSA) earning 3.5-5.0% APR. NOT in stocks (too volatile for short-term needs). NOT in a checking account (too easy to spend). A HYSA at Ally, Marcus, or SoFi offers the right balance of accessibility, safety (FDIC insured), and yield." },
      { question: "Should I pay off debt or build an emergency fund first?", answer: "Build a mini emergency fund of 1 month's expenses first ($1-2K), then pay off high-interest debt (credit cards over 15% APR), then build the full 3-6 month fund. This balanced approach provides a safety net while aggressively attacking expensive debt." },
      { question: "What counts as an emergency?", answer: "Job loss, medical emergency, major car repair, urgent home repair (leaking roof, broken HVAC), unexpected travel for family emergencies. NOT: vacation, Black Friday deals, home renovation, new electronics, or wedding expenses. If it's optional or planned, it's not an emergency." },
      { question: "How do I rebuild my emergency fund after using it?", answer: "Treat the depleted fund as priority #1. Temporarily reduce other savings (retirement, investing) and redirect all available cash to rebuilding. Most people should rebuild within 3-6 months if they redirect their normal savings rate. Consider pausing non-essential spending until the fund is restored." },
      { question: "Does health insurance affect emergency fund needs?", answer: "Yes. If you have good health insurance with a low deductible ($1-2K), you can lean toward 3 months of expenses. If you have a high-deductible plan ($5-10K+), lean toward 6+ months. Your emergency fund should be able to cover your out-of-pocket maximum plus living expenses." },
      { question: "How does job stability affect my emergency fund target?", answer: "High stability (tenured professor, government worker): 3 months is sufficient. Medium stability (established professional): 4-5 months. Low stability (startup employee, freelancer, gig worker): 6-12 months. The more variable your income, the larger your safety net should be." },
      { question: "What is the difference between an emergency fund and a sinking fund?", answer: "Emergency fund = unplanned, urgent expenses. Sinking fund = planned, expected expenses (car registration, annual insurance, holiday gifts). Sinking funds prevent true emergencies by smoothing out predictable irregular expenses. Have separate sinking funds for known upcoming costs." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
