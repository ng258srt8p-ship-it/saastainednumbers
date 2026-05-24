import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "debt-payoff-calculator",
  category: "personal-finance",
  meta: {
    title: "Debt Payoff Calculator",
    description: "Calculate how long it will take to pay off your debt and how much interest you'll pay with your current payment plan.",
    keywords: ["debt payoff", "debt calculator", "loan payoff", "credit card payoff", "interest calculator", "debt snowball"],
  },
  inputs: [
    { id: "totalDebt", label: "Total Debt ($)", type: "currency" as const, defaultValue: 15000, min: 0 },
    { id: "interestRate", label: "Annual Interest Rate (%)", type: "percentage" as const, defaultValue: 18, min: 0, max: 100 },
    { id: "monthlyPayment", label: "Monthly Payment ($)", type: "currency" as const, defaultValue: 500, min: 1 },
  ],
  outputs: [
    { id: "monthsToPayoff", label: "Months to Payoff", type: "number" as const, isPrimary: true, suffix: " months" },
    { id: "yearsToPayoff", label: "Years to Payoff", type: "number" as const, isPrimary: false, suffix: " years" },
    { id: "totalInterestPaid", label: "Total Interest Paid", type: "currency" as const, isPrimary: true },
    { id: "totalPaid", label: "Total Paid", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Debt is expensive. Credit card interest rates average 20-28%, meaning your debt grows almost as fast as you can pay it off if you only make minimum payments. Understanding your debt payoff timeline and total interest cost is the first step to financial freedom. This calculator shows exactly how much interest you'll pay and how long until you're debt-free with your current payment plan.",
    howToUse: "Enter your total debt balance, annual interest rate, and monthly payment amount. The calculator shows months to payoff, total interest paid, and total amount paid. Try increasing your monthly payment to see how even small extra amounts dramatically reduce total interest and payoff time.",
    formulaExplanation: "Each month: Interest = Balance × (Rate ÷ 12 ÷ 100). Principal Payment = Monthly Payment  -  Interest. New Balance = Balance  -  Principal Payment. This repeats until balance reaches zero. Total Interest = sum of all interest charges. Total Paid = Original Debt + Total Interest.",
    benchmarks: "Credit card minimum payments typically take 15-25 years to pay off $10K at 18% APR, costing $10-15K in interest. Doubling the minimum payment cuts the payoff time in half and saves 60%+ in interest. The debt snowball method (paying smallest debts first) has the highest success rate. The avalanche method (highest interest first) saves the most money. Use [YNAB](https://www.ynab.com) or [Mint](https://mint.intuit.com) for debt tracking.",
    benchmarkData: [
      { metric: "Average Credit Card APR", value: "20-28%", source: "Federal Reserve 2025" },
      { metric: "Average Student Loan Rate", value: "5-8%", source: "Federal Reserve 2025" },
      { metric: "Average Auto Loan Rate", value: "6-10%", source: "Federal Reserve 2025" },
      { metric: "$10K at Minimum Payment (18% APR)", value: "15-25 years", source: "Calculated" },
      { metric: "$10K at Double Minimum (18% APR)", value: "3-5 years", source: "Calculated" },
      { metric: "Debt Snowball Success Rate", value: "78% vs 42% for avalanche", source: "Behavioral Studies" },
    ],
    relatedCalculators: ["savings-rate-calculator", "fire-calculator"],
    faq: [
      { question: "Should I use the debt snowball or avalanche method?", answer: "Avalanche (highest interest first) saves the most money. Snowball (smallest balance first) has the highest success rate because of psychological wins. If you're disciplined, use avalanche. If you struggle with motivation, use snowball. Mathematically, avalanche is superior; behaviorally, snowball often wins." },
      { question: "How does paying extra each month affect my payoff timeline?", answer: "Extra payments have a leveraged effect. Paying $50 extra on a $500 minimum payment (10% increase) can cut payoff time by 30-40% and save 40-50% in interest. Every extra dollar goes directly to principal, avoiding future interest. This is the highest-return investment most people can make." },
      { question: "What is the minimum payment trap?", answer: "Minimum payments are designed to maximize interest income for lenders. On $10K at 18% APR with 2% minimum payment ($200), it takes 25+ years to pay off and costs $15K+ in interest. The credit card company profits $15K while you pay 2.5x what you borrowed. Always pay more than the minimum." },
      { question: "Should I invest or pay off debt?", answer: "Rule of thumb: pay off debt with interest rates above 8% before investing. Below 5% (mortgage, some student loans), invest instead. Between 5-8%, it's a personal decision. Paying off 18% credit card debt is equivalent to earning a guaranteed 18% return  -  better than any investment." },
      { question: "How does debt consolidation help?", answer: "Consolidation (balance transfer or personal loan) can lower your interest rate from 20%+ to 5-15%, saving thousands in interest. However, it only works if you stop using the paid-off credit cards. Balance transfer fees (3-5%) are worth it if you pay off the debt within the 0% promo period." },
      { question: "What is the debt-to-income ratio and why does it matter?", answer: "DTI = Total Monthly Debt Payments ÷ Gross Monthly Income × 100. Lenders prefer DTI under 36%. Above 43% makes it hard to get mortgages or auto loans. High DTI also means more of your income goes to interest rather than building wealth." },
      { question: "How do student loans compare to credit card debt?", answer: "Student loans typically have lower rates (5-8%) but higher balances ($30-50K average). Federal student loans offer income-driven repayment, deferment, and potential forgiveness. Credit card debt has higher rates (20%+) and no such protections. Prioritize credit card debt, then private student loans, then federal student loans." },
      { question: "What is a good debt payoff timeline?", answer: "Credit card debt: 12-24 months. Auto loans: original term (3-5 years). Student loans: 5-15 years (standard) or 20-25 years (income-driven). Mortgage: 15-30 years. The faster you pay off high-interest debt, the more money you keep. Aim to be debt-free except for a mortgage within 5 years." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
