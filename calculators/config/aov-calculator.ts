import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "aov-calculator",
  category: "general-business",
  isNew: true,
  meta: {
    title: "AOV Calculator (Average Order Value)",
    description: "Calculate Average Order Value (AOV) based on total revenue and number of orders to measure purchase behavior.",
    keywords: ["aov", "average order value", "average transaction value", "ecommerce metrics", "order value", "revenue per order", "purchase behavior"],
  },
  inputs: [
    { id: "totalRevenue", label: "Total Revenue ($)", type: "currency" as const, defaultValue: 50000, min: 0 },
    { id: "numberOfOrders", label: "Number of Orders", type: "number" as const, defaultValue: 1250, min: 1 },
  ],
  outputs: [
    { id: "aov", label: "Average Order Value (AOV)", type: "currency" as const, isPrimary: true },
    { id: "totalRevenue", label: "Total Revenue", type: "currency" as const, isPrimary: false },
    { id: "numberOfOrders", label: "Number of Orders", type: "number" as const, isPrimary: false },
  ],
  content: {
    intro: "Average Order Value (AOV) tracks the average dollar amount spent each time a customer places an order on your website or store. It's a core e-commerce and retail metric that directly impacts revenue without requiring more customers. Increasing AOV by just 10% can dramatically boost profitability since the incremental revenue comes without proportional acquisition costs. This calculator helps you measure current AOV and model the impact of upsells, bundles, and minimum order thresholds.",
    howToUse: "Enter your total revenue and number of orders over a given period (month, quarter, or year). The calculator shows your AOV along with the input values. Track AOV over time to measure the impact of pricing changes, product bundling, upselling strategies, and free shipping thresholds.",
    formulaExplanation: "AOV = Total Revenue ÷ Number of Orders. Example: $50,000 revenue from 1,250 orders = $40 AOV. If you increase AOV to $45 (+12.5%), revenue becomes $56,250 from the same number of orders; a $6,250 increase with no additional customer acquisition cost.",
    benchmarks: "AOV varies significantly by industry. Apparel averages $50-100, electronics $100-300, home goods $75-150, subscription boxes $25-50, B2B $500-2000+ Luxury goods can exceed $500. Use [Shopify Analytics](https://shopify.com/analytics) or [Google Analytics](https://analytics.google.com) e-commerce tracking to monitor your AOV trends.",
    benchmarkData: [
      { metric: "Apparel AOV", value: "$50-100", source: "General benchmark" },
      { metric: "Electronics AOV", value: "$100-300", source: "General benchmark" },
      { metric: "Home Goods AOV", value: "$75-150", source: "General benchmark" },
      { metric: "Subscription Box AOV", value: "$25-50", source: "Recharge" },
      { metric: "B2B AOV", value: "$500-2000+", source: "General benchmark" },
      { metric: "Luxury Goods AOV", value: "$500+", source: "Bain & Company" },
    ],
    relatedCalculators: ["ltv-calculator", "arpu-calculator", "conversion-rate-calculator", "cac-calculator"],
    faq: [
      { question: "Why is AOV an important metric for e-commerce?", answer: "AOV directly impacts revenue and profitability without requiring more customers. Higher AOV means more revenue from the same marketing spend since acquisition costs don't increase. Even a 5-10% increase in AOV can significantly improve unit economics. Combined with conversion rate optimization, AOV is one of the highest-leverage levers in e-commerce." },
      { question: "How do I increase average order value?", answer: "Proven strategies include: product bundling (save 10% when buying together), volume discounts (buy 3 for $50), free shipping thresholds ($75+ for free shipping), upsells and cross-sells (customers who bought X also bought Y), minimum order quantities, tiered pricing, and loyalty programs with spend-based rewards. Testing these strategies with A/B tests reveals what works best for your customers." },
      { question: "What is the difference between AOV and ARPU?", answer: "AOV (Average Order Value) measures the value of a single transaction. ARPU (Average Revenue Per User) measures revenue generated per customer over a period. A customer who places 4 orders at $50 AOV generates $200 ARPU. AOV is a transaction metric; ARPU is a customer metric. Both are important for understanding your business model." },
       { question: "How does AOV affect customer acquisition cost (CAC)?", answer: "Higher AOV means you can afford higher CAC and still maintain healthy unit economics. A business with $40 AOV and 40% margin can afford $16 CAC. A business with $80 AOV and 40% margin can afford $32 CAC; double the budget for acquiring customers. Improving AOV effectively increases your maximum viable CAC." },
       { question: "Can AOV be too high?", answer: "Yes; if AOV increases because customers can only afford lower-priced items elsewhere, you may be losing price-sensitive customers. Monitor conversion rate alongside AOV. If AOV goes up but conversion rate drops significantly, your pricing may be turning away potential customers. The optimal AOV balances revenue per order with order volume." },
      { question: "How often should I calculate AOV?", answer: "Monthly for most businesses, weekly for fast-growing e-commerce stores. Track AOV by channel (organic, paid, email, social) and by customer segment (new vs returning) to identify optimization opportunities. AOV typically drops during promotional periods (sales, discounts) and rises during new product launches." },
      { question: "What is the relationship between AOV and shipping strategy?", answer: "Free shipping thresholds ($75+ for free shipping) are one of the most effective AOV boosters, increasing AOV by 15-30% on average. Conversely, free shipping on all orders can lower AOV. The sweet spot is setting a free shipping threshold 20-30% above your current AOV to encourage basket building." },
      { question: "How do returns affect AOV?", answer: "Returns effectively reduce your net AOV. If your AOV is $50 but 10% of orders are returned, your net AOV is $45. Track both gross AOV (before returns) and net AOV (after returns). High return rates in categories like apparel (20-40% return rate) mean gross AOV significantly overstates actual revenue per order." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "AOV計算機（平均注文額）",
        description: "総収益と注文数に基づいて平均注文額（AOV）を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
