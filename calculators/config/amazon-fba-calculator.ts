import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "amazon-fba-calculator",
  category: "side-hustle",
  meta: {
    title: "Amazon FBA Revenue Calculator",
    description: "Calculate Amazon FBA profit margins after referral fees, fulfillment fees, storage, and advertising costs.",
    keywords: ["amazon fba", "fba profit", "amazon seller", "fba calculator", "ecommerce profit", "amazon fees"],
  },
  inputs: [
    { id: "itemPrice", label: "Item Price ($)", type: "currency" as const, defaultValue: 29.99, min: 0 },
    { id: "costOfGoods", label: "Cost of Goods ($)", type: "currency" as const, defaultValue: 8, min: 0 },
    { id: "referralFeePercent", label: "Referral Fee (%)", type: "percentage" as const, defaultValue: 15, min: 0, max: 100 },
    { id: "fbaFulfillmentFee", label: "FBA Fulfillment Fee ($)", type: "currency" as const, defaultValue: 5.50, min: 0 },
    { id: "monthlyStorageFee", label: "Monthly Storage Fee ($)", type: "currency" as const, defaultValue: 50, min: 0 },
    { id: "advertisingCostPerUnit", label: "Advertising Cost per Unit ($)", type: "currency" as const, defaultValue: 3, min: 0 },
    { id: "unitsSoldPerMonth", label: "Units Sold per Month", type: "number" as const, defaultValue: 200, min: 0 },
  ],
  outputs: [
    { id: "monthlyRevenue", label: "Monthly Revenue", type: "currency" as const, isPrimary: false },
    { id: "monthlyCostOfGoods", label: "Cost of Goods Sold", type: "currency" as const, isPrimary: false },
    { id: "monthlyTotalFees", label: "Total Amazon Fees", type: "currency" as const, isPrimary: false },
    { id: "monthlyTotalCosts", label: "Total Monthly Costs", type: "currency" as const, isPrimary: false },
    { id: "monthlyProfit", label: "Monthly Profit", type: "currency" as const, isPrimary: true },
    { id: "profitMargin", label: "Profit Margin", type: "percentage" as const, isPrimary: true },
    { id: "profitPerUnit", label: "Profit per Unit", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Amazon FBA (Fulfillment by Amazon) lets sellers store products in Amazon's warehouses and have them pick, pack, and ship to customers. While this provides massive reach and Prime eligibility, Amazon's fee structure is complex and can consume 30-50% of your revenue. Understanding your true costs  -  referral fees (8-20%), FBA fulfillment fees, storage fees, and advertising costs  -  is essential for profitable selling. This calculator breaks down every cost to show your true profit margin.",
    howToUse: "Enter your item price, cost of goods, Amazon's referral fee percentage (typically 15% for most categories), FBA fulfillment fee, monthly storage, advertising cost per unit, and monthly sales volume. The calculator shows revenue, all costs, total fees, profit, and margin.",
    formulaExplanation: "Monthly Revenue = Price × Units Sold. Referral Fees = Revenue × Referral %. Fulfillment = FBA Fee × Units. Storage = Monthly Storage Fee. Advertising = Ad Cost × Units. Total Fees = Referral + Fulfillment + Storage + Advertising. Profit = Revenue  -  Cost of Goods  -  Fees. Margin = Profit ÷ Revenue × 100.",
    benchmarks: "Successful Amazon FBA sellers target 20-40% profit margins. The average seller sees 15-25% net margins after all fees. Referral fees vary by category (8% for electronics, 15% for apparel, 20% for jewelry). FBA fulfillment fees depend on size and weight. Amazon takes approximately 25-35% of each sale in fees alone (referral + fulfillment). Use [Jungle Scout](https://junglescout.com) or [Helium 10](https://helium10.com) for product research.",
    benchmarkData: [
      { metric: "Average Amazon Referral Fee", value: "8-20%", source: "Amazon 2025" },
      { metric: "FBA Fulfillment Fee (Small)", value: "$3-5 / unit", source: "Amazon 2025" },
      { metric: "FBA Fulfillment Fee (Large)", value: "$5-8 / unit", source: "Amazon 2025" },
      { metric: "Successful FBA Margin", value: "20-40%", source: "Jungle Scout 2025" },
      { metric: "Average Seller Net Margin", value: "15-25%", source: "Jungle Scout 2025" },
      { metric: "Amazon Fee Share of Revenue", value: "25-35%", source: "Industry Average" },
    ],
    relatedCalculators: ["etsy-profit-calculator", "break-even-calculator"],
    faq: [
      { question: "What is a good profit margin for Amazon FBA?", answer: "Target 20-40% net profit margin after all costs. If your margin is below 15%, consider raising prices, reducing costs, or finding a different product. Products priced $15-50 typically have the best margins. Premium products ($50+) can have higher margins but lower volume." },
      { question: "What are all the fees Amazon charges FBA sellers?", answer: "Referral fee (8-20% of sale), FBA fulfillment fee (per-unit picking/packing/shipping), monthly storage fee ($0.56-2.40/cubic foot depending on season), long-term storage fee (items stored 365+ days), advertising costs (PPC campaigns), and return processing fees. Expect 25-35% of revenue to go to Amazon fees alone." },
      { question: "How do I find profitable products for FBA?", answer: "Use product research tools like Jungle Scout or Helium 10. Look for: price $15-50, low competition, lightweight/small size (lower FBA fees), 20-40% profit margin, and consistent monthly demand. Avoid: high return rate categories (clothing), seasonal products, and heavy/bulky items." },
      { question: "How much does Amazon advertising cost?", answer: "Amazon PPC (Pay-Per-Click) costs vary by category: $0.20-2.00 per click. Average ACOS (Advertising Cost of Sale) is 15-30%. New products may require 30-50% ACOS initially. Blended ACOS across all campaigns should be under 25% for healthy margins. Use [Helium 10](https://helium10.com) for keyword research." },
      { question: "How do returns affect FBA profitability?", answer: "Average return rate is 5-15% depending on category. When a customer returns an item, you may lose: the sale, FBA fees (not always refunded), return processing fee, and potentially the inventory (if damaged). Factor 8-10% return rate into your pricing to maintain margins." },
      { question: "What is the FBA storage fee structure?", answer: "Standard-size: $0.75-0.80/cubic foot (Jan-Sep), $2.40/cubic foot (Oct-Dec). Oversize: $0.40-0.45/cubic foot (Jan-Sep), $1.20-1.35/cubic foot (Oct-Dec). Long-term storage (365+ days): $6.90-15.15/cubic foot + monthly fees. Minimize storage costs with lean inventory and fast turnover." },
      { question: "Should I use FBA or FBM (Fulfillment by Merchant)?", answer: "FBA: higher fees, Prime eligibility, better conversion, less work. FBM: lower fees, more control, no storage costs, better for large/heavy items. Use FBA for best-selling items and FBM for oversized, low-volume, or slow-moving inventory. Many sellers use both (multi-channel fulfillment)." },
      { question: "How do I increase Amazon FBA profit margins?", answer: "Raise prices (test 5-10% increases), negotiate with suppliers for better COGS, reduce advertising ACOS, optimize product size to lower FBA fees, bundle products to increase AOV, reduce return rates with better listings, and source from lower-cost countries. Each 1% margin improvement compounds significantly at scale." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
