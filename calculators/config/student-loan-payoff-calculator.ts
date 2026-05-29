import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "student-loan-payoff-calculator",
  category: "personal-finance",
  meta: {
    title: "Student Loan Payoff Calculator",
    description: "Calculate your student loan payoff timeline, total interest paid, and explore strategies like snowball vs avalanche methods.",
    keywords: ["student loan payoff", "student loan calculator", "debt repayment", "student loan interest", "avalanche method", "snowball method"],
  },
  inputs: [
    { id: "totalLoan", label: "Total Loan Balance ($)", type: "currency" as const, defaultValue: 35000, min: 0 },
    { id: "interestRate", label: "Interest Rate (%)", type: "percentage" as const, defaultValue: 5.5, min: 0, max: 20 },
    { id: "monthlyPayment", label: "Monthly Payment ($)", type: "currency" as const, defaultValue: 400, min: 0 },
  ],
  outputs: [
    { id: "monthsToPayoff", label: "Months to Pay Off", type: "number" as const, isPrimary: false, suffix: " months" },
    { id: "yearsToPayoff", label: "Years to Pay Off", type: "number" as const, isPrimary: false, suffix: " years" },
    { id: "totalInterestPaid", label: "Total Interest Paid", type: "currency" as const, isPrimary: true },
    { id: "totalPaid", label: "Total Paid", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Student loan debt in the United States exceeds $1.7 trillion, affecting over 40 million borrowers. Understanding your repayment timeline and total interest cost is essential for making informed decisions about your repayment strategy. The two most popular approaches are the debt snowball (paying smallest loans first for psychological wins) and the debt avalanche (paying highest interest rate loans first to minimize total interest). Both methods work  -  the best one is the one you stick with. This calculator uses the standard amortization approach to determine how long your loans will take to pay off given your current balance, interest rate, and monthly payment. It also shows the total interest you'll pay over the life of the loan, which can be eye-opening. For federal student loans, programs like income-driven repayment (IDR), Public Service Loan Forgiveness (PSLF), and loan consolidation can significantly alter your payoff timeline. Private student loans generally have fewer flexible options but may be refinanced for a lower rate. The key insight: paying even $50 extra per month can save thousands in interest and cut years off your repayment timeline.",
    howToUse: "Enter your total student loan balance, the weighted average interest rate across all your loans, and the monthly payment you can afford. The calculator shows your payoff timeline, total interest paid, and total amount paid. Experiment with higher payment amounts to see how much you can save in interest. To calculate your weighted average interest rate, multiply each loan's rate by its balance, sum them, and divide by the total balance. Check loan comparison websites for current refinance rates if you have private loans. Federal loan borrowers should consider income-driven repayment plans through StudentAid.gov before refinancing, as refinancing federal loans with a private lender forfeits federal protections.",
    formulaExplanation: "This calculator uses iterative amortization. Each month: interest = current balance × (annual rate / 12 / 100). The payment first covers the accrued interest, and the remainder reduces the principal. This repeats monthly until the balance reaches zero. If the monthly payment is less than or equal to the monthly interest accrual, the loan will never be paid off  -  the calculator will throw an error because the balance grows instead of shrinking. Months to Payoff is the count of iterations. Years to Payoff = Months / 12. Total Interest = sum of all monthly interest charges. Total Paid = original loan balance + total interest.",
    benchmarks: "The average federal student loan balance is $37,700 per borrower. At 5.5% interest with a $400/month payment, a $35K loan takes about 9 years to pay off with $8,700 in total interest. The standard 10-year repayment plan for federal loans is the baseline  -  any payment above the standard amount accelerates payoff and reduces interest. The Department of Education reports that 66% of borrowers use income-driven repayment plans. Borrowers pursuing PSLF must make 120 qualifying payments while working for a qualifying employer. Refinancing with private lenders can reduce rates to 3-5% for high-credit borrowers. For more information, consult [Investopedia](https://investopedia.com/student-loan-refinancing-5070334) or [Fool.com](https://fool.com/student-loans/).",
    benchmarkData: [
      { metric: "Average Federal Student Loan Balance", value: "$37,700", source: "Education Data Initiative" },
      { metric: "Standard Repayment Term", value: "10 years", source: "Federal Student Aid" },
      { metric: "Total Student Loan Debt (US)", value: "$1.7+ trillion", source: "Federal Reserve" },
      { metric: "Borrowers on IDR Plans", value: "66%", source: "Dept. of Education" },
      { metric: "Average Interest Rate (Federal)", value: "5.5-7.0%", source: "Federal Student Aid" },
      { metric: "PSLF Qualifying Payments", value: "120 payments (10 years)", source: "StudentAid.gov" },
    ],
    relatedCalculators: ["debt-payoff-calculator", "credit-card-payoff-calculator", "investment-returns-calculator"],
    faq: [
      { question: "Should I use the snowball or avalanche method for student loans?", answer: "The avalanche method (pay highest interest rate first) saves the most money on total interest. The snowball method (pay smallest balance first) provides psychological momentum that helps some borrowers stay motivated. Mathematically, avalanche wins. Behaviorally, snowball works if it keeps you on track. Use this calculator to compare scenarios and choose the approach you can sustain long-term." },
      { question: "Should I refinance my student loans?", answer: "Refinancing can lower your interest rate if you have good credit (700+) and stable income, potentially saving thousands. However, refinancing federal loans with a private lender means losing access to IDR plans, PSLF, loan forgiveness, deferment, and forbearance. Only refinance federal loans if you're certain you won't need those protections. Use [Bankrate](https://bankrate.com/student-loans/refinance/) to compare rates from multiple lenders." },
      { question: "What is income-driven repayment (IDR)?", answer: "IDR plans cap your monthly payment at 10-20% of your discretionary income and forgive any remaining balance after 20-25 years. Types include SAVE, PAYE, REPAYE, and IBR. Payments can be as low as $0 if your income is low enough. However, forgiven amounts may be taxed as income. IDR is ideal for borrowers with high debt relative to income or those pursuing PSLF." },
      { question: "How does Public Service Loan Forgiveness work?", answer: "PSLF forgives the remaining balance on federal Direct Loans after 120 qualifying monthly payments (10 years) while working full-time for a qualifying employer (government, non-profit, or certain other public service organizations). Only payments made under an IDR plan and on time count. Submit the PSLF Employment Certification form annually to track progress. The PSLF program has been reformed to make it easier to qualify." },
      { question: "What happens if I can't afford my student loan payments?", answer: "Options include: switching to an IDR plan (lowers payments), requesting deferment or forbearance (temporarily pause payments, but interest may still accrue), consolidating loans (extends term, lowers payment, but may increase total interest), or loan rehabilitation (for defaulted loans). Never ignore student loans  -  default has serious consequences including wage garnishment and tax refund seizure." },
      { question: "How does paying extra each month affect my loans?", answer: "Additional payments go directly to principal after covering accrued interest, which reduces the total interest charged and shortens the payoff timeline. For example, paying $100 extra per month on a $35K loan at 5.5% saves approximately $3,100 in interest and cuts 3 years off the repayment period. Always specify that extra payments should be applied to the principal balance." },
      { question: "Can I deduct student loan interest on my taxes?", answer: "You can deduct up to $2,500 in student loan interest paid per year as an above-the-line adjustment to income (no need to itemize). The deduction phases out at higher income levels (2025: $75K single, $155K married filing jointly). This reduces your taxable income, not your tax bill directly. Your lender will send you Form 1098-E showing the interest paid." },
      { question: "What is the difference between subsidized and unsubsidized loans?", answer: "Subsidized loans (undergraduate only) don't accrue interest while you're in school at least half-time, during the 6-month grace period, or during deferment. The government pays the interest. Unsubsidized loans (undergraduate and graduate) accrue interest from the date of disbursement. Unpaid interest capitalizes (adds to principal) when entering repayment. Prioritize subsidized loans first if you need to borrow." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "学生ローン返済計算機",
        description: "学生ローンの返済期間と総支払利息を計算し、スノーボール vs アバランチ戦略を比較します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
