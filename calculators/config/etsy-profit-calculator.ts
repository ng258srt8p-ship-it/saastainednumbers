import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "etsy-profit-calculator",
  category: "side-hustle",
  meta: {
    title: "Etsy Profit Margin Calculator",
    description: "Calculate your Etsy store profit margins after fees, materials, shipping, and other costs.",
    keywords: ["etsy profit", "etsy fees", "etsy pricing", "etsy seller", "etsy margin", "handmade business", "etsy calculator"],
  },
  inputs: [
    { id: "itemPrice", label: "Item Price ($)", type: "currency" as const, defaultValue: 25, min: 0 },
    { id: "costOfGoods", label: "Cost of Goods ($)", type: "currency" as const, defaultValue: 8, min: 0 },
    { id: "shippingCost", label: "Shipping Cost ($)", type: "currency" as const, defaultValue: 5, min: 0 },
    { id: "listingFee", label: "Listing Fee ($)", type: "currency" as const, defaultValue: 0.20, min: 0 },
    { id: "transactionFeePercent", label: "Transaction Fee (%)", type: "percentage" as const, defaultValue: 6.5, min: 0, max: 100 },
    { id: "paymentFeePercent", label: "Payment Processing Fee (%)", type: "percentage" as const, defaultValue: 3, min: 0, max: 100 },
    { id: "paymentFixedFee", label: "Payment Fixed Fee ($)", type: "currency" as const, defaultValue: 0.25, min: 0 },
    { id: "quantitySold", label: "Quantity Sold", type: "number" as const, defaultValue: 100, min: 1 },
  ],
  outputs: [
    { id: "revenue", label: "Total Revenue", type: "currency" as const, isPrimary: false },
    { id: "totalCostOfGoods", label: "Cost of Goods Sold", type: "currency" as const, isPrimary: false },
    { id: "totalShipping", label: "Total Shipping Costs", type: "currency" as const, isPrimary: false },
    { id: "totalFees", label: "Total Etsy Fees", type: "currency" as const, isPrimary: false },
    { id: "totalCosts", label: "Total Costs", type: "currency" as const, isPrimary: false },
    { id: "profit", label: "Total Profit", type: "currency" as const, isPrimary: true },
    { id: "profitMargin", label: "Profit Margin", type: "percentage" as const, isPrimary: true },
    { id: "profitPerItem", label: "Profit per Item", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Etsy is a popular platform for selling handmade goods, vintage items, and craft supplies, but many sellers underestimate the impact of Etsy's fee structure on their profit margins. Between listing fees, transaction fees, payment processing fees, shipping costs, and materials, your take-home profit can be 40-60% less than your listed price. This calculator breaks down every cost so you can price your items profitably. Understanding your true profit margin is the difference between a sustainable business and one that loses money on every sale.",
    howToUse: "Enter your item price, cost of materials, shipping cost, Etsy listing fee, transaction fee percentage (Etsy takes 6.5%), payment processing fee, and quantity sold. Etsy's current fees: $0.20/listing, 6.5% transaction fee, 3% + $0.25 payment processing. Adjust defaults if fees change. The calculator shows revenue, all costs, net profit, and margin.",
    formulaExplanation: "Revenue = Price × Quantity. Total Fees = (Listing Fee × Qty) + (Revenue × Transaction Fee %) + (Revenue × Payment Fee % + Payment Fixed Fee × Qty). Total Costs = Cost of Goods + Shipping + Fees. Profit = Revenue  -  Total Costs. Margin = (Profit ÷ Revenue) × 100. Example: 100 items at $25: Revenue = $2,500. Fees = $20 + $162.50 + $75 + $25 = $282.50. Profit = $2,500  -  $800  -  $500  -  $282.50 = $917.50. Margin = 36.7%.",
    benchmarkData: [
      { metric: "Etsy Listing Fee", value: "$0.20 per item", source: "Etsy 2025" },
      { metric: "Etsy Transaction Fee", value: "6.5%", source: "Etsy 2025" },
      { metric: "Payment Processing Fee", value: "3% + $0.25", source: "Etsy 2025" },
      { metric: "Top Etsy Sellers Margin", value: "40-60%", source: "Etsy Seller Survey 2025" },
      { metric: "Average Etsy Seller Margin", value: "25-40%", source: "Etsy Seller Survey 2025" },
      { metric: "Offsite Ads Fee (Opted In)", value: "12-15% on attributed sales", source: "Etsy 2025" },
    ],
    relatedCalculators: ["youtube-ad-revenue-calculator", "break-even-calculator"],
    faq: [
      { question: "What are all the fees Etsy charges?", answer: "Etsy charges: $0.20 per listing (4 months active), 6.5% transaction fee on the total sale price (item + shipping), payment processing fee of 3% + $0.25 (US), and 12-15% offsite ads fee if opted in (only on sales attributed to Etsy ads). Etsy also has optional promoted listings and pattern subscription fees." },
      { question: "How much profit should I make per item on Etsy?", answer: "Aim for 40-60% profit margin per item. If your item sells for $25, your costs (materials + shipping + fees) should be under $15. Items with margin under 25% are generally not worth selling due to the time investment in making, photographing, listing, and shipping each item." },
      { question: "How do I increase my Etsy profit margin?", answer: "Raise prices (even $1-2 helps), buy materials in bulk for discounts, reduce shipping costs with flat-rate boxes or regional carriers, batch production for efficiency, increase item price to cover shipping with free shipping, and optimize product photography to reduce return rates. Scale to your own website to reduce marketplace fees and capture higher margins." },
      { question: "What is the offsite ads fee and should I opt in?", answer: "Etsy offsite ads promotes your products on Google, Instagram, and Pinterest. If a sale is attributed to the ad, Etsy charges 12-15% additional fee. Opting in is mandatory for stores earning over $10K/year. For smaller stores, evaluate if the additional exposure justifies the fee." },
      { question: "How does free shipping affect my profit?", answer: "Etsy rewards free shipping listings with better search placement, but you must build shipping costs into your item price. If shipping costs $5, increase your item price from $25 to $30. This also increases your transaction fee (6.5% of $5 more = +$0.33), so factor that in." },
      { question: "What are the most profitable Etsy categories?", answer: "Digital products (printables, templates, SVGs) have near-zero material costs and 80-95% margins. Jewelry and accessories average 50-70%. Home decor 40-60%. Clothing 30-50%. Personalized items 40-55%. Digital products require the least ongoing work for the highest margin." },
      { question: "How do returns and refunds affect profitability?", answer: "Factor a 2-5% return rate into your pricing. Returns cost you: lost sale, shipping both ways, and potentially restocking time. Include a clear return policy and detailed product photos to minimize returns. Consider offering store credit instead of cash refunds to retain revenue." },
      { question: "How does Etsy shipping work for profit calculations?", answer: "You can charge exact shipping, offer free shipping (building cost into price), or use calculated shipping (Etsy estimates based on buyer location). Calculated shipping is most accurate but can surprise buyers. Free shipping boosts conversion but requires careful pricing. Use [Pirate Ship](https://pirateship.com) for discounted labels." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "Etsy利益率計算機",
        description: "手数料、材料費、配送料、その他費用を差し引いたEtsyストアの利益率を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
