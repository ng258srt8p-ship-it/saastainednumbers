import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "customer-health-score-calculator",
  category: "churn-retention",
  meta: {
    title: "Customer Health Score Calculator",
    description: "Calculate your customer health score based on NPS, product usage, support tickets, and engagement to predict retention risk.",
    keywords: ["customer health score", "churn prediction", "customer success", "saas metrics", "retention"],
  },
  inputs: [
    { id: "nps", label: "NPS Score (-100 to 100)", type: "number" as const, defaultValue: 50, min: -100, max: 100 },
    { id: "productUsageScore", label: "Product Usage Score (0-100)", type: "number" as const, defaultValue: 70, min: 0, max: 100 },
    { id: "supportTickets", label: "Support Tickets (last 30 days)", type: "number" as const, defaultValue: 2, min: 0 },
    { id: "daysSinceLastLogin", label: "Days Since Last Login", type: "number" as const, defaultValue: 5, min: 0 },
  ],
  outputs: [
    { id: "healthScore", label: "Health Score", type: "number" as const, isPrimary: true, suffix: "/100" },
    { id: "healthCategory", label: "Health Category", type: "number" as const, isPrimary: false },
  ],
  content: {
    intro: "Customer Health Score is a composite metric that predicts the likelihood of customer retention or churn. By combining NPS (customer sentiment), product adoption (usage depth), support experience (ticket volume), and engagement (login frequency), you get a single score that reveals which customers need attention. Proactive customer success teams use health scores to intervene before customers churn. This calculator helps you score individual customers or segments and take action based on their health category — from At Risk to Champion.",
    howToUse: "Enter the customer's NPS score, product usage score (0-100), support tickets in the last 30 days, and days since last login. The calculator will compute a composite health score (0-100) and category. Use the category to prioritize customer success interventions.",
    formulaExplanation: "Health Score = (Normalized NPS × 0.25) + (Usage Score × 0.35) + (Support Score × 0.20) + (Engagement Score × 0.20). Normalized NPS = (NPS + 100) ÷ 2. Support Score = max(0, 100 - tickets × 10). Engagement Score = max(0, 100 - daysSinceLogin × 2). Score > 80: Champion, 60-80: Healthy, 40-60: Needs Attention, < 40: At Risk",
    benchmarks: "Best-in-class SaaS companies maintain average customer health scores above 70. Companies with proactive customer success programs see 20-40% reduction in churn. According to Gainsight and Totango, customers with health scores below 50 have a 60%+ probability of churning within 90 days. Customers with scores above 80 have less than 5% churn probability.",
    benchmarkData: [
      { metric: "Champion (Very Low Churn Risk)", value: "80 - 100", source: "Gainsight" },
      { metric: "Healthy (Low Churn Risk)", value: "60 - 80", source: "Gainsight" },
      { metric: "Needs Attention (Medium Risk)", value: "40 - 60", source: "Totango" },
      { metric: "At Risk (High Churn Probability)", value: "< 40", source: "Totango" },
      { metric: "Churn Probability Below 50 Score", value: "60%+", source: "Gainsight" },
    ],
    relatedCalculators: ["churn-calculator", "nrr-calculator", "nps-calculator"],
    faq: [
      { question: "What is a good customer health score?", answer: "Above 70 is excellent. 60-70 is healthy. 40-60 needs monitoring. Below 40 indicates high churn risk. Track the distribution of scores across your customer base." },
      { question: "How often should I calculate health scores?", answer: "Weekly for high-value customers. Monthly for the full customer base. Real-time scoring is ideal for automated customer success workflows." },
      { question: "What actions should I take for at-risk customers?", answer: "Schedule executive check-ins, provide additional training, offer success plans, reduce friction in the product, and consider proactive outreach from customer success." },
      { question: "Can health score predict churn?", answer: "Yes. Companies with proactive health scoring see 20-40% churn reduction. Health scores below 50 correlate with 60%+ churn probability within 90 days." },
      { question: "What metrics should be included in health score?", answer: "Product adoption (feature usage, logins), sentiment (NPS, CSAT), support experience (ticket volume, resolution time), and business outcomes (time-to-value, goal achievement)." },
      { question: "How do different customer segments score?", answer: "Enterprise customers typically score higher on engagement but may have more tickets. SMB customers may have lower engagement scores but fewer tickets. Adjust thresholds by segment." },
      { question: "What is a leading vs lagging health indicator?", answer: "Product usage and login frequency are leading indicators (predict future churn). NPS and support tickets are lagging indicators (reflect past experience). Combine both." },
      { question: "How do I build an automated health scoring system?", answer: "Start with this calculator's formula, then refine weights based on your data. Integrate with your CRM and product analytics to update scores automatically." },
    ],
  },
  premium: true,
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
