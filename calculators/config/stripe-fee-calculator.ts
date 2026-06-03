import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "stripe-fee-calculator",
  category: "general-business",
  isNew: true,
  meta: {
    title: "Stripe Fee Calculator",
    description: "Calculate Stripe payment processing fees including per-transaction fees, percentage fees, and monthly/annual costs with enterprise rate logic.",
    keywords: ["stripe fees", "payment processing", "stripe calculator", "merchant fees", "transaction fees", "credit card processing", "stripe pricing"],
  },
  inputs: [
    { id: "transactionAmount", label: "Transaction Amount ($)", type: "currency" as const, defaultValue: 50, min: 0.01 },
    { id: "monthlyVolume", label: "Monthly Processing Volume ($)", type: "currency" as const, defaultValue: 10000, min: 0 },
    { id: "averageTransactionSize", label: "Average Transaction Size ($)", type: "currency" as const, defaultValue: 50, min: 0 },
    { id: "refundRate", label: "Refund Rate (%)", type: "percentage" as const, defaultValue: 5, min: 0, max: 100 },
  ],
  outputs: [
    { id: "perTransactionFee", label: "Fee per Transaction", type: "currency" as const, isPrimary: true },
    { id: "percentageFee", label: "Percentage Fee", type: "currency" as const, isPrimary: false },
    { id: "totalFee", label: "Total Fee per Transaction", type: "currency" as const, isPrimary: false },
    { id: "effectiveRate", label: "Effective Rate per Transaction", type: "percentage" as const, isPrimary: false },
    { id: "monthlyTotalFees", label: "Total Monthly Fees", type: "currency" as const, isPrimary: true },
    { id: "annualTotalFees", label: "Total Annual Fees", type: "currency" as const, isPrimary: true },
  ],
  content: {
    intro: "Stripe processes billions of dollars in payments for millions of businesses worldwide. Their standard pricing is 2.9% + $0.30 per successful card charge, but enterprise accounts processing over $80K/month qualify for reduced rates of 2.7% + $0.30. This calculator models Stripe's fee structure including refund costs, showing exactly what each transaction costs and what you'll pay monthly and annually. Understanding your payment processing costs is essential for pricing, margins, and financial planning.",
    howToUse: "Enter the individual transaction amount, your monthly processing volume, average transaction size, and typical refund rate. The calculator shows per-transaction fees, total monthly fees, and annual projections. If monthly volume exceeds $80,000, the enterprise rate (2.7% + $0.30) applies automatically. Refund rate increases total fees because Stripe does not refund the processing fee on refunded transactions.",
    formulaExplanation: "Percentage Fee = Transaction Amount × (Rate ÷ 100). Per-Transaction Fee = Percentage Fee + $0.30. Standard Rate = 2.9% + $0.30 (< $80K/month). Enterprise Rate = 2.7% + $0.30 (≥ $80K/month). Monthly Fees = (Monthly Volume × Rate) + (Number of Transactions × $0.30) × (1 + Refund Rate ÷ 100). Example: $50 transaction at standard rate = $1.45 + $0.30 = $1.75 total fee (3.5% effective rate).",
    benchmarks: "Stripe's standard rate of 2.9% + $0.30 is competitive with PayPal (2.99% + $0.49), Square (2.6% + $0.10), and Braintree (2.59% + $0.49). Enterprise rates typically start at $80K/month volume. High-risk businesses pay 3.5-5% + $0.30. Industry average effective rate is 2.5-3.5% for most online businesses. Use [Stripe](https://stripe.com/pricing) for current pricing and custom enterprise quotes.",
    benchmarkData: [
      { metric: "Standard Stripe Rate", value: "2.9% + $0.30", source: "Stripe Pricing" },
      { metric: "Enterprise Rate Threshold", value: "$80K+/month", source: "General benchmark" },
      { metric: "PayPal Rate", value: "2.99% + $0.49", source: "PayPal" },
      { metric: "Square Rate", value: "2.6% + $0.10", source: "Square" },
      { metric: "Braintree Rate", value: "2.59% + $0.49", source: "Braintree" },
      { metric: "Industry Average Effective Rate", value: "2.5-3.5%", source: "General benchmark" },
    ],
    relatedCalculators: ["break-even-calculator", "pricing-strategy-calculator", "payment-processing-fee-calculator"],
    faq: [
        { question: "Does Stripe refund the processing fee on refunded transactions?", answer: "No; Stripe does not refund the 2.9% + $0.30 fee when you issue a refund. This means refunded transactions effectively cost you the processing fee with no offsetting revenue. The refund rate input accounts for this hidden cost. High refund rates can significantly increase your effective processing costs." },
      { question: "What qualifies for Stripe's enterprise rate?", answer: "Stripe offers custom pricing for businesses processing over $80,000 per month. The standard enterprise rate is 2.7% + $0.30, but larger volumes ($500K+/month) can negotiate even lower rates down to 2.2% + $0.15. Contact Stripe sales for a custom quote based on your specific volume and business type." },
        { question: "How do international payments affect Stripe fees?", answer: "International cards and non-USD currencies add a 1% international fee on top of the standard rate. Currency conversion adds another 1-2%. A $50 international transaction could cost 3.9% + $0.30 instead of 2.9% + $0.30. This calculator uses domestic USD rates; add 1-3% for international estimates." },
      { question: "What other Stripe fees should I be aware of?", answer: "Additional fees include: $15 per monthly payout via wire transfer, $5 per failed payment dispute (win or lose), 0.5% for Instant Payouts, $2 per month for additional connected accounts, and 1% for international cards. Annual fees for Stripe Billing start at 0.5% per transaction. Review your full Stripe statement for all applicable fees." },
      { question: "How does average transaction size affect total fees?", answer: "The $0.30 fixed fee per transaction means that lower-value transactions have a higher effective rate. A $5 transaction has a 8.9% effective rate ($0.45 fee), while a $500 transaction has only 2.96% effective rate ($14.80 fee). Bundling smaller purchases or increasing average order value significantly reduces your effective processing cost." },
      { question: "Can I pass Stripe fees to customers?", answer: "Yes, but with restrictions. You can add a surcharge of up to 3% for credit card payments in most US states (check local laws). In the EU and UK, surcharging is generally prohibited. An alternative is offering a cash/discount price vs card price. Stripe's terms allow surcharging but require disclosure. This calculator helps you model the surcharge needed to fully offset processing costs." },
      { question: "What is the difference between authorized and settled amounts?", answer: "Stripe charges fees on the authorized amount at the time of payment, not the final settled amount. If you authorize $100 but only capture $95, you still paid the fee on $100. Partial captures and amount mismatches can create small discrepancies in expected vs actual fees. Most businesses see <1% variance between expected and actual fees." },
      { question: "How do subscriptions and recurring billing affect fees?", answer: "Stripe Billing charges the same 2.9% + $0.30 per recurring transaction plus an additional 0.5% on each recurring payment. For a $50 monthly subscription, the total fee is approximately $2.00 per month ($1.75 processing + $0.25 billing). Annual billing reduces per-transaction costs by processing once instead of 12 times." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "Stripe手数料計算機",
        description: "取引手数料、 percentage手数料、月間・年間コストをエンタープライズレートロジックで計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
