import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "mortgage-affordability-calculator",
  category: "personal-finance",
  meta: {
    title: "Mortgage Affordability Calculator",
    description: "Determine how much house you can afford based on your income, debt, down payment, and current interest rates using the 28/36 rule.",
    keywords: ["mortgage affordability", "how much house can I afford", "home buying", "28/36 rule", "debt to income ratio", "mortgage calculator"],
  },
  inputs: [
    { id: "annualIncome", label: "Annual Income ($)", type: "currency" as const, defaultValue: 100000, min: 0 },
    { id: "monthlyDebtPayments", label: "Monthly Debt Payments ($)", type: "currency" as const, defaultValue: 500, min: 0 },
    { id: "downPayment", label: "Down Payment ($)", type: "currency" as const, defaultValue: 50000, min: 0 },
    { id: "interestRate", label: "Interest Rate (%)", type: "percentage" as const, defaultValue: 6.5, min: 0, max: 20 },
    { id: "loanTermYears", label: "Loan Term (Years)", type: "number" as const, defaultValue: 30, min: 1, max: 40 },
    { id: "propertyTaxRate", label: "Property Tax Rate (%)", type: "percentage" as const, defaultValue: 1.2, min: 0, max: 5 },
    { id: "insuranceMonthly", label: "Monthly Home Insurance ($)", type: "currency" as const, defaultValue: 150, min: 0 },
  ],
  outputs: [
    { id: "maxHomePrice", label: "Max Home Price", type: "currency" as const, isPrimary: true },
    { id: "monthlyPayment", label: "Monthly Payment", type: "currency" as const, isPrimary: false },
    { id: "downPaymentPercent", label: "Down Payment %", type: "percentage" as const, isPrimary: false },
    { id: "debtToIncomeRatio", label: "Debt-to-Income Ratio", type: "percentage" as const, isPrimary: false },
    { id: "loanAmount", label: "Loan Amount", type: "currency" as const, isPrimary: false },
    { id: "totalInterestPaid", label: "Total Interest Paid", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Mortgage affordability determines how much home you can responsibly purchase based on your income, existing debts, and current interest rates. The golden rule in lending is the 28/36 Rule: no more than 28% of your gross monthly income should go toward housing costs, and no more than 36% should go toward total debt payments (housing plus other debts). Lenders use these ratios to qualify borrowers, but your personal comfort zone may differ. A lower debt-to-income ratio means more financial flexibility and less risk if rates rise or income changes. This calculator uses the backend ratio (36%) to determine your maximum affordable home price  -  the total debt ceiling that includes your mortgage payment plus existing monthly debt obligations like car loans, student loans, and credit card minimums. Home affordability has shifted dramatically as interest rates fluctuated in recent years. At 7% interest, the purchasing power is roughly 20% lower than at 3%, underscoring why rate shopping with multiple lenders is essential. Use this calculator to set realistic expectations before you start touring homes, and pair it with pre-approval from a lender for the most accurate picture.",
    howToUse: "Enter your annual gross income, total monthly debt payments (car loans, student loans, credit card minimums, etc.), available down payment, expected interest rate based on current mortgage rates, loan term, property tax rate for your area, and monthly home insurance estimate. The calculator applies the 36% backend DTI limit to determine your maximum home price. Adjust the interest rate to match today's rates  -  check mortgage rate comparison sites for current averages. A higher down payment reduces your loan amount and may eliminate PMI. Remember that property taxes and insurance vary significantly by location and should be researched for your target area.",
    formulaExplanation: "Monthly Income = Annual Income / 12. Max Monthly Payment = Monthly Income × 0.36  -  Monthly Debt Payments. Max Loan Amount is derived from the standard amortization formula: Max Loan = Max Payment × ((1 + r)^n  -  1) / (r × (1 + r)^n) where r = monthly interest rate (annual / 12) and n = total months. Max Home Price = Max Loan + Down Payment. Down Payment % = Down Payment / Max Home Price. DTI = (Total Monthly Debt + Housing Payment) / Monthly Income × 100. Total Interest = Total of All Payments  -  Loan Amount.",
    benchmarks: "The FHFA reports the US median home price was approximately $420K in 2025. A household earning $100K/year with $500 in monthly debts, $50K down, and a 6.5% rate on a 30-year loan can typically afford a home around $350-400K. The 28/36 rule is the industry standard used by Fannie Mae and Freddie Mac for conforming loans. FHA loans allow higher DTI ratios (up to 43% or even 50% with compensating factors). The average effective property tax rate in the US is 1.1% but ranges from 0.3% in Hawaii to 2.5% in New Jersey. Consult [Fool.com](https://fool.com) for mortgage strategy guides and [Investopedia](https://investopedia.com) for detailed DTI explanations.",
    benchmarkData: [
      { metric: "US Median Home Price (2025)", value: "~$420K", source: "FHFA" },
      { metric: "Standard DTI Limit (Conforming)", value: "36% backend", source: "Fannie Mae" },
      { metric: "FHA Max DTI", value: "43% (up to 50%)", source: "HUD" },
      { metric: "Average Property Tax Rate", value: "1.1%", source: "Tax Foundation" },
      { metric: "Recommended Down Payment", value: "20% to avoid PMI", source: "Consumer Finance" },
      { metric: "30-Year Fixed Rate (2025 avg)", value: "6.5-7.0%", source: "Freddie Mac" },
    ],
    relatedCalculators: ["rent-vs-buy-calculator", "savings-rate-calculator"],
    faq: [
      { question: "What is the 28/36 rule in mortgage lending?", answer: "The 28/36 rule is a lending guideline stating that no more than 28% of your gross monthly income should go toward housing expenses (front-end ratio) and no more than 36% should go toward total debt payments including housing (back-end ratio). This calculator uses the 36% backend ratio for a conservative maximum. Some conventional loans allow up to 43-50% DTI with strong compensating factors like a high credit score or large down payment." },
      { question: "How much do I need for a down payment?", answer: "Conventional loans require as little as 3% down, FHA loans require 3.5%, and VA/USDA loans may require 0% down for qualified borrowers. However, putting 20% down eliminates Private Mortgage Insurance (PMI), which costs 0.5-2% of the loan amount annually. A larger down payment also means a lower monthly payment and more equity from day one. Use [NerdWallet](https://nerdwallet.com/mortgages/down-payment) to compare down payment options." },
      { question: "How does my credit score affect affordability?", answer: "Your credit score directly impacts the interest rate you qualify for. A 760+ credit score might get you a rate 1-2% lower than a 620 score. On a $300K loan, that difference can mean $200-400/month in extra payments and tens of thousands in extra interest over the life of the loan. Check your credit score and correct errors before applying for a mortgage." },
      { question: "What costs are included in my monthly payment?", answer: "Your total monthly payment (PITI) includes: Principal (loan repayment), Interest (cost of borrowing), Taxes (property taxes), and Insurance (homeowners insurance). Many lenders also require PMI if you put down less than 20%. This calculator accounts for principal, interest, taxes, and insurance. HOA fees are an additional cost not included here." },
      { question: "How do interest rates affect what I can afford?", answer: "Interest rates have an enormous impact on affordability. A 1% rate increase reduces purchasing power by approximately 10-12%. For example, a $2,000 monthly payment buys a $445K home at 5% but only a $373K home at 7%. This is why rate shopping and locking in favorable rates is critical. Check current rates daily on [Bankrate](https://bankrate.com/mortgages/)." },
      { question: "Should I get pre-approved before house hunting?", answer: "Absolutely. Pre-approval gives you a firm price range, shows sellers you're a serious buyer, and speeds up closing once you make an offer. It involves a credit check and income verification. Pre-qualification is less formal (self-reported info) and carries less weight. Most real estate agents recommend pre-approval before starting your home search in competitive markets." },
      { question: "What is debt-to-income ratio and why does it matter?", answer: "Debt-to-Income (DTI) ratio compares your monthly debt payments to your gross monthly income. Lenders use it to assess your ability to manage monthly payments and repay borrowed money. A lower DTI (under 36%) signals financial health and qualifies you for better rates. A higher DTI (above 43%) may disqualify you from conventional mortgages. Reducing existing debt before applying for a mortgage directly improves your DTI." },
      { question: "What other costs should I budget for as a homeowner?", answer: "Beyond your mortgage payment, budget 1-2% of the home's value annually for maintenance and repairs, $300-1,000/year for homeowners insurance, property taxes (0.3-2.5% of value), HOA fees ($100-500+/month if applicable), utilities, and closing costs (2-5% of purchase price). The CFPB recommends having 3-6 months of housing expenses in emergency savings before buying a home." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
