import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "rule-of-40-calculator",
  category: "growth-efficiency",
  meta: {
    title: "Rule of 40 Calculator",
    description: "Calculate your Rule of 40 score  -  revenue growth rate plus profit margin  -  to measure your SaaS company's health.",
    keywords: ["rule of 40", "saas rule of 40", "growth", "profitability", "saas metrics"],
  },
  benchmarkMetric: "rule-of-40",
  inputs: [
    { id: "revenueGrowthRate", label: "Revenue Growth Rate (%)", type: "percentage" as const, defaultValue: 30 },
    { id: "profitMargin", label: "Profit Margin (%)", type: "percentage" as const, defaultValue: 10 },
  ],
  outputs: [
    { id: "ruleOf40Score", label: "Rule of 40 Score", type: "number" as const, isPrimary: true, suffix: "%" },
    { id: "meetsThreshold", label: "Meets 40% Threshold", type: "text" as const, isPrimary: false },
  ],
  content: {
    intro: "The Rule of 40 is the most widely used health metric for SaaS companies. It states that a company's revenue growth rate plus profit margin should equal or exceed 40%. A company growing at 30% with a 10% profit margin scores 40  -  the threshold for a healthy SaaS business. The rule recognizes that high-growth companies may sacrifice profitability (negative margins) as long as growth is strong enough to compensate. This metric is used by investors, board members, and management teams to evaluate whether a company is striking the right balance between growth and profitability.",
    howToUse: "Enter your year-over-year revenue growth rate (as a percentage) and your current profit margin (as a percentage). Profit margin can be negative for high-growth companies. The calculator will compute your Rule of 40 score and tell you whether you meet the threshold.",
    formulaExplanation: "Rule of 40 = Revenue Growth Rate (%) + Profit Margin (%). Example: Growth = 30%, Margin = 10%. Score = 30 + 10 = 40. The company meets the threshold. A company growing at 50% with -15% margin scores 35 = 50 - 15 = 35. Below 40 but close.",
    benchmarks: "According to KeyBanc Capital Markets 2025 SaaS Survey, median public SaaS Rule of 40 score is 35. Top-quartile companies score 50+. Companies above 40 are considered healthy and well-balanced. Companies below 20 are typically struggling with either growth or profitability. High-growth companies (50%+ growth) can have negative margins, while mature companies (10-20% growth) should be profitable.",
    benchmarkData: [
      { metric: "Excellent", value: "50+", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Good (Meets Threshold)", value: "40+", source: "General benchmark" },
      { metric: "Median Public SaaS", value: "35", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Needs Improvement", value: "20 - 40", source: "General benchmark" },
      { metric: "Concerning", value: "< 20", source: "General benchmark" },
    ],
    relatedCalculators: ["gross-margin-calculator", "operating-margin-calculator", "mrr-growth-rate-calculator"],
    faq: [
      { question: "What is a good Rule of 40 score?", answer: "40+ is the threshold. 50+ is excellent. Companies scoring 40+ are considered healthy and can balance growth and profitability. Below 40 means one of the two dimensions needs attention." },
      { question: "Can a company with negative margins have a good Rule of 40?", answer: "Yes. A company growing 60% with -20% margin scores 40 (60 - 20). High growth compensates for negative profitability. The rule allows trade-offs between growth and profit." },
      { question: "How does the Rule of 40 vary by company stage?", answer: "Early-stage companies typically have high growth (50-100%) and negative margins (-20 to -50%), still hitting 40+. Mature companies have lower growth (15-25%) but positive margins (15-25%)." },
      { question: "What profit margin should I use?", answer: "Use operating margin (EBITDA margin or operating income / revenue). Free cash flow margin is also acceptable. Use consistent definitions when comparing across periods." },
      { question: "How often should I calculate Rule of 40?", answer: "Quarterly is standard. Annual is common for board reporting. Track the trend  -  improving scores indicate better balance between growth and efficiency." },
      { question: "What if my Rule of 40 is below 40?", answer: "Focus on improving either growth (through product investment, GTM expansion) or profitability (cost reduction, pricing optimization). Address the weaker dimension first." },
      { question: "Does the Rule of 40 apply to non-SaaS businesses?", answer: "It was designed for SaaS but applies to any recurring-revenue business. Professional services and hardware businesses typically don't use this metric." },
      { question: "How do investors use the Rule of 40?", answer: "Public market investors use it to value SaaS companies. Companies with higher Rule of 40 scores command higher revenue multiples. It's a standard slide in board meetings and earnings calls." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "Rule of 40計算機",
        description: "収益成長率に利益率を加えたRule of 40スコアを計算してSaaS企業の健全性を測定します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
