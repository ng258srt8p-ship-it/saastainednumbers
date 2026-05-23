import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "operating-margin-calculator",
  category: "unit-economics",
  meta: {
    title: "Operating Margin Calculator",
    description: "Calculate your operating margin — operating income divided by revenue — to measure your business profitability.",
    keywords: ["operating margin", "profitability", "operating income", "ebitda", "saas metrics"],
  },
  inputs: [
    { id: "operatingIncome", label: "Operating Income", type: "currency" as const, defaultValue: 20000 },
    { id: "revenue", label: "Total Revenue", type: "currency" as const, defaultValue: 100000 },
  ],
  outputs: [
    { id: "operatingMargin", label: "Operating Margin", type: "percentage" as const, isPrimary: true },
  ],
  content: {
    intro: "Operating Margin measures how much profit a company makes from its core operations per dollar of revenue, after all operating expenses but before interest and taxes. It's one of the most important profitability metrics for SaaS companies because it captures the efficiency of the entire business — including R&D, sales & marketing, and G&A costs. Unlike gross margin (which only looks at COGS) or net margin (which includes non-operating items), operating margin focuses purely on operational efficiency. This calculator helps you track your operating margin and understand your business profitability.",
    howToUse: "Enter your operating income (revenue minus all operating expenses including R&D, S&M, and G&A) and total revenue. The calculator will compute your operating margin percentage. A positive margin means you're profitable from operations; negative means you're investing more than you earn.",
    formulaExplanation: "Operating Margin = Operating Income ÷ Revenue × 100. Example: Revenue = $100K, Operating Expenses = $80K. Operating Income = $20K. Operating Margin = $20K ÷ $100K × 100 = 20%",
    benchmarks: "According to KeyBanc Capital Markets 2025 SaaS Survey, median public SaaS operating margin is 10%. Top-quartile companies achieve 20%+. High-growth companies often have negative operating margins (-10% to -30%) as they invest in growth. Mature profitable SaaS companies target 15-25% operating margins. Rule of 40 combines operating margin with growth rate.",
    benchmarkData: [
      { metric: "Excellent Operating Margin", value: "20%+", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Median Public SaaS", value: "10%", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Good for Mature SaaS", value: "15 - 25%", source: "SaaS Capital" },
      { metric: "Growth Stage (Negative)", value: "-10% to -30%", source: "Industry Standard" },
      { metric: "Concerning (Mature)", value: "< 5%", source: "Industry Standard" },
    ],
    relatedCalculators: ["gross-margin-calculator", "contribution-margin-calculator", "rule-of-40-calculator"],
    faq: [
      { question: "What is a good operating margin for a SaaS company?", answer: "For mature companies: 15-25% is excellent, 10-15% is good, 5-10% needs improvement. Growth-stage companies often have negative margins as they invest in growth — evaluate alongside growth rate (Rule of 40)." },
      { question: "How is operating margin different from gross margin?", answer: "Gross margin only subtracts COGS. Operating margin subtracts ALL operating expenses including R&D, sales & marketing, and G&A. Operating margin is a more comprehensive measure of business profitability." },
      { question: "What is the difference between operating margin and EBITDA margin?", answer: "Operating margin uses operating income (GAAP). EBITDA margin adds back depreciation and amortization. EBITDA margin is typically 2-5 percentage points higher than operating margin for SaaS companies." },
      { question: "How does operating margin vary by company stage?", answer: "Early-stage: -20% to -50% (investing in product and GTM). Growth stage: -10% to +10%. Mature: +10% to +25%. The Rule of 40 provides context — high growth justifies negative margins." },
      { question: "How do I improve operating margin?", answer: "Increase revenue (pricing, expansion), reduce R&D costs (product efficiency), optimize S&M spend (channel efficiency), or reduce G&A (automation, outsourcing). Each lever has different impact and timing." },
      { question: "What costs are excluded from operating margin?", answer: "Interest expense, interest income, tax expense, and one-time items (restructuring, acquisition costs, legal settlements). These are non-operating items below the operating income line." },
      { question: "How does operating margin affect valuation?", answer: "Higher operating margins command higher revenue multiples. Public SaaS companies with 20%+ margins trade at 8-12x revenue, while those with negative margins trade at 3-6x revenue." },
      { question: "How often should I track operating margin?", answer: "Monthly for internal management. Quarterly for board reporting and investor updates. Track the trailing 12-month trend to identify whether profitability is improving or degrading." },
    ],
  },
  premium: true,
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
