import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "unit-economics-dashboard-calculator",
  category: "saas-deepen",
  meta: {
    title: "Unit Economics Dashboard Calculator",
    description: "Track your SaaS unit economics with a comprehensive dashboard showing LTV/CAC ratio, contribution margin, payback period, MRR, and gross profit per customer.",
    keywords: ["unit economics", "saas metrics", "ltv cac ratio", "contribution margin", "payback period", "mrr", "gross profit per customer"],
  },
  inputs: [
    { id: "cac", label: "Customer Acquisition Cost (CAC)", type: "currency" as const, defaultValue: 500, min: 0 },
    { id: "ltv", label: "Customer Lifetime Value (LTV)", type: "currency" as const, defaultValue: 3000, min: 0 },
    { id: "arpu", label: "Average Revenue Per User (ARPU)", type: "currency" as const, defaultValue: 100, min: 0 },
    { id: "grossMargin", label: "Gross Margin", type: "percentage" as const, defaultValue: 70, min: 0, max: 100 },
    { id: "churnRate", label: "Monthly Churn Rate", type: "percentage" as const, defaultValue: 5, min: 0, max: 100 },
    { id: "customerCount", label: "Total Customers", type: "number" as const, defaultValue: 500, min: 0 },
  ],
  outputs: [
    { id: "ltvCacRatio", label: "LTV/CAC Ratio", type: "number" as const, isPrimary: true },
    { id: "contributionMargin", label: "Contribution Margin (per customer)", type: "currency" as const, isPrimary: false },
    { id: "paybackPeriodMonths", label: "Payback Period", type: "number" as const, isPrimary: false, suffix: " months" },
    { id: "mrr", label: "Monthly Recurring Revenue", type: "currency" as const, isPrimary: false },
    { id: "grossProfitPerCustomer", label: "Gross Profit Per Customer", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "A Unit Economics Dashboard gives SaaS founders and operators a single-pane view of the most critical financial metrics that determine business viability and growth potential. By bringing together CAC, LTV, ARPU, gross margin, churn rate, and customer count, this dashboard calculates your LTV/CAC ratio, contribution margin, payback period, overall MRR, and gross profit per customer. Together, these metrics tell you whether your customer acquisition engine is efficient, whether your pricing supports sustainable growth, and how quickly you recoup your customer acquisition investment. Investors and board members expect to see these numbers in every quarterly review because they collectively answer the most important question: does your SaaS business model work at scale? Healthy unit economics are the foundation of every great SaaS company, from early-stage startups to public enterprises. Use this dashboard to assess your current health, identify improvement areas, and track progress over time.",
    howToUse: "Enter your CAC, LTV, ARPU, gross margin percentage, monthly churn rate, and total customer count. The dashboard instantly computes your LTV/CAC ratio, contribution margin per customer, payback period in months, total MRR, and gross profit per customer. Review each output to identify whether your unit economics are healthy or need attention.",
    formulaExplanation: "LTV/CAC Ratio = LTV / CAC. Contribution Margin = ARPU × (Gross Margin / 100). Payback Period = CAC / Contribution Margin. MRR = ARPU × Customer Count. Gross Profit Per Customer = ARPU × (Gross Margin / 100). A healthy LTV/CAC ratio is above 3x. Payback period under 12 months is standard for SaaS. Contribution margin must be positive for each customer to be profitable.",
    benchmarks: "Top-quartile SaaS companies maintain an LTV/CAC ratio above 5x with a median of 3-5x. Payback period benchmarks vary by segment: enterprise SaaS typically targets under 12 months, while SMB SaaS can stretch to 18 months. Contribution margin should exceed 60% for healthy SaaS businesses. According to KeyBanc 2025 SaaS Survey, best-in-class companies have payback periods under 6 months and LTV/CAC ratios above 7x.",
    benchmarkData: [
      { metric: "Excellent LTV/CAC Ratio", value: "> 5x", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Good LTV/CAC Ratio", value: "3 - 5x", source: "Pacific Crest" },
      { metric: "Contribution Margin (Best-in-Class)", value: "> 75%", source: "SaaS Capital" },
      { metric: "Payback Period (Enterprise)", value: "< 12 months", source: "OpenView" },
      { metric: "Payback Period (SMB)", value: "< 18 months", source: "OpenView" },
    ],
    relatedCalculators: ["cac-calculator", "ltv-calculator", "arpu-calculator", "gross-margin-calculator"],
    faq: [
      { question: "What is a good LTV/CAC ratio for SaaS?", answer: "A ratio above 3x indicates healthy unit economics. Above 5x is excellent. Below 1.5x means you are spending too much to acquire customers and need to improve CAC efficiency or increase LTV through retention and expansion." },
      { question: "What is contribution margin and why does it matter?", answer: "Contribution margin is ARPU minus the cost of serving that customer (excluding acquisition costs). It represents the gross profit each customer generates per month, which must cover CAC within a reasonable payback period for the business to be sustainable." },
      { question: "How does churn rate affect payback period?", answer: "Higher churn means customers leave faster, so you need a shorter payback period to recoup CAC before they cancel. With 5% monthly churn, customers stay about 20 months on average, so payback under 12 months is essential to be profitable." },
      { question: "What is the ideal payback period for SaaS?", answer: "Under 12 months is standard for enterprise SaaS. Under 6 months is excellent. For SMB or self-serve products with lower ARPU, up to 18 months may be acceptable. Payback beyond 24 months indicates inefficient acquisition or pricing." },
      { question: "Does ARPU include all revenue from a customer?", answer: "ARPU should include all recurring revenue streams including base subscription, usage-based overages, and add-on modules. Exclude one-time fees like setup charges and professional services for a true recurring revenue picture." },
      { question: "How do gross margins affect unit economics?", answer: "Higher gross margins mean more of each revenue dollar contributes to covering CAC and operating expenses. SaaS companies typically target 70-85% gross margins. Margins below 50% make it difficult to achieve healthy payback periods." },
      { question: "What MRR benchmarks should I track against?", answer: "Compare your MRR growth rate to stage-appropriate benchmarks. Early-stage companies should target 15-25% MoM growth. Growth-stage companies aim for 5-10% MoM. Use MRR in conjunction with unit economics to evaluate growth efficiency." },
      { question: "How often should I review unit economics?", answer: "Monthly review is standard for active SaaS companies. Track trends over 3-6 months to identify deterioration early. Quarterly deep dives with cohort analysis help you understand how unit economics evolve as you scale and acquire different customer segments." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
