import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "pricing-strategy-calculator",
  category: "general-business",
  meta: {
    title: "Pricing Strategy Calculator",
    description: "Compare cost-plus, competitor-based, and value-based pricing strategies for your product or service.",
    keywords: ["pricing strategy", "cost plus pricing", "value based pricing", "competitive pricing", "product pricing", "margin calculator"],
  },
  inputs: [
    { id: "costPerUnit", label: "Cost per Unit ($)", type: "currency" as const, defaultValue: 20, min: 0 },
    { id: "desiredMarginPercent", label: "Desired Margin (%)", type: "percentage" as const, defaultValue: 60, min: 0, max: 99 },
    { id: "competitorPrice", label: "Competitor Price ($)", type: "currency" as const, defaultValue: 75, min: 0 },
    { id: "customerPerceivedValue", label: "Customer Perceived Value ($)", type: "currency" as const, defaultValue: 100, min: 0 },
  ],
  outputs: [
    { id: "costPlusPrice", label: "Cost-Plus Price", type: "currency" as const, isPrimary: false },
    { id: "targetMarginPrice", label: "Target Margin Price", type: "currency" as const, isPrimary: false },
    { id: "competitivePricePosition", label: "Competitive Position", type: "text" as const, isPrimary: false },
    { id: "valueBasedPrice", label: "Value-Based Price", type: "currency" as const, isPrimary: false },
    { id: "recommendedPrice", label: "Recommended Price", type: "currency" as const, isPrimary: true },
    { id: "recommendedMargin", label: "Recommended Margin", type: "percentage" as const, isPrimary: true },
  ],
  content: {
    intro: "Pricing is the most leveraged lever in business  -  a 1% price increase can yield 10-15% profit improvement. But finding the right price requires balancing three perspectives: your costs (can't price below cost), the market (competitor pricing sets expectations), and your customer's perceived value (what they're willing to pay). This calculator compares all three approaches and recommends an optimal price based on your inputs.",
    howToUse: "Enter your cost per unit, desired profit margin, competitor's price for a comparable product, and the value your customer places on your solution. The calculator shows prices from three strategies and a recommended price based on maximum sustainable value.",
    formulaExplanation: "Cost-Plus = Cost × (1 + Desired Markup). Target Margin = Cost ÷ (1  -  Desired Margin %). Competitive Position compares target margin price to competitor price. Value-Based = (Competitor Price + Customer Value) ÷ 2. Recommended = min(Value-Based, Customer Value) capped at target margin price.",
    benchmarks: "SaaS gross margins target 70-85%. Physical products target 40-60%. Premium brands use value-based pricing (charging what the market will bear). Commodity products use cost-plus. Most successful companies use a hybrid: cost-plus as floor, value-based as ceiling, and competitive to calibrate. A price that's too low signals low quality; too high prices out the market. Test prices and measure conversion.",
    benchmarkData: [
      { metric: "SaaS Gross Margin Target", value: "70-85%", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Physical Product Margin Target", value: "40-60%", source: "Industry Average" },
      { metric: "Premium Brand Markup vs Cost", value: "3-10x", source: "Luxury Goods" },
      { metric: "Optimal Price Testing Range", value: "3-5 price points", source: "Pricing Psychology" },
      { metric: "Revenue Impact of 1% Price Increase", value: "10-15% profit lift", source: "McKinsey" },
      { metric: "Charm Pricing Effect ($0.99 endings)", value: "+15-25% conversion", source: "Consumer Research" },
    ],
    relatedCalculators: ["break-even-calculator", "employee-cost-calculator"],
    faq: [
      { question: "What pricing strategy is best for a new product?", answer: "Start with value-based pricing. Research what customers currently pay for alternatives and what your solution saves them. Set price at 50-70% of the value you deliver. If you can't determine value, use competitor-matching with a slight discount (10-20%) as an introductory strategy, then raise prices as you prove value." },
      { question: "How do I determine customer perceived value?", answer: "Survey customers: How much does this solution save them? What have they tried? What's their budget? Compare to alternatives (do-it-yourself cost, competitor pricing). Value = cost savings + time savings + revenue increase + peace of mind. The customer's next best alternative sets the floor for perceived value." },
      { question: "What is the difference between cost-plus and value-based pricing?", answer: "Cost-plus looks inward (cost + markup). Value-based looks outward (what the customer is willing to pay). Cost-plus guarantees you don't lose money on each sale but leaves money on the table. Value-based captures more of the value you create. A $20 product delivering $200 of value should be priced closer to $100 than $30." },
      { question: "How do I test pricing without losing revenue?", answer: "A/B test on new visitors only (keep existing customers at current price). Test in different geographies. Use decoy pricing (3 options where middle is target). Run limited-time offers at different prices. Survey customers at different price points. Always grandfather existing customers when raising prices." },
      { question: "What is price anchoring and how does it work?", answer: "Anchoring means presenting a higher-priced option first to make your target price seem reasonable. Show $149/month (premium), $99/month (recommended), $49/month (basic). The $99 option looks affordable compared to $149. Always present multiple tiers  -  single-price offerings underperform tiered pricing by 20-40%." },
      { question: "How does pricing affect brand perception?", answer: "Price signals quality. Too low = perceived low quality. Too high = inaccessible. The golden zone is 20-30% above the market average for a premium positioning. Luxury brands use prices as a quality signal  -  lowering price can reduce perceived value and actually decrease sales." },
      { question: "What is price elasticity and how do I measure it?", answer: "Price elasticity = % change in demand ÷ % change in price. Elastic products (>1): demand changes significantly with price (commodities, discretionary). Inelastic products (<1): demand stays stable with price changes (necessities, unique products). SaaS typically has low elasticity (0.3-0.7), meaning you can raise prices without losing many customers." },
      { question: "How do discounting and promotions affect pricing strategy?", answer: "Frequent discounts train customers to wait for sales, eroding your regular price. Never discount more than 20% off your regular price  -  deeper discounts signal desperation and devalue your product. Instead of discounts, offer bundles, annual prepay discounts, or added value (bonus features, extended support) to preserve price integrity." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
