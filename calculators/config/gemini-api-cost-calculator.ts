import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "gemini-api-cost-calculator",
  category: "ai-cost",
  meta: {
    title: "Gemini API Cost Calculator",
    description: "Calculate Google Gemini API costs by model tier, tokens, and usage volume for your AI applications.",
    keywords: ["gemini api", "google ai", "gemini pricing", "gemini pro", "gemini ultra", "ai api costs"],
  },
  inputs: [
    { id: "inputTokens", label: "Input Tokens per Call", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "outputTokens", label: "Output Tokens per Call", type: "number" as const, defaultValue: 500, min: 0 },
    { id: "callsPerDay", label: "Calls per Day", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "inputPricePerMillion", label: "Input Price per 1M Tokens ($)", type: "currency" as const, defaultValue: 1.25, min: 0 },
    { id: "outputPricePerMillion", label: "Output Price per 1M Tokens ($)", type: "currency" as const, defaultValue: 5.00, min: 0 },
  ],
  outputs: [
    { id: "costPerCall", label: "Cost per Call", type: "currency" as const, isPrimary: false },
    { id: "costPerDay", label: "Cost per Day", type: "currency" as const, isPrimary: false },
    { id: "costPerMonth", label: "Cost per Month", type: "currency" as const, isPrimary: true },
    { id: "costPerYear", label: "Cost per Year", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Google's Gemini models offer competitive pricing for AI-powered applications, with strong performance across text, code, and multimodal tasks. Gemini provides three tiers: Flash (cheapest, fastest), Pro (balanced), and Ultra (most capable). Pricing varies by model tier and input/output token type. Google also offers context caching and batch processing discounts. This calculator helps you estimate costs based on your usage patterns. Current pricing: Flash ($0.10/M input, $0.40/M output), Pro ($1.25/M input, $5.00/M output), Ultra ($10.00/M input, $30.00/M output). Adjust the price fields for your model tier.",
    howToUse: "Enter your average input and output tokens per call, daily call volume, and model pricing. Adjust the price fields for your Gemini model tier  -  Flash ($0.10/$0.40), Pro ($1.25/$5.00), or Ultra ($10.00/$30.00). The calculator shows per-call, daily, monthly, and annual costs.",
    formulaExplanation: "Cost = (Input Tokens ÷ 1,000,000 × Input Price) + (Output Tokens ÷ 1,000,000 × Output Price). Monthly = Daily × 30. Annual = Daily × 365. Google's pricing includes a free tier for low-volume usage (60 requests per minute on Gemini Flash).",
    benchmarks: "Gemini Flash handles 80% of use cases at the lowest cost. Pro is suitable for production applications requiring higher quality. Ultra is for complex reasoning tasks. Google offers a free tier for prototyping. For high-volume applications ($5K+/month), contact Google for reserved throughput pricing. Monitor usage with Google Cloud Monitoring or [Helicone](https://helicone.ai).",
    benchmarkData: [
      { metric: "Gemini Flash (Most Affordable)", value: "$0.10 / 1M input tokens", source: "Google AI 2025" },
      { metric: "Gemini Pro (Balanced)", value: "$1.25 / 1M input tokens", source: "Google AI 2025" },
      { metric: "Gemini Ultra (Most Capable)", value: "$10.00 / 1M input tokens", source: "Google AI 2025" },
      { metric: "Context Caching Discount", value: "Up to 50% on cached tokens", source: "Google AI 2025" },
      { metric: "Batch Processing Discount", value: "50% off", source: "Google AI 2025" },
      { metric: "Free Tier Rate Limit", value: "60 requests/minute", source: "Google AI 2025" },
    ],
    relatedCalculators: ["claude-api-cost-calculator", "chatgpt-api-cost-calculator"],
    faq: [
      { question: "How does Gemini pricing compare to Claude and GPT?", answer: "Gemini Flash ($0.10/M input) is significantly cheaper than GPT-4o ($2.50/M) or Claude Sonnet ($3.00/M). At the high end, Gemini Ultra ($10/M input) is cheaper than GPT-4 ($30/M) or Claude Opus ($15/M). Google's context caching and batch discounts can further reduce costs by 50%." },
      { question: "What is Gemini context caching?", answer: "Context caching allows you to store frequently used prompt prefixes (system instructions, few-shot examples) and access them at a deeply discounted rate. Cached tokens cost approximately 50% less than fresh tokens. This is ideal for applications with consistent system prompts across many user queries." },
      { question: "Does Gemini have a free tier?", answer: "Yes, Gemini Flash offers a free tier for prototyping with 60 requests per minute. Gemini Pro has a limited free tier. For production usage beyond free limits, you pay per-token. Google also offers $300 in free credits for new Google Cloud users." },
      { question: "How does Gemini's 1M token context window affect cost?", answer: "Gemini has a 1M token context window (vs ~128K for most competitors). Larger context windows mean more input tokens per call, increasing costs. However, with prompt caching, repeated long contexts are much cheaper. Use the minimum context length needed for your task." },
      { question: "What is the best Gemini model for cost-effective production?", answer: "Start with Gemini Flash for most applications  -  it handles classification, extraction, summarization, and simple chat at the lowest cost. Upgrade to Pro for higher quality generation, complex reasoning, or multilingual applications. Reserve Ultra for the most demanding analytical tasks." },
      { question: "How do Gemini batch discounts work?", answer: "Batch processing on Gemini offers 50% discount compared to real-time API calls. If your application tolerates latency (hours to days), batch processing can significantly reduce costs. Use batch for data processing, content generation at scale, and nightly analysis jobs." },
      { question: "How does Gemini charge for multimodal inputs?", answer: "Images are charged based on resolution: low-res images cost ~130 tokens, high-res cost ~258 tokens per image. Audio is charged per second of audio (~32 tokens/second for 16kHz). Video is charged per frame. Text is charged per token. All modalities are billed at the same per-token rate." },
      { question: "Does Google offer volume discounts for Gemini API?", answer: "Yes, Google offers committed use discounts for consistent high-volume usage (typically $5K+/month). Contact Google Cloud sales for reserved throughput pricing. They also offer the Google for Startups Cloud Program with up to $200K in credits over 2 years." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
