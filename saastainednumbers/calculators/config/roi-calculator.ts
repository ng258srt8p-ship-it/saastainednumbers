import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "roi-calculator",
  category: "general-business",
  meta: {
    title: "ROI Calculator",
    description: "Calculate Return on Investment (ROI) and annualized ROI for any business investment or project.",
    keywords: ["roi", "return on investment", "investment calculator", "annualized return", "business roi", "project roi"],
  },
  inputs: [
    { id: "initialInvestment", label: "Initial Investment ($)", type: "currency" as const, defaultValue: 10000, min: 0.01 },
    { id: "finalValue", label: "Final Value ($)", type: "currency" as const, defaultValue: 15000, min: 0 },
    { id: "years", label: "Time Period (Years)", type: "number" as const, defaultValue: 3, min: 0.1 },
  ],
  outputs: [
    { id: "totalGain", label: "Total Gain ($)", type: "currency" as const, isPrimary: false },
    { id: "roiPercent", label: "Total ROI", type: "percentage" as const, isPrimary: true },
    { id: "annualizedROI", label: "Annualized ROI", type: "percentage" as const, isPrimary: true },
  ],
  content: {
    intro: "Return on Investment (ROI) is the most widely used metric for evaluating the profitability of an investment, project, or business decision. It measures the gain or loss generated relative to the amount invested. While simple ROI gives the total return over the full period, annualized ROI accounts for the time value of money  -  essential for comparing investments across different time horizons. This calculator helps you evaluate any investment, from marketing campaigns and equipment purchases to stock investments and business acquisitions.",
    howToUse: "Enter your initial investment amount, the final value of the investment, and the time period in years. The calculator shows total gain, total ROI percentage, and annualized ROI. For marketing campaigns, initial investment = campaign cost, final value = attributable revenue. For equipment, final value = total savings or revenue generated.",
    formulaExplanation: "Total Gain = Final Value  -  Initial Investment. ROI = (Gain ÷ Investment) × 100. Annualized ROI = ((Final ÷ Initial)^(1 ÷ Years)  -  1) × 100. Example: $10K investment grows to $15K over 3 years. Gain = $5K. ROI = 50%. Annualized ROI = (1.5^(1/3)  -  1) × 100 = 14.5%.",
    benchmarks: "A good ROI depends on your industry and risk level. S&P 500 historical average: 10% annualized. Business investments should target 15-30% ROI. Marketing campaigns: 300-500% ROI (5:1 ratio) is considered excellent. Real estate: 8-12% annualized. Venture capital targets 25%+ annualized to compensate for high failure rates. Use [QuickBooks](https://quickbooks.intuit.com) or [Bench](https://bench.co) for tracking business investment performance.",
    benchmarkData: [
      { metric: "S&P 500 Historical Average", value: "10% annualized", source: "Morningstar" },
      { metric: "Good Business Investment", value: "15-30% ROI", source: "Industry Average" },
      { metric: "Excellent Marketing ROI", value: "300-500% (5:1)", source: "Nielsen" },
      { metric: "Real Estate Average Return", value: "8-12% annualized", source: "NCREIF" },
      { metric: "Venture Capital Target", value: "25%+ annualized", source: "Industry Standard" },
      { metric: "Small Business Average", value: "20-40% ROI", source: "SBA" },
    ],
    relatedCalculators: ["break-even-calculator", "fire-calculator"],
    faq: [
      { question: "What is a good ROI for a small business?", answer: "Small businesses should target 20-40% ROI on most investments. Marketing campaigns should achieve 300%+ (3:1 ratio) to be viable. New equipment should pay for itself within 12-18 months. The minimum acceptable ROI is typically 15%  -  anything below your cost of capital destroys value." },
      { question: "What is the difference between ROI and annualized ROI?", answer: "Simple ROI shows total return over the full investment period. Annualized ROI normalizes returns to a per-year basis, allowing comparison between investments of different durations. A 50% ROI over 3 years equals 14.5% annualized. Always use annualized ROI when comparing investments across different time periods." },
      { question: "How do I calculate ROI for marketing campaigns?", answer: "Marketing ROI = (Revenue Attributed to Campaign  -  Campaign Cost) / Campaign Cost × 100. Use UTM parameters and conversion tracking to attribute revenue accurately. Account for all costs: ad spend, creative production, tools, and team time. A 5:1 ratio ($5 revenue per $1 spend) is excellent." },
      { question: "What is ROI vs ROAS vs IRR?", answer: "ROI = total return on investment. ROAS (Return on Ad Spend) = revenue ÷ ad cost (marketing-specific). IRR (Internal Rate of Return) accounts for the timing of cash flows  -  more accurate for investments with irregular payments. IO (Return on Investment) = standard metric. IRR is best for comparing complex investments." },
      { question: "How does risk affect ROI expectations?", answer: "Higher risk investments require higher expected ROI. Risk-free rate (US Treasury) is ~5%. A stable business investment should earn 10-15%. A startup or new product launch should target 25-50% to compensate for failure risk. Adjust your minimum acceptable ROI based on the investment's risk profile." },
      { question: "Should I consider taxes when calculating ROI?", answer: "For accurate comparison, use after-tax ROI. Capital gains taxes (15-20% for long-term, up to 37% for short-term) reduce your net return. Tax-advantaged accounts (401k, IRA, HSA) allow investments to grow tax-free or tax-deferred, effectively increasing your after-tax ROI." },
      { question: "What is the payback period and how does it relate to ROI?", answer: "Payback period is how long until cumulative returns equal the initial investment  -  the break-even time. Two investments with the same ROI can have very different payback periods. Shorter payback periods reduce risk and free up capital for reinvestment. Aim for payback within 12-18 months for most business investments." },
      { question: "How do I compare ROI across different investment types?", answer: "Always use annualized ROI for fair comparison. Account for risk, liquidity, time horizon, and tax treatment. A 15% annualized ROI in real estate (moderate risk, low liquidity) may be equivalent to a 25% annualized ROI in a startup (high risk, illiquid). Use the Sharpe Ratio to compare risk-adjusted returns." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
