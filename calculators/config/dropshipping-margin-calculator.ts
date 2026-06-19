import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "dropshipping-margin-calculator",
  category: "side-hustle",
  meta: {
    title: "Dropshipping Margin Calculator",
    description: "Calculate your dropshipping profit margins after product costs, shipping, platform fees, ad spend, and returns.",
    keywords: ["dropshipping margin", "dropshipping profit", "aliexpress dropshipping", "spocket", "dropship calculator", "ecommerce profit", "dropshipping fees"],
  },
  inputs: [
    { id: "productPrice", label: "Product Selling Price ($)", type: "currency" as const, defaultValue: 49.99, min: 0 },
    { id: "supplierCost", label: "Supplier Cost ($)", type: "currency" as const, defaultValue: 20, min: 0 },
    { id: "shippingCost", label: "Shipping Cost ($)", type: "currency" as const, defaultValue: 5, min: 0 },
    { id: "platformFeePercent", label: "Platform / Marketplace Fee (%)", type: "percentage" as const, defaultValue: 15, min: 0, max: 100 },
    { id: "advertisingCostPerUnit", label: "Ad Cost per Unit ($)", type: "currency" as const, defaultValue: 10, min: 0 },
    { id: "unitsSoldPerMonth", label: "Units Sold per Month", type: "number" as const, defaultValue: 100, min: 0 },
    { id: "returnRate", label: "Return Rate (%)", type: "percentage" as const, defaultValue: 3, min: 0, max: 100 },
  ],
  outputs: [
    { id: "monthlyRevenue", label: "Monthly Revenue", type: "currency" as const },
    { id: "monthlyCOGS", label: "COGS (Supplier Cost)", type: "currency" as const },
    { id: "monthlyShipping", label: "Shipping Costs", type: "currency" as const },
    { id: "monthlyPlatformFees", label: "Platform / Marketplace Fees", type: "currency" as const },
    { id: "monthlyAdCost", label: "Advertising Costs", type: "currency" as const },
    { id: "monthlyReturnCost", label: "Return Costs", type: "currency" as const },
    { id: "monthlyTotalCosts", label: "Total Monthly Costs", type: "currency" as const },
    { id: "monthlyProfit", label: "Monthly Profit", type: "currency" as const, isPrimary: true },
    { id: "profitMargin", label: "Profit Margin", type: "percentage" as const },
    { id: "profitPerUnit", label: "Profit per Unit", type: "currency" as const },
  ],
  content: {
    intro: "Dropshipping is an ecommerce model where you sell products without holding inventory  -  the supplier ships directly to your customer. While it offers low startup costs and no inventory risk, profit margins are thin once you account for supplier costs, shipping, platform/marketplace fees, advertising, and product returns. Successful dropshipping requires finding winning products with high perceived value, keeping customer acquisition costs (CAC) low, and managing supplier relationships through platforms like [Spocket](https://www.spocket.co), [AliExpress](https://www.aliexpress.com), or [Modalyst](https://www.modalyst.co). This calculator gives you a complete picture of your per-sale and monthly profitability across all cost categories.",
    howToUse: "Enter your product selling price, supplier cost, shipping cost, platform/marketplace fee percentage (e.g., Amazon referral fee 15%, Shopify transaction fee 2.9%), average ad cost per unit sold, monthly units sold, and expected return rate. The calculator breaks down every cost category  -  COGS, shipping, platform fees, ad spend, and return costs  -  then shows your net profit, margin percentage, and per-unit profit.",
    formulaExplanation: "Monthly Revenue = Product Price × Units Sold. COGS = Supplier Cost × Units Sold. Shipping = Shipping Cost × Units Sold. Platform Fees = Revenue × (Platform Fee % ÷ 100). Ad Cost = Ad Cost Per Unit × Units Sold. Return Cost = (Units Sold × Return Rate ÷ 100) × Product Price. Total Costs = COGS + Shipping + Fees + Ad Cost + Return Cost. Profit = Revenue - Total Costs. Profit Margin = (Profit ÷ Revenue) × 100. Profit Per Unit = Profit ÷ Units Sold.",
    benchmarks: "Dropshipping profit margins typically range from 10-25% after all costs, significantly lower than traditional ecommerce (40-60%) due to higher supplier costs and advertising expenses. According to industry data, the average dropshipper earns $1,000-3,000/month with a 15-20% margin. Top performers who find winning products and optimize ad campaigns earn $10,000-50,000/month with 20-30% margins. Customer acquisition cost (ad spend) is typically 10-30% of product price. Return rates average 2-5% for general products but reach 15-25% for clothing and shoes. Using platforms like Oberlo (now Spocket) has made dropshipping more accessible but also more competitive.",
    benchmarkData: [
      { metric: "Average Dropshipping Profit Margin", value: "15-25%", source: "Dropshipping Industry Report 2025" },
      { metric: "Average Monthly Dropshipper Earnings", value: "$1,000-3,000", source: "Shopify Dropshipping Survey" },
      { metric: "Top Performer Monthly Revenue", value: "$10,000-50,000", source: "Ecommerce Benchmark 2025" },
      { metric: "Customer Acquisition Cost (Ad Spend)", value: "10-30% of price", source: "Dropshipping Industry Report" },
      { metric: "Average Return Rate (General)", value: "2-5%", source: "Shopify Returns Data 2025" },
      { metric: "Return Rate (Clothing / Shoes)", value: "15-25%", source: "Shopify Returns Data 2025" },
    ],
    relatedCalculators: ["print-on-demand-profit-calculator", "etsy-profit-calculator", "amazon-fba-calculator"],
    faq: [
      { question: "Is dropshipping still profitable in 2025?", answer: "Yes, but it's more competitive than ever. Profitability depends on finding untapped product niches, optimizing ad campaigns, and managing costs tightly. The days of easy money with generic AliExpress products are over. Successful 2025 dropshippers focus on high-quality suppliers via [Spocket](https://www.spocket.co), branded stores with custom packaging (fulfillment partnerships), and targeting specific audiences with compelling ad creatives. Margins of 15-25% are realistic for well-run stores." },
      { question: "What is a good profit margin for dropshipping?", answer: "A healthy dropshipping profit margin is 20-30% minimum. However, most dropshippers achieve 10-20%. To reach 30%+, you need either high-ticket products ($100+), low supplier costs (under 30% of selling price), or efficient ad campaigns (CAC under 15% of price). Products with perceived value significantly higher than cost work best  -  think home gym equipment, specialty electronics, or niche hobby gear." },
      { question: "How do platform fees affect dropshipping profit?", answer: "Platform fees vary widely: Shopify charges 2.9% + $0.30 per transaction plus monthly subscription ($39-399). [Amazon](https://amazon.com) referral fees range from 8-20% depending on category. [eBay](https://ebay.com) charges 13.25% on total sale. WooCommerce (WordPress) has no monthly fee but adds payment processing (2.9% + $0.30). These fees can consume 10-30% of your revenue before ad spend, so choose your platform carefully." },
      { question: "How do I find winning dropshipping products?", answer: "Winning products solve a specific problem, have high perceived value relative to cost, are not easily found in local stores, and have strong visual appeal. Use [Google Trends](https://trends.google.com) to identify rising trends, [AliExpress](https://www.aliexpress.com) for product research (sort by orders), and [Facebook Ad Library](https://www.facebook.com/ads/library) to see what competitors are advertising. Products with 2-5x markup potential and low return rates are ideal." },
      { question: "What is the biggest cost in dropshipping?", answer: "For most dropshippers, advertising (Facebook Ads, TikTok Ads, Google Ads) is the single largest cost  -  often 25-40% of revenue. Many beginners fail because their CAC is too high relative to profit per sale. If you spend $15 per sale on ads but only make $10 profit, you're losing money. Focus on organic content through [TikTok](https://tiktok.com) and [Instagram](https://instagram.com) reels before scaling paid ads." },
      { question: "How do I handle returns and chargebacks in dropshipping?", answer: "Have a clear return policy that aligns with your supplier's policy. Most AliExpress suppliers accept returns within 30 days but don't cover return shipping. Factor 2-5% of revenue for returns. For chargebacks (customer disputes with their credit card), implement clear product descriptions, accurate photos, and tracking numbers. High chargeback rates (over 1%) can get your payment processor shut down. Use Shopify fraud analysis tools." },
      { question: "How long does it take to become profitable dropshipping?", answer: "Most successful dropshippers become profitable within 2-6 months. The first 1-2 months are typically spent testing products and ad creatives at a loss (break-even or slight loss). Once a winning product is found and ad campaigns are optimized, profitability follows. Expect to invest $500-2,000 in initial product testing. Stores that survive past 6 months have a 70%+ chance of long-term success." },
      { question: "Do I need to register as a business for dropshipping?", answer: "Yes. In the US, you should register as a sole proprietor or LLC depending on your risk tolerance. An LLC ($50-500 to file) protects personal assets from lawsuits. You'll need a business bank account, sales tax registration in states where you have economic nexus, and you'll pay self-employment tax (15.3%) plus income tax on profits. Use [QuickBooks](https://quickbooks.intuit.com) or [Wave](https://waveapps.com) to track expenses and taxes." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "ドロップシッピング利益率計算機",
        description: "商品原価、配送料、プラットフォーム手数料、広告費、返品を考慮したドロップシッピングの利益率を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
