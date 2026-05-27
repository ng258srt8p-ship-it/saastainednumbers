import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "payment-processing-fee-calculator",
  category: "general-business",
  isNew: true,
  meta: {
    title: "Payment Processing Fee Calculator",
    description: "Calculate payment processing fees including transaction fees, chargeback costs, and effective rate for any payment processor.",
    keywords: ["payment processing", "credit card fees", "merchant fees", "transaction fees", "chargeback fees", "stripe", "paypal", "square", "payment processor comparison"],
  },
  inputs: [
    { id: "monthlyRevenue", label: "Monthly Processing Volume ($)", type: "currency" as const, defaultValue: 50000, min: 0.01 },
    { id: "averageTransactionSize", label: "Average Transaction Size ($)", type: "currency" as const, defaultValue: 75, min: 0.01 },
    { id: "processorFeePercent", label: "Processor Fee (%)", type: "percentage" as const, defaultValue: 2.9, min: 0 },
    { id: "processorFixedFee", label: "Processor Fixed Fee per Transaction ($)", type: "currency" as const, defaultValue: 0.30, min: 0 },
    { id: "chargebackRate", label: "Chargeback Rate (%)", type: "percentage" as const, defaultValue: 0.5, min: 0, max: 100 },
    { id: "chargebackFee", label: "Chargeback Fee ($)", type: "currency" as const, defaultValue: 15, min: 0 },
  ],
  outputs: [
    { id: "monthlyTransactionFees", label: "Monthly Transaction Fees", type: "currency" as const, isPrimary: false },
    { id: "monthlyChargebackFees", label: "Monthly Chargeback Fees", type: "currency" as const, isPrimary: false },
    { id: "totalMonthlyFees", label: "Total Monthly Fees", type: "currency" as const, isPrimary: true },
    { id: "effectiveRate", label: "Effective Rate", type: "percentage" as const, isPrimary: true },
    { id: "annualFees", label: "Annual Fees", type: "currency" as const, isPrimary: true },
    { id: "feesAsPercentOfRevenue", label: "Fees as % of Revenue", type: "percentage" as const, isPrimary: false },
  ],
  content: {
    intro: "Payment processing fees are one of the most significant operational costs for any business that accepts card payments. These fees include a percentage of each transaction plus a fixed fee, plus potential chargeback costs when customers dispute transactions. This calculator models the complete fee structure — percentage fees, fixed per-transaction fees, and chargeback costs — giving you a clear picture of your true cost of payment processing.",
    howToUse: "Enter your monthly processing volume, average transaction size, processor's percentage fee, fixed per-transaction fee, chargeback rate, and chargeback fee. The calculator breaks down transaction fees, chargeback costs, total monthly fees, effective rate, and annual projections. Adjust processor inputs to compare different payment providers and fee structures.",
    formulaExplanation: "Number of Transactions = Monthly Revenue ÷ Average Transaction Size. Transaction Fees = (Revenue × Fee %) + (Transactions × Fixed Fee). Chargeback Fees = Transactions × (Chargeback Rate ÷ 100) × Chargeback Fee. Total Fees = Transaction Fees + Chargeback Fees. Effective Rate = (Total Fees ÷ Revenue) × 100. Example: $50K volume, $75 avg transaction = 667 transactions. 2.9% + $0.30 = $1,450 + $200 = $1,650 in transaction fees. 0.5% chargeback rate × $15 fee = $50. Total: $1,700/month ($20,400/year, 3.4% effective rate).",
    benchmarks: "Industry average effective rates range from 2.5-4% depending on business type and volume. Low-risk businesses with high volume: 2-2.5%. Mid-risk (standard e-commerce): 2.5-3.5%. High-risk (subscription, travel, CBD): 4-7%. Chargeback rates should stay below 1% (Visa/Mastercard thresholds). Each chargeback costs $15-25 in fees plus potential lost revenue. Use [CardinalCommerce](https://cardinalcommerce.com) or [Sift](https://sift.com) for chargeback prevention tools.",
    benchmarkData: [
      { metric: "Low-Risk Business Effective Rate", value: "2-2.5%", source: "Industry Average" },
      { metric: "Standard E-commerce Effective Rate", value: "2.5-3.5%", source: "Industry Average" },
      { metric: "High-Risk Effective Rate", value: "4-7%", source: "Industry Average" },
      { metric: "Visa/MC Chargeback Threshold", value: "< 1%", source: "Card Network Rules" },
      { metric: "Average Chargeback Fee", value: "$15-25", source: "Industry Standard" },
      { metric: "Stripe Standard Rate", value: "2.9% + $0.30", source: "Stripe Pricing" },
    ],
    relatedCalculators: ["stripe-fee-calculator", "break-even-calculator", "pricing-strategy-calculator", "gross-margin-calculator"],
    faq: [
      { question: "How does average transaction size affect effective rate?", answer: "The fixed fee per transaction means smaller transactions have a higher effective rate. A $10 transaction with 2.9% + $0.30 = $0.59 fee (5.9% effective). A $100 transaction with same fees = $3.20 (3.2% effective). Encouraging larger transactions through bundling, minimum orders, or volume discounts significantly reduces your effective processing rate." },
      { question: "What is a chargeback and how much does it really cost?", answer: "A chargeback occurs when a customer disputes a transaction with their card issuer. The direct cost is the chargeback fee ($15-35), but the true cost is higher: you lose the transaction revenue, incur administrative costs fighting the dispute, and risk higher processing rates if your chargeback ratio exceeds 1%. Excessive chargebacks can result in account termination. Total cost of a single chargeback is estimated at $100-200 including lost goods and labor." },
      { question: "What is interchange plus pricing vs flat-rate pricing?", answer: "Interchange plus (IC+) pricing passes through the card network interchange rate (1.5-3.5% depending on card type) plus a small markup (0.1-0.5% + $0.10). Flat-rate pricing charges a single blended rate (e.g., 2.9% + $0.30) regardless of card type. IC+ is cheaper for high-volume businesses (saving 0.3-0.5% vs flat rate), while flat rate is simpler and better for low-volume businesses." },
      { question: "How do I reduce payment processing fees?", answer: "Negotiate lower rates based on volume ($10K+/month), optimize for higher average transaction value, use IC+ pricing for high volume, avoid keyed transactions (higher rate than swiped/dipped), settle same-day to avoid higher rates, use address verification (AVS) to reduce fraud, implement 3D Secure 2.0 to shift liability, and keep chargeback rates below 0.5% to maintain good standing with your processor." },
      { question: "What is the difference between qualified and non-qualified transactions?", answer: "Qualified transactions are standard consumer credit cards that meet all processor requirements (swiped/dipped, AVS matched). Non-qualified transactions include rewards cards, corporate cards, international cards, and keyed/manual entries — these incur 0.5-1.5% surcharges. When comparing processors, ask what percentage of your transactions will be qualified vs non-qualified, as this dramatically affects effective rate." },
      { question: "How do monthly minimum fees affect small businesses?", answer: "Many processors charge a monthly minimum fee ($10-30) if your total processing fees don't exceed that amount. For small businesses processing under $1,000/month, these minimums can double or triple your effective rate. Flat-rate processors like Stripe and Square don't charge monthly minimums, making them better for low-volume businesses. IC+ processors typically have minimums." },
      { question: "What is PCI compliance and does it cost money?", answer: "PCI DSS (Payment Card Industry Data Security Standard) compliance is mandatory for all businesses accepting card payments. Non-compliance can result in fines of $5,000-100,000/month. Most processors include basic PCI compliance tools (SAQ, scanning) for free or $10-20/month. Larger businesses require annual on-site assessments ($5,000-50,000). Using a payment processor like Stripe or Square (which handles card data directly) significantly reduces your PCI scope." },
      { question: "How does international payment processing affect fees?", answer: "International transactions add 1-3% in cross-border fees, plus currency conversion costs (1-2.5% above spot rate). A standard domestic rate of 2.9% + $0.30 becomes 4-5% + $0.30 for international. Some processors charge a flat 1% international fee; others use dynamic pricing. If you have significant international customers, compare processors on their cross-border pricing specifically." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
