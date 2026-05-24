import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "credit-card-payoff-calculator",
  category: "personal-finance",
  meta: {
    title: "Credit Card Payoff Calculator",
    description: "Find out how long it will take to pay off your credit card debt and how much interest you'll pay with your current payment plan.",
    keywords: ["credit card payoff", "credit card debt", "debt payoff calculator", "credit card interest", "debt repayment", "minimum payment"],
  },
  inputs: [
    { id: "totalBalance", label: "Total Balance ($)", type: "currency" as const, defaultValue: 5000, min: 0 },
    { id: "interestRate", label: "Interest Rate (%)", type: "percentage" as const, defaultValue: 22, min: 0, max: 36 },
    { id: "monthlyPayment", label: "Monthly Payment ($)", type: "currency" as const, defaultValue: 200, min: 0 },
  ],
  outputs: [
    { id: "monthsToPayoff", label: "Months to Pay Off", type: "number" as const, isPrimary: false, suffix: " months" },
    { id: "yearsToPayoff", label: "Years to Pay Off", type: "number" as const, isPrimary: false, suffix: " years" },
    { id: "totalInterestPaid", label: "Total Interest Paid", type: "currency" as const, isPrimary: true },
    { id: "totalPaid", label: "Total Paid", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Credit card debt is one of the most expensive forms of borrowing, with average interest rates exceeding 22% APR. At these rates, carrying a balance month-to-month can turn a manageable purchase into a long-term financial burden. The interest compounds daily or monthly, meaning you pay interest not just on your original purchases but also on the interest that has already accrued. This calculator helps you understand the true cost of carrying credit card debt by showing exactly how long it will take to pay off your balance and how much interest you'll pay with your current monthly payment. The numbers can be sobering: making only minimum payments on a $5,000 balance at 22% APR can take over 20 years to pay off and cost more than $7,000 in interest. Paying even a modest amount above the minimum can dramatically reduce both the payoff timeline and total interest. The most effective strategies include the debt avalanche (pay highest APR card first), debt snowball (pay smallest balance first for momentum), balance transfers to 0% APR cards, and debt consolidation loans at lower rates. The best strategy is the one you will actually stick with until the debt is gone.",
    howToUse: "Enter your total credit card balance, your card's APR (Annual Percentage Rate), and the amount you can pay each month. The calculator shows your payoff timeline, total interest paid, and total amount paid over the life of the debt. Try increasing your monthly payment amount to see how much faster you can become debt-free and how much interest you can save. For example, increasing from $200 to $300/month on a $5K balance at 22% cuts the payoff time from 3.5 years to 2 years and saves over $700 in interest. To find 0% balance transfer offers, check [NerdWallet](https://nerdwallet.com) and [Bankrate](https://bankrate.com). If you're struggling with multiple cards, consider a debt management plan through a nonprofit credit counseling agency like NFCC or Money Management International.",
    formulaExplanation: "This calculator uses iterative amortization. Each month: interest = current balance × (APR / 12 / 100). The payment first covers the accrued interest; the remainder reduces the principal balance. This repeats until the balance reaches zero. If the monthly payment is less than or equal to the monthly interest accrual, the balance will never be paid off, and the calculator throws an error. Months to Payoff is the total number of iterations. Years to Payoff = Months / 12. Total Interest = sum of all monthly interest charges. Total Paid = original balance + total interest. This is the standard credit card amortization method used by issuers, though actual daily compounding may result in slightly different numbers.",
    benchmarks: "The average credit card APR in 2025 is approximately 22-24% for new offers and higher for those with lower credit scores. The average US household carries about $6,200 in credit card debt. Making the minimum payment (typically 1-2% of the balance) on a $5K balance at 22% APR results in over 20 years of payments and more than $7K in interest. The CFPB recommends paying more than the minimum each month and prioritizing high-interest debt. Balance transfer fees typically range from 3-5% of the transferred amount. For credit card debt help, visit [Investopedia](https://investopedia.com) for strategy guides and [Fool.com](https://fool.com) for personal finance tips.",
    benchmarkData: [
      { metric: "Average Credit Card APR (2025)", value: "22-24%", source: "Federal Reserve" },
      { metric: "Average US Household Credit Card Debt", value: "$6,200", source: "Experian 2025" },
      { metric: "Minimum Payment Term (typical)", value: "1-2% of balance", source: "CFPB" },
      { metric: "Balance Transfer Fee", value: "3-5% of amount", source: "NerdWallet" },
      { metric: "US Credit Card Debt Total", value: "$1.1+ trillion", source: "Federal Reserve" },
      { metric: "Payoff Time (min payment @ 22%)", value: "20+ years", source: "Calculated" },
    ],
    relatedCalculators: ["debt-payoff-calculator", "student-loan-payoff-calculator", "savings-rate-calculator"],
    faq: [
      { question: "Should I pay off credit card debt or save for emergencies first?", answer: "Financial experts generally recommend building a small emergency fund ($1,000-2,000) first, then aggressively paying down high-interest credit card debt, then building a full 3-6 month emergency fund. The reason: credit card interest at 22%+ is an emergency in itself  -  paying it off gives you a guaranteed 22% return on your money, far better than any investment. Once the cards are paid, redirect that payment amount to savings." },
      { question: "What is the best strategy for paying off multiple credit cards?", answer: "Two proven strategies: Debt Avalanche  -  pay minimums on all cards and put extra money toward the card with the highest APR (saves the most interest). Debt Snowball  -  pay minimums on all cards and put extra toward the smallest balance (builds momentum and motivation). Mathematically, avalanche wins. Behaviorally, snowball works better for many people. Choose the one you'll stick with. Balance transfers to 0% APR cards can accelerate either strategy." },
      { question: "How do balance transfers work and are they worth it?", answer: "Balance transfers let you move debt from a high-APR card to one offering 0% APR for 12-21 months. You pay a 3-5% transfer fee upfront but save on interest during the promotional period. They're worth it if: you can pay off the balance within the promotional period, your credit score qualifies (typically 670+), and you don't rack up new charges on the old card. After the promo period, the APR reverts to the regular rate, so have a payoff plan." },
      { question: "What is the impact of making only minimum payments?", answer: "Minimum payments are designed to keep you in debt longer. On a $5K balance at 22% APR with a 2% minimum payment ($100 initially), it takes 20+ years and costs over $7K in interest  -  more than the original balance. The minimum payment decreases as the balance drops, extending the timeline further. Always pay more than the minimum whenever possible. Use this calculator to see the difference for your specific situation." },
      { question: "Should I use a debt consolidation loan for credit cards?", answer: "Consolidation loans can make sense if: you can get a rate significantly lower (8-15% vs 22%+), you're committed to not running up new card balances, and you have the credit score to qualify. The risk is that many people consolidate debt and then run up their credit cards again, ending up in worse shape. Personal loans, home equity loans, and 401k loans are common consolidation options  -  each with different risks and benefits." },
      { question: "How does credit card interest actually work day-to-day?", answer: "Most credit cards use daily compounding: interest = daily balance × (APR / 365) each day. If you pay your statement balance in full by the due date, you get a grace period and pay no interest at all. Once you carry a balance, the grace period disappears and interest accrues from the purchase date. This is why carrying a balance is so expensive  -  you lose the interest-free float. Pay your statement balance in full each month to avoid interest entirely." },
      { question: "What happens to my credit score when I pay off credit cards?", answer: "Paying off credit cards generally improves your credit score by lowering your credit utilization ratio (the most important factor after payment history). Utilization below 30% is good, below 10% is excellent. However, closing paid-off cards can hurt your score by reducing your total available credit. Keep old accounts open (even if unused) to maintain a longer credit history and higher available credit." },
      { question: "How can I avoid credit card debt in the future?", answer: "Best practices: 1) Pay your statement balance in full every month, 2) Use the 30% rule  -  don't charge more than 30% of your credit limit, 3) Track spending with budgeting apps like YNAB or Mint, 4) Build a 3-6 month emergency fund to avoid using cards for unexpected expenses, 5) Treat credit cards as payment tools, not loans. Use [NerdWallet](https://nerdwallet.com) to find cards with rewards that match your spending patterns while keeping a zero balance." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
