import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "print-on-demand-profit-calculator",
  category: "side-hustle",
  meta: {
    title: "Print-on-Demand Profit Calculator",
    description: "Calculate your print-on-demand store profits after product costs, printing, platform fees, and shipping.",
    keywords: ["print on demand", "pod profit", "printful", "printify", "merch by amazon", "pod calculator", "print on demand margin"],
  },
  inputs: [
    { id: "itemPrice", label: "Item Selling Price ($)", type: "currency" as const, defaultValue: 25, min: 0 },
    { id: "baseProductCost", label: "Base Product Cost ($)", type: "currency" as const, defaultValue: 8, min: 0 },
    { id: "printCost", label: "Printing Cost ($)", type: "currency" as const, defaultValue: 4, min: 0 },
    { id: "platformFee", label: "Platform / Listing Fee ($)", type: "currency" as const, defaultValue: 5, min: 0 },
    { id: "shippingCost", label: "Shipping Cost ($)", type: "currency" as const, defaultValue: 3.99, min: 0 },
    { id: "unitsSoldPerMonth", label: "Units Sold per Month", type: "number" as const, defaultValue: 200, min: 0 },
  ],
  outputs: [
    { id: "monthlyRevenue", label: "Monthly Revenue", type: "currency" as const },
    { id: "monthlyCOGS", label: "Monthly COGS (Product + Print)", type: "currency" as const },
    { id: "monthlyFees", label: "Monthly Platform Fees", type: "currency" as const },
    { id: "monthlyShipping", label: "Monthly Shipping Costs", type: "currency" as const },
    { id: "monthlyProfit", label: "Monthly Profit", type: "currency" as const, isPrimary: true },
    { id: "profitMargin", label: "Profit Margin", type: "percentage" as const },
    { id: "profitPerUnit", label: "Profit per Unit", type: "currency" as const },
  ],
  content: {
    intro: "Print-on-demand (POD) is a popular ecommerce model where products are printed and shipped only after a customer places an order  -  eliminating inventory risk and upfront costs. Platforms like [Printful](https://www.printful.com), [Printify](https://printify.com), and Merch by Amazon connect designers with print providers worldwide. While POD removes inventory headaches, profit margins are typically lower than bulk manufacturing because per-unit costs are higher. This calculator helps you understand your true profit per sale after accounting for base product costs, printing, platform fees, and shipping. Successful POD sellers differentiate through unique designs, targeted niches, and multiple sales channels including [Shopify](https://shopify.pxf.io/2R5Dza) stores, [Etsy](https://etsy.com), and [Amazon](https://amazon.com).",
    howToUse: "Enter your item selling price, base product cost (the blank t-shirt, hoodie, etc.), printing cost per item, platform/listing fee (e.g., Etsy fees, Shopify app fees, or marketplace commissions), shipping cost per item, and monthly units sold. The calculator breaks down revenue, cost of goods sold, fees, shipping, and shows your profit, margin percentage, and per-unit profit.",
    formulaExplanation: "Monthly Revenue = Item Price × Units Sold. COGS = (Base Product Cost + Print Cost) × Units Sold. Platform Fees = Platform Fee × Units Sold. Shipping Cost = Shipping Cost × Units Sold. Monthly Profit = Revenue - COGS - Fees - Shipping. Profit Margin = (Profit ÷ Revenue) × 100. Profit Per Unit = Profit ÷ Units Sold.",
    benchmarks: "Print-on-demand profit margins typically range from 15-35% after all costs, compared to 40-60% for bulk-manufactured products. According to POD industry data, t-shirts (the most popular POD item) average $7-12 base cost + $3-5 printing, sold at $20-35. Hoodies average $15-25 base + $5-8 printing, sold at $40-60. The most profitable POD sellers focus on niche designs (anime, gaming, pets, hobbies) that command higher prices and lower return rates. Top POD stores on [Shopify](https://shopify.pxf.io/2R5Dza) earn $5,000-20,000/month with 15-25% margins. Using [Printful](https://www.printful.com) vs [Printify](https://printify.com) can affect margins by 10-20% depending on product type.",
    benchmarkData: [
      { metric: "Average POD Profit Margin", value: "15-35%", source: "POD Industry Report 2025" },
      { metric: "T-Shirt Typical Selling Price", value: "$20-35", source: "Printful / Printify 2025" },
      { metric: "T-Shirt Base + Print Cost", value: "$10-17", source: "Printful / Printify 2025" },
      { metric: "Hoodie Typical Selling Price", value: "$40-60", source: "Printful / Printify 2025" },
      { metric: "Top POD Stores Monthly Revenue", value: "$5,000-20,000", source: "Shopify POD Survey" },
      { metric: "Average Return Rate for POD", value: "3-8%", source: "POD Industry Benchmarks" },
    ],
    relatedCalculators: ["etsy-profit-calculator", "amazon-fba-calculator", "dropshipping-margin-calculator"],
    faq: [
      { question: "Which POD platform is most profitable?", answer: "Profitability varies by product and volume. [Printful](https://www.printful.com) offers higher quality but higher base prices. [Printify](https://printify.com) has lower base prices through multiple print providers but quality varies. Merch by Amazon has the largest built-in audience but takes higher fees and limits pricing flexibility. Many successful sellers use Printify for lower costs and Printful for premium products, comparing per-product margins before choosing." },
      { question: "How can I increase my POD profit margin?", answer: "Raise your selling price (even $2-3 improves margin significantly without losing sales), choose lower-cost print providers, optimize product selection (mugs and phone cases have higher margins than t-shirts), bundle products for higher average order value, reduce shipping costs with flat-rate options, and create designs for niche audiences that are less price-sensitive. Use [Shopify](https://shopify.pxf.io/2R5Dza) to build your own store rather than relying solely on Etsy or Amazon." },
      { question: "What are the most profitable POD products?", answer: "Products with the highest margins relative to selling price include: posters/prints (60-70% margin), mugs (50-60%), phone cases (45-55%), tote bags (40-50%), and embroidered hats (35-45%). T-shirts (20-35%) and hoodies (20-30%) are the most competitive. All-over-print (AOP) leggings and swimwear can achieve 40-50% margins but have lower sales volume. Focus on products that match your design style." },
      { question: "How does shipping affect POD profitability?", answer: "Shipping is a major cost in POD, typically $3.99-7.99 per item within the US and higher internationally. You can offer free shipping (building cost into item price), charge exact shipping, or use flat-rate shipping. Free shipping increases conversion but reduces per-item profit by $3-5. Consider raising prices by $3-4 and offering free shipping to increase sales while maintaining margin." },
      { question: "Do I need a business license for POD?", answer: "Yes, in most jurisdictions you need some form of business registration. In the US, many POD sellers start as sole proprietors (using their SSN) but should register as an LLC for liability protection. You need a sales tax permit in states where you have nexus (physical presence or economic nexus). Consult a tax professional about [QuickBooks](https://quickbooks.intuit.com) or [FreshBooks](https://freshbooks.com) for tracking income and expenses." },
      { question: "How do returns and refunds work with POD?", answer: "POD returns are handled differently than traditional retail. Most POD providers offer a satisfaction guarantee  -  they'll replace damaged or misprinted items at no cost. For buyer's remorse returns, you'll likely lose the product cost and shipping. Factor a 3-8% return rate into your pricing. Clear product photos, accurate sizing charts, and detailed descriptions minimize returns. Consider offering store credit instead of refunds." },
      { question: "What makes a POD design sell well?", answer: "Successful POD designs target specific niches rather than broad audiences. Popular niches include: pets (dog breeds, cats), hobbies (gaming, hiking, yoga), professions (nurse, teacher, engineer), humor (dad jokes, puns), and causes (mental health, LGBTQ+, environmental). Designs with clean, readable text and simple graphics outperform complex illustrations. Research trends using [Google Trends](https://trends.google.com) and [Etsy](https://etsy.com) search data." },
      { question: "How do I market my POD store effectively?", answer: "Social media marketing is the most effective channel for POD. [Pinterest](https://pinterest.com) drives significant traffic for visual products. [TikTok](https://tiktok.com) and [Instagram](https://instagram.com) are great for showcasing designs through videos and lifestyle photos. Facebook groups in your niche can generate targeted traffic. Consider running small ad tests ($5-10/day) on winning designs. Email marketing through [Mailchimp](https://mailchimp.com) helps with repeat customers." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
