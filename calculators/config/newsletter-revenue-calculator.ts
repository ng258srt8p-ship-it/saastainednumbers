import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "newsletter-revenue-calculator",
  category: "side-hustle",
  meta: {
    title: "Newsletter Revenue Calculator",
    description: "Calculate your newsletter income from paid subscriptions and sponsorships based on subscriber count and engagement.",
    keywords: ["newsletter revenue", "substack earnings", "paid newsletter", "sponsorship income", "email monetization"],
  },
  inputs: [
    { id: "subscribers", label: "Total Subscribers", type: "number" as const, defaultValue: 10000, min: 0 },
    { id: "freeToPaidConversionRate", label: "Free-to-Paid Conversion Rate (%)", type: "percentage" as const, defaultValue: 5, min: 0, max: 100 },
    { id: "monthlyPrice", label: "Monthly Subscription Price ($)", type: "currency" as const, defaultValue: 8, min: 0 },
    { id: "sponsorshipCpm", label: "Sponsorship CPM ($ per 1K opens)", type: "currency" as const, defaultValue: 50, min: 0 },
    { id: "sponsorshipEmailsPerMonth", label: "Sponsored Emails per Month", type: "number" as const, defaultValue: 2, min: 0 },
    { id: "openRate", label: "Average Open Rate (%)", type: "percentage" as const, defaultValue: 45, min: 0, max: 100 },
  ],
  outputs: [
    { id: "paidSubscribers", label: "Paid Subscribers", type: "number" as const, isPrimary: false },
    { id: "monthlySubscriptionRevenue", label: "Monthly Subscription Revenue", type: "currency" as const, isPrimary: false },
    { id: "monthlySponsorshipRevenue", label: "Monthly Sponsorship Revenue", type: "currency" as const, isPrimary: false },
    { id: "monthlyTotalRevenue", label: "Monthly Total Revenue", type: "currency" as const, isPrimary: true },
    { id: "annualRevenue", label: "Annual Revenue", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Newsletters have become a powerful revenue channel for independent creators, journalists, and experts. Platforms like Substack and ConvertKit make it easy to monetize through both paid subscriptions and sponsorships. The key metrics are subscriber growth, conversion rate (typically 2-10%), and engagement (open rates of 30-60%). Top newsletters earn millions annually, but even a modest 10K subscriber list can generate a solid side income.",
    howToUse: "Enter your total subscriber count, expected free-to-paid conversion rate, monthly subscription price, sponsorship CPM rate, sponsored emails per month, and average open rate. The calculator shows paid subscribers, subscription revenue, sponsorship revenue, and total income.",
    formulaExplanation: "Paid Subs = Subscribers × (Conversion Rate ÷ 100). Subscription Revenue = Paid Subs × Monthly Price. Sponsorship Revenue = (Sponsored Emails × Subscribers × Open Rate ÷ 100 ÷ 1,000) × CPM. Total = Subscription + Sponsorship.",
    benchmarks: "Newsletter benchmarks: Average conversion rate is 2-10% for paid newsletters. Open rates of 40-60% are excellent. Sponsorship CPM ranges from $25-100 depending on niche (tech/B2B commands highest rates). A 10K-subscriber newsletter with 5% conversion at $8/month and 2 sponsorships at $50 CPM earns ~$4,000/month from subscriptions and ~$450/month from sponsorships.",
    benchmarkData: [
      { metric: "Average Free-to-Paid Conversion", value: "2-10%", source: "Substack 2025" },
      { metric: "Good Email Open Rate", value: "40-60%", source: "Mailchimp 2025" },
      { metric: "Sponsorship CPM Range", value: "$25-100", source: "Newsletter Industry" },
      { metric: "Typical Monthly Subscription Price", value: "$5-15 / month", source: "Substack" },
      { metric: "Top 1% Newsletter Revenue", value: "$100K+ / year", source: "Substack" },
      { metric: "Median Paid Newsletter Revenue", value: "$1-5K / year", source: "Substack" },
    ],
    relatedCalculators: ["podcast-revenue-calculator", "affiliate-income-calculator"],
    faq: [
      { question: "How many subscribers do I need to make a living from a newsletter?", answer: "At a $8/month price with 5% conversion: 100K subscribers = $40K/month from subscriptions alone. A full-time income ($3-5K/month) requires approximately 10-20K subscribers with good conversion. Sponsorship adds another 20-50% on top. Focus on growing to 10K subscribers for meaningful revenue." },
      { question: "What is a good free-to-paid conversion rate?", answer: "Industry average is 2-10%. Top performers achieve 10-15% through: strong value proposition in free content, scarcity tactics (limited-time intro pricing), social proof (testimonials, subscriber counts), and regular calls-to-action. Higher-ticket newsletters ($15+/month) typically see lower conversion (1-3%)." },
      { question: "How do newsletter sponsorships work?", answer: "Sponsors pay to include their message in your email. Pricing is typically CPM-based on opens (not sends). A $50 CPM with 10K subscribers at 45% open rate = $225 per sponsorship. Direct sponsorships pay 2-3x more than programmatic ad networks. Tech/B2B newsletters command $50-100 CPM due to high-intent audiences." },
      { question: "What are the best newsletter platforms for monetization?", answer: "Substack (all-in-one, built-in paid subscriptions, no transaction fees on first $1K), ConvertKit (powerful automation, audience segmentation), Beehiiv (built-in ad network, growth tools), and Revue (Twitter integration). Substack is best for simplicity, Beehiiv for growth features, ConvertKit for deep audience management." },
      { question: "How do I increase newsletter conversion rate?", answer: "Offer a compelling premium tier (exclusive content, community access, templates, tools). Use welcome sequences to demonstrate value before asking for conversion. Add social proof (subscriber count, testimonials). Offer annual plans at a discount. Run conversion campaigns during key moments (milestones, events, launches)." },
      { question: "What newsletter niches are most profitable?", answer: "Finance/investing (highest CPM at $75-100, strong conversion), tech/SaaS ($50-75 CPM), business/entrepreneurship ($40-60), health/wellness ($30-50), and professional development ($25-50). Niche B2B newsletters often outperform broader topics because advertisers pay more for targeted audiences." },
      { question: "How do I grow my newsletter subscriber count?", answer: "Content upgrades (free PDF/guide in exchange for email), cross-promotion with other newsletters, social media lead magnets, guest posting on larger publications, referral programs (like Beehiiv's Boost), SEO-optimized landing pages, and paid acquisition when CPA is sustainable." },
      { question: "What expenses should newsletter creators track?", answer: "Platform fees (Substack takes 10%, ConvertKit $29-59/month), email design tools (Canva, Figma), writing/editing help, advertising costs for paid acquisition, and software subscriptions. Most newsletters operate at 10-30% expense ratio. Track these to understand true profitability." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "ニュースレター収益計算機",
        description: "購読者数とエンゲージメントに基づいて有料購読とスポンサーシップからのニュースレター収入を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
