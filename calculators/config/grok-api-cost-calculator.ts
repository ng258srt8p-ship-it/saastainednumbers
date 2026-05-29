import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "grok-api-cost-calculator",
  category: "ai-cost",
  meta: {
    title: "Grok API Cost Calculator",
    description: "Calculate xAI Grok API costs based on token usage, model version, and call volume.",
    keywords: ["grok api", "xai", "grok pricing", "elon musk ai", "grok tokens", "ai api costs"],
  },
  inputs: [
    { id: "inputTokens", label: "Input Tokens per Call", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "outputTokens", label: "Output Tokens per Call", type: "number" as const, defaultValue: 500, min: 0 },
    { id: "callsPerDay", label: "Calls per Day", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "inputPricePerMillion", label: "Input Price per 1M Tokens ($)", type: "currency" as const, defaultValue: 2.00, min: 0 },
    { id: "outputPricePerMillion", label: "Output Price per 1M Tokens ($)", type: "currency" as const, defaultValue: 10.00, min: 0 },
  ],
  outputs: [
    { id: "costPerCall", label: "Cost per Call", type: "currency" as const, isPrimary: false },
    { id: "costPerDay", label: "Cost per Day", type: "currency" as const, isPrimary: false },
    { id: "costPerMonth", label: "Cost per Month", type: "currency" as const, isPrimary: true },
    { id: "costPerYear", label: "Cost per Year", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "xAI's Grok models offer real-time knowledge and conversational AI capabilities with competitive pricing. Grok is designed for natural dialogue and can access up-to-date information through the X platform. Current pricing for Grok 2 is $2.00/M input tokens and $10.00/M output tokens, positioning it competitively against mid-tier models from other providers. This calculator helps you estimate your costs based on actual token usage and call volume.",
    howToUse: "Enter your average input and output tokens per call, daily call volume, and the model pricing. Default values reflect Grok 2 pricing. The calculator shows per-call, daily, monthly, and annual costs instantly.",
    formulaExplanation: "Cost = (Input Tokens ÷ 1,000,000 × Input Price) + (Output Tokens ÷ 1,000,000 × Output Price). Monthly = Daily × 30. Annual = Daily × 365.",
    benchmarks: "Grok's pricing is competitive with mid-tier models  -  cheaper than GPT-4 ($30/M) and Claude Opus ($15/M) but more expensive than budget options like Gemini Flash ($0.10/M). Grok excels at real-time information retrieval and conversational tasks. For high-volume applications, check xAI's batch pricing and potential volume discounts.",
    benchmarkData: [
      { metric: "Grok 2 Input Price", value: "$2.00 / 1M tokens", source: "xAI 2025" },
      { metric: "Grok 2 Output Price", value: "$10.00 / 1M tokens", source: "xAI 2025" },
      { metric: "Typical Chatbot Monthly Cost", value: "$150-500 / month", source: "Estimated" },
      { metric: "Content Gen Monthly Cost", value: "$500-2,000 / month", source: "Estimated" },
      { metric: "Real-Time Data Access", value: "Included with API", source: "xAI" },
    ],
    relatedCalculators: ["claude-api-cost-calculator", "chatgpt-api-cost-calculator"],
    faq: [
      { question: "What makes Grok API unique?", answer: "Grok's key differentiator is real-time knowledge access through the X platform, allowing it to answer questions about current events and trending topics. It's designed for natural, conversational dialogue with a touch of humor and personality." },
      { question: "How does Grok pricing compare to competitors?", answer: "At $2/$10 per million tokens, Grok 2 is positioned between budget models (Gemini Flash at $0.10/$0.40) and premium models (GPT-4 at $30/$60, Claude Opus at $15/$75). It's most comparable to Claude Sonnet ($3/$15) and Gemini Pro ($1.25/$5)." },
      { question: "Does Grok offer a free tier?", answer: "xAI offers limited free access through the Grok chat interface on X Premium. For API access, pricing is per-token with no free tier announced. Check the xAI developer console for current pricing and any available credits." },
      { question: "What are typical use cases for Grok API?", answer: "Grok is well-suited for conversational AI, customer support chatbots, real-time information retrieval, content generation, social media analysis, and news summarization. Its access to X data makes it particularly useful for trend analysis and social listening." },
      { question: "How does Grok handle context windows?", answer: "Grok supports context windows comparable to other leading models (128K tokens). Larger contexts increase per-call costs proportionally. Use the minimum context needed for optimal cost efficiency." },
      { question: "Does Grok support vision and multimodal inputs?", answer: "Grok supports image understanding capabilities. Pricing for multimodal inputs may differ from text-only tokens. Check xAI's current documentation for multimodal pricing details." },
      { question: "How do I get started with Grok API?", answer: "Sign up for API access through the xAI developer platform. You'll receive API keys and can start making requests immediately. Check the [xAI documentation](https://x.ai) for code samples and integration guides." },
      { question: "Does Grok offer batch processing discounts?", answer: "xAI may offer batch processing discounts for high-volume, non-real-time workloads. Contact xAI enterprise sales for information about volume pricing, reserved capacity, and custom agreements." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "Grok API費用計算機",
        description: "トークン使用量、モデルバージョン、呼び出し数に基づくxAI Grok API費用を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
