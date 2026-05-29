import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "feature-adoption-rate-calculator",
  category: "saas-deepen",
  meta: {
    title: "Feature Adoption Rate Calculator",
    description: "Calculate your SaaS feature adoption rate, measure the gap to target adoption, and determine how many additional users need to adopt a feature to hit your goals.",
    keywords: ["feature adoption", "product adoption", "saas metrics", "user engagement", "feature usage"],
  },
  benchmarkMetric: "activation-rate",
  inputs: [
    { id: "totalUsers", label: "Total Users", type: "number" as const, defaultValue: 1000, min: 1 },
    { id: "usersUsingFeature", label: "Users Using Feature", type: "number" as const, defaultValue: 300, min: 0 },
    { id: "targetAdoptionRate", label: "Target Adoption Rate", type: "percentage" as const, defaultValue: 50, min: 0, max: 100 },
  ],
  outputs: [
    { id: "adoptionRate", label: "Current Adoption Rate", type: "percentage" as const, isPrimary: true },
    { id: "gapToTarget", label: "Gap to Target", type: "percentage" as const, isPrimary: false },
    { id: "usersNeeded", label: "Additional Users Needed", type: "number" as const, isPrimary: false },
    { id: "status", label: "Adoption Status", type: "text" as const, isPrimary: false },
  ],
  content: {
    intro: "Feature Adoption Rate measures the percentage of your total user base that actively uses a specific feature within your SaaS product. This is one of the most important product-led growth metrics because it directly correlates with customer retention, engagement, and perceived value. If users are not adopting key features, they are not experiencing your product's full value proposition, which increases churn risk. Product managers and growth teams use feature adoption rates to prioritize product investments, improve onboarding flows, and identify features that need better in-app education. Low adoption on a high-investment feature signals a need for redesign, better discoverability, or more targeted user communication. This calculator helps you quantify your current adoption rate, understand the gap to your target, and calculate exactly how many additional users need to adopt to reach your adoption goals. Track adoption rates over time to measure the impact of product changes and growth initiatives.",
    howToUse: "Enter your total user count, the number of users currently using the feature, and your target adoption rate percentage. The calculator will compute your current adoption rate, the gap to target, how many additional users need to adopt, and an overall adoption status ranging from Critical to On Track.",
    formulaExplanation: "Adoption Rate = (Users Using Feature / Total Users) × 100. Gap to Target = Target Adoption Rate - Current Adoption Rate. Users Needed = Total Users × (Target Adoption Rate / 100) - Users Using Feature. Status is determined by how close you are to target: 100%+ = On Track, 75-100% = Needs Improvement, below 75% = Critical.",
    benchmarks: "Best-in-class SaaS products see 60-80% feature adoption for core features. According to Mixpanel and Amplitude, the median feature adoption rate across all SaaS products is approximately 20-30%. Top-quartile products achieve 50%+ adoption on their top 5 features. Features below 10% adoption should be evaluated for improvement or deprecation. Onboarding features should target 80%+ adoption within the first 30 days.",
    benchmarkData: [
      { metric: "Top-Quartile Feature Adoption", value: "50 - 80%", source: "Mixpanel" },
      { metric: "Median Feature Adoption", value: "20 - 30%", source: "Amplitude" },
      { metric: "Core Feature Target", value: "60 - 80%", source: "Product School" },
      { metric: "Onboarding Feature Target", value: "80%+", source: "Userpilot" },
      { metric: "Consider Deprecation", value: "< 10%", source: "Product School" },
    ],
    relatedCalculators: ["activation-rate-calculator", "customer-engagement-score-calculator", "time-to-value-calculator"],
    faq: [
      { question: "What is a good feature adoption rate?", answer: "Core features should target 60-80% adoption. Secondary features at 20-40% are acceptable. Features below 10% adoption should be evaluated for improvement, better positioning, or deprecation. Benchmarks vary by product category and user segment." },
      { question: "How do I increase feature adoption?", answer: "Improve in-app discovery with tooltips and walkthroughs, simplify the feature UX, add contextual prompts at the right moment in the user journey, send targeted emails highlighting the feature's value, and integrate the feature into onboarding flows." },
      { question: "What is the difference between adoption and activation?", answer: "Activation is the moment a user experiences core value (the aha moment). Adoption is ongoing usage of a specific feature. Activation typically happens within the first session, while adoption is measured over days and weeks after signup." },
      { question: "Why should I track gap to target adoption?", answer: "The gap tells you how far you are from your goal and how much work remains. If the gap is widening over time, your product changes or user education efforts are not working. A narrowing gap validates that your adoption initiatives are effective." },
      { question: "How many users should use each feature?", answer: "For your top 3-5 core features, target 50-80% adoption. Power users will adopt more features, while casual users may only use 1-2. Segment analysis by user persona or plan tier gives more actionable insight than overall averages." },
      { question: "What causes low feature adoption?", answer: "Poor discoverability (users do not know the feature exists), high complexity (too hard to use), weak value proposition (not solving a real problem), bad timing (feature shown at wrong moment), or lack of integration into existing workflows." },
      { question: "How does feature adoption affect retention?", answer: "Users who adopt 3+ features have significantly higher retention rates. Data from Amplitude shows that feature adoption is one of the strongest leading indicators of long-term retention. Each additional adopted feature reduces churn probability by 10-20%." },
      { question: "What tools measure feature adoption?", answer: "Amplitude, Mixpanel, Heap, Pendo, PostHog, and Hotjar all offer feature adoption tracking. Most product analytics platforms allow you to tag features and track usage rates over time with cohort analysis and funnel visualization." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "機能採用率計算機",
        description: "SaaSの機能採用率を計算し、目標採用率とのギャップを測定します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
