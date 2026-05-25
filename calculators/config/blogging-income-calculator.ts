import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "blogging-income-calculator",
  category: "side-hustle",
  meta: {
    title: "Blogging Income Potential Calculator",
    description: "Estimate your blog's revenue potential from ads, affiliates, sponsorships, and digital products.",
    keywords: ["blogging income", "blog revenue", "monetize blog", "ad revenue", "blogger income", "website monetization"],
  },
  inputs: [
    { id: "monthlyPageviews", label: "Monthly Pageviews", type: "number" as const, defaultValue: 50000, min: 0 },
    { id: "adRpm", label: "Ad RPM ($ per 1,000 pageviews)", type: "currency" as const, defaultValue: 12, min: 0 },
    { id: "affiliateRevenuePerMonth", label: "Monthly Affiliate Revenue ($)", type: "currency" as const, defaultValue: 500, min: 0 },
    { id: "sponsoredPostRevenuePerMonth", label: "Monthly Sponsored Post Revenue ($)", type: "currency" as const, defaultValue: 1000, min: 0 },
    { id: "digitalProductRevenue", label: "Monthly Digital Product Revenue ($)", type: "currency" as const, defaultValue: 300, min: 0 },
  ],
  outputs: [
    { id: "monthlyAdRevenue", label: "Monthly Ad Revenue", type: "currency" as const, isPrimary: false },
    { id: "monthlyAffiliateRevenue", label: "Monthly Affiliate Revenue", type: "currency" as const, isPrimary: false },
    { id: "monthlySponsoredRevenue", label: "Monthly Sponsored Revenue", type: "currency" as const, isPrimary: false },
    { id: "monthlyDigitalProductRevenue", label: "Monthly Digital Product Revenue", type: "currency" as const, isPrimary: false },
    { id: "monthlyTotalRevenue", label: "Monthly Total Revenue", type: "currency" as const, isPrimary: true },
    { id: "annualRevenue", label: "Annual Revenue", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Blogging has evolved from a hobby into a serious business model. Successful blogs diversify revenue across four main streams: display ads, affiliate marketing, sponsored content, and digital products. Each stream scales differently  -  ads scale with traffic, affiliates scale with content quality, sponsorships scale with authority, and digital products scale with your audience's trust. This calculator helps you project your blog's income potential and identify which revenue streams to prioritize.",
    howToUse: "Enter your monthly pageviews, ad RPM, affiliate revenue, sponsored post revenue, and digital product income. The calculator shows a breakdown of each revenue stream and monthly/annual totals. Use the benchmarks below to estimate realistic RPM rates for your niche.",
    formulaExplanation: "Monthly Ad Revenue = (Pageviews ÷ 1,000) × RPM. Total Monthly = Ad Revenue + Affiliate + Sponsorships + Digital Products. Annual = Total × 12. RPM varies by niche: tech ($15-25), finance ($20-30), lifestyle ($5-15), entertainment ($3-8).",
    benchmarks: "Display ad RPM ranges from $3-30 depending on niche and traffic quality. Affiliate income typically equals 1-3x ad revenue for established blogs. Sponsorships pay $50-500 per 1,000 pageviews for a single post. Digital products (courses, templates, eBooks) have 80-95% margins and represent the highest-leverage revenue stream. Top blogs earn $50K-500K+/month through all four streams combined.",
    benchmarkData: [
      { metric: "Tech/SaaS Blog RPM", value: "$15-25", source: "Industry Average" },
      { metric: "Finance Blog RPM", value: "$20-30", source: "Industry Average" },
      { metric: "Lifestyle Blog RPM", value: "$5-15", source: "Industry Average" },
      { metric: "Affiliate Revenue Ratio", value: "1-3x ad revenue", source: "Industry Average" },
      { metric: "Sponsorship Rate per 1K Views", value: "$50-500", source: "Industry Average" },
      { metric: "Digital Product Margin", value: "80-95%", source: "Industry Average" },
    ],
    relatedCalculators: ["affiliate-income-calculator", "youtube-ad-revenue-calculator"],
    faq: [
      { question: "How many pageviews do I need to make money blogging?", answer: "At $12 RPM: 10K pageviews/month = $120 from ads alone. Add affiliates and digital products, and meaningful income ($1K+/month) starts around 20-50K pageviews. Full-time income ($5K+/month) requires 100-200K pageviews with diversified revenue. Focus on quality content that drives organic traffic." },
      { question: "What is RPM and how do I increase it?", answer: "RPM (Revenue Per Mille) = earnings per 1,000 pageviews. Increase RPM by: targeting high-CPM niches (finance, tech), maximizing ad viewability, using premium ad networks (Mediavine at 50K sessions, Raptive at 100K), optimizing ad placement, and reducing ad blocker usage with polite messages." },
      { question: "Which ad network is best for bloggers?", answer: "Google AdSense (any traffic level, low RPM), Mediavine (50K+ monthly sessions, $10-25 RPM), Raptive/AdThrive (100K+ sessions, $15-30 RPM), and Monumetric (10K+ sessions, $8-15 RPM). Mediavine is the most popular for growing blogs. Ezoic is an alternative for any traffic level with dynamic ad testing." },
      { question: "What blog niches are most profitable?", answer: "Personal finance/investing ($20-30 RPM, high affiliate commissions), tech/SaaS ($15-25 RPM, strong SaaS affiliate programs), health/wellness ($10-20 RPM), digital marketing ($15-25 RPM), and outdoor/gear ($10-20 RPM). The best niche combines high RPM and strong affiliate programs relevant to your expertise." },
      { question: "How do I get sponsored posts?", answer: "Reach 10K+ monthly pageviews minimum. Create a media kit with traffic stats, audience demographics, and social proof. Pitch brands in your niche with specific content ideas. Join influencer marketing platforms. Build relationships with PR contacts. Most bloggers start getting inbound sponsorship requests around 50K+ pageviews." },
      { question: "What digital products should bloggers create?", answer: "Start with: eBooks or guides ($10-30), templates/worksheets ($5-20), online courses ($50-500), or membership communities ($10-50/month). Digital products have 80-95% margins and generate passive income. Create products that solve a specific problem your audience already asks about. Sell and deliver digital products easily with [Gumroad](https://gumroad.com)." },
      { question: "How long does it take to build a profitable blog?", answer: "Expect 6-12 months to reach 10K monthly pageviews with consistent publishing (2-3x/week). 18-24 months to reach 50K pageviews. 2-3 years for full-time income. SEO takes time  -  search engines need to discover, index, and rank your content. Consistency and quality compound over time." },
      { question: "What expenses should bloggers budget for?", answer: "Hosting ($10-50/month), domain ($15/year), email marketing ($0-50/month), design tools ($0-30/month), SEO tools ($30-100/month), ad network fees (varies), and freelance help if outsourcing. Most bloggers operate at 10-30% expense ratio. Track all expenses carefully for tax deductions." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
