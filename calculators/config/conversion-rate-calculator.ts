import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "conversion-rate-calculator",
  category: "growth-efficiency",
  isNew: true,
  meta: {
    title: "Conversion Rate Calculator",
    description: "Calculate your conversion rate from visitors to customers with total conversions and non-converting visitor breakdown.",
    keywords: ["conversion rate", "cvr", "conversion optimization", "cro", "visitor conversion", "sales conversion", "ecommerce conversion", "lead conversion"],
  },
  inputs: [
    { id: "totalVisitors", label: "Total Visitors", type: "number" as const, defaultValue: 10000, min: 1 },
    { id: "totalConversions", label: "Total Conversions", type: "number" as const, defaultValue: 350, min: 0 },
  ],
  outputs: [
    { id: "conversionRate", label: "Conversion Rate", type: "percentage" as const, isPrimary: true },
    { id: "totalConversions", label: "Total Conversions", type: "number" as const, isPrimary: false },
    { id: "visitorsNotConverted", label: "Visitors Not Converted", type: "number" as const, isPrimary: false },
  ],
  content: {
    intro: "Conversion rate is the percentage of visitors who complete a desired action — whether that's making a purchase, signing up for a trial, filling out a form, or clicking a button. It's one of the most leveraged metrics in business: a small improvement in conversion rate can dramatically increase revenue without any increase in traffic. This calculator shows your current conversion rate, total conversions, and the number of visitors who didn't convert, giving you a clear baseline for optimization efforts.",
    howToUse: "Enter your total website or landing page visitors and the number who completed your desired action (purchase, sign-up, download, etc.). The calculator shows your conversion rate as a percentage and the total non-converting visitors. Use this to benchmark current performance and calculate the impact of conversion rate optimization efforts.",
    formulaExplanation: "Conversion Rate = (Conversions ÷ Visitors) × 100. Visitors Not Converted = Visitors - Conversions. Example: 10,000 visitors with 350 conversions = 3.5% conversion rate. 9,650 visitors did not convert. If you increase conversion rate to 4%, you'd get 400 conversions from the same traffic — 50 more customers without spending more on acquisition.",
    benchmarks: "Average e-commerce conversion rates range from 2-4% depending on traffic quality and product type. SaaS landing pages average 3-5% for free trials, 1-2% for demo requests. B2B websites typically see 2-5% conversion rates. Top-quartile performers achieve 2x the average. Use [Google Analytics](https://analytics.google.com) and [Hotjar](https://hotjar.com) for conversion tracking and optimization insights.",
    benchmarkData: [
      { metric: "E-commerce Average", value: "2-4%", source: "Baymard Institute" },
      { metric: "SaaS Free Trial", value: "3-5%", source: "Growth Marketing Benchmark" },
      { metric: "SaaS Demo Request", value: "1-2%", source: "G2" },
      { metric: "B2B Website Average", value: "2-5%", source: "MarketingSherpa" },
      { metric: "Top-Quartile Performer", value: "5-10%", source: "Unbounce" },
      { metric: "Mobile vs Desktop", value: "Mobile 40-60% lower", source: "Industry Average" },
    ],
    relatedCalculators: ["lead-conversion-rate-calculator", "trial-to-paid-calculator", "cac-calculator", "roas-calculator"],
    faq: [
      { question: "What is a good conversion rate?", answer: "A good conversion rate depends entirely on your industry, traffic source, and offer type. E-commerce: 2-4% is average, 5%+ is excellent. SaaS: 3-5% for free trials, 1-2% for paid. B2B: 2-5% for lead generation. Blog/Content: 0.5-2% for email signups. Focus on improving your own rate over time rather than comparing across completely different businesses." },
      { question: "How do I calculate conversion rate for multi-step funnels?", answer: "Calculate conversion rate at each step of your funnel separately. Example: Landing page visit → Sign-up (visitor to lead rate), Sign-up → Free trial (lead to activation rate), Free trial → Paid (trial to paid rate). The overall conversion rate is the product of all step rates. A 10% drop-off at each of 3 steps yields 0.1% overall conversion from visitor to paid customer." },
      { question: "What factors most impact conversion rate?", answer: "The biggest factors are: page load speed (1-second delay = 7% reduction), clear value proposition, social proof (testimonials, reviews), trust signals (security badges, guarantees), mobile optimization, simplified checkout/form, urgency cues, and relevant traffic quality. Testing one change at a time with A/B tests reveals what matters most for your audience." },
      { question: "How much traffic do I need for statistically significant conversion rate tests?", answer: "You need at least 100 conversions per variation (not visitors) for statistical significance. For a 3% converting page, that's ~3,300 visitors per variation. Lower conversion rates require more traffic. Tools like Optimizely, VWO, and Google Optimize calculate required sample sizes automatically. Running tests with insufficient data leads to false conclusions." },
      { question: "What is visitor = not converted and how do I recover them?", answer: "Visitors who don't convert immediately aren't lost forever. Use retargeting ads, email capture (exit-intent popups), abandoned cart emails, and retargeting on social media to re-engage. Abandoned cart emails alone recover 10-15% of lost e-commerce conversions. Exit-intent popups can capture 2-5% of leaving visitors as email subscribers." },
      { question: "How does traffic source affect conversion rate?", answer: "Conversion rates vary dramatically by source: branded search (10-20%), organic search (3-5%), paid search (2-4%), social media (0.5-2%), email (2-5%), referral (3-6%). Don't compare conversion rates across sources — optimize each source for its own baseline. Low conversion rate from social may still be profitable if traffic is cheap." },
      { question: "Should I track micro-conversions vs macro-conversions?", answer: "Both. Macro-conversions are your primary goal (purchase, sign-up). Micro-conversions are smaller steps (email signup, add to cart, video view, PDF download). Tracking micro-conversions helps optimize the top and middle of your funnel, even when macro-conversion data is limited. They're especially useful for high-consideration products with long sales cycles." },
      { question: "How does seasonality affect conversion rates?", answer: "Conversion rates typically increase 20-40% during peak shopping seasons (Q4 holiday, Black Friday, Cyber Monday) due to buyer intent. They drop in January and summer months. Always compare year-over-year rather than month-over-month. Adjust your conversion rate targets and budgets based on seasonal trends." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
