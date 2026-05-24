import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "rent-vs-buy-calculator",
  category: "personal-finance",
  meta: {
    title: "Rent vs Buy Calculator",
    description: "Compare the total cost of renting versus buying a home over any time period, factoring in mortgage, taxes, insurance, maintenance, and investment returns.",
    keywords: ["rent vs buy", "renting vs buying a home", "home affordability", "real estate decision", "buying a house", "renting calculator"],
  },
  inputs: [
    { id: "homePrice", label: "Home Price ($)", type: "currency" as const, defaultValue: 400000, min: 0 },
    { id: "downPayment", label: "Down Payment ($)", type: "currency" as const, defaultValue: 80000, min: 0 },
    { id: "interestRate", label: "Mortgage Interest Rate (%)", type: "percentage" as const, defaultValue: 6.5, min: 0, max: 20 },
    { id: "loanTermYears", label: "Loan Term (Years)", type: "number" as const, defaultValue: 30, min: 1, max: 40 },
    { id: "propertyTaxRate", label: "Property Tax Rate (%)", type: "percentage" as const, defaultValue: 1.2, min: 0, max: 5 },
    { id: "homeInsuranceMonthly", label: "Monthly Home Insurance ($)", type: "currency" as const, defaultValue: 100, min: 0 },
    { id: "maintenanceRate", label: "Annual Maintenance (%)", type: "percentage" as const, defaultValue: 1, min: 0, max: 5 },
    { id: "hoaMonthly", label: "Monthly HOA Fees ($)", type: "currency" as const, defaultValue: 200, min: 0 },
    { id: "monthlyRent", label: "Monthly Rent ($)", type: "currency" as const, defaultValue: 2000, min: 0 },
    { id: "rentInsuranceMonthly", label: "Monthly Renters Insurance ($)", type: "currency" as const, defaultValue: 15, min: 0 },
    { id: "yearsPlanned", label: "Years Planned in Home", type: "number" as const, defaultValue: 7, min: 0 },
    { id: "investmentReturn", label: "Alternative Investment Return (%)", type: "percentage" as const, defaultValue: 7, min: 0, max: 30 },
    { id: "closingCostPercent", label: "Closing Costs (%)", type: "percentage" as const, defaultValue: 3, min: 0, max: 10 },
    { id: "sellingCostPercent", label: "Selling Costs (%)", type: "percentage" as const, defaultValue: 6, min: 0, max: 10 },
  ],
  outputs: [
    { id: "totalRentCost", label: "Total Cost of Renting", type: "currency" as const, isPrimary: false },
    { id: "totalBuyCost", label: "Total Cost of Buying", type: "currency" as const, isPrimary: false },
    { id: "netEquity", label: "Net Equity (After Selling)", type: "currency" as const, isPrimary: false },
    { id: "buyAdvantage", label: "Buy Advantage (Savings)", type: "currency" as const, isPrimary: true },
    { id: "buyBetter", label: "Buying is Better?", type: "text" as const, isPrimary: false },
    { id: "monthlyBuyPayment", label: "Monthly Mortgage Payment", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "The rent vs buy decision is one of the most consequential financial choices you'll make. Buying builds equity and offers stability, but comes with significant transaction costs, maintenance responsibilities, and illiquidity. Renting offers flexibility and simplicity but provides no equity or tax benefits. The breakeven horizon  -  the time after which buying becomes cheaper than renting  -  is typically 3-7 years depending on your local market, interest rates, and home price appreciation. This calculator provides a comprehensive total-cost comparison by factoring in mortgage payments, property taxes, insurance, maintenance, HOA fees, closing costs, selling costs, and the opportunity cost of your down payment (what that money could earn if invested). The key insight: buying often wins over long time horizons (10+ years) due to equity building and inflation hedging, while renting often wins over shorter periods (under 5 years) because transaction costs swamp any equity gains. Your personal timeline, financial stability, and lifestyle preferences matter as much as the numbers. Consult [Fool.com](https://fool.com) and [NerdWallet](https://nerdwallet.com) for deeper home-buying guidance.",
    howToUse: "Enter the home price you're considering, your down payment, current mortgage interest rate, loan term, and all homeownership costs (property taxes, insurance, maintenance, HOA). On the rent side, enter monthly rent and renters insurance. Set how many years you plan to stay in the home, and the expected return if you invested the down payment instead. The calculator shows total costs for both scenarios and a buy advantage amount  -  positive means buying saves money, negative means renting is cheaper. Experiment with different time horizons to find your personal breakeven point. Check [Bankrate](https://bankrate.com) for current mortgage rates and [Investopedia](https://investopedia.com) for detailed cost breakdowns.",
    formulaExplanation: "Monthly Buy Payment = P × (r × (1+r)^n) / ((1+r)^n  -  1) where P = loan amount, r = monthly rate, n = months. Total Rent Cost = (Rent + Insurance) × 12 × Years. Total Buy Cost = Closing Costs + (Monthly Payment × 12 × Years) + Selling Costs. Net Equity = Home Price  -  Remaining Loan Balance  -  Selling Costs. Buy Advantage = Total Rent Cost  -  (Total Buy Cost  -  Net Equity). Buy Better = Buy Advantage > 0. Remaining Balance after N years = Loan × ((1+r)^n  -  (1+r)^(N×12)) / ((1+r)^n  -  1).",
    benchmarks: "Historically, buying is cheaper than renting after approximately 5-7 years in most US markets. Transaction costs (closing at 2-5% and selling at 5-6%) are the main deterrent to short-term buying. The NAR reports the median US home value appreciates 3-5% annually long-term. A $400K home with 20% down at 6.5% over 30 years has a monthly payment around $2,400 including taxes and insurance  -  comparable to renting a similar property for $2,000/month. The NYT Rent vs Buy calculator is a well-known industry benchmark. For personalized advice, consult [Fool.com](https://fool.com) or [NerdWallet](https://nerdwallet.com).",
    benchmarkData: [
      { metric: "Typical Breakeven Horizon", value: "5-7 years", source: "NYT / NAR" },
      { metric: "Average Home Appreciation", value: "3-5% annually", source: "NAR" },
      { metric: "Closing Costs", value: "2-5% of purchase price", source: "Bankrate" },
      { metric: "Selling Costs (Agent Commission)", value: "5-6% of sale price", source: "NAR" },
      { metric: "Annual Maintenance Cost", value: "1-2% of home value", source: "This Old House" },
      { metric: "Median US Rent (2BR)", value: "$1,700/month", source: "Zillow 2025" },
    ],
    relatedCalculators: ["mortgage-affordability-calculator", "investment-returns-calculator"],
    faq: [
      { question: "How long do I need to stay in a home for buying to make sense?", answer: "The typical breakeven period is 5-7 years. With 6% transaction costs (3% closing + 3% selling) and 1% annual maintenance, you need enough appreciation and principal paydown to overcome these costs. In high-cost markets like San Francisco or NYC, the breakeven can be 10+ years. In affordable markets with lower prices, it can be as short as 3 years. Always run the numbers for your specific situation." },
      { question: "What are the hidden costs of homeownership?", answer: "Beyond the mortgage payment, budget for: property taxes (0.3-2.5% of value), homeowners insurance ($800-2,000/year), maintenance (1-2% of value annually), HOA fees ($100-500+/month), utilities (often higher than rentals), trash/water/sewer, pest control, lawn care, and major repairs (roof, HVAC, plumbing). The 1% rule is a good starting point but older homes may require 2% or more annually." },
      { question: "How does the opportunity cost of my down payment factor in?", answer: "Your down payment is money that could otherwise be invested in the stock market. At 7% average annual return, $80K invested grows to $160K in 10 years. This opportunity cost is a real cost of buying  -  you're choosing home equity over market returns. The calculator accounts for this through the alternative investment return input. If you expect strong market returns, renting becomes relatively more attractive." },
      { question: "Is buying always a good investment?", answer: "No. A primary residence is first a place to live and secondarily an investment. Homes appreciate 3-5% on average but can decline (2008, 2022 corrections). After transaction costs, maintenance, taxes, and insurance, net returns often underperform stocks. The real financial benefit of buying comes from: forced savings (mortgage principal paydown), inflation hedging (fixed-rate mortgage), and tax benefits (mortgage interest deduction for itemizers)." },
      { question: "How do interest rates affect the rent vs buy decision?", answer: "Higher rates increase monthly mortgage payments, making renting relatively more attractive. A 1% rate increase adds approximately $250/month to the payment on a $400K loan, shifting the breakeven horizon by 2-3 years. At 7%+ rates, renting often wins in the short-to-medium term. At 4-5% rates, buying wins sooner. This is why rate-sensitive buyers should consider rate buydowns or adjustable-rate mortgages." },
      { question: "What about tax benefits of homeownership?", answer: "Homeowners can deduct mortgage interest on the first $750K of acquisition debt and property taxes up to $10K (SALT cap). However, since the 2018 tax reform doubled the standard deduction, only about 10% of taxpayers itemize  -  most don't benefit from these deductions. The mortgage interest deduction is more valuable in high-cost areas and for higher-income households with larger mortgages." },
      { question: "Does renting ever make more financial sense long-term?", answer: "Yes. If you invest the difference between renting and buying costs in the stock market, renting can outperform buying even over 10-15 years in high-cost markets. The rent-vs-buy decision isn't just about housing costs  -  it's about the opportunity cost of your down payment and ongoing savings. In markets where price-to-rent ratios exceed 20, renting and investing often wins. Use [NerdWallet](https://nerdwallet.com) to explore market-specific data." },
      { question: "What if I can't afford a 20% down payment?", answer: "Many conventional loans require as little as 3-5% down. FHA loans require 3.5%. However, less than 20% down means paying PMI (0.5-2% of loan amount annually) until you reach 20% equity. PMI adds to your monthly cost and should be factored into the comparison. A smaller down payment also means a larger loan and higher monthly payment, potentially making buying less attractive relative to renting." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
