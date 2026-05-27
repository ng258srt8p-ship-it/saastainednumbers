import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "tam-sam-som-calculator",
  category: "general-business",
  isNew: true,
  meta: {
    title: "TAM SAM SOM Calculator",
    description: "Calculate Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM) with growth projections.",
    keywords: ["tam", "sam", "som", "market sizing", "total addressable market", "serviceable addressable market", "serviceable obtainable market", "market analysis", "market size calculator"],
  },
  inputs: [
    { id: "totalAddressableMarket", label: "Total Addressable Market (TAM) ($)", type: "currency" as const, defaultValue: 100000000, min: 0.01 },
    { id: "serviceableAddressableMarket", label: "Serviceable Addressable Market (SAM) ($)", type: "currency" as const, defaultValue: 30000000, min: 0 },
    { id: "serviceableObtainableMarket", label: "Serviceable Obtainable Market (SOM) ($)", type: "currency" as const, defaultValue: 5000000, min: 0 },
    { id: "marketGrowthRate", label: "Market Growth Rate (%)", type: "percentage" as const, defaultValue: 10, min: 0, max: 1000 },
    { id: "years", label: "Projection Period (Years)", type: "number" as const, defaultValue: 5, min: 1 },
  ],
  outputs: [
    { id: "tam", label: "Total Addressable Market (TAM)", type: "currency" as const, isPrimary: true },
    { id: "sam", label: "Serviceable Addressable Market (SAM)", type: "currency" as const, isPrimary: true },
    { id: "som", label: "Serviceable Obtainable Market (SOM)", type: "currency" as const, isPrimary: true },
    { id: "tamShare", label: "SAM as % of TAM", type: "percentage" as const, isPrimary: false },
    { id: "samShare", label: "SOM as % of SAM", type: "percentage" as const, isPrimary: false },
    { id: "growthRate", label: "Market Growth Rate", type: "percentage" as const, isPrimary: false },
    { id: "projectedTAM", label: "Projected TAM (in {years} years)", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "The TAM SAM SOM framework is the gold standard for market sizing in business planning and fundraising. Total Addressable Market (TAM) is the total revenue opportunity available if you achieved 100% market share. Serviceable Addressable Market (SAM) is the segment of TAM your products and services can realistically reach. Serviceable Obtainable Market (SOM) is the portion of SAM you can actually capture given competition and your go-to-market strategy. Together, these three metrics tell investors and stakeholders exactly how big your opportunity is and how much you can realistically own.",
    howToUse: "Enter your TAM (total market revenue), SAM (reachable segment), and SOM (capturable segment). Set the market growth rate and projection period. The calculator shows current market sizes, what percentage of TAM your SAM represents, what percentage of SAM your SOM represents, and the projected TAM after applying growth compounding. Adjust inputs to model different market scenarios for your pitch deck or business plan.",
    formulaExplanation: "TAM Share = (SAM ÷ TAM) × 100 — what percentage of the total market you can serve. SAM Share = (SOM ÷ SAM) × 100 — what percentage of your serviceable market you can capture. Projected TAM = TAM × (1 + Growth Rate ÷ 100)^Years — compound growth projection. For example, with a $100M TAM, $30M SAM, and $5M SOM: TAM Share = 30%, SAM Share = 16.7%, projected TAM at 10% growth over 5 years = $161M.",
    benchmarks: "Investors typically look for SOM that is at least 1-5% of TAM for an early-stage company. A SAM/TAM ratio above 20% suggests a focused market strategy. High-growth markets (15%+ CAGR) command higher valuation multiples. TAM should be large enough to support a $100M+ company for venture-backable startups. See [CB Insights](https://www.cbinsights.com) for comparable market sizing data.",
    benchmarkData: [
      { metric: "Early-Stage SOM/TAM Ratio", value: "1-5%", source: "Industry Standard" },
      { metric: "Healthy SAM/TAM Ratio", value: "20%+", source: "Venture Capital Benchmark" },
      { metric: "High-Growth Market CAGR", value: "15%+", source: "Industry Average" },
      { metric: "Venture-Backable TAM Minimum", value: "$1B+", source: "VC Standard" },
      { metric: "Typical SOM as % of SAM", value: "10-30%", source: "Industry Average" },
    ],
    relatedCalculators: ["break-even-calculator", "roi-calculator", "business-valuation-calculator"],
    faq: [
      { question: "What is the difference between TAM, SAM, and SOM?", answer: "TAM (Total Addressable Market) is the total revenue opportunity for your product or service globally. SAM (Serviceable Addressable Market) is the portion of TAM you can reach with your specific distribution channels and product. SOM (Serviceable Obtainable Market) is the share of SAM you can realistically capture accounting for competition, brand awareness, and go-to-market constraints. Think of it as a funnel: TAM → SAM → SOM." },
      { question: "How do I estimate TAM for a new market?", answer: "Use top-down (industry reports × segment percentage) or bottom-up (unit volume × average price × target customers) approaches. Top-down uses analyst reports from Gartner, IDC, or Statista. Bottom-up is more defensible because it's based on your actual business model. Most investors prefer the bottom-up method for early-stage companies." },
      { question: "Why is TAM SAM SOM important for fundraising?", answer: "Investors use TAM SAM SOM to assess whether your startup can return their fund. Venture capitalists typically need a path to $100M+ in revenue. A $1B+ TAM with a credible path to capturing SOM demonstrates that potential. Weak market sizing is one of the top reasons VCs pass on deals." },
      { question: "How often should I update my market sizing?", answer: "Revisit TAM SAM SOM annually or whenever your business model or target market changes significantly. As you launch new products, enter new geographies, or shift pricing, your SAM and SOM will change. Market growth rates should also be updated based on the latest industry reports." },
      { question: "What is a good SAM/TAM ratio?", answer: "A SAM/TAM ratio of 20-50% is healthy — it shows you've defined a focused, reachable market. Below 10% may indicate your market is too niche for venture capital. Above 80% suggests you may be defining your market too broadly. The ideal ratio depends on your business model and distribution strategy." },
      { question: "How does competition affect SOM?", answer: "SOM should account for direct competitors, indirect alternatives, and the customer acquisition landscape. If there are 5 established competitors, your SOM might be 10-20% of SAM at maturity. First-mover advantages and network effects can justify higher SOM estimates. Always stress-test your SOM assumptions against real competitive data." },
      { question: "Should I use TAM SAM SOM for a B2B or B2C business?", answer: "Both, but the approach differs. For B2B, calculate TAM from the number of target companies × average contract value. For B2C, use total potential users × average revenue per user. B2B markets tend to have clearer SAM definitions (industry verticals, company size segments). B2C requires more demographic and psychographic segmentation." },
      { question: "What's the difference between TAM SAM SOM and bottoms-up market sizing?", answer: "TAM SAM SOM is a top-down framework that starts with the total market and narrows down. Bottom-up starts with your unit economics (price × customers you can realistically reach) and builds up. Both are useful — TAM SAM SOM shows the total opportunity, bottom-up validates the go-to-market plan. The best pitch decks show both approaches converging on a similar SOM number." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
