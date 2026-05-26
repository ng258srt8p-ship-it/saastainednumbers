import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "podcast-revenue-calculator",
  category: "side-hustle",
  meta: {
    title: "Podcast Revenue Calculator",
    description: "Estimate your podcast earnings from ads, sponsorships, and listener support.",
    keywords: ["podcast revenue", "podcast monetization", "sponsorship income", "podcast ads", "creator income"],
  },
  inputs: [
    { id: "downloadsPerEpisode", label: "Downloads per Episode", type: "number" as const, defaultValue: 5000, min: 0 },
    { id: "episodesPerMonth", label: "Episodes per Month", type: "number" as const, defaultValue: 4, min: 0 },
    { id: "cpm", label: "Ad CPM ($ per 1,000 downloads)", type: "currency" as const, defaultValue: 25, min: 0 },
    { id: "sponsorshipRate", label: "Sponsorship Rate per Episode ($)", type: "currency" as const, defaultValue: 500, min: 0 },
    { id: "sponsorsPerEpisode", label: "Sponsors per Episode", type: "number" as const, defaultValue: 2, min: 0 },
  ],
  outputs: [
    { id: "monthlyAdRevenue", label: "Monthly Ad Revenue", type: "currency" as const, isPrimary: false },
    { id: "monthlySponsorshipRevenue", label: "Monthly Sponsorship Revenue", type: "currency" as const, isPrimary: false },
    { id: "monthlyTotalRevenue", label: "Monthly Total Revenue", type: "currency" as const, isPrimary: true },
    { id: "annualRevenue", label: "Annual Revenue", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Podcasting has become a serious revenue channel for creators, with top shows earning millions annually through a mix of host-read ads, programmatic ads, sponsorships, and listener support. Revenue scales with downloads  -  but not linearly. Premium sponsors typically require 5,000-10,000 downloads per episode minimum, while programmatic ad networks work at any scale. This calculator helps you project your podcast income as your audience grows.",
    howToUse: "Enter your average downloads per episode, episodes per month, ad CPM rate, sponsorship rate per episode, and sponsors per episode. Default values represent a growing indie podcast. The calculator shows separate ad revenue, sponsorship revenue, and total monthly and annual income.",
    formulaExplanation: "Monthly Ad Revenue = (Downloads × Episodes ÷ 1,000) × CPM. Monthly Sponsorship = Sponsorship Rate × Sponsors × Episodes. Total = Ad Revenue + Sponsorship Revenue. Annual = Monthly × 12.",
    benchmarks: "Podcast ad CPM ranges from $15-50 depending on niche. Business/tech shows command $30-50 CPM. Entertainment/lifestyle shows average $15-25. Premium sponsorships pay $25-100 CPM in flat fees. Top 1% of podcasts earn $50K+/month. The median podcast earns under $100/month  -  revenue is heavily skewed toward the top. Use [Podscribe](https://podscribe.ai) or [Megaphone](https://megaphone.fm) for ad management.",
    benchmarkData: [
      { metric: "Indie Podcast (1-5K downloads/ep)", value: "$200-1,000 / month", source: "Industry Average" },
      { metric: "Growing Podcast (5-20K downloads/ep)", value: "$1,000-5,000 / month", source: "Industry Average" },
      { metric: "Top Podcast (100K+ downloads/ep)", value: "$20,000-100,000+ / month", source: "Industry Average" },
      { metric: "Business/Tech CPM", value: "$30-50", source: "AdvertiseCast 2025" },
      { metric: "Entertainment CPM", value: "$15-25", source: "AdvertiseCast 2025" },
      { metric: "Sponsorship Minimum Threshold", value: "5,000-10,000 downloads/ep", source: "Industry Standard" },
    ],
    relatedCalculators: ["youtube-ad-revenue-calculator", "newsletter-revenue-calculator"],
    faq: [
      { question: "How many downloads do I need to make money podcasting?", answer: "With programmatic ads (like AdvertiseCast), you can earn at any scale  -  even 500 downloads/episode generates some revenue. Premium sponsorships typically require 5,000-10,000 downloads per episode minimum. At 1,000 downloads/episode with 4 episodes/month, expect $100-400/month from ads." },
      { question: "What is the best way to monetize a podcast?", answer: "Tiered approach: 1) Programmatic ads (AdvertiseCast, Megaphone) at any scale. 2) Direct sponsorships at 5K+ downloads  -  host-read ads pay 2-3x more. 3) Listener support ([Patreon](https://patreon.com), Buy Me a Coffee). 4) Premium content or courses. 5) Live events and merchandise (sell merch through [Shopify](https://shopify.pxf.io/2R5Dza)). Most revenue comes from the top few sources." },
      { question: "How do podcast ad rates work?", answer: "CPM (cost per mille) is the rate advertisers pay per 1,000 downloads. Typical CPM is $15-50. A podcast with 10K downloads/episode earning $25 CPM with 2 ad slots: 10 × $25 × 2 = $500/episode. Host-read ads (the host reads the ad) earn 2-3x more than pre-recorded ads." },
      { question: "What podcast niches have the highest CPM?", answer: "Business/entrepreneurship ($30-50 CPM), technology/SaaS ($25-45), finance/investing ($30-50), health/wellness ($20-35), and true crime ($15-25). Niche B2B podcasts often command premium rates because advertisers value the targeted audience." },
      { question: "How do I get podcast sponsors?", answer: "Reach 5K+ downloads per episode minimum. Use ad marketplaces (AdvertiseCast, Podcorn for smaller shows). Pitch directly to brands in your niche with a media kit showing audience demographics. Build relationships with sponsors through consistent quality and engagement." },
      { question: "Is podcasting profitable after production costs?", answer: "Yes, at scale. Production costs: hosting ($10-50/month), equipment ($200-500 upfront), editing ($100-500/episode if outsourced). Break-even typically occurs at 2,000-5,000 downloads/episode depending on niche CPM. A show with 10K downloads/episode at $30 CPM grosses $1,200/month from 4 episodes  -  net after $400 editing costs = $800/month." },
      { question: "How does listener support (Patreon) compare to ads?", answer: "Patreon typically earns $1-5 per patron per month. A strong conversion rate is 1-5% of listeners. At 10K downloads/episode with 3% conversion at $5/month: 300 patrons × $5 = $1,500/month  -  often matching or exceeding ad revenue. Top creators earn 2-5x more from direct support than from ads." },
      { question: "How do I grow podcast downloads to reach revenue thresholds?", answer: "Consistent publishing schedule (weekly minimum). Strong SEO (show notes, transcripts). Cross-promotion with other podcasts. Social media clips (short-form video). Guest appearances on larger shows. Email list building. Most shows grow to 5K downloads/episode within 6-12 months of consistent publishing." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
