import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "revenue-per-user-trend-calculator",
  category: "saas-deepen",
  meta: {
    title: "Revenue Per User Trend Calculator",
    description: "Track your ARPU trend over time by comparing previous and current month revenue and user counts to determine if your per-user revenue is growing, stable, or declining.",
    keywords: ["arpu trend", "revenue per user", "saas metrics", "monetization", "average revenue per user"],
  },
  inputs: [
    { id: "prevMonthRevenue", label: "Previous Month Revenue", type: "currency" as const, defaultValue: 50000, min: 0 },
    { id: "currentMonthRevenue", label: "Current Month Revenue", type: "currency" as const, defaultValue: 55000, min: 0 },
    { id: "prevMonthUsers", label: "Previous Month Users", type: "number" as const, defaultValue: 500, min: 1 },
    { id: "currentMonthUsers", label: "Current Month Users", type: "number" as const, defaultValue: 520, min: 1 },
  ],
  outputs: [
    { id: "currentArpu", label: "Current Month ARPU", type: "currency" as const, isPrimary: true },
    { id: "prevArpu", label: "Previous Month ARPU", type: "currency" as const, isPrimary: false },
    { id: "arpuGrowth", label: "ARPU Growth", type: "percentage" as const, isPrimary: false },
    { id: "trend", label: "Trend", type: "text" as const, isPrimary: false },
  ],
  content: {
    intro: "Revenue Per User (ARPU) Trend Analysis tracks how your average revenue per user changes month over month, revealing whether your monetization strategy is improving, stagnating, or declining. Growing ARPU means you are successfully upselling, expanding usage, or raising prices. Declining ARPU suggests you may be adding lower-value customers, experiencing plan downgrades, or facing pricing pressure from competitors. ARPU trend is a powerful leading indicator of revenue health because it separates growth driven by customer acquisition from growth driven by increasing customer value. A company adding 1,000 customers at $10/month ARPU is growing differently than one adding 500 customers at $50/month ARPU. This calculator computes your current and previous ARPU, calculates the percentage growth, and classifies the trend as Growing, Stable, or Declining. Use it to monitor your monetization trajectory and make data-driven pricing and packaging decisions.",
    howToUse: "Enter your previous month's total revenue and user count, then your current month's total revenue and user count. The calculator will compute both months' ARPU, the percentage change, and classify the trend as Growing (above 5%), Stable (-5% to 5%), or Declining (below -5%).",
    formulaExplanation: "ARPU = Monthly Revenue / Monthly Users. ARPU Growth = ((Current ARPU - Previous ARPU) / Previous ARPU) × 100. Trend is classified as Growing if growth > 5%, Stable if between -5% and 5%, and Declining if < -5%. Example: $50K revenue / 500 users = $100 ARPU; $55K / 520 = $105.77 ARPU; Growth = 5.77%  -  Growing.",
    benchmarks: "Healthy SaaS companies maintain stable or growing ARPU over time. According to SaaS Capital and KeyBanc 2025 SaaS Survey, median ARPU for SMB SaaS is $50-150/month, mid-market is $150-500/month, and enterprise is $500-5,000+/month. ARPU growth of 5-15% year-over-year is strong for mature companies. Early-stage companies often see declining ARPU initially as they acquire lower-value customers, then recover as they optimize pricing and expand existing accounts.",
    benchmarkData: [
      { metric: "ARPU Growth (Strong)", value: "> 10% YoY", source: "SaaS Capital" },
      { metric: "ARPU Growth (Stable)", value: "5 - 10% YoY", source: "SaaS Capital" },
      { metric: "SMB ARPU Range", value: "$50 - $150 / month", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Mid-Market ARPU Range", value: "$150 - $500 / month", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Enterprise ARPU Range", value: "$500 - $5,000+ / month", source: "OpenView" },
    ],
    relatedCalculators: ["arpu-calculator", "mrr-growth-rate-calculator", "revenue-per-employee-calculator"],
    faq: [
      { question: "What does growing ARPU indicate about my business?", answer: "Growing ARPU means your existing customers are spending more over time through upgrades, usage expansion, or add-on purchases. It signals strong product-market fit and effective monetization. Growing ARPU combined with customer growth is the strongest sign of a healthy SaaS business." },
      { question: "How is ARPU trend different from a single ARPU calculation?", answer: "A single ARPU calculation is a snapshot. Trend analysis shows the direction and velocity of change over time, helping you identify whether your monetization strategy is working or deteriorating. Trend is more actionable than a point-in-time number." },
      { question: "What causes declining ARPU?", answer: "Adding lower-value customers through self-serve or freemium plans, existing customers downgrading to cheaper plans, pricing pressure from competitors, increased discounting, or a shift in sales mix toward smaller deals. Analyze new customer ARPU vs. existing customer ARPU separately." },
      { question: "How do pricing changes affect ARPU trend?", answer: "Price increases temporarily boost ARPU but may slow customer acquisition. Price decreases can accelerate adoption but may reduce ARPU. Monitor ARPU trend alongside customer count to understand the net revenue impact of pricing changes." },
      { question: "Should I track ARPU by customer segment?", answer: "Yes. Overall ARPU can be misleading if your customer mix is changing. Track ARPU separately for each segment (self-serve, sales-led, SMB, mid-market, enterprise) to understand which segments are improving and which are underperforming." },
      { question: "What is a healthy ARPU growth rate?", answer: "5-15% year-over-year ARPU growth is healthy for mature SaaS companies. Early-stage companies may see 20%+ growth as they optimize pricing. Negative ARPU growth warrants investigation  -  it may be acceptable if driven by a deliberate land-and-expand strategy." },
      { question: "How does ARPU relate to LTV?", answer: "LTV = ARPU / Monthly Churn Rate (simplified). Higher ARPU directly increases LTV, making your unit economics more attractive. Improving ARPU is one of the most effective ways to improve LTV without reducing churn." },
      { question: "What actions can improve ARPU trend?", answer: "Introduce usage-based pricing tiers, launch premium add-on features, implement annual prepayment discounts that increase commitment, improve onboarding to drive faster value realization, and create upsell paths from free to paid and paid to premium tiers. Track ARPU trends per segment with [Baremetrics](https://baremetrics.com?via=saastainednumbers)." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
