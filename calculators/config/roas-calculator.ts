import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "roas-calculator",
  category: "growth-efficiency",
  isNew: true,
  meta: {
    title: "ROAS Calculator (Return on Ad Spend)",
    description: "Calculate Return on Ad Spend (ROAS), net return, and profit margin for your advertising campaigns.",
    keywords: ["roas", "return on ad spend", "advertising roi", "marketing roas", "ad spend calculator", "campaign performance", "marketing metrics"],
  },
  inputs: [
    { id: "adSpend", label: "Total Ad Spend ($)", type: "currency" as const, defaultValue: 5000, min: 0.01 },
    { id: "revenueFromAds", label: "Revenue from Ads ($)", type: "currency" as const, defaultValue: 20000, min: 0 },
  ],
  outputs: [
    { id: "roas", label: "Return on Ad Spend (ROAS)", type: "ratio" as const, isPrimary: true, prefix: "ratio", suffix: "x" },
    { id: "netReturn", label: "Net Return", type: "currency" as const, isPrimary: true },
    { id: "profitMargin", label: "Profit Margin", type: "percentage" as const, isPrimary: false },
  ],
  content: {
    intro: "Return on Ad Spend (ROAS) is the single most important metric for evaluating advertising campaign performance. It measures the gross revenue generated for every dollar spent on advertising. A ROAS of 4.0 means you earn $4 for every $1 spent on ads. Unlike ROI which considers all costs, ROAS focuses specifically on advertising spend, making it the standard metric for optimizing campaigns across Google Ads, Meta, TikTok, and other platforms.",
    howToUse: "Enter your total ad spend (cost of all campaigns, including creative production if desired) and the total revenue directly attributable to those ads. The calculator shows ROAS as a ratio, net return (revenue minus spend), and profit margin percentage. Use this to compare campaign performance across channels and time periods.",
    formulaExplanation: "ROAS = Revenue from Ads ÷ Ad Spend. Net Return = Revenue from Ads - Ad Spend. Profit Margin = ((Revenue - Ad Spend) ÷ Revenue) × 100. Example: $5,000 ad spend generates $20,000 revenue. ROAS = 4.0x. Net Return = $15,000. Profit Margin = 75%. A ROAS of 1.0 means break-even; every dollar spent returns exactly one dollar.",
    benchmarks: "A good ROAS varies by industry and business model. E-commerce typically targets 4:1 (400%) as profitable. SaaS companies aim for 3:1 or higher due to lower COGS. High-ticket items can sustain 2:1 because of higher margins. Below 2:1 usually means campaigns need optimization. Use [Google Ads](https://ads.google.com) and [Meta Ads Manager](https://business.facebook.com/adsmanager) for platform-specific ROAS tracking.",
    benchmarkData: [
      { metric: "E-commerce Target ROAS", value: "4:1 (400%)", source: "Shopify" },
      { metric: "SaaS Target ROAS", value: "3:1 (300%)", source: "General benchmark" },
      { metric: "Minimum Profitable ROAS", value: "2:1 (200%)", source: "General benchmark" },
      { metric: "Brand Awareness ROAS", value: "1.5-2:1", source: "Nielsen" },
      { metric: "Retargeting Campaign ROAS", value: "8-12:1", source: "Criteo" },
    ],
    relatedCalculators: ["conversion-rate-calculator", "cpc-calculator", "ctr-calculator", "cpm-calculator"],
    faq: [
      { question: "What is the difference between ROAS and ROI?", answer: "ROAS (Return on Ad Spend) measures gross revenue divided by ad spend. It's campaign-specific and doesn't account for COGS or other costs. ROI (Return on Investment) ROI (Return on Investment) measures profit divided by total investment, including all costs. ROAS of 4.0 might mean 10% net ROI after COGS, fulfillment, and overhead. Use ROAS for campaign optimization and ROI for business decisions." },
      { question: "What is a good ROAS for my business?", answer: "A good ROAS depends on your gross margins. If your margin is 50%, you need ROAS of at least 2.0 to break even on ad spend alone (ignoring other costs). Most profitable e-commerce businesses target 3-5x ROAS. SaaS companies with 80%+ margins can sustain 2-3x. Calculate your break-even ROAS as: 1 ÷ Gross Margin %. For 40% margin, break-even ROAS is 2.5." },
      { question: "How do I track ROAS accurately?", answer: "Use UTM parameters, conversion tracking pixels, and platform attribution tools. Google Ads conversion tracking, Meta Pixel, and server-side tracking (GTM Server Side, Facebook Conversions API) provide increasingly accurate data. Multi-touch attribution models give more accurate ROAS for longer sales cycles. Single-touch (last-click) attribution typically underestimates the impact of top-of-funnel campaigns." },
      { question: "What causes low ROAS and how do I fix it?", answer: "Common causes: poor targeting, weak creative, low landing page conversion rates, incorrect attribution, or market saturation. Fix by: A/B testing ad creative and copy, refining audience segments, optimizing landing pages for conversion, improving offer relevance, and adjusting bidding strategies. Use ROAS data to identify which campaigns, audiences, and creatives perform best." },
        { question: "Should I use ROAS or CPA (Cost Per Acquisition)?", answer: "Both; they answer different questions. ROAS tells you revenue efficiency (how much you earn per dollar spent). CPA tells you cost efficiency (how much it costs to acquire a customer). Use ROAS for scaling decisions (increase spend on high-ROAS campaigns) and CPA for budget planning (can you acquire customers profitably at current costs?)." },
      { question: "How does attribution window affect ROAS?", answer: "Shorter attribution windows (7-day click, 1-day view) show lower ROAS because they miss delayed conversions. Longer windows (28-day click, 28-day view) show higher ROAS but may over-attribute. The right window depends on your sales cycle: 7-14 days for low-consideration, 28-90 days for B2B or high-ticket items. Be consistent when comparing ROAS across time periods." },
      { question: "What is blended ROAS vs channel-specific ROAS?", answer: "Blended ROAS = total revenue from all channels ÷ total ad spend across all channels. Channel-specific ROAS isolates performance of individual platforms (Google, Meta, TikTok, etc.). Blended ROAS gives the big picture; channel-specific ROAS drives optimization decisions. Most businesses optimize at the channel level and report at the blended level." },
      { question: "How do seasonality and market conditions affect ROAS?", answer: "ROAS typically drops 20-40% during peak competitive periods (Q4 holiday season, Prime Day, industry events) because more advertisers compete for the same audience. Plan for lower ROAS during these periods and higher ROAS during off-peak times. Year-over-year ROAS comparison is more meaningful than month-over-month due to seasonality." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "ROAS計算機（広告費用対効果）",
        description: "広告費用対効果（ROAS）、純収益、広告キャンペーンの利益率を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
