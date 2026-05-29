import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "cpc-calculator",
  category: "growth-efficiency",
  isNew: true,
  meta: {
    title: "CPC Calculator (Cost Per Click)",
    description: "Calculate Cost Per Click (CPC) for your advertising campaigns based on total cost and clicks generated.",
    keywords: ["cpc", "cost per click", "ppc", "pay per click", "advertising cost", "click cost", "google ads", "facebook ads"],
  },
  inputs: [
    { id: "totalCost", label: "Total Cost ($)", type: "currency" as const, defaultValue: 1000, min: 0 },
    { id: "totalClicks", label: "Total Clicks", type: "number" as const, defaultValue: 500, min: 1 },
  ],
  outputs: [
    { id: "cpc", label: "Cost Per Click (CPC)", type: "currency" as const, isPrimary: true },
    { id: "totalCost", label: "Total Cost", type: "currency" as const, isPrimary: false },
    { id: "totalClicks", label: "Total Clicks", type: "number" as const, isPrimary: false },
  ],
  content: {
    intro: "Cost Per Click (CPC) is the amount you pay each time someone clicks on your ad. It's the primary pricing model for search advertising (Google Ads), social media advertising (Meta, LinkedIn, TikTok), and many display networks. CPC directly impacts your customer acquisition costs and campaign profitability. This calculator helps you measure your effective CPC and compare performance across campaigns and platforms.",
    howToUse: "Enter your total ad spend and the number of clicks generated. The calculator shows your effective CPC. Use this to compare costs across different campaigns, ad platforms, and time periods. Lower CPC isn't always better — the cheapest clicks may convert at a lower rate. Balance CPC with conversion rate and average order value for a complete picture.",
    formulaExplanation: "CPC = Total Cost ÷ Total Clicks. Example: $1,000 spent generating 500 clicks = $2.00 CPC. If those clicks convert at 3% (15 conversions) with a $40 AOV, your cost per acquisition = $66.67 and ROAS = 0.6x — showing that CPC alone doesn't determine profitability.",
    benchmarks: "CPC varies significantly by industry and platform. Google Ads average CPC ranges from $1-5 (search) and $0.50-2 (display). Facebook Ads average $0.50-2. LinkedIn Ads are typically $5-8 due to B2B targeting. High-intent keywords like insurance or lawyer can cost $50-100+ per click. Use [Google Keyword Planner](https://ads.google.com/home/tools/keyword-planner/) for industry-specific CPC estimates.",
    benchmarkData: [
      { metric: "Google Search Avg CPC", value: "$1-5", source: "WordStream" },
      { metric: "Google Display Avg CPC", value: "$0.50-2", source: "WordStream" },
      { metric: "Facebook Ads Avg CPC", value: "$0.50-2", source: "Hootsuite" },
      { metric: "LinkedIn Ads Avg CPC", value: "$5-8", source: "LinkedIn Marketing" },
      { metric: "Instagram Ads Avg CPC", value: "$0.50-1.50", source: "Industry Average" },
      { metric: "TikTok Ads Avg CPC", value: "$0.50-1", source: "Industry Average" },
    ],
    relatedCalculators: ["roas-calculator", "ctr-calculator", "cpm-calculator", "conversion-rate-calculator"],
    faq: [
      { question: "What is the difference between CPC and CPM?", answer: "CPC (Cost Per Click) charges you when someone clicks your ad. CPM (Cost Per Mille) charges per 1,000 impressions regardless of clicks. CPC is better for performance campaigns (you want actions), while CPM is better for brand awareness (you want visibility). Most platforms offer both models — choose based on your campaign objective." },
      { question: "What is a good CPC for my industry?", answer: "Good CPC depends on your margins and conversion rates. A $10 CPC might be profitable with a 10% conversion rate and $200 AOV (CAC = $100, revenue = $200). The same CPC would be unprofitable with 2% conversion and $50 AOV. Calculate your break-even CPC as: (AOV × Margin % × Conversion Rate). For example, with $100 AOV, 40% margin, 5% conversion rate: break-even CPC = $2.00." },
      { question: "How does Quality Score affect CPC in Google Ads?", answer: "Google Ads Quality Score (1-10) directly impacts your actual CPC. A high Quality Score (8-10) can reduce CPC by 30-50% compared to a low score (1-3). Quality Score is based on expected click-through rate, ad relevance, and landing page experience. Improving Quality Score is the most effective way to lower CPC while maintaining or improving ad position." },
      { question: "Why are some keywords so expensive per click?", answer: "High CPC keywords ($20-100+) are typically high-intent commercial searches where the customer is ready to buy: insurance, lawyer, mortgage, business services, medical procedures. The CPC is high because the conversion value is high — a single click can result in a $1,000+ customer. Competitive markets with limited ad inventory also drive up CPC through auction dynamics." },
      { question: "How do I lower my CPC without reducing traffic?", answer: "Improve Quality Score (relevant ads, strong CTR, optimized landing pages), use long-tail keywords (less competition, lower CPC), implement negative keywords (eliminate irrelevant clicks), target lower-competition geographic areas, use ad scheduling (bid lower during low-converting hours), and test different ad platforms (Facebook and TikTok often have lower CPCs than Google for B2C)." },
      { question: "What's the relationship between CPC, CTR, and ad rank?", answer: "Ad rank = Bid × Quality Score. Higher Quality Score means you can bid less (lower CPC) to achieve the same ad position. CTR (Click-Through Rate) is a key component of Quality Score. A 2% CTR ad needs a lower bid to outrank a 0.5% CTR ad at the same position. This is why optimizing ad copy for CTR simultaneously improves ad position and reduces CPC." },
      { question: "How does device targeting affect CPC?", answer: "Mobile CPCs are typically 20-40% lower than desktop CPCs in most industries, but mobile conversion rates are often lower too. Tablet CPCs are similar to desktop. Adjust device bid modifiers based on your conversion data. If desktop converts at 2x the rate of mobile, bid 100% higher on desktop to maximize ROAS." },
      { question: "What is the difference between manual CPC and automated bidding?", answer: "Manual CPC gives you full control over individual keyword bids — ideal for experienced advertisers with time to optimize. Automated bidding (Target CPA, Target ROAS, Maximize Conversions) uses Google's machine learning to adjust bids in real-time. Automated bidding often outperforms manual for accounts with 30+ conversions per month. Large accounts with 100+ conversions/month nearly always benefit from automated bidding." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "CPC計算機（クリック単価）",
        description: "総費用とクリック数に基づいて広告キャンペーンのクリック単価（CPC）を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
