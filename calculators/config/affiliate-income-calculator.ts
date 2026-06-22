import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "affiliate-income-calculator",
  category: "side-hustle",
  meta: {
    title: "Affiliate Marketing Income Calculator",
    description: "Project your affiliate marketing earnings based on traffic, click-through rates, conversion rates, and commissions.",
    keywords: ["affiliate marketing", "affiliate income", "commission calculator", "passive income", "affiliate earnings"],
  },
  inputs: [
    { id: "monthlyVisitors", label: "Monthly Visitors", type: "number" as const, defaultValue: 50000, min: 0 },
    { id: "clickThroughRate", label: "Affiliate Link CTR (%)", type: "percentage" as const, defaultValue: 3, min: 0, max: 100 },
    { id: "conversionRate", label: "Conversion Rate (%)", type: "percentage" as const, defaultValue: 5, min: 0, max: 100 },
    { id: "averageCommission", label: "Average Commission per Sale ($)", type: "currency" as const, defaultValue: 25, min: 0 },
    { id: "cookieDurationDays", label: "Cookie Duration (Days)", type: "number" as const, defaultValue: 30, min: 1 },
  ],
  outputs: [
    { id: "monthlyClicks", label: "Monthly Clicks", type: "number" as const, isPrimary: false },
    { id: "monthlyConversions", label: "Monthly Conversions", type: "number" as const, isPrimary: false },
    { id: "monthlyRevenue", label: "Monthly Revenue", type: "currency" as const, isPrimary: true },
    { id: "annualRevenue", label: "Annual Revenue", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Affiliate marketing is one of the most accessible ways to generate passive income online. By promoting products you believe in and earning commissions on sales, you can build a revenue stream that grows with your audience. The key metrics are traffic volume, click-through rate (how many visitors click your affiliate links), conversion rate (how many clicks become sales), and commission per sale. This calculator helps you project your affiliate income and understand which levers to pull to grow it.",
    howToUse: "Enter your monthly visitors, expected click-through rate on affiliate links, conversion rate (clicks to sales), average commission per sale, and cookie duration. Default values reflect a growing affiliate site. The calculator shows monthly clicks, conversions, revenue, and annual projections.",
    formulaExplanation: "Monthly Clicks = Monthly Visitors × (CTR ÷ 100). Monthly Conversions = Monthly Clicks × (Conversion Rate ÷ 100). Monthly Revenue = Conversions × Average Commission. Annual Revenue = Monthly × 12. Cookie duration affects how long after a click you earn the commission  -  longer cookies = more attributed sales.",
    benchmarks: "Average affiliate CTR is 1-5%. Top performers achieve 5-10%. Conversion rates average 2-10% depending on product type (digital products convert higher than physical). Commissions range from 5-50% of product price. A site with 50K monthly visitors at 3% CTR and 5% conversion earning $25 commission generates ~$1,875/month. Top affiliate sites earn $50K-500K+/month. Use [ShareASale](https://shareasale.com) or [Impact](https://impact.com) for affiliate programs.",
    benchmarkData: [
      { metric: "Average Affiliate CTR", value: "1-5%", source: "Affiliate Industry 2025" },
      { metric: "Average Conversion Rate", value: "2-10%", source: "Affiliate Industry 2025" },
      { metric: "Digital Product Commission", value: "30-50%", source: "Affiliate Programs" },
      { metric: "Physical Product Commission", value: "5-15%", source: "Amazon Associates" },
      { metric: "SaaS Affiliate Commission", value: "20-30% recurring", source: "SaaS Industry" },
      { metric: "Top Affiliate Site Revenue", value: "$50K-500K+ / month", source: "Affiliate Industry" },
    ],
    relatedCalculators: ["blogging-income-calculator", "newsletter-revenue-calculator"],
    faq: [
      { question: "How much can you make from affiliate marketing?", answer: "Entry level (1K visitors/month): $50-500/month. Part-time (10K visitors/month): $500-5,000/month. Full-time (100K visitors/month): $5,000-50,000/month. Top earners (1M+ visitors/month): $50K-500K+/month. The key is traffic × conversion rate × commission  -  improve any of these to grow income." },
      { question: "What are the best affiliate programs for beginners?", answer: "Amazon Associates (low commissions but high conversion), ShareASale (wide variety), Impact (premium brands), and individual SaaS programs (20-30% recurring). Start with products you actually use and recommend. For digital products, [Gumroad](https://gumroad.com) has a built-in affiliate system that makes it easy to start promoting. Focus on high-converting, relevant products in your niche." },
      { question: "What is cookie duration and why does it matter?", answer: "Cookie duration is how long after a visitor clicks your affiliate link that you still earn the commission. Amazon: 24 hours. Most SaaS: 30-90 days. Some programs offer lifetime cookies. Longer cookies = more commissions because visitors may research before buying. Prioritize programs with 30+ day cookies." },
      { question: "How do I increase affiliate click-through rates?", answer: "Place links in high-intent content (product comparisons, reviews, tutorials). Use contextual in-text links. Add call-to-action buttons. Create comparison tables with affiliate links. Place links above the fold. Test link placement and anchor text. Top performers achieve 5-10% CTR vs 1-3% average." },
      { question: "What type of content converts best for affiliate marketing?", answer: "Product reviews and comparisons (highest conversion), tutorial/how-to guides (medium conversion), listicles (best X products), case studies, and problem/solution articles. Honest, detailed reviews with pros/cons consistently outperform short promotional content." },
      { question: "How does SEO affect affiliate income?", answer: "SEO is the primary traffic driver for most affiliate sites. Ranking for buyer-intent keywords (best, review, vs, vs) drives high-converting traffic. A site ranking #1 for a 'best product' keyword can earn $1K-10K+/month from that single article. Focus on creating thorough, helpful content that earns backlinks." },
      { question: "What are the best niches for affiliate marketing?", answer: "Tech/SaaS (high commissions, recurring), health/wellness (high demand), personal finance (high CPM + affiliate), outdoor/survival (high conversion), and software reviews (very high commissions). The best niche combines: strong affiliate programs, buyer-intent content opportunities, and your personal expertise/interest." },
      { question: "How do I disclose affiliate links legally?", answer: "FTC requires clear disclosure. Add a disclaimer at the top of each affiliate page (something like: 'This post contains affiliate links. I may earn a commission at no extra cost to you.'). Some countries require even more prominent disclosure. Non-compliance can result in fines. Always be transparent with your audience." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "アフィリエイト収入計算機",
        description: "トラフィック、クリック率、コンバージョン率、手数料に基づいてアフィリエイトマーケティング収入を予測します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
