import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "tiktok-creator-fund-calculator",
  category: "side-hustle",
  meta: {
    title: "TikTok Creator Fund Calculator",
    description: "Estimate your TikTok Creator Fund payouts based on views, region, engagement, and video length.",
    keywords: ["tiktok creator fund", "tiktok payout", "tiktok monetization", "tiktok rpm", "tiktok earnings", "creator fund calculator"],
  },
  inputs: [
    { id: "monthlyViews", label: "Monthly Views", type: "number" as const, defaultValue: 100000, min: 0 },
    { id: "region", label: "Region", type: "currency" as const, defaultValue: 1, min: 0 },
    { id: "engagementRate", label: "Engagement Rate (%)", type: "percentage" as const, defaultValue: 5, min: 0, max: 100 },
    { id: "avgVideoLengthSec", label: "Average Video Length (seconds)", type: "number" as const, defaultValue: 30, min: 0 },
  ],
  outputs: [
    { id: "estimatedMonthlyPayout", label: "Estimated Monthly Payout", type: "currency" as const, isPrimary: true },
    { id: "annualPayout", label: "Annual Payout", type: "currency" as const },
    { id: "rpm", label: "RPM (Revenue per 1,000 Views)", type: "currency" as const },
  ],
  content: {
    intro: "The TikTok Creator Fund (now rebranded as the Creator Rewards Program) pays creators based on video views, engagement, and viewer location. Unlike YouTube's ad revenue model, TikTok's payout structure uses a fixed fund pool distributed among eligible creators, making RPM highly variable. Typical TikTok RPM ranges from $0.02-0.06 per 1,000 views  -  significantly lower than YouTube's $1-15 RPM. However, TikTok's virality potential means high-volume creators can still earn substantial income through volume. This calculator estimates your monthly and annual Creator Fund payouts based on your view count, region, engagement rate, and average video length. For serious income, creators diversify with brand sponsorships via [Shopify](https://shopify.pxf.io/2R5Dza), affiliate marketing through [Amazon Influencer](https://amazon.com/influencers), and cross-promotion to [YouTube](https://youtube.com) where RPM is higher.",
    howToUse: "Enter your monthly video views, select your primary audience region (affects RPM multiplier), your engagement rate (likes + comments + shares ÷ views), and average video length in seconds. The calculator shows estimated monthly payout, annual projection, and your effective RPM. TikTok's RPM varies significantly  -  US views pay the most while OTHER regions pay the least. Longer videos earn a length bonus as the fund rewards watch time.",
    formulaExplanation: "Base RPM = $0.03. Region Multiplier: US = 1.0, UK = 0.8, CA = 0.9, AU = 0.85, OTHER = 0.4. Length Bonus = min(Avg Video Length in minutes, 1) × 0.5 (up to 50% bonus for 60+ second videos). RPM = Base RPM × Region Multiplier × (1 + Length Bonus) × (1 + Engagement Rate ÷ 100). Monthly Payout = (Monthly Views ÷ 1,000) × RPM. Annual Payout = Monthly Payout × 12.",
    benchmarks: "TikTok's Creator Fund pays significantly less than other platforms. According to creator reports, average RPM ranges from $0.02-0.06, compared to YouTube's $1-15. A creator with 1 million monthly views in the US typically earns $20-60/month from the Creator Fund. The TikTok Creator Rewards Program (launched 2024) replaced the original fund with higher payouts for longer videos (60+ seconds) and higher engagement rates. Creators earning significant income from TikTok typically supplement with brand deals ($500-5,000 per post), live gifts, and cross-platform promotion. Using [CapCut](https://capcut.com) for editing and posting longer content can increase earnings.",
    benchmarkData: [
      { metric: "Average TikTok RPM (US)", value: "$0.03-0.06", source: "Creator Reports 2025" },
      { metric: "Average TikTok RPM (UK/CA/AU)", value: "$0.02-0.05", source: "Creator Reports 2025" },
      { metric: "Average TikTok RPM (Other Regions)", value: "$0.01-0.02", source: "Creator Reports 2025" },
      { metric: "1M Monthly Views Estimated Payout", value: "$20-60/mo", source: "TikTok Creator Insights" },
      { metric: "Creator Rewards Program Boost", value: "+50% for 60+ sec videos", source: "TikTok 2024" },
      { metric: "Average Brand Sponsorship (10K-100K)", value: "$200-2,000 per post", source: "Influencer Marketing Hub 2025" },
    ],
    relatedCalculators: ["youtube-ad-revenue-calculator", "twitch-revenue-calculator"],
    faq: [
      { question: "How much does TikTok pay per 1,000 views?", answer: "TikTok's RPM (revenue per 1,000 views) is typically $0.02-0.06, dramatically lower than YouTube ($1-15). US viewers pay the highest RPM at $0.03-0.06. UK, Canada, and Australia average $0.02-0.05. Other regions average just $0.01-0.02. The Creator Rewards Program (2024+) offers higher payouts for longer videos (60+ seconds) and higher engagement rates, potentially doubling RPM for qualifying content." },
      { question: "How do I qualify for the TikTok Creator Fund?", answer: "Requirements for the Creator Rewards Program: 10,000+ followers, 100,000+ video views in the last 30 days, age 18+, adhere to TikTok's community guidelines, and have an account in good standing. Previously the original Creator Fund required 10K followers and 100K views in 30 days. Applications are available through the Creator Tools section in the TikTok app." },
      { question: "Why is TikTok's payout so low compared to YouTube?", answer: "TikTok uses a fixed fund pool model  -  a set amount of money is divided among all eligible creators based on their share of views. YouTube uses an auction-based ad model where advertisers bid for ad space, creating higher CPMs. TikTok's average RPM ($0.03-0.06) is 50-300x lower than YouTube's ($1-15). TikTok makes up for this with viral reach  -  it's easier to get millions of views on TikTok than YouTube." },
      { question: "How can I increase my TikTok earnings?", answer: "Create videos 60+ seconds long (length bonus increases RPM by up to 50%), target US and UK audiences with relevant content, increase engagement rate through calls-to-action and trending sounds, post consistently (1-3 times daily), and diversify income with brand sponsorships via [Shopify](https://shopify.pxf.io/2R5Dza), affiliate marketing through [Amazon Influencer](https://amazon.com/influencers), and live streaming with gifts. Also cross-post to [YouTube Shorts](https://youtube.com) and [Instagram Reels](https://instagram.com) for additional revenue sources." },
      { question: "How do brand sponsorships compare to Creator Fund income?", answer: "Brand sponsorships pay 50-100x more than Creator Fund revenue. A creator with 100K monthly views might earn $3-6 from the Creator Fund but $200-2,000 per sponsored post. Most creators earning a living on TikTok derive 80-95% of income from brand deals, not the Creator Fund. Build a media kit with your engagement rates, audience demographics, and past campaign results to attract sponsors." },
      { question: "Does TikTok pay for live streaming?", answer: "Yes, TikTok pays for live streaming through virtual gifts. Viewers purchase TikTok coins and send gifts during live streams, which creators convert to diamonds and then cash out. TikTok takes approximately 50% of gift revenue. Live streaming is one of the highest-earning activities on TikTok  -  top live streamers can earn $500-5,000+ per session. Focus on interactive live content like Q&As, tutorials, or performances." },
      { question: "What content gets the highest TikTok RPM?", answer: "Longer videos (60+ seconds) with high engagement rates earn the highest RPM in the Creator Rewards Program. Educational content, tutorials, storytelling, and series-based content naturally get higher watch times and engagement. Niche content like finance, business, tech, and personal development tends to attract older audiences with higher purchasing power, making it more attractive to advertisers and sponsors." },
      { question: "How do taxes work for TikTok Creator Fund income?", answer: "TikTok Creator Fund income is taxable as self-employment income. US creators receive a 1099-NEC form if earnings exceed $600. You must pay self-employment tax (15.3%) plus federal and state income tax. Track all deductible expenses: camera equipment, lighting, editing software ([CapCut](https://capcut.com) Pro, [Adobe Premiere](https://adobe.com)), internet, phone, props, and home office deduction. Set aside 25-30% of Creator Fund earnings for taxes." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "TikTokクリエイターファンド計算機",
        description: "視聴回数、地域、エンゲージメント、動画時間に基づいてTikTokクリエイターファンドの支払額を見積もります。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
