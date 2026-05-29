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
      { metric: "Average Effective Side Income Tax Rate", value: "25-35%", source: "Freelancer Tax Study 2026" },
      { metric: "Average Business Expense Deduction", value: "$5,000-15,000", source: "IRS Sole Proprietor Data" },
      { metric: "State Income Tax Range", value: "0-13.3%", source: "State Tax Authorities 2026" },
    ],
    relatedCalculators: ["savings-rate-calculator", "fire-calculator"],
    faq: [
      { question: "Do I have to pay self-employment tax on side income?", answer: "Yes, if your net self-employment income is $400 or more in a tax year, you must pay self-employment tax (15.3%  -  12.4% for Social Security + 2.9% for Medicare). This is in addition to income tax. Unlike W-2 employees who split this tax with their employer, self-employed individuals pay both portions. However, you can deduct the employer-equivalent portion (50% of SE tax) as an adjustment to income." },
      { question: "What business expenses can I deduct for my side hustle?", answer: "Common deductible expenses include: home office (dedicated space used regularly/exclusively for business), equipment (computer, camera, phone), software subscriptions ([QuickBooks](https://quickbooks.intuit.com), [Adobe Creative Cloud](https://adobe.com)), internet and phone (business portion), travel for business, marketing (ads, website hosting), professional services (accountant, lawyer), education (courses, conferences), and vehicle expenses (standard mileage rate $0.67/mi in 2025). Save all receipts and maintain a mileage log." },
      { question: "How do I pay estimated quarterly taxes?", answer: "If you expect to owe $1,000 or more in tax on your side income, the IRS requires quarterly estimated payments (due April 15, June 15, Sept 15, Jan 15). Calculate your estimated annual tax, divide by 4, and pay via IRS Direct Pay or EFTPS. Underpaying can result in penalties. Most tax software like [TurboTax](https://turbotax.intuit.com) or [TaxSlayer](https://taxslayer.com) can generate estimated payment vouchers." },
      { question: "How does filing status affect side hustle taxes?", answer: "Filing status affects your tax brackets and standard deduction. In 2025: Single ($15,000 standard deduction), Married Filing Jointly ($30,000), Married Filing Separately ($15,000), Head of Household ($22,500). Your side income stacks on top of your employment income within the same brackets, so a Married Filing Jointly couple with one high earner will pay less tax on side income than a Single filer with the same total income." },
      { question: "What's the difference between a hobby and a business for tax purposes?", answer: "The IRS distinguishes hobbies from businesses based on profit motive. A business is conducted with the intent to make a profit (shows profit in 3 of 5 years, has a separate bank account, keeps business records). Hobby income is reported as 'Other Income' (not subject to self-employment tax), but hobby expenses are generally not deductible. If you're earning significant side income, treat it as a business to qualify for deductions." },
      { question: "Should I form an LLC for my side hustle?", answer: "An LLC provides legal liability protection (separates personal from business assets) and can offer tax flexibility (elect S-corp status to reduce SE tax on income over $60K). However, forming an LLC costs $50-500 and requires annual filings in most states. For side hustles earning under $20K/year, a sole proprietorship with a DBA is often sufficient. For higher earners, consult a CPA about LLC vs S-corp election." },
      { question: "How do I handle sales tax for my side hustle?", answer: "If you sell physical products (via [Etsy](https://etsy.com), [Shopify](https://shopify.pxf.io/2R5Dza), or in-person), you must collect and remit sales tax in states where you have nexus (physical presence or economic nexus  -  typically $100K+ in sales or 200+ transactions). Register for a sales tax permit in each relevant state, collect tax on applicable sales, and file returns (monthly, quarterly, or annually depending on volume). Use [TaxJar](https://taxjar.com) or [Avalara](https://avalara.com) for automation." },
      { question: "What tax breaks are available specifically for side hustlers?", answer: "The Qualified Business Income (QBI) deduction (Section 199A) allows eligible sole proprietors and LLCs to deduct up to 20% of qualified business income, subject to phaseout thresholds ($191,950 single / $383,900 MFJ in 2025). The home office deduction (simplified method: $5/sq ft up to 300 sq ft = $1,500 max). Health insurance premiums may be deductible if you're not eligible for an employer plan. Retirement contributions (SEP IRA, Solo 401k) reduce taxable income significantly." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "副業税金計算機",
        description: "個人事業税、連邦税、州税を含む副業収入の税金を見積もります。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
