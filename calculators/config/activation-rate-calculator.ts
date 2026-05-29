import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "activation-rate-calculator",
  category: "growth-efficiency",
  meta: {
    title: "Activation Rate Calculator",
    description: "Calculate the percentage of new signups that reach activation  -  your product's 'aha moment' and key leading indicator of retention.",
    keywords: ["activation rate", "product activation", "aha moment", "user onboarding", "saas metrics"],
  },
  inputs: [
    { id: "signups", label: "Total Signups", type: "number" as const, defaultValue: 1000 },
    { id: "activated", label: "Activated Users (reached aha moment)", type: "number" as const, defaultValue: 400 },
  ],
  outputs: [
    { id: "activationRate", label: "Activation Rate", type: "percentage" as const, isPrimary: true },
    { id: "notActivated", label: "Users Not Activated", type: "number" as const, isPrimary: false },
  ],
  content: {
    intro: "Activation Rate measures the percentage of new signups that reach a defined 'aha moment'  -  the point where a new user experiences your product's core value. It is the most important leading indicator of retention because users who activate are far more likely to become long-term customers. Unlike vanity metrics like signups, activation rate tells you whether your onboarding, product experience, and value proposition are actually working. Companies with strong onboarding consistently achieve activation rates above 50%, while poor onboarding can leave 70-80% of new users never experiencing core value. This calculator helps you measure and track your activation funnel.",
    howToUse: "Enter your total number of signups in a given period and the number of users who reached your defined activation milestone. The calculator will compute your activation rate. Track this metric weekly or monthly and segment by acquisition channel to identify which sources bring the most activatable users.",
    formulaExplanation: "Activation Rate = (Activated Users ÷ Total Signups) × 100. For example: 400 activated users out of 1,000 signups = 40% activation rate. Users Not Activated = Signups - Activated = 600 users who never experienced core value",
    benchmarks: "According to Reforge and industry benchmarks, top-quartile SaaS companies achieve 50-60% activation rates. Median activation rates range from 25-35%. Bottom-quartile companies see below 20%. B2B products typically have higher activation rates (40-60%) than B2C (20-40%) because of higher intent users.",
    benchmarkData: [
      { metric: "Top Quartile", value: "50-60%", source: "Reforge / Industry Reports" },
      { metric: "Median", value: "25-35%", source: "Reforge / Industry Reports" },
      { metric: "Bottom Quartile", value: "< 20%", source: "Reforge / Industry Reports" },
      { metric: "B2B Typical", value: "40-60%", source: "Industry Standard" },
      { metric: "B2C Typical", value: "20-40%", source: "Industry Standard" },
    ],
    relatedCalculators: ["mrr-calculator", "trial-to-paid-calculator", "churn-calculator"],
    faq: [
      { question: "What counts as activation?", answer: "Activation is the moment a user experiences your core value. For Slack, it's sending 2,000 messages. For Dropbox, it's saving the first file. Define activation based on the behavior that correlates with long-term retention in your product." },
      { question: "How is activation rate different from conversion rate?", answer: "Activation measures users reaching product value (product-led). Conversion measures users becoming paying customers (revenue-led). Activation should happen before conversion and is a predictor of conversion." },
      { question: "What is a good activation rate for SaaS?", answer: "Above 50% is excellent. Between 25-35% is median. Below 20% requires significant onboarding improvement. Top companies like Slack and Dropbox achieve 50-60%+." },
      { question: "How do I improve activation rate?", answer: "Simplify onboarding, reduce time-to-value, add interactive walkthroughs, personalize the first experience based on user persona, remove friction points, and measure drop-off at each step." },
      { question: "Should activation be measured by user or by account?", answer: "Both. User-level activation matters for product-led growth. Account-level activation matters for B2B with multiple stakeholders. Track both and correlate with retention." },
      { question: "How often should I track activation rate?", answer: "Weekly for growth-stage companies. Monthly for mature companies. If you're running onboarding experiments, track daily to measure iteration impact." },
      { question: "Does activation rate vary by channel?", answer: "Significantly. Referral traffic often has the highest activation rates (40-50%+). Paid ads may have lower activation (15-25%). Segment activation by source to optimize acquisition spend." },
      { question: "What happens after users activate?", answer: "Guide activated users to their next milestone: first value, first collaboration, first integration. Build habits through repeated value delivery. Activated users should then move to monetization." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "アクティベーション率計算機",
        description: "新規サインアップのうちアクティベーションに達した割合を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
