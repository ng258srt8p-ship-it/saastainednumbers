import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "ctr-calculator",
  category: "growth-efficiency",
  meta: {
    title: "CTR Calculator (Click-Through Rate)",
    description: "Calculate Click-Through Rate (CTR) for your ads, emails, and content based on impressions and clicks.",
    keywords: ["ctr", "click through rate", "click rate", "ad ctr", "email ctr", "engagement metrics", "campaign performance"],
  },
  inputs: [
    { id: "totalImpressions", label: "Total Impressions", type: "number" as const, defaultValue: 10000, min: 1 },
    { id: "totalClicks", label: "Total Clicks", type: "number" as const, defaultValue: 250, min: 0 },
  ],
  outputs: [
    { id: "ctr", label: "Click-Through Rate (CTR)", type: "percentage" as const, isPrimary: true },
    { id: "totalImpressions", label: "Total Impressions", type: "number" as const, isPrimary: false },
    { id: "totalClicks", label: "Total Clicks", type: "number" as const, isPrimary: false },
  ],
  content: {
    intro: "Click-Through Rate (CTR) measures how often people click on your ad, email, search listing, or content after seeing it. It's a critical engagement metric that reflects relevance, messaging effectiveness, and audience targeting quality. High CTR indicates strong alignment between your offer and your audience. Low CTR signals that your creative, targeting, or value proposition needs improvement. This calculator helps you measure CTR across any channel.",
    howToUse: "Enter your total impressions (how many times your content was shown) and total clicks (how many times people clicked). The calculator shows your CTR percentage. Use this to benchmark and compare performance across campaigns, channels, ad formats, and time periods to identify what resonates with your audience.",
    formulaExplanation: "CTR = (Clicks ÷ Impressions) × 100. Example: 250 clicks from 10,000 impressions = 2.5% CTR. This means 2.5% of people who saw your ad clicked on it. A higher CTR generally indicates more relevant and compelling content. CTR is a leading indicator — improving it typically leads to more conversions at the same traffic volume.",
    benchmarks: "CTR benchmarks vary by channel and industry. Google Search ads average 3-5%, Google Display ads 0.3-0.8%, Facebook ads 0.5-1.5%, email marketing 2-5%, LinkedIn ads 0.3-0.8%. Top-quartile performers achieve 2x the average. Use platform analytics to track your CTR and compare against industry benchmarks from sources like [WordStream](https://wordstream.com) and [Mailchimp](https://mailchimp.com).",
    benchmarkData: [
      { metric: "Google Search Ad CTR", value: "3-5%", source: "WordStream" },
      { metric: "Google Display Ad CTR", value: "0.3-0.8%", source: "WordStream" },
      { metric: "Facebook Ad CTR", value: "0.5-1.5%", source: "Hootsuite" },
      { metric: "Email Marketing CTR", value: "2-5%", source: "Mailchimp" },
      { metric: "LinkedIn Ad CTR", value: "0.3-0.8%", source: "LinkedIn Marketing" },
      { metric: "Top-Quartile (All Channels)", value: "2x Average", source: "Industry Standard" },
    ],
    relatedCalculators: ["cpc-calculator", "cpm-calculator", "roas-calculator", "conversion-rate-calculator"],
    faq: [
      { question: "What is a good CTR for my ads?", answer: "A good CTR depends on the channel and format. Google Search: 3-5% is good, 8%+ is excellent. Google Display: 0.3-0.8% is average, 1%+ is excellent. Facebook: 0.5-1.5% is average, 2%+ is strong. Email: 2-5% is average, 8%+ is exceptional. The most important benchmark is your own historical CTR — focus on continuous improvement rather than comparing across completely different businesses." },
      { question: "How do I improve click-through rate?", answer: "Improve ad copy with clear value propositions and strong CTAs, A/B test headlines and descriptions, use emotional triggers (urgency, curiosity, social proof), include offers and promotions (15% off, free shipping), optimize ad extensions and rich snippets, improve creative quality (images and video), refine audience targeting, and test different ad formats (carousel, video, single image)." },
      { question: "Why is my CTR high but conversion rate low?", answer: "High CTR with low conversion rate suggests a disconnect between your ad promise and your landing page experience. Your ad might be generating clicks from curiosity or misleading messaging, but the landing page doesn't deliver what users expected. Fix by: matching ad copy to landing page headline, maintaining consistent messaging, ensuring fast page load, and simplifying the conversion process." },
      { question: "What is the relationship between CTR and Quality Score?", answer: "CTR is the most important component of Google's Quality Score (accounting for ~60% of the score). Higher CTR directly improves Quality Score, which lowers your CPC and improves ad position. A 2% CTR might give a Quality Score of 5, while a 6% CTR for the same keyword could give a Quality Score of 8-9 — reducing CPC by 30-40%." },
      { question: "How does ad position affect CTR?", answer: "CTR drops significantly as ad position decreases. Position 1 typically gets 10-20% CTR, Position 2 gets 5-10%, Position 3 gets 3-6%. By position 5, CTR drops to 1-2%. However, higher positions cost more per click. The optimal position balances CTR with CPC to achieve the best ROAS. Test different position targets (via bid adjustments) to find the sweet spot." },
      { question: "What is the difference between CTR for search vs display advertising?", answer: "Search ads have much higher CTR (3-5%) because users are actively searching for what you offer — intent is high. Display ads have lower CTR (0.3-0.8%) because they interrupt users who are consuming content. This doesn't mean display is worse — display is better for brand awareness and retargeting, while search captures existing demand." },
      { question: "How does ad fatigue affect CTR over time?", answer: "CTR typically declines over time as your audience becomes fatigued with seeing the same creative. After 3-5 exposures, CTR can drop 40-60%. Refresh ad creative every 2-4 weeks, rotate multiple ad variations, and use frequency caps to limit how often individuals see your ads. Facebook recommends creating new ad creative when frequency exceeds 3-4 per week." },
      { question: "Should I optimize for CTR or conversion rate?", answer: "Optimize for both sequentially. First improve CTR to drive more traffic at lower cost (via improved Quality Score). Then optimize landing pages to improve conversion rate from that traffic. A 2% CTR with 5% conversion rate equals the same conversion volume as 5% CTR with 2% conversion rate — but the first scenario likely has lower CPC and higher ROAS." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
