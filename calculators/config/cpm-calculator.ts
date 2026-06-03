import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "cpm-calculator",
  category: "side-hustle",
  isNew: true,
  meta: {
    title: "CPM Calculator (Cost Per Mille)",
    description: "Calculate Cost Per Mille (CPM), the cost per 1,000 ad impressions, for advertising campaigns and content monetization.",
    keywords: ["cpm", "cost per mille", "cost per thousand", "advertising cpm", "ad revenue", "impressions", "monetization", "ad rates"],
  },
  inputs: [
    { id: "totalCost", label: "Total Cost ($)", type: "currency" as const, defaultValue: 500, min: 0 },
    { id: "totalImpressions", label: "Total Impressions", type: "number" as const, defaultValue: 100000, min: 1 },
  ],
  outputs: [
    { id: "cpm", label: "Cost Per Mille (CPM)", type: "currency" as const, isPrimary: true },
    { id: "totalCost", label: "Total Cost", type: "currency" as const, isPrimary: false },
    { id: "totalImpressions", label: "Total Impressions", type: "number" as const, isPrimary: false },
  ],
  content: {
    intro: "Cost Per Mille (CPM), also called Cost Per Thousand, measures the cost of 1,000 ad impressions. It's the standard pricing model for display advertising, programmatic ads, and content monetization. For advertisers, CPM tells you how efficiently you're buying ad inventory. For content creators and publishers, CPM determines how much you earn from your audience. This calculator works both ways: enter your cost and impressions to find your CPM.",
    howToUse: "Enter your total ad spend or earnings (total cost) and the total number of impressions served or received. The calculator shows your CPM rate. For advertisers: use this to compare pricing across ad platforms. For creators and publishers: use this to calculate your effective RPM (Revenue Per Mille) and benchmark against industry standards.",
    formulaExplanation: "CPM = (Total Cost ÷ Total Impressions) × 1,000. Example: $500 cost for 100,000 impressions = $5.00 CPM. This means each 1,000 ad impressions costs (or earns) $5.00. A higher CPM means the advertiser pays more per thousand views; a lower CPM means more cost-efficient ad buying.",
    benchmarks: "CPM rates vary dramatically by industry, ad format, and targeting. Display ads average $2-5 CPM, video ads $10-25 CPM, premium placements $15-50 CPM. Niche B2B audiences can command $50-200+ CPM. Content creators on YouTube typically earn $2-5 RPM (revenue per thousand views). Use [Google Ad Manager](https://admanager.google.com) or [Ezoic](https://ezoic.com) to track your actual CPM rates.",
    benchmarkData: [
      { metric: "Standard Display CPM", value: "$2-5", source: "General benchmark" },
      { metric: "Video Ad CPM", value: "$10-25", source: "General benchmark" },
      { metric: "Premium Placement CPM", value: "$15-50", source: "Digiday" },
      { metric: "Niche B2B CPM", value: "$50-200+", source: "General benchmark" },
      { metric: "YouTube RPM (Creator)", value: "$2-5", source: "YouTube Analytics" },
      { metric: "Programmatic Display CPM", value: "$1-3", source: "General benchmark" },
    ],
    relatedCalculators: ["cpc-calculator", "ctr-calculator", "roas-calculator", "blogging-income-calculator"],
    faq: [
        { question: "What is the difference between CPM and RPM?", answer: "CPM (Cost Per Mille) is what advertisers pay; it's the cost per 1,000 impressions from the buyer's perspective. RPM (Revenue Per Mille) is what publishers earn; it's the revenue per 1,000 impressions after ad network fees. RPM is typically 30-50% lower than CPM due to network fees, fill rates, and unsold inventory. For creators, RPM is the more relevant metric for earnings." },
      { question: "What factors affect CPM rates?", answer: "CPM is influenced by: audience demographics (US/EU audiences command 5-10x higher CPMs than developing markets), content vertical (finance, B2B, legal = high CPM; entertainment, gaming = lower CPM), ad format (video > native > display > banner), seasonality (Q4 CPMs are 20-50% higher), ad placement (above-fold > below-fold), and targeting precision (behavioral > contextual > untargeted)." },
      { question: "How do I increase my CPM as a publisher or creator?", answer: "Build traffic from high-CPM countries (US, UK, Canada, Australia, EU), create content in high-CPM verticals (finance, SaaS, business, law, health), optimize ad placement and format (video ads earn 3-5x more than display ads), increase session depth (pages per visit), improve content quality to attract premium advertisers, and use ad networks like Mediavine, AdThrive, or Ezoic that optimize for publisher revenue." },
      { question: "What is a good CPM for a new blog or website?", answer: "New blogs typically start with low CPMs ($1-3) until they build traffic, authority, and audience data. As traffic grows to 10K+ monthly visitors and content quality improves, CPMs can reach $5-10. Premium ad networks like Mediavine (50K+ sessions/month) and AdThrive (100K+ sessions/month) offer significantly higher CPMs but require minimum traffic thresholds." },
      { question: "How does CPM relate to CPC and CTR?", answer: "CPM, CPC, and CTR are interconnected. CPM = (CTR × CPC × 1,000) ÷ 100. If your ad has a 2% CTR (20 clicks per 1,000 impressions) and a $0.50 CPC, the implied CPM = (0.02 × $0.50 × 1,000) = $10. Ad networks optimize for whichever metric maximizes their revenue, so understanding all three helps you evaluate campaign performance holistically." },
      { question: "Why do video ads have higher CPM than display ads?", answer: "Video ads command 3-5x higher CPMs because they're more engaging, have higher completion rates, and advertisers are willing to pay more for the immersive format. In-stream video ads (pre-roll, mid-roll) have the highest CPMs. Out-stream video (auto-play in content) has moderate CPMs. Display banners have the lowest CPMs due to banner blindness and lower engagement." },
      { question: "What is CPM floor pricing and how does it work?", answer: "Floor pricing is the minimum CPM you'll accept for your ad inventory. In programmatic advertising, you set a floor price, and the ad exchange only accepts bids above that threshold. Higher floors increase revenue per impression but reduce fill rate (the percentage of impressions sold). The optimal floor price balances CPM against fill rate to maximize total revenue." },
      { question: "How do ad blockers affect CPM?", answer: "Ad blockers reduce your total impressions and can skew CPM higher (because only non-blocking users see ads, and they tend to be less tech-savvy and potentially more valuable). However, total revenue drops proportionally to your ad block rate (typically 20-40% of visitors). Some publishers use ad block recovery messages asking users to whitelist the site." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "CPM計算機（インプレッション単価）",
        description: "広告キャンペーンとコンテンツマネタイゼーションのインプレッション単価（CPM）を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
