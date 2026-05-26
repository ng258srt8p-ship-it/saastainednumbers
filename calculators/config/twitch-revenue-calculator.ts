import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "twitch-revenue-calculator",
  category: "side-hustle",
  meta: {
    title: "Twitch Revenue Calculator",
    description: "Estimate your Twitch streaming income from subscriptions, ads, and Bits donations.",
    keywords: ["twitch revenue", "twitch income", "streamer earnings", "twitch subs", "bits", "affiliate", "partner"],
  },
  inputs: [
    { id: "avgViewers", label: "Average Viewers", type: "number" as const, defaultValue: 50, min: 0 },
    { id: "streamHoursPerMonth", label: "Stream Hours / Month", type: "number" as const, defaultValue: 80, min: 0 },
    { id: "subCount", label: "Active Subscribers", type: "number" as const, defaultValue: 100, min: 0 },
    { id: "subPrice", label: "Subscription Price ($)", type: "currency" as const, defaultValue: 4.99, min: 0 },
    { id: "adRevenuePerHour", label: "Ad Revenue per Stream Hour ($)", type: "currency" as const, defaultValue: 2.50, min: 0 },
    { id: "bitsRevenuePerMonth", label: "Bits / Cheering Revenue ($/mo)", type: "currency" as const, defaultValue: 100, min: 0 },
  ],
  outputs: [
    { id: "monthlySubRevenue", label: "Monthly Subscription Revenue", type: "currency" as const },
    { id: "monthlyAdRevenue", label: "Monthly Ad Revenue", type: "currency" as const },
    { id: "monthlyBitsRevenue", label: "Monthly Bits Revenue", type: "currency" as const },
    { id: "monthlyTotal", label: "Monthly Total Revenue", type: "currency" as const, isPrimary: true },
    { id: "annualRevenue", label: "Annual Revenue", type: "currency" as const },
    { id: "revenuePerStreamHour", label: "Revenue per Stream Hour", type: "currency" as const },
  ],
  content: {
    intro: "Twitch offers streamers multiple revenue streams: subscriptions (Tier 1/2/3), ad revenue from pre-roll and mid-roll ads, and Bits (chat donations/cheering). The standard revenue split is 50/50 for affiliates and 70/30 for partners, though top creators negotiate better terms. This calculator estimates your total monthly and annual Twitch income based on your viewer count, stream schedule, subscriber base, and engagement. Beyond direct Twitch revenue, successful streamers diversify with [Patreon](https://patreon.com) memberships, sponsorships from [SponsorSpot](https://sponsorspot.com), merchandise via [Printful](https://www.printful.com), and affiliate marketing. According to StreamElements and Streamlabs reports, the top 1% of streamers earn over $10K/month, while the median affiliate earns $100-500/month.",
    howToUse: "Enter your average concurrent viewers, monthly streaming hours, active subscriber count, subscription price (default $4.99 for Tier 1), estimated ad revenue per stream hour, and monthly Bits/Bits revenue. The calculator breaks down each revenue stream and shows your total monthly income, annual projection, and revenue per stream hour. Adjust the sub price if you have a mix of Tier 1/2/3 subs.",
    formulaExplanation: "Monthly Subscription Revenue = Active Subscribers × Subscription Price. Monthly Ad Revenue = Stream Hours Per Month × Ad Revenue Per Hour. Monthly Bits Revenue = Bits Revenue Per Month (direct input). Monthly Total = Sub Revenue + Ad Revenue + Bits Revenue. Annual Revenue = Monthly Total × 12. Revenue Per Stream Hour = Monthly Total ÷ Stream Hours Per Month",
    benchmarks: "Twitch revenue varies dramatically by audience size and engagement. According to [StreamElements](https://streamelements.com) State of the Stream 2025, the median affiliate earns $150-300/month, partners average $2,000-5,000/month, and top partnered streamers earn $20,000-100,000+/month. Subscriber counts typically range from 1-5% of total followers. Ad revenue averages $1.50-4.00 per stream hour depending on ad frequency and viewer location. Bits/cheering accounts for 5-15% of total revenue for most streamers. US and UK audiences generate significantly more ad revenue than other regions.",
    benchmarkData: [
      { metric: "Median Affiliate Monthly Revenue", value: "$150-300", source: "StreamElements 2025" },
      { metric: "Average Partner Monthly Revenue", value: "$2,000-5,000", source: "StreamElements 2025" },
      { metric: "Top 1% Streamer Revenue", value: "$10,000+/mo", source: "Streamlabs 2025" },
      { metric: "Sub-to-Follower Conversion Rate", value: "1-5%", source: "Twitch Analytics" },
      { metric: "Ad Revenue per Stream Hour (Affiliate)", value: "$1.50-3.00", source: "Twitch Partner Program" },
      { metric: "Tier 1 Subscription Price", value: "$4.99 (50/50 split)", source: "Twitch 2025" },
    ],
    relatedCalculators: ["youtube-ad-revenue-calculator", "podcast-revenue-calculator"],
    faq: [
      { question: "How much do Twitch streamers actually earn?", answer: "Twitch streamer earnings vary enormously. The median affiliate earns $150-300/month. Partners typically earn $2,000-5,000/month. Top creators earn $20,000-100,000+/month from subscriptions, ads, Bits, and sponsorships. Most streamers earn the majority of their income from sponsorships and donations, not Twitch itself. Building a sustainable income typically requires 500+ average viewers and consistent streaming 3-5 days per week." },
      { question: "What is the Twitch revenue split?", answer: "Twitch affiliates earn a 50/50 revenue split on subscriptions and Bits. Twitch partners can negotiate a 70/30 split (streamer keeps 70%) based on performance. The 70/30 split typically requires 300+ average viewers or 1,000+ subscribers. Ad revenue is split 50/50 for both affiliates and partners. Top creators may negotiate custom splits." },
      { question: "How many subscribers do I need to make $1,000/month?", answer: "At $4.99 per sub with a 50/50 split, you need approximately 400 subscribers to earn $1,000/month from subscriptions alone. With ad revenue ($2.50/hour for 80 hours = $200) and Bits ($100), you'd need about 300 subs for $1,000 total. As a partner with a 70/30 split, you'd need about 285 subs for $1,000 from subscriptions." },
      { question: "What factors affect Twitch ad revenue the most?", answer: "Ad revenue depends on viewer count, ad frequency (pre-roll vs. mid-roll), viewer location (US/UK audiences earn 5x more), and seasonality (Q4 has higher CPM rates). Running 3 minutes of ads per hour typically generates $2-4 per stream hour per 100 viewers. Mid-roll ads earn significantly more than pre-roll only." },
      { question: "Is Twitch or YouTube better for streamer revenue?", answer: "Twitch typically offers better subscription and donation revenue (community engagement is higher), while YouTube offers better ad revenue (higher RPM) and discoverability through search. Many successful creators use both: Twitch for live streaming with community support and YouTube for on-demand content with ad revenue. Consider using [Restream](https://restream.io) to multistream to both platforms." },
      { question: "How do Bits and cheers work for revenue?", answer: "Bits are Twitch's virtual currency viewers purchase to cheer in chat. Streamers earn $0.01 per Bit used in their channel (1 cent per Bit). Bits cost viewers approximately $0.014 per Bit, with the extra going to Twitch. Cheering is popular during hype moments, milestones, and tournaments. Top streamers earn $500-2,000/month from Bits alone." },
      { question: "Do Twitch streamers pay taxes on their income?", answer: "Yes, Twitch income is fully taxable. US streamers receive a 1099-MISC or 1099-NEC form. You must pay self-employment tax (15.3%) plus federal and state income tax. Track all streaming-related expenses (equipment, internet, games, software, utilities) to reduce taxable income. Consider quarterly estimated tax payments for earnings over $1,000/year." },
      { question: "How can I grow my Twitch revenue beyond the platform?", answer: "Diversify with [Patreon](https://patreon.com) for exclusive content, [Discord](https://discord.com) memberships, merchandise via [Printful](https://www.printful.com) or your own [Shopify](https://shopify.pxf.io/2R5Dza) store, and brand sponsorships via [SponsorSpot](https://sponsorspot.com). Many top streamers earn 50-70% of their income from sources outside Twitch. Build a YouTube channel for discoverability and edit streams into highlight compilations." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
