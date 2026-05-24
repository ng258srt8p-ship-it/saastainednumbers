import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "youtube-ad-revenue-calculator",
  category: "side-hustle",
  meta: {
    title: "YouTube Ad Revenue Calculator",
    description: "Estimate your YouTube channel earnings based on views, RPM, and engagement metrics.",
    keywords: ["youtube revenue", "youtube ad earnings", "rpm", "cpm", "youtube monetization", "creator income"],
  },
  inputs: [
    { id: "viewsPerMonth", label: "Monthly Views", type: "number" as const, defaultValue: 50000, min: 0 },
    { id: "rpm", label: "RPM ($ per 1,000 views)", type: "currency" as const, defaultValue: 3.50, min: 0 },
  ],
  outputs: [
    { id: "monthlyRevenue", label: "Monthly Revenue", type: "currency" as const, isPrimary: true },
    { id: "annualRevenue", label: "Annual Revenue", type: "currency" as const, isPrimary: false },
    { id: "revenuePerThousandViews", label: "Revenue per 1,000 Views", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "YouTube ad revenue is the primary income source for most creators on the platform, but earnings vary dramatically by niche, audience location, and video length. RPM (Revenue Per Mille)  -  the amount you earn per 1,000 views  -  ranges from $0.50 for entertainment content to $15+ for finance and business channels. This calculator helps you estimate your YouTube earnings based on your current or projected view counts. Beyond ad revenue, successful creators diversify with sponsorships, merchandise, and affiliate marketing to multiply their income.",
    howToUse: "Enter your monthly video views and your estimated RPM (revenue per 1,000 views). If you don't know your RPM, use the benchmarks below  -  finance/tech channels average $8-15, while entertainment averages $1-3. The calculator shows your monthly and annual ad revenue.",
    formulaExplanation: "Monthly Revenue = (Monthly Views ÷ 1,000) × RPM. Annual Revenue = Monthly Revenue × 12. RPM includes all ad revenue sources (pre-roll, mid-roll, display ads) and accounts for factors like viewer location, ad blocker usage, and seasonality.",
    benchmarks: "YouTube RPM varies significantly by content category. Finance and business channels earn the highest RPM ($10-15) because advertisers pay more for high-intent audiences. Tech and education channels earn $5-10. Gaming and entertainment earn $0.50-3.00. US and UK audiences generate 5-10x more ad revenue than viewers from developing countries. Top creators supplement ad revenue with [SponsorSpot](https://sponsorspot.com) and [Patreon](https://patreon.com) to multiply their earnings 3-5x.",
    benchmarkData: [
      { metric: "Finance / Business RPM", value: "$10-15", source: "Social Blade 2025" },
      { metric: "Tech / Education RPM", value: "$5-10", source: "Social Blade 2025" },
      { metric: "Lifestyle / Vlogging RPM", value: "$2-5", source: "Social Blade 2025" },
      { metric: "Entertainment / Gaming RPM", value: "$0.50-3", source: "Social Blade 2025" },
      { metric: "US Audience Multiplier", value: "5-10x", source: "YouTube Analytics" },
      { metric: "Mid-Roll Ads Revenue Boost", value: "+20-40%", source: "YouTube Creator Academy" },
    ],
    relatedCalculators: ["etsy-profit-calculator", "freelance-rate-calculator"],
    faq: [
      { question: "What is the difference between RPM and CPM?", answer: "RPM (Revenue Per Mille) is what you earn per 1,000 views after YouTube's cut (45%). CPM (Cost Per Mille) is what advertisers pay per 1,000 ad impressions. RPM is always lower than CPM because it accounts for YouTube's revenue share and the fact that not all views include ads. Focus on optimizing RPM." },
      { question: "How many views do I need to make $1,000/month?", answer: "At the average RPM of $3.50, you need approximately 285,000 monthly views to earn $1,000/month from ads. Finance channels (RPM $12) need only 83,000 views. Entertainment channels (RPM $1.50) need 667,000 views. Niche matters enormously." },
      { question: "What factors affect YouTube RPM the most?", answer: "Audience location (US/UK viewers earn 5-10x more), video length (8+ minute videos allow mid-roll ads for 2-3x revenue), content category (finance/tech ads pay more), seasonality (Q4 holiday ads pay premium rates), and ad engagement rates." },
      { question: "How do I increase my YouTube RPM?", answer: "Create videos over 8 minutes to enable mid-roll ads. Target US and UK audiences with relevant content. Focus on high-CPM niches like finance, business, tech, and education. Improve audience retention to increase ad impressions. Upload consistently to build algorithmic trust." },
      { question: "Does YouTube pay for shorts?", answer: "Yes, through the YouTube Shorts Fund and revenue sharing, but Shorts RPM is significantly lower ($0.01-0.30) than long-form content. The Shorts revenue pool is shared across all eligible creators. Focus on long-form for substantial ad revenue." },
      { question: "How much do sponsorships pay compared to ads?", answer: "Sponsorships typically pay $20-50 per 1,000 views (vs $1-15 for ads), making them 3-10x more lucrative than ad revenue alone. A channel with 100K views/month might earn $350 from ads but $2,000-5,000 from a single sponsorship integration." },
      { question: "When does YouTube start showing ads on my videos?", answer: "YouTube starts showing ads once you join the YouTube Partner Program (1,000 subscribers + 4,000 watch hours in the past year, or 1,000 subscribers + 10M Shorts views in 90 days). You can then enable monetization on each video." },
      { question: "How do payment processing and taxes affect YouTube income?", answer: "YouTube pays net 30-60 days after the month ends. Income is taxable  -  US creators receive a 1099-MISC. Estimated 30% withholding applies to non-US creators without tax treaties. Track revenue with [TubeBuddy](https://tubebuddy.com) or [VidIQ](https://vidiq.com) for analytics." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
