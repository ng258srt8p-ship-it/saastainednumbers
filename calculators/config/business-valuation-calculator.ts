import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "business-valuation-calculator",
  category: "general-business",
  meta: {
    title: "Business Valuation Calculator",
    description: "Estimate your business value using revenue multiple and EBITDA multiple methods with growth-adjusted blended valuation.",
    keywords: ["business valuation", "company valuation", "revenue multiple", "EBITDA multiple", "business worth", "sell business", "valuation method"],
  },
  inputs: [
    { id: "annualRevenue", label: "Annual Revenue ($)", type: "currency" as const, defaultValue: 2000000, min: 0 },
    { id: "ebitdaMargin", label: "EBITDA Margin (%)", type: "percentage" as const, defaultValue: 20, min: 0, max: 100 },
    { id: "revenueMultiple", label: "Revenue Multiple", type: "number" as const, defaultValue: 3, min: 0 },
    { id: "ebitdaMultiple", label: "EBITDA Multiple", type: "number" as const, defaultValue: 10, min: 0 },
    { id: "growthRate", label: "Annual Growth Rate (%)", type: "percentage" as const, defaultValue: 15, min: 0, max: 100 },
  ],
  outputs: [
    { id: "revenueBasedValue", label: "Revenue-Based Valuation", type: "currency" as const, isPrimary: false },
    { id: "ebitdaBasedValue", label: "EBITDA-Based Valuation", type: "currency" as const, isPrimary: false },
    { id: "blendedValue", label: "Blended Valuation", type: "currency" as const, isPrimary: true },
    { id: "ebitda", label: "EBITDA (Earnings)", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Business valuation is the process of determining the economic value of a company. There are multiple approaches, but the most common for small to mid-market businesses are the revenue multiple method and the EBITDA multiple method. The revenue multiple approach applies a multiplier to annual revenue  -  common for high-growth SaaS and tech companies where revenue is the primary value driver. The EBITDA multiple approach applies a multiplier to earnings before interest, taxes, depreciation, and amortization  -  preferred for profitable, established businesses where earnings power matters most. This calculator blends both approaches and applies a growth premium for high-growth companies (above 10% annual growth), giving you a realistic valuation range. Understanding your business's value is essential, whether you are planning an exit, raising investment, applying for financing, or just tracking your company's progress against industry benchmarks.",
    howToUse: "Enter your annual revenue, EBITDA margin (EBITDA as a percentage of revenue), expected revenue and EBITDA multiples based on industry comparables, and annual growth rate. The calculator computes both valuation methods and a blended value that combines them with a growth premium. Adjust the multiples to match recent transactions in your industry  -  smaller businesses typically trade at lower multiples than larger, more established companies.",
    formulaExplanation: "EBITDA = Annual Revenue × EBITDA Margin. Revenue-Based Valuation = Annual Revenue × Revenue Multiple. EBITDA-Based Valuation = EBITDA × EBITDA Multiple. Growth Premium: 1.0x for ≤10% growth, 1.1x for 10-20% growth, 1.2x for above 20% growth. Blended Value = ((Revenue Value + EBITDA Value) ÷ 2) × Growth Premium. For example, $2M revenue, 20% margin ($400K EBITDA), 3x revenue multiple, 10x EBITDA multiple, 15% growth: Revenue Value = $6M, EBITDA Value = $4M, Growth Premium = 1.1x, Blended Value = (($6M + $4M) ÷ 2) × 1.1 = $5.5M.",
    benchmarks: "Valuation multiples vary significantly by industry. According to BizBuySell's 2025 Insight Report, small businesses sell for 2-3x seller's discretionary earnings (SDE), while mid-market businesses trade at 5-12x EBITDA. SaaS companies command higher revenue multiples (4-10x) due to recurring revenue. Use [BizBuySell](https://bizbuysell.com) for small business comps and [PitchBook](https://pitchbook.com) for private market data.",
    benchmarkData: [
      { metric: "Small Business (Main Street) Multiple", value: "2-3x SDE", source: "BizBuySell 2025" },
      { metric: "Mid-Market EBITDA Multiple", value: "5-12x", source: "PitchBook 2025" },
      { metric: "SaaS Revenue Multiple", value: "4-10x ARR", source: "KeyBanc 2025" },
      { metric: "Professional Services Multiple", value: "4-8x EBITDA", source: "General benchmark" },
      { metric: "Manufacturing / Industrial Multiple", value: "3-6x EBITDA", source: "General benchmark" },
    ],
    relatedCalculators: ["roi-calculator", "cash-runway-calculator"],
    faq: [
      { question: "What is the difference between revenue multiple and EBITDA multiple?", answer: "Revenue multiple values a business based on top-line revenue  -  common for high-growth companies that may not yet be profitable. EBITDA multiple values based on earnings power  -  preferred for profitable, established businesses. Revenue multiples are typically lower (1-10x) than EBITDA multiples (3-15x) because they don't account for profitability. The right approach depends on your industry and business stage." },
      { question: "What multiple should I use for my business?", answer: "Research recent transactions of comparable businesses in your industry, size range, and geography. Small businesses (under $5M revenue) trade at 2-4x SDE. Growing tech companies at 4-10x ARR. Profitable service businesses at 4-8x EBITDA. If you don't have comparables, start conservative and adjust. A business broker or M&A advisor can provide specific guidance." },
      { question: "How does growth rate affect valuation?", answer: "Higher growth rates command higher multiples. A business growing 20%+ annually might trade at 1.5-2x the multiple of a flat-growth business. This calculator applies a growth premium factor (1.0x, 1.1x, or 1.2x) to the blended valuation based on growth rate thresholds. Investors pay more for growth because it signals future earning potential." },
      { question: "What is EBITDA and why does it matter for valuation?", answer: "EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization. It measures operational profitability by excluding non-operating expenses and non-cash charges. Buyers care about EBITDA because it represents the true cash earnings available to a new owner  -  unaffected by capital structure, tax strategy, or accounting decisions." },
      { question: "How do I increase my business valuation?", answer: "Increase revenue and profitability (the two direct inputs), improve growth rate (by expanding market, launching products, or acquiring customers), reduce customer concentration risk, strengthen recurring revenue, build a management team that doesn't depend on you, clean up financial reporting, and establish documented processes and systems. Every point of EBITDA margin improvement directly increases value." },
      { question: "Should I sell my business based on revenue or EBITDA multiple?", answer: "Generally, sell on the metric that makes your business look best. High-growth but low-profit companies sell on revenue multiples. Highly profitable, steady companies sell on EBITDA multiples. Most buyers will want to use both and negotiate. This calculator's blended approach reflects typical deal negotiation  -  averaging both methods and adding a growth premium." },
      { question: "How do I find comparable business sale data?", answer: "BizBuySell (small businesses), PitchBook (private equity and VC deals), GF Data (mid-market M&A), and industry-specific M&A reports from investment banks. Trade associations often publish valuation surveys. For a quick estimate, search for 'valuation multiples [your industry] 2025' to find recent transaction data and published reports." },
      { question: "Does business valuation differ for an acquisition vs raising investment?", answer: "Yes. For acquisitions, buyers discount for risk and apply control premiums  -  they value what they can make from the business. For investment (minority stake), valuations are often higher because investors pay for growth potential and take less control. Strategic buyers (competitors) often pay 20-50% more than financial buyers (private equity) due to synergies." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "企業価値評価計算機",
        description: "収益倍率とEBITDA倍率を使用して企業価値を評価します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
