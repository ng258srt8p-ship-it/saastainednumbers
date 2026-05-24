import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "nps-calculator",
  category: "growth-efficiency",
  meta: {
    title: "Net Promoter Score (NPS) Calculator",
    description: "Calculate your Net Promoter Score from survey responses  -  measure customer loyalty and predict growth.",
    keywords: ["nps", "net promoter score", "customer satisfaction", "loyalty", "survey"],
  },
  inputs: [
    { id: "promoters", label: "Promoters (score 9-10)", type: "number" as const, defaultValue: 200 },
    { id: "passives", label: "Passives (score 7-8)", type: "number" as const, defaultValue: 150 },
    { id: "detractors", label: "Detractors (score 0-6)", type: "number" as const, defaultValue: 50 },
  ],
  outputs: [
    { id: "nps", label: "Net Promoter Score", type: "number" as const, isPrimary: true },
    { id: "totalResponses", label: "Total Responses", type: "number" as const, isPrimary: false },
    { id: "promoterPct", label: "Promoter %", type: "percentage" as const, isPrimary: false },
  ],
  content: {
    intro: "Net Promoter Score (NPS) is the gold standard for measuring customer loyalty and predicting business growth. Based on a single question  -  'How likely are you to recommend us to a friend?'  -  NPS categorizes respondents into Promoters (9-10), Passives (7-8), and Detractors (0-6). The score ranges from -100 to +100. Companies with high NPS grow faster because Promoters drive word-of-mouth referrals and have lower churn. This calculator helps you compute your NPS from survey raw data and understand your customer loyalty profile.",
    howToUse: "Enter the number of Promoters (scores 9-10), Passives (scores 7-8), and Detractors (scores 0-6) from your latest NPS survey. The calculator will compute your overall NPS, total responses, and the percentage breakdown of each category.",
    formulaExplanation: "NPS = (Promoters ÷ Total Responses × 100) - (Detractors ÷ Total Responses × 100). Example: 200 Promoters, 150 Passives, 50 Detractors. Total = 400. Promoter % = 50%. Detractor % = 12.5%. NPS = 50% - 12.5% = 37.5",
    benchmarks: "According to Satmetrix and Bain & Company benchmarks, average B2B SaaS NPS is 30-40. Top-quartile SaaS companies achieve NPS of 60+. World-class NPS is 70+. Companies with NPS above 50 typically have strong organic growth through referrals. NPS below 0 indicates significant customer dissatisfaction. Industry leaders like Apple and Amazon consistently score 60-80.",
    benchmarkData: [
      { metric: "World-Class NPS", value: "70+", source: "Satmetrix/Bain" },
      { metric: "Excellent NPS", value: "50 - 70", source: "Satmetrix/Bain" },
      { metric: "Good NPS", value: "30 - 50", source: "Industry Standard" },
      { metric: "Average B2B SaaS", value: "30 - 40", source: "Satmetrix/Bain" },
      { metric: "Needs Improvement", value: "< 30", source: "Industry Standard" },
    ],
    relatedCalculators: ["customer-health-score-calculator", "churn-calculator", "nrr-calculator"],
    faq: [
      { question: "What is a good NPS for a SaaS company?", answer: "Above 50 is excellent. 30-50 is good. 0-30 is average. Below 0 is concerning. The average B2B SaaS NPS is 30-40 according to Satmetrix/Bain benchmarks." },
      { question: "How is NPS different from customer satisfaction (CSAT)?", answer: "NPS measures willingness to recommend (loyalty + growth). CSAT measures satisfaction with a specific interaction. NPS is more predictive of long-term growth; CSAT is better for transactional feedback." },
      { question: "How often should I survey NPS?", answer: "Quarterly is standard for B2B SaaS. Some companies use transaction-based NPS after key events (onboarding, support resolution). Annual surveys miss too much." },
      { question: "What response rate do I need for reliable NPS?", answer: "Aim for 30%+ response rate for statistical significance. Lower response rates may have response bias (unhappy customers are more likely to respond)." },
      { question: "How does NPS correlate with growth?", answer: "Companies with NPS 50+ grow at 2x+ the rate of companies with NPS below 20. Promoters drive referrals (lower CAC), renew at higher rates, and expand faster." },
      { question: "Should I benchmark NPS by industry?", answer: "Yes. SaaS NPS averages 30-40. E-commerce averages 50-60. Insurance averages 20-30. Always compare against your specific industry and segment." },
      { question: "How do I improve NPS?", answer: "Close the loop with detractors, fix product pain points, improve onboarding, enhance support quality, and build features that drive customer outcomes. Track NPS driver analysis." },
      { question: "Can NPS be manipulated?", answer: "Yes. Survey timing, question phrasing, and incentive structure can bias results. Use consistent methodology and benchmark against industry standards for accuracy." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
