import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "customer-engagement-score-calculator",
  category: "saas-deepen",
  meta: {
    title: "Customer Engagement Score Calculator",
    description: "Measure customer engagement using DAU/MAU ratio, session frequency, duration, and feature adoption.",
    keywords: ["customer engagement", "dau mau ratio", "engagement score", "user engagement", "product engagement", "saas metrics"],
  },
  benchmarkMetric: "customer-health",
  inputs: [
    { id: "dailyActiveUsers", label: "Daily Active Users (DAU)", type: "number" as const, defaultValue: 5000, min: 0 },
    { id: "monthlyActiveUsers", label: "Monthly Active Users (MAU)", type: "number" as const, defaultValue: 25000, min: 0 },
    { id: "sessionsPerUserPerMonth", label: "Sessions per User per Month", type: "number" as const, defaultValue: 12, min: 0 },
    { id: "avgSessionDurationMinutes", label: "Avg Session Duration (minutes)", type: "number" as const, defaultValue: 15, min: 0 },
    { id: "featureAdoptionRate", label: "Feature Adoption Rate (%)", type: "percentage" as const, defaultValue: 40, min: 0, max: 100 },
  ],
  outputs: [
    { id: "dauMauRatio", label: "DAU/MAU Ratio", type: "percentage" as const, isPrimary: true },
    { id: "engagementScore", label: "Engagement Score", type: "number" as const, isPrimary: true, suffix: "/100" },
    { id: "engagementCategory", label: "Engagement Category", type: "text" as const, isPrimary: false },
    { id: "totalMonthlySessions", label: "Total Monthly Sessions", type: "number" as const, isPrimary: false },
  ],
  content: {
    intro: "Customer engagement is the leading indicator of retention, expansion, and advocacy. Highly engaged customers churn less, spend more, and refer others. This calculator computes a composite engagement score based on five key metrics: DAU/MAU ratio (stickiness), session frequency, session duration, and feature adoption. Each component is weighted to give you a single score (0-100) and engagement category that helps you identify which customers need re-engagement and which are power users.",
    howToUse: "Enter your daily active users, monthly active users, average sessions per user per month, average session duration, and feature adoption rate. The calculator computes DAU/MAU ratio, a composite engagement score, and engagement category (At Risk, Moderate, Engaged, Highly Engaged).",
    formulaExplanation: "Engagement Score = (DAU/MAU × 40%) + (Sessions Frequency × 25%) + (Session Duration × 20%) + (Feature Adoption × 15%). Each component is normalized to 0-100. DAU/MAU > 50% is exceptional. > 8 sessions/user/month indicates daily or near-daily usage. > 20 min sessions indicate deep engagement. Feature adoption > 60% indicates strong product-market fit.",
    benchmarks: "Top-quartile SaaS products maintain DAU/MAU above 40%. Social/communication apps exceed 50%. Enterprise SaaS averages 20-30%. Session frequency varies: daily-use products target 20+ sessions/month, weekly-use target 5-8/month, monthly-use target 1-2/month. Feature adoption of 40-60% is typical for most products. Products with engagement scores above 70 see 50% lower churn and 2x higher expansion revenue. Use [Amplitude](https://amplitude.com) or [Mixpanel](https://mixpanel.com) for tracking.",
    benchmarkData: [
      { metric: "Top-Quartile DAU/MAU", value: "40%+", source: "Amplitude 2025" },
      { metric: "Social/Consumer DAU/MAU", value: "50-70%", source: "Industry Data" },
      { metric: "Enterprise SaaS DAU/MAU", value: "20-30%", source: "Industry Data" },
      { metric: "Healthy Feature Adoption Rate", value: "40-60%", source: "Mixpanel" },
      { metric: "Typical Session Duration (B2B)", value: "10-20 minutes", source: "Product Analytics" },
      { metric: "Engaged Users Churn Rate", value: "50% lower than disengaged", source: "Gainsight" },
    ],
    relatedCalculators: ["customer-health-score-calculator", "nps-calculator"],
    faq: [
      { question: "What is a good DAU/MAU ratio?", answer: "For social/communication products: 50%+ is excellent (users engage daily). For B2B SaaS: 20-40% is healthy (users engage multiple times per week). Below 20% indicates low stickiness  -  users visit occasionally but haven't built a habit. DAU/MAU is one of the strongest predictors of long-term retention." },
      { question: "How do different engagement metrics correlate?", answer: "DAU/MAU predicts retention. Session frequency predicts habit formation. Session duration predicts value realization. Feature adoption predicts expansion revenue. A balanced score across all dimensions is more predictive than excelling in any single metric. Use composite scores for customer health monitoring." },
      { question: "What is the engagement score threshold for at-risk customers?", answer: "Scores below 40 indicate high risk of churn. Customers with scores below 30 are likely to churn within 90 days. Scores of 40-60 need re-engagement campaigns. Scores of 60-80 are healthy. Scores above 80 are champions  -  likely to expand and refer. Set automated triggers at each threshold." },
      { question: "How do I improve DAU/MAU ratio?", answer: "Build habit-forming features: email/web push notifications, daily digest emails, streak tracking, in-app reminders, and personalized dashboards. Reduce time-to-value so users see results in their first session. Add sticky features that accumulate value over time (history, saved data, personalization)." },
      { question: "What is the relationship between engagement and revenue?", answer: "Highly engaged users (score 80+) typically have 2-4x higher lifetime value than disengaged users (score under 40). They churn less, upgrade more, and refer more. A 10-point increase in engagement score correlates with 15-25% higher NRR (Net Revenue Retention)." },
      { question: "How does engagement vary by user segment?", answer: "Power users (top 10%) often have scores of 85-100. Average users: 40-60. New users: 10-30 (increasing as they learn the product). Segment your engagement score by: user role, plan tier, acquisition channel, and team size. Each segment may need different re-engagement strategies." },
      { question: "What are the best tools for tracking engagement?", answer: "Amplitude (best for product analytics), Mixpanel (user behavior tracking), Pendo (in-app guidance + analytics), Heap (auto-capture analytics), and PostHog (open-source product analytics). Most offer free tiers for up to 10K monthly tracked users. Integrate with your CRM for a complete customer view." },
      { question: "How often should I measure engagement?", answer: "Daily for DAU/MAU and session metrics. Weekly for cohort engagement trends. Monthly for full engagement score and segmentation analysis. Real-time monitoring for automated triggers (drop below 40 score → trigger re-engagement sequence). Quarterly for strategic engagement initiatives and product improvements." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
