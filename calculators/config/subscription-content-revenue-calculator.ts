import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "subscription-content-revenue-calculator",
  category: "side-hustle",
  meta: {
    title: "Subscription Content Revenue Calculator",
    description: "Estimate income from subscription-based content platforms like OnlyFans, Patreon, and FanCentro.",
    keywords: ["subscription revenue", "onlyfans income", "patreon earnings", "fancentro", "content creator", "paid subscribers", "fan revenue"],
  },
  inputs: [
    { id: "freeFollowers", label: "Free Followers / Audience", type: "number" as const, defaultValue: 10000, min: 0 },
    { id: "conversionRate", label: "Conversion Rate to Paid (%)", type: "percentage" as const, defaultValue: 5, min: 0, max: 100 },
    { id: "monthlyPrice", label: "Monthly Subscription Price ($)", type: "currency" as const, defaultValue: 9.99, min: 0 },
    { id: "payPerViewRevenue", label: "Pay-Per-View Revenue ($/mo)", type: "currency" as const, defaultValue: 200, min: 0 },
    { id: "tipsPerMonth", label: "Tips / Custom Content ($/mo)", type: "currency" as const, defaultValue: 150, min: 0 },
  ],
  outputs: [
    { id: "paidSubscribers", label: "Paid Subscribers", type: "number" as const },
    { id: "monthlySubRevenue", label: "Monthly Subscription Revenue", type: "currency" as const },
    { id: "monthlyPPVRevenue", label: "Monthly PPV Revenue", type: "currency" as const },
    { id: "monthlyTipsRevenue", label: "Monthly Tips Revenue", type: "currency" as const },
    { id: "monthlyTotal", label: "Monthly Total Revenue", type: "currency" as const, isPrimary: true },
    { id: "annualRevenue", label: "Annual Revenue", type: "currency" as const },
  ],
  content: {
    intro: "Subscription content platforms have revolutionized how creators monetize their audience. Whether you use OnlyFans, Patreon, FanCentro, or a similar platform, your income depends on converting free followers into paid subscribers, then maximizing per-subscriber revenue through pay-per-view (PPV) content, tips, and custom requests. Platform fees typically take 10-20% of earnings. This calculator helps you project your revenue based on audience size, conversion rates, and engagement. Successful creators earn from multiple streams: recurring subscriptions, exclusive PPV content, direct tips, and custom content requests. Platforms like [Patreon](https://patreon.com) charge 5-12% fees, while [OnlyFans](https://onlyfans.com) takes 20%. Use [Gumroad](https://gumroad.com) for one-time digital product sales alongside subscriptions.",
    howToUse: "Enter your total free follower count, your estimated conversion rate to paid subscribers (industry average is 2-10%), your monthly subscription price, additional monthly pay-per-view revenue, and tips/custom content income. The calculator shows your paid subscriber count, revenue breakdown by source, total monthly earnings, and annual projection. Adjust the conversion rate and price to see different scenarios.",
    formulaExplanation: "Paid Subscribers = Free Followers × (Conversion Rate ÷ 100), rounded to the nearest whole number. Monthly Subscription Revenue = Paid Subscribers × Monthly Price. Monthly Total = Subscription Revenue + PPV Revenue + Tips Revenue. Annual Revenue = Monthly Total × 12. The platform's fee is not deducted  -  shown values represent gross revenue before platform commission.",
    benchmarks: "Subscription content conversion rates typically range from 1-10% depending on the platform and content type. According to industry reports, the average OnlyFans creator has 100-300 paid subscribers earning $1,000-3,000/month. Top 1% of creators earn $10,000-100,000+/month. Patreon creators average $100-500/month with 50-200 patrons. PPV revenue typically accounts for 20-40% of total income on platforms that support it. Tips and custom content add 10-25%. Building a sustainable subscription business requires consistent posting, audience engagement, and promotional content on platforms like [Twitter/X](https://x.com) and [Reddit](https://reddit.com).",
    benchmarkData: [
      { metric: "Average Follower-to-Paid Conversion", value: "2-5%", source: "General benchmark" },
      { metric: "OnlyFans Median Monthly Earnings", value: "$150-300", source: "General benchmark" },
      { metric: "Top 1% Creator Monthly Revenue", value: "$10,000-100,000+", source: "General benchmark" },
      { metric: "Patreon Average Creator Income", value: "$100-500/mo", source: "Patreon 2025" },
      { metric: "PPV Revenue Share of Total", value: "20-40%", source: "General benchmark" },
      { metric: "Tips / Custom Content Share", value: "10-25%", source: "General benchmark" },
    ],
    relatedCalculators: ["twitch-revenue-calculator", "newsletter-revenue-calculator"],
    faq: [
      { question: "What is a good conversion rate from free to paid subscribers?", answer: "A good conversion rate is 3-5% for most platforms. Exceptional creators achieve 8-10% by offering valuable free content, direct engagement, and compelling subscription benefits. Rates below 1% indicate a need to improve free content quality, posting consistency, or subscription value proposition. Promotional tactics like limited-time discounts and bundle offers can boost conversion." },
      { question: "How much do platform fees affect my take-home pay?", answer: "Platform fees vary significantly: OnlyFans takes 20%, Patreon takes 5-12% depending on plan, FanCentro takes 30%, and [Gumroad](https://gumroad.com) takes 3-10%. A creator earning $5,000/month on OnlyFans actually takes home $4,000 before taxes. Factor platform fees into your pricing  -  consider raising subscription prices by 15-25% to account for fees while maintaining your target net income." },
      { question: "How many subscribers do I need to earn a full-time income?", answer: "At $9.99/month with a 5% conversion rate, you need about 2,000 paid subscribers to earn $20,000/month gross ($16,000 after 20% platform fees). That requires approximately 40,000 free followers. Many creators combine subscription revenue with PPV ($200-500/mo), tips ($150-500/mo), and affiliate marketing to reach full-time income with fewer subscribers." },
      { question: "What types of content generate the most PPV revenue?", answer: "Exclusive, premium content that goes beyond regular posts generates the most PPV revenue. This includes longer-form videos, personalized content, behind-the-scenes footage, tutorials, and themed photosets. Creators who regularly post free content and offer premium PPV upgrades see 20-40% of total revenue from PPV. Price PPV content at 2-5x your subscription price for best results." },
      { question: "How do tips and custom content requests work?", answer: "Tips are voluntary payments from fans, often in exchange for appreciation or specific shoutouts. Custom content requests are paid commissions for personalized photos, videos, or messages. Pricing varies but typically runs $50-200 for custom photosets and $100-500 for custom videos. Tips and custom content can add 25-50% to base subscription revenue for engaged creators." },
      { question: "What is the best platform for subscription content?", answer: "The best platform depends on your content type. [OnlyFans](https://onlyfans.com) is largest for adult content. [Patreon](https://patreon.com) works well for educational, artistic, and podcast content. [FanCentro](https://fancentro.com) is popular for direct fan engagement. [Substack](https://substack.com) is best for written content. Many successful creators use 2-3 platforms simultaneously to diversify income and reach different audiences." },
      { question: "How do taxes work for subscription content income?", answer: "Subscription content income is self-employment income subject to 15.3% self-employment tax plus federal and state income tax. Creators should track all deductible expenses: equipment, internet, phone, software (editing/editing apps), props/costumes, marketing, and a home office deduction if applicable. Set aside 25-30% of gross income for taxes. Consider quarterly estimated tax payments for earnings over $1,000/year." },
      { question: "How can I grow my subscriber base faster?", answer: "Post consistently (daily if possible), engage with followers through DMs and comments, offer limited-time promotions (first month discount), collaborate with other creators, use social media platforms like [Twitter/X](https://x.com) and [Reddit](https://reddit.com) for promotion, create referral programs, and offer bundle deals (annual subscriptions at a discount). Analyze which content performs best and double down on that style." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "サブスクリプションコンテンツ収益計算機",
        description: "OnlyFans、Patreon、FanCentroなどのサブスクリプション型コンテンツプラットフォームの収益を見積もります。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
