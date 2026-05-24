import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "acv-calculator",
  category: "revenue",
  meta: {
    title: "ACV Calculator",
    description: "Calculate your Annual Contract Value (ACV) and Total Contract Value (TCV) for subscription agreements.",
    keywords: ["acv", "annual contract value", "tcv", "total contract value", "saas metrics", "subscription"],
  },
  inputs: [
    { id: "totalContractValue", label: "Total Contract Value (TCV)", type: "currency" as const, defaultValue: 60000 },
    { id: "contractDurationYears", label: "Contract Duration (years)", type: "number" as const, defaultValue: 3 },
  ],
  outputs: [
    { id: "acv", label: "Annual Contract Value (ACV)", type: "currency" as const, isPrimary: true },
    { id: "tcv", label: "Total Contract Value (TCV)", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Annual Contract Value (ACV) and Total Contract Value (TCV) are essential metrics for understanding your sales performance and revenue composition. ACV represents the annualized value of a customer contract, excluding one-time fees. TCV is the total value of the contract over its full duration. These metrics help SaaS companies normalize revenue comparisons across contracts of different lengths and sizes. Sales teams use ACV to track deal size trends, and investors use it to evaluate revenue quality and predictability.",
    howToUse: "Enter the total contract value (TCV) and contract duration in years. The calculator will compute the annualized contract value (ACV). Use this to evaluate deal sizes and compare contracts of different lengths.",
    formulaExplanation: "ACV = Total Contract Value ÷ Contract Duration (Years). TCV = Total Contract Value. Example: 3-year contract worth $60,000 total. ACV = $60,000 ÷ 3 = $20,000/year. TCV = $60,000",
    benchmarks: "According to SaaS Capital and KeyBanc, median SaaS ACV varies significantly by segment: SMB ACV averages $100-500/year, Mid-Market ACV averages $5K-50K/year, and Enterprise ACV averages $50K-500K+/year. Companies with ACV above $25K typically require sales-assisted go-to-market. Self-serve companies typically have ACV under $2K. Higher ACV generally correlates with lower gross retention but higher net retention.",
    benchmarkData: [
      { metric: "SMB ACV", value: "$100 - $500 / year", source: "SaaS Capital" },
      { metric: "Mid-Market ACV", value: "$5K - $50K / year", source: "SaaS Capital" },
      { metric: "Enterprise ACV", value: "$50K - $500K+ / year", source: "KeyBanc SaaS Survey" },
      { metric: "Self-Serve ACV", value: "< $2K / year", source: "OpenView Partners" },
      { metric: "Sales-Assisted Threshold", value: "$25K+ ACV", source: "Pacific Crest" },
    ],
    relatedCalculators: ["mrr-calculator", "arpu-calculator", "ltv-calculator"],
    faq: [
      { question: "What is the difference between ACV and ARR?", answer: "ACV is the annualized value of a single contract. ARR is the annualized value of all contracts combined (sum of all customer ACVs). ACV is per-customer; ARR is company-wide." },
      { question: "Should I include one-time fees in ACV?", answer: "No. ACV should only include recurring subscription revenue. Exclude setup fees, implementation fees, hardware sales, and professional services from ACV calculations." },
      { question: "How does contract length affect ACV?", answer: "Longer contracts spread the total value over more years, reducing annual ACV but improving retention and predictability. Shorter contracts have higher annual ACV but more churn risk." },
      { question: "What is a good ACV for a SaaS company?", answer: "It depends on your business model. Higher ACV enables sales-assisted GTM but has longer sales cycles. Lower ACV enables self-serve but requires volume. Know your segment benchmarks." },
      { question: "How does ACV affect sales compensation?", answer: "Many SaaS companies structure sales comp around ACV rather than TCV. Sales reps are often paid a percentage of ACV to normalize commission across different contract lengths." },
      { question: "Should I track ACV by deal size segment?", answer: "Yes. Segment ACV into small ($1K-5K), mid ($5K-50K), and large ($50K+). Each segment has different sales motions, churn rates, and customer success requirements." },
      { question: "How does ACV relate to customer acquisition cost?", answer: "A healthy ACV:CAC ratio is typically 3:1 or higher. If ACV is $20K and CAC is $10K, payback is 6 months and LTV:CAC should be 3:1+ with good retention." },
      { question: "What is the difference between ACV and ARPU?", answer: "ACV is annual (per customer per year). ARPU is monthly (per customer per month). ACV = ARPU × 12. ARPU is more common for monthly subscription businesses; ACV for annual contracts." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
