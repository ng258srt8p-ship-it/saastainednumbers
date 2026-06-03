import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "side-income-tax-calculator",
  category: "side-hustle",
  meta: {
    title: "Side Income Tax Calculator",
    description: "Estimate taxes on your side hustle income including self-employment tax, federal, and state taxes.",
    keywords: ["side hustle tax", "self employment tax", "1099 tax", "freelance tax", "gig economy tax", "independent contractor tax", "side income"],
  },
  inputs: [
    { id: "sideIncome", label: "Annual Side Income ($)", type: "currency" as const, defaultValue: 20000, min: 0 },
    { id: "employmentIncome", label: "W-2 Employment Income ($)", type: "currency" as const, defaultValue: 80000, min: 0 },
    { id: "filingStatus", label: "Filing Status", type: "currency" as const, defaultValue: 0, min: 0 },
    { id: "state", label: "State", type: "currency" as const, defaultValue: 0, min: 0 },
    { id: "expenses", label: "Deductible Expenses ($)", type: "currency" as const, defaultValue: 3000, min: 0 },
  ],
  outputs: [
    { id: "taxableSideIncome", label: "Taxable Side Income (after expenses)", type: "currency" as const },
    { id: "selfEmploymentTax", label: "Self-Employment Tax (employer portion)", type: "currency" as const },
    { id: "estimatedFederalTax", label: "Estimated Additional Federal Tax", type: "currency" as const },
    { id: "estimatedStateTax", label: "Estimated State Tax", type: "currency" as const },
    { id: "totalAdditionalTax", label: "Total Additional Tax Due", type: "currency" as const, isPrimary: true },
    { id: "effectiveTaxRate", label: "Effective Tax Rate on Side Income", type: "percentage" as const },
    { id: "afterTaxSideIncome", label: "After-Tax Side Income", type: "currency" as const },
  ],
  content: {
    intro: "Side hustle income is taxed differently than regular employment income. Unlike W-2 employees where taxes are automatically withheld, independent contractors and freelancers must pay both income tax AND self-employment tax (Social Security and Medicare  -  15.3% total). The good news: you can deduct legitimate business expenses to reduce taxable income. This calculator estimates your total additional tax burden from side hustle activities, including self-employment tax, federal income tax on the additional income, and estimated state tax. Understanding your true tax liability helps you set aside the right amount for quarterly estimated payments and avoid surprises at tax time. Use tools like [QuickBooks](https://quickbooks.intuit.com) or [FreshBooks](https://freshbooks.com) to track deductions and [TurboTax](https://turbotax.intuit.com) or [TaxSlayer](https://taxslayer.com) for filing.",
    howToUse: "Enter your estimated annual side hustle income, your W-2 employment income, your filing status, state of residence, and deductible business expenses. The calculator uses simplified tax brackets for estimation  -  federal tax is calculated using 2025-2026 marginal rates. Actual tax liability depends on your full financial picture including deductions, credits, and state-specific tax laws. Use this as a planning tool, not a replacement for professional tax advice.",
    formulaExplanation: "Taxable Side Income = Side Income - Expenses. Self-Employment Tax = Taxable Side Income × 15.3% × 50% (deductible employer portion only). Federal Tax: Estimates additional federal income tax by comparing total income (employment + side) tax to employment-only tax using simplified brackets ($0-60K at 10%, over $60K at 22%). State Tax = Taxable Side Income × 5% (estimated average state rate). Effective Tax Rate = Total Additional Tax ÷ Taxable Side Income × 100. After-Tax Side Income = Taxable Side Income - Total Additional Tax.",
    benchmarks: "The effective tax rate on side hustle income typically ranges from 25-40% depending on your total income, filing status, and deductions. Self-employment tax alone adds 15.3% on top of income tax. According to IRS data, approximately 30% of independent contractors fail to pay sufficient estimated taxes, resulting in penalties. The average sole proprietor deducts $5,000-15,000 in business expenses annually. Using a dedicated business bank account and tracking software like [QuickBooks](https://quickbooks.intuit.com) can reduce tax preparation time by 50% and uncover legitimate deductions. State income tax rates vary from 0% (TX, FL, NV, WA) to 13.3% (CA).",
    benchmarkData: [
      { metric: "Self-Employment Tax Rate", value: "15.3%", source: "IRS 2026" },
      { metric: "Federal Tax Bracket (Low)", value: "10% ($0-60K combined)", source: "IRS 2026" },
      { metric: "Federal Tax Bracket (High)", value: "22% ($60K+ combined)", source: "IRS 2026" },
      { metric: "Average Effective Side Income Tax Rate", value: "25-35%", source: "General benchmark" },
      { metric: "Average Business Expense Deduction", value: "$5,000-15,000", source: "General benchmark" },
      { metric: "State Income Tax Range", value: "0-13.3%", source: "General benchmark" },
    ],
    relatedCalculators: ["fire-calculator", "savings-rate-calculator", "investment-returns-calculator"],
    faq: [
      { question: "How is side hustle income taxed?", answer: "Side hustle income is taxed as self-employment income. You owe both income tax (federal + state) and self-employment tax (15.3% for Social Security and Medicare). The good news: you can deduct business expenses, half of self-employment tax, and contributions to a SEP IRA or Solo 401k." },
      { question: "Do I need to pay quarterly estimated taxes?", answer: "If you expect to owe $1,000 or more in taxes on your side hustle, yes. The IRS requires quarterly estimated payments if your withholding doesn't cover your total tax liability. Form 1040-ES is used to calculate and pay quarterly estimates. Failure to pay can result in underpayment penalties." },
      { question: "What expenses can I deduct as a freelancer?", answer: "Common deductions include: home office (simplified method: $5/sq ft up to 300 sq ft), equipment and supplies, software subscriptions, internet and phone (business portion), marketing and advertising, professional development, travel for client meetings, health insurance premiums, and retirement contributions. Track everything with [QuickBooks](https://quickbooks.intuit.com) or [FreshBooks](https://freshbooks.com)." },
        { question: "Should I form an LLC for my side hustle?", answer: "A single-member LLC provides liability protection and credibility but doesn't change your tax situation (you still file Schedule C). Consider an S-Corp election when your net side income exceeds $60K/year; it can reduce self-employment tax by allowing you to take part of your income as distributions (not subject to SE tax). LLC formation costs $50-800 depending on state." },
      { question: "What is the self-employment tax rate?", answer: "The self-employment tax rate is 15.3% (12.4% for Social Security + 2.9% for Medicare). However, you can deduct half of this amount (7.65%) as an adjustment to income on your Form 1040. The Social Security portion only applies to the first $176,100 of combined income (2026 limit)." },
      { question: "Do I need a separate bank account for my side hustle?", answer: "While not legally required for a sole proprietorship, a separate business bank account is strongly recommended. It simplifies bookkeeping, shows professionalism if audited, and makes tax preparation significantly easier. Many free options exist like [Lili](https://lili.com) or [Mercury](https://mercury.com) for online businesses." },
      { question: "What happens if I don't report side hustle income?", answer: "The IRS has increasingly sophisticated methods to detect unreported income, including matching 1099 forms, analyzing bank deposits, and using AI to identify discrepancies. Penalties include: 20% accuracy-related penalty, failure-to-file penalty (5%/month up to 25%), failure-to-pay penalty (0.5%/month up to 25%), and potential criminal charges for tax evasion in extreme cases." },
      { question: "How do state taxes work for side hustle income?", answer: "You owe state income tax in your state of residence. If you provide in-person services in other states, you may owe tax there too. States without income tax (TX, FL, NV, WA, etc.) are ideal for side hustlers. State tax rates range from 0% to 13.3% (CA). Some states have specific rules for digital products and services." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "副業収入税額計算機",
        description: "副業収入の税額を見積もります。事業経費、自営業税、連邦税と州税を含みます。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
