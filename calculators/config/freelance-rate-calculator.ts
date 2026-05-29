import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "freelance-rate-calculator",
  category: "side-hustle",
  meta: {
    title: "Freelance Hourly Rate Calculator",
    description: "Calculate your optimal freelance hourly rate based on desired income, billable hours, expenses, and taxes.",
    keywords: ["freelance rate", "hourly rate", "freelance pricing", "contractor rate", "consulting rate", "self-employed"],
  },
  inputs: [
    { id: "desiredIncome", label: "Desired Annual Take-Home Income ($)", type: "currency" as const, defaultValue: 80000, min: 0 },
    { id: "billableHoursPerWeek", label: "Billable Hours per Week", type: "number" as const, defaultValue: 25, min: 1, max: 80 },
    { id: "weeksPerYear", label: "Weeks Worked per Year", type: "number" as const, defaultValue: 48, min: 1, max: 52 },
    { id: "expenses", label: "Annual Business Expenses ($)", type: "currency" as const, defaultValue: 10000, min: 0 },
    { id: "taxRate", label: "Effective Tax Rate (%)", type: "percentage" as const, defaultValue: 25, min: 0, max: 60 },
  ],
  outputs: [
    { id: "hourlyRate", label: "Required Hourly Rate", type: "currency" as const, isPrimary: true },
    { id: "annualRevenue", label: "Annual Revenue (Before Tax)", type: "currency" as const, isPrimary: false },
    { id: "monthlyRevenue", label: "Monthly Revenue", type: "currency" as const, isPrimary: false },
    { id: "monthlyTakeHome", label: "Monthly Take-Home Pay", type: "currency" as const, isPrimary: false },
    { id: "annualTakeHome", label: "Annual Take-Home Pay", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Setting your freelance rate is one of the most important decisions you'll make as a self-employed professional. Charge too little and you'll burn out working unsustainable hours. Charge too much and you may struggle to land clients. The key is understanding your true costs  -  not just your desired income, but also business expenses, taxes, and non-billable time. Most freelancers can only bill 50-70% of their working hours; the rest goes to admin, marketing, proposals, and professional development. This calculator helps you find the rate that meets your financial goals while accounting for the realities of freelance work.",
    howToUse: "Enter your desired annual take-home income, average billable hours per week, weeks per year, annual business expenses, and estimated effective tax rate. The calculator shows the hourly rate you need to charge, plus monthly and annual projections. Most freelancers bill 20-30 hours per week and work 46-48 weeks per year.",
    formulaExplanation: "Annual Revenue = (Desired Income + Expenses) ÷ (1 - Tax Rate). Hourly Rate = Annual Revenue ÷ (Billable Hours × Weeks). For example, to take home $80K with $10K expenses and 25% tax rate: Revenue = $90K ÷ 0.75 = $120K. At 25 billable hours/week for 48 weeks: Rate = $120K ÷ 1,200 = $100/hour.",
    benchmarks: "According to Upwork's 2025 Freelance Rate Survey, median US freelance rates are $60-80/hour for general skills, $100-150/hour for tech and development, and $150-300/hour for specialized consulting. Top freelancers charge 2-3x the median by building strong portfolios, specializing in niche skills, and raising rates annually. Use [FreshBooks](https://freshbooks.com) or [HoneyBook](https://honeybook.com) for invoicing and expense tracking.",
    benchmarkData: [
      { metric: "General Admin / VA", value: "$25-50 / hour", source: "Upwork 2025" },
      { metric: "Writing / Content", value: "$50-100 / hour", source: "Upwork 2025" },
      { metric: "Graphic Design", value: "$50-120 / hour", source: "Upwork 2025" },
      { metric: "Web Development", value: "$75-150 / hour", source: "Upwork 2025" },
      { metric: "Software Engineering", value: "$100-200 / hour", source: "Upwork 2025" },
      { metric: "Specialized Consulting", value: "$150-300 / hour", source: "Upwork 2025" },
      { metric: "Typical Billable Utilization", value: "50-70%", source: "FreshBooks 2025" },
    ],
    relatedCalculators: ["break-even-calculator", "gig-worker-take-home-calculator"],
    faq: [
      { question: "What is a good utilization rate for freelancers?", answer: "Most freelancers achieve 50-70% billable utilization. The remaining 30-50% goes to marketing, proposals, admin, accounting, and professional development. Top performers reach 75-80% by streamlining operations and delegating non-billable work." },
      { question: "How often should I raise my rates?", answer: "Annually is standard. Raise rates 10-20% per year for existing clients with proper notice (30-60 days). New clients should be charged your current rate immediately. Signal rate increases by delivering more value  -  faster turnaround, better quality, additional services." },
      { question: "Should I charge hourly or fixed-price?", answer: "Fixed-price (project-based) billing rewards efficiency and is preferred by clients. Hourly billing is simpler but caps your earning potential. Hybrid approach: quote fixed-price based on estimated hours × target rate, with a scope clause for changes." },
      { question: "How do I handle non-billable time?", answer: "Build non-billable time into your rate. If you work 40 hours but only bill 25, your rate needs to cover 40 hours of value. Create systems to minimize non-billable time: templates for proposals, automated invoicing, and batched admin work." },
      { question: "What expenses should freelancers track?", answer: "Deductible expenses include: home office (dedicated space), software subscriptions (Adobe, Figma, Notion), equipment (laptop, monitor, peripherals), internet and phone, professional development (courses, conferences), health insurance premiums (deductible for self-employed), and retirement contributions (SEP IRA, Solo 401k)." },
      { question: "How do taxes work for freelancers?", answer: "Freelancers pay both employer and employee portions of Social Security and Medicare (self-employment tax, ~15.3% on net earnings). Plus federal and state income tax. Make quarterly estimated tax payments to avoid penalties. Deductible expenses reduce your tax burden significantly." },
      { question: "What is the difference between a 1099 contractor and W-2 employee?", answer: "As a 1099 contractor, you pay both sides of FICA tax (~15.3% vs 7.65% as an employee) and receive no benefits (PTO, health insurance, 401k match). Your rate should be 30-50% higher than an equivalent salaried position to compensate for these differences." },
      { question: "How do I find higher-paying freelance clients?", answer: "Specialize in a niche (the riches are in the niches). Build a portfolio site showcasing results. Network at industry events and on LinkedIn. Raise rates proactively. Offer value-based pricing (charging based on value delivered, not time spent). Use platforms like [Toptal](https://toptal.com) for premium clients." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "フリーランス時給計算機",
        description: "希望収入、請求可能時間、経費、税金に基づいて最適なフリーランス時給を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
