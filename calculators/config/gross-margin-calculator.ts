import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "gross-margin-calculator",
  category: "revenue",
  meta: {
    title: "Gross Margin Calculator",
    description: "Calculate your gross margin percentage, gross profit, and COGS percentage to understand your business profitability.",
    keywords: ["gross margin", "gross profit", "cogs", "profitability", "saas metrics"],
  },
  benchmarkMetric: "gross-margin",
  inputs: [
    { id: "revenue", label: "Total Revenue", type: "currency" as const, defaultValue: 100000 },
    { id: "cogs", label: "Cost of Goods Sold (COGS)", type: "currency" as const, defaultValue: 25000 },
  ],
  outputs: [
    { id: "grossMargin", label: "Gross Margin", type: "percentage" as const, isPrimary: true },
    { id: "grossProfit", label: "Gross Profit", type: "currency" as const, isPrimary: false },
    { id: "cogsPercentage", label: "COGS as % of Revenue", type: "percentage" as const, isPrimary: false },
  ],
  content: {
    intro: "Gross Margin is one of the most fundamental profitability metrics for any business. It measures the percentage of revenue that remains after deducting the direct costs of delivering your product or service (COGS). For SaaS companies, gross margin is especially important because high gross margins (typically 70-85%) are a defining characteristic of great software businesses. Gross margin determines how much revenue is available to fund sales, marketing, R&D, and G&A. This calculator helps you compute your gross margin, gross profit, and COGS percentage instantly.",
    howToUse: "Enter your total revenue and cost of goods sold (COGS) for any period. The calculator will compute gross margin percentage, gross profit amount, and COGS as a percentage of revenue. Use it to track margin trends month over month.",
    formulaExplanation: "Gross Profit = Revenue - COGS. Gross Margin = (Revenue - COGS) ÷ Revenue × 100. COGS % = COGS ÷ Revenue × 100. Example: Revenue = $100K, COGS = $25K. Gross Profit = $75K. Gross Margin = 75%. COGS % = 25%",
    benchmarks: "Top SaaS companies maintain gross margins of 75-85%. Good SaaS gross margin is 70-80%. Below 60% is concerning for a pure SaaS business. According to KeyBanc Capital Markets 2025 SaaS Survey, median public SaaS gross margin is 74%. High-end enterprise SaaS with significant services can have lower gross margins (50-65%). Infrastructure SaaS (cloud, hosting) typically has lower margins at 60-70%.",
    benchmarkData: [
      { metric: "Top SaaS Gross Margin", value: "75 - 85%", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Median SaaS Gross Margin", value: "74%", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Good SaaS Gross Margin", value: "70 - 80%", source: "SaaS Capital" },
      { metric: "Concerning for SaaS", value: "< 60%", source: "Industry Standard" },
      { metric: "Infrastructure SaaS", value: "60 - 70%", source: "Pacific Crest" },
    ],
    relatedCalculators: ["mrr-calculator", "ltv-calculator", "arpu-calculator"],
    faq: [
      { question: "What is a good gross margin for a SaaS company?", answer: "75-85% is excellent, 70-75% is good, 60-70% is acceptable. Below 60% suggests your cost structure needs attention  -  either pricing is too low or hosting/customer support costs are too high." },
      { question: "What costs should be included in COGS for SaaS?", answer: "Cloud infrastructure (AWS, GCP, Azure), hosting fees, CDN costs, database licenses, payment processing fees, customer support salaries, and onboarding costs. Exclude R&D, sales & marketing, and G&A. [ProfitWell](https://www.profitwell.com) helps track COGS and margin trends." },
      { question: "How is gross margin different from net margin?", answer: "Gross margin only subtracts direct costs (COGS). Net margin subtracts all expenses including R&D, sales & marketing, and G&A. Gross margin shows product profitability; net margin shows overall business profitability." },
      { question: "Why do SaaS companies have high gross margins?", answer: "Software has near-zero marginal cost of reproduction. Once built, serving additional customers costs very little (just hosting and support), enabling 70-85% margins that are impossible for physical goods businesses." },
      { question: "How does pricing affect gross margin?", answer: "Higher pricing directly improves gross margin if COGS stays constant. Usage-based pricing can compress margins at scale if infrastructure costs grow proportionally with revenue." },
      { question: "Can gross margin decrease as you scale?", answer: "Yes. Enterprise deals often require more support and onboarding, reducing gross margin. Multi-tenant SaaS typically maintains margins better than single-tenant deployments." },
      { question: "How should I track gross margin trends?", answer: "Track gross margin monthly and look for trends: declining margins may indicate rising cloud costs or increased support needs. Improving margins suggest economies of scale. Tools like [ChartMogul](https://chartmogul.com) can track this automatically." },
      { question: "What is the difference between gross margin and contribution margin?", answer: "Gross margin subtracts COGS from revenue. Contribution margin subtracts all variable costs including variable sales commissions and variable support costs. Contribution margin is more comprehensive." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
