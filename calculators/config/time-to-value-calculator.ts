import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "time-to-value-calculator",
  category: "saas-deepen",
  meta: {
    title: "Time to Value Calculator",
    description: "Calculate your SaaS time-to-value metric, measure how many users achieve value within your target timeframe, and determine whether your onboarding is effective.",
    keywords: ["time to value", "ttv", "saas onboarding", "customer onboarding", "value realization"],
  },
  inputs: [
    { id: "totalDaysToValue", label: "Average Days to Value", type: "number" as const, defaultValue: 14, min: 0 },
    { id: "targetDays", label: "Target Days to Value", type: "number" as const, defaultValue: 7, min: 1 },
    { id: "completedUsers", label: "Users Who Reached Value", type: "number" as const, defaultValue: 60, min: 0 },
    { id: "totalUsers", label: "Total Users in Cohort", type: "number" as const, defaultValue: 100, min: 1 },
  ],
  outputs: [
    { id: "averageDaysToValue", label: "Average Days to Value", type: "number" as const, isPrimary: false, suffix: " days" },
    { id: "onTrackPercent", label: "On-Track Percentage", type: "percentage" as const, isPrimary: true },
    { id: "status", label: "TTV Status", type: "text" as const, isPrimary: false },
    { id: "daysGap", label: "Days Gap to Target", type: "number" as const, isPrimary: false, suffix: " days" },
  ],
  content: {
    intro: "Time to Value (TTV) is the time it takes for a new customer to realize meaningful value from your SaaS product. It is one of the most critical onboarding metrics because it directly predicts activation, retention, and long-term customer success. A shorter TTV means customers experience your core value proposition faster, reducing the risk of early churn and accelerating the path to expansion revenue. TTV is measured from the moment a user first signs up until they achieve a predefined value milestone, such as completing a key workflow, generating their first report, or inviting their first team member. Leading SaaS companies obsess over TTV because reducing it by even a few days can have a dramatic impact on conversion rates, customer satisfaction scores, and net revenue retention. This calculator helps you assess your current TTV performance, compare it to your target, and understand how many users are hitting the value milestone on time.",
    howToUse: "Enter the average days it takes users to reach value, your target days to value, how many users in the current cohort reached value, and the total number of users in the cohort. The calculator shows your average TTV, the percentage on track, a status rating, and the gap between your actual and target TTV.",
    formulaExplanation: "Average Days to Value = Total Days to Value (the current measured average). On-Track Percentage = (Users Who Reached Value / Total Users) × 100. Days Gap = Target Days - Average Days to Value. A positive gap means you are ahead of target. Status: Good if average ≤ target, Needs Improvement if average ≤ target × 1.5, Poor if average > target × 1.5.",
    benchmarks: "Best-in-class SaaS companies achieve TTV under 7 days for self-serve products and under 14 days for enterprise products. According to Gainsight and customer success benchmarks, reducing TTV by 30% correlates with a 15-20% improvement in net revenue retention. Products with TTV under 5 minutes (like Slack or Dropbox) have conversion rates above 10%. Enterprise products with TTV under 30 days achieve 90%+ onboarding completion rates.",
    benchmarkData: [
      { metric: "Self-Serve TTV (Best-in-Class)", value: "< 7 days", source: "Gainsight" },
      { metric: "Enterprise TTV (Good)", value: "< 14 days", source: "Gainsight" },
      { metric: "Enterprise TTV (Acceptable)", value: "< 30 days", source: "Customer Success Collective" },
      { metric: "Instant-Value Products (Slack/Dropbox)", value: "< 5 minutes", source: "Industry Standard" },
      { metric: "On-Track Percentage Target", value: "80%+", source: "Product School" },
    ],
    relatedCalculators: ["feature-adoption-rate-calculator", "activation-rate-calculator", "customer-health-score-calculator"],
    faq: [
      { question: "What is a good time-to-value for SaaS?", answer: "For self-serve products, under 7 days is excellent. For enterprise products with complex implementations, under 14 days is good and under 30 days is acceptable. The faster users reach value, the higher your activation and retention rates." },
      { question: "How do I reduce time-to-value?", answer: "Simplify onboarding flows, add in-app guidance and tutorials, provide templates and sample data, offer proactive customer success outreach, remove unnecessary steps, and use progressive disclosure to focus users on the core value path first." },
      { question: "What is the difference between TTV and onboarding?", answer: "Onboarding is the entire process of getting a customer set up and educated. TTV is specifically the moment they realize value. A customer can complete onboarding but still not have reached TTV if they have not experienced the core value proposition." },
      { question: "How does TTV affect churn?", answer: "Longer TTV directly correlates with higher early-stage churn. Customers who do not reach value within their expected timeframe are more likely to cancel before their next billing cycle. Reducing TTV is one of the most effective churn reduction strategies." },
      { question: "What is the ideal TTV for different SaaS types?", answer: "Consumer/self-serve: minutes to hours. SMB SaaS: 1-7 days. Mid-market: 7-14 days. Enterprise: 14-30 days. Low-touch products must have shorter TTV because there is no human-guided onboarding to compensate." },
      { question: "How should I measure TTV?", answer: "Define your value milestone as a specific user action that signals core value realization (e.g., first report generated, first team invite sent, first API call completed). Measure from signup to that action using product analytics or CRM tracking." },
      { question: "What factors extend TTV?", answer: "Complex setup requirements, lack of onboarding guidance, unclear value proposition, required integrations that take time, data import friction, multiple stakeholder approvals, and steep learning curves all extend TTV." },
      { question: "Can TTV vary by customer segment?", answer: "Yes. Enterprise customers typically have longer TTV due to implementation complexity and multiple stakeholders. Self-serve customers expect near-instant value. Segment your TTV analysis by plan type, customer size, and acquisition channel for actionable insights." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "タイムトゥーバリュー計算機",
        description: "SaaSのタイムトゥーバリューを測定し、目標期間内に価値を実現するユーザー数を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
