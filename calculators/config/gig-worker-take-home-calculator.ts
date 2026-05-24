import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "gig-worker-take-home-calculator",
  category: "side-hustle",
  meta: {
    title: "Gig Worker Take-Home Pay Calculator",
    description: "Calculate your net income after expenses and taxes for rideshare, delivery, and gig economy work.",
    keywords: ["gig worker pay", "uber earnings", "doordash income", "rideshare calculator", "delivery driver pay", "gig economy"],
  },
  inputs: [
    { id: "hoursPerWeek", label: "Hours Worked per Week", type: "number" as const, defaultValue: 30, min: 0 },
    { id: "hourlyEarnings", label: "Gross Hourly Earnings ($)", type: "currency" as const, defaultValue: 25, min: 0 },
    { id: "weeklyExpenses", label: "Weekly Expenses (gas, maintenance, etc.)", type: "currency" as const, defaultValue: 150, min: 0 },
    { id: "taxRate", label: "Estimated Tax Rate (%)", type: "percentage" as const, defaultValue: 20, min: 0, max: 50 },
  ],
  outputs: [
    { id: "grossWeeklyIncome", label: "Gross Weekly Income", type: "currency" as const, isPrimary: false },
    { id: "weeklyExpenses", label: "Weekly Expenses", type: "currency" as const, isPrimary: false },
    { id: "netWeeklyIncome", label: "Net Weekly Income", type: "currency" as const, isPrimary: false },
    { id: "netMonthlyIncome", label: "Net Monthly Income", type: "currency" as const, isPrimary: true },
    { id: "netAnnualIncome", label: "Net Annual Income", type: "currency" as const, isPrimary: false },
    { id: "effectiveHourlyRate", label: "Effective Hourly Rate (After Costs)", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Gig economy work  -  rideshare driving, food delivery, task running  -  offers flexibility and quick earnings, but the gap between gross pay and take-home pay can be shocking. Between vehicle expenses (gas, maintenance, depreciation), platform fees, self-employment taxes, and unpaid time between gigs, your effective hourly rate may be far lower than the headlines suggest. This calculator helps you understand your true earnings so you can decide if gig work makes financial sense for your situation.",
    howToUse: "Enter your hours worked per week, gross hourly earnings (before expenses), weekly expenses (gas, maintenance, tolls, parking), and estimated tax rate. The calculator shows your gross income, expenses, net income after tax, and your effective hourly rate. Most gig workers earn $15-30/hour gross but see 30-50% deducted for expenses and taxes.",
    formulaExplanation: "Gross Weekly = Hours × Hourly Earnings. Net Weekly Before Tax = Gross  -  Expenses. Net Weekly = Net Before Tax × (1  -  Tax Rate). Net Monthly = Net Weekly × 4.33. Net Annual = Net Weekly × 52. Effective Hourly = Net Weekly ÷ Hours. Most gig workers see 40-50% of gross earnings consumed by expenses and taxes.",
    benchmarkData: [
      { metric: "Uber/Lyft Driver Median", value: "$19-26 / hour gross", source: "Rideshare Guy 2025" },
      { metric: "DoorDash Driver Median", value: "$15-22 / hour gross", source: "Gridwise 2025" },
      { metric: "Vehicle Expense Rate", value: "25-40% of gross", source: "IRS Mileage Rate" },
      { metric: "Self-Employment Tax Rate", value: "15.3% + income tax", source: "IRS" },
      { metric: "Typical Take-Home Percentage", value: "50-65% of gross", source: "Industry Average" },
      { metric: "Empty Miles (No Passenger)", value: "20-40% of total", source: "Rideshare Guy 2025" },
    ],
    relatedCalculators: ["freelance-rate-calculator", "savings-rate-calculator"],
    faq: [
      { question: "What is the real hourly rate for gig workers after costs?", answer: "After accounting for vehicle expenses (gas, maintenance, depreciation  -  approximately $0.67/mile per IRS rates), platform fees (20-30% for Uber/DoorDash), and self-employment taxes (15.3%), the effective hourly rate is typically 40-50% lower than gross earnings. A $25/hour gross earner often nets $12-15/hour." },
      { question: "How do vehicle expenses affect gig worker income?", answer: "The IRS standard mileage rate for 2025 is approximately $0.67/mile, which accounts for gas, maintenance, insurance, and depreciation. Most gig drivers spend 25-40% of gross earnings on vehicle costs. Electric vehicles reduce this to 15-20% but have higher upfront costs." },
      { question: "What is the best gig platform for earnings?", answer: "It depends on your market. Uber/Lyft offers higher per-trip earnings but more competition. DoorDash/UberEats delivery can be more consistent. Task-based platforms (TaskRabbit) often pay $30-60/hour. The key is testing multiple platforms and calculating your effective hourly rate for each." },
      { question: "How do taxes work for gig workers?", answer: "Gig workers are independent contractors (1099). You owe both employee and employer portions of Social Security/Medicare (15.3% self-employment tax) plus income tax. Make quarterly estimated payments to avoid penalties. Track mileage and expenses  -  they're your biggest deductions." },
      { question: "What expenses can gig workers deduct?", answer: "You can deduct actual vehicle expenses (gas, maintenance, repairs, insurance, depreciation, registration) or use the standard mileage deduction (~$0.67/mile). Also deductible: phone plan, cell phone mount, dash cam, water/snacks for passengers, tolls, parking, and car washes." },
      { question: "How does health insurance affect gig worker finances?", answer: "Without employer-sponsored insurance, health coverage is a major expense. ACA marketplace plans cost $300-800/month per person. Factor this into your required earnings. Health insurance premiums are deductible as self-employed health insurance." },
      { question: "What is the earning potential for full-time gig work?", answer: "Full-time gig workers (40+ hours/week) typically gross $40K-60K/year in major markets. After expenses and taxes, net take-home is $20K-35K/year. Top earners on multiple platforms can reach $60-80K gross but work 50-60 hours/week. Gig work is best as flexible side income, not a primary career." },
      { question: "How can gig workers increase their effective hourly rate?", answer: "Work peak hours (rush hour, weekend nights, events). Use multiple platforms simultaneously. Focus on high-demand areas. Optimize routes to minimize empty miles. Switch to a fuel-efficient or electric vehicle. Upgrade to a larger platform (towing, hauling) that pays more per trip." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
