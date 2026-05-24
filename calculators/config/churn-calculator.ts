import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "churn-calculator",
  category: "churn-retention",
  meta: {
    title: "Churn Rate Calculator",
    description: "Calculate your monthly and annual churn rate to understand customer retention.",
    keywords: ["churn", "churn rate", "customer retention", "saas metrics", "monthly churn", "annual churn"],
  },
  inputs: [
    { id: "customersStart", label: "Customers at Period Start", type: "number" as const, defaultValue: 1000 },
    { id: "customersEnd", label: "Customers at Period End", type: "number" as const, defaultValue: 950 },
    { id: "lostCustomers", label: "Customers Lost in Period", type: "number" as const, defaultValue: 50 },
  ],
  outputs: [
    { id: "monthlyChurnPct", label: "Monthly Churn Rate", type: "percentage" as const, isPrimary: true },
    { id: "annualChurnPct", label: "Annual Churn Rate", type: "percentage" as const, isPrimary: false },
    { id: "retainedCustomers", label: "Retained Customers", type: "number" as const, isPrimary: false },
  ],
  content: {
    intro: "Churn rate measures the percentage of customers who stop using your product during a given period. It is arguably the most critical retention metric for subscription businesses because it directly impacts revenue, growth, and customer lifetime value. A high churn rate means you must constantly acquire new customers just to maintain revenue levels, creating a 'leaky bucket' dynamic that limits growth. Reducing churn by even a few percentage points can dramatically improve your company's financial trajectory. Understanding both monthly and annual churn rates helps you benchmark against industry standards and set realistic retention goals.",
    howToUse: "Enter your customer count at the start and end of the period, plus the number of customers lost. The calculator computes both monthly and annualized churn rates, along with retained customer count. Use this data to track retention trends and identify periods of customer attrition.",
    formulaExplanation: "Monthly Churn Rate = (Lost Customers ÷ Starting Customers) × 100. Annual Churn Rate = 1 - (1 - Monthly Rate)^12. For example, if you start with 1,000 customers and lose 50: Monthly churn = (50 ÷ 1,000) × 100 = 5%. Annual churn = 1 - (1 - 0.05)^12 ≈ 46%.",
    benchmarks: "SaaS churn benchmarks vary by customer segment: SMB/self-serve averages 5-7% monthly churn, mid-market averages 3-5%, enterprise averages 1-2%, and top-quartile companies achieve under 1% monthly churn. According to Recurly Research 2025, median monthly churn across all subscription types is 4-6%. Annual churn for established SaaS companies typically ranges from 5-10% for enterprise to 30-50%+ for SMB.",
    benchmarkData: [
      { metric: "SMB Monthly Churn", value: "5 - 7%", source: "Recurly Research 2025" },
      { metric: "Mid-Market Monthly Churn", value: "3 - 5%", source: "Recurly Research 2025" },
      { metric: "Enterprise Monthly Churn", value: "1 - 2%", source: "Recurly Research 2025" },
      { metric: "Top-Quartile Monthly Churn", value: "< 1%", source: "KeyBanc 2025" },
      { metric: "Healthy Annual Churn (Enterprise)", value: "5 - 10%", source: "SaaS Capital" },
    ],
    relatedCalculators: ["mrr-calculator", "ltv-calculator", "arpu-calculator"],
    faq: [
      { question: "What is a good churn rate?", answer: "For SaaS, 3-5% monthly churn is average for SMB, while enterprise SaaS aims for 1-2% or lower. Under 1% monthly is world-class. Annual churn under 10% is considered healthy." },
      { question: "Should I include voluntary and involuntary churn?", answer: "Yes. Track both types separately but include both in your total churn calculation for accuracy. Voluntary churn (customers who cancel) and involuntary churn (failed payments) require different solutions. Reduce involuntary churn with dunning tools like [Baremetrics](https://baremetrics.com)." },
      { question: "What is the difference between logo churn and revenue churn?", answer: "Logo churn tracks customer count; revenue churn tracks MRR lost. Revenue churn can be lower than logo churn if lost customers were low-paying and remaining customers upgrade." },
      { question: "How do I reduce monthly churn rate?", answer: "Focus on onboarding improvement (reduce time-to-value), proactive customer success (reach out before renewal), pricing optimization (right-size plans), and product improvements based on churn feedback. Use [ChurnZero](https://churnzero.com) for proactive customer success automation." },
      { question: "What is a healthy annual churn rate for SaaS?", answer: "Under 10% annual churn is excellent. 10-20% is average. Above 20% needs immediate attention. Enterprise SaaS often achieves 5-7% annual churn." },
      { question: "How do I calculate churn for a new product with few customers?", answer: "Use cohort analysis. Track groups of customers who joined in the same month and measure their retention over time. This gives more reliable data than overall churn for small customer bases." },
      { question: "What causes involuntary churn?", answer: "Failed payments are the primary cause of involuntary churn. Implement dunning (automatic retry), email reminders before card expiry, and multiple payment methods to reduce it." },
      { question: "How does churn rate affect company valuation?", answer: "Dramatically. Lower churn means higher LTV, more predictable revenue, and lower replacement costs. Investors heavily weight churn rate when valuing SaaS companies." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
