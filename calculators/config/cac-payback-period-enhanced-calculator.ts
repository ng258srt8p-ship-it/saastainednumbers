import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "cac-payback-period-enhanced-calculator",
  category: "saas-deepen",
  meta: {
    title: "CAC Payback Period Enhanced Calculator",
    description: "Calculate your enhanced CAC payback period in months and days accounting for gross margin, giving a more accurate view of how quickly you recoup customer acquisition costs.",
    keywords: ["cac payback period", "customer acquisition cost", "payback period", "saas metrics", "unit economics"],
  },
  benchmarkMetric: "cac-payback",
  inputs: [
    { id: "cac", label: "Customer Acquisition Cost (CAC)", type: "currency" as const, defaultValue: 500, min: 0 },
    { id: "arpu", label: "Average Revenue Per User (ARPU)", type: "currency" as const, defaultValue: 100, min: 0 },
    { id: "grossMargin", label: "Gross Margin", type: "percentage" as const, defaultValue: 70, min: 0, max: 100 },
  ],
  outputs: [
    { id: "paybackMonths", label: "Payback Period", type: "number" as const, isPrimary: true, suffix: " months" },
    { id: "paybackDays", label: "Payback Period", type: "number" as const, isPrimary: false, suffix: " days" },
    { id: "grossProfitPerMonth", label: "Gross Profit Per Month", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "The CAC Payback Period is the time it takes for a customer to generate enough gross profit to cover the cost of acquiring them. Unlike a simple revenue-based payback calculation, this enhanced version uses gross margin to reflect the true profit you retain after cost of goods sold. This is critical because gross margin varies significantly between SaaS companies and directly impacts how quickly you earn back your acquisition investment. A company with 80% gross margin pays back CAC much faster than one with 50% gross margin, even with the same CAC and ARPU. The CAC payback period is one of the most closely watched SaaS unit economics metrics because it determines how much capital you need to fund customer acquisition before those customers become profitable. Investors use it to evaluate business model efficiency and determine appropriate growth spending levels. This calculator provides both monthly and daily payback periods, along with the gross profit per customer per month, giving you a complete picture of your customer-level profitability.",
    howToUse: "Enter your customer acquisition cost, average revenue per user per month, and gross margin percentage. The calculator computes the payback period in months and days, plus the monthly gross profit per customer. A payback period under 12 months is generally considered healthy for SaaS.",
    formulaExplanation: "Gross Profit Per Month = ARPU × (Gross Margin / 100). Payback Period (months) = CAC / Gross Profit Per Month. Payback Period (days) = Payback Months × 30.44. Example: CAC = $500, ARPU = $100, Gross Margin = 70%. Gross Profit = $70/month. Payback = $500 / $70 = 7.14 months (217 days). Total invested capital is recouped after 7.14 months, and the customer becomes profitable from that point forward.",
    benchmarks: "Best-in-class SaaS companies achieve a CAC payback period under 6 months. A payback period under 12 months is considered healthy and standard for most SaaS models. Periods between 12 and 18 months need monitoring and improvement. Payback over 18 months indicates inefficient acquisition or problematic pricing. According to KeyBanc 2025 SaaS Survey, the median SaaS company has a payback period of 12-18 months. Enterprise SaaS with high ARPU typically achieves faster payback than SMB SaaS with lower ARPU.",
    benchmarkData: [
      { metric: "Excellent Payback Period", value: "< 6 months", source: "OpenView" },
      { metric: "Healthy Payback Period", value: "< 12 months", source: "SaaS Capital" },
      { metric: "Needs Monitoring", value: "12 - 18 months", source: "SaaS Capital" },
      { metric: "Problematic Payback", value: "> 18 months", source: "OpenView" },
      { metric: "Median SaaS Payback Period", value: "12 - 18 months", source: "KeyBanc 2025 SaaS Survey" },
    ],
    relatedCalculators: ["cac-calculator", "payback-period-calculator", "gross-margin-calculator", "arpu-calculator"],
    faq: [
      { question: "What is a good CAC payback period for SaaS?", answer: "Under 12 months is healthy. Under 6 months is excellent. Between 12 and 18 months needs monitoring. Over 18 months indicates inefficient acquisition, low pricing, or insufficient gross margin that requires corrective action." },
      { question: "How is this different from a standard CAC payback calculation?", answer: "Standard payback uses raw ARPU. This enhanced version uses gross profit (ARPU × gross margin), which reflects the actual cash available to cover CAC after accounting for cost of goods sold. Gross margin-adjusted payback is more accurate and conservative." },
      { question: "What gross margin percentage is typical for SaaS?", answer: "Gross margins for pure SaaS companies typically range from 65% to 85%. Companies with significant infrastructure costs (like cloud infrastructure platforms) may have lower margins around 50-65%. Higher gross margins directly improve payback period." },
      { question: "How does pricing affect payback period?", answer: "Higher ARPU means more gross profit per customer, which reduces payback period. Increasing prices by 20% can reduce payback period by nearly 17%. However, higher prices may slow customer acquisition, so optimize pricing to balance speed of acquisition with payback period." },
      { question: "What is enhanced about this calculator?", answer: "This calculator incorporates gross margin into the payback calculation, provides both monthly and daily payback figures for more precise planning, and explicitly shows the gross profit per customer per month. Many standard calculators omit the gross margin adjustment, giving an overly optimistic view." },
      { question: "How do I reduce CAC payback period?", answer: "Reduce CAC through more efficient marketing and sales channels, increase ARPU through pricing optimization and upsells, improve gross margin by reducing infrastructure and support costs, or combine all three approaches for maximum impact. Track payback trends automatically with [Baremetrics](https://baremetrics.com?via=saastainednumbers)." },
      { question: "What benchmarks exist for payback period by segment?", answer: "Enterprise SaaS: target under 6 months (high ARPU). SMB SaaS: target under 12 months (lower ARPU). Self-serve: target under 3 months (very low CAC). Usage-based: varies widely but typically under 12 months for healthy businesses." },
      { question: "How does payback period relate to LTV/CAC ratio?", answer: "Payback period and LTV/CAC are complementary metrics. LTV/CAC tells you the total return on acquisition investment. Payback period tells you how quickly that return materializes. A company can have a good LTV/CAC ratio but a dangerously long payback period if retention is slow to materialize revenue." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
