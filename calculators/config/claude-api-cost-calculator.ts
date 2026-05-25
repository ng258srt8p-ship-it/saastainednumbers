import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "claude-api-cost-calculator",
  category: "ai-cost",
  meta: {
    title: "Claude API Cost Calculator",
    description: "Calculate your Anthropic Claude API costs by model (Haiku, Sonnet, Opus), tokens, and usage volume.",
    keywords: ["claude api cost", "anthropic pricing", "claude haiku", "claude sonnet", "claude opus", "ai api costs"],
  },
  inputs: [
    { id: "inputTokens", label: "Input Tokens per Call", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "outputTokens", label: "Output Tokens per Call", type: "number" as const, defaultValue: 500, min: 0 },
    { id: "callsPerDay", label: "Calls per Day", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "inputPricePerMillion", label: "Input Price per 1M Tokens ($)", type: "currency" as const, defaultValue: 3.00, min: 0 },
    { id: "outputPricePerMillion", label: "Output Price per 1M Tokens ($)", type: "currency" as const, defaultValue: 15.00, min: 0 },
  ],
  outputs: [
    { id: "costPerCall", label: "Cost per Call", type: "currency" as const, isPrimary: false },
    { id: "costPerDay", label: "Cost per Day", type: "currency" as const, isPrimary: false },
    { id: "costPerMonth", label: "Cost per Month", type: "currency" as const, isPrimary: true },
    { id: "costPerYear", label: "Cost per Year", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Anthropic's Claude models offer powerful AI capabilities at competitive prices. Claude Haiku is the fastest and most affordable model for simple tasks, Sonnet balances speed and intelligence for everyday workloads, and Opus delivers the highest reasoning capability for complex analysis. Understanding your API costs is essential for budgeting and choosing the right model for each use case. This calculator helps you estimate costs based on your actual token usage across all Claude models. Current pricing: Haiku 3.5 ($0.80/M input, $4.00/M output), Sonnet 4 ($3.00/M input, $15.00/M output), Opus 4 ($15.00/M input, $75.00/M output). Adjust the price fields above to match your model and any discounts you receive.",
    howToUse: "Enter your average input tokens per call, output tokens per call, daily call volume, and the model pricing. Adjust the price fields to match your Claude model tier  -  use the defaults for Sonnet 4 or change to Haiku ($0.80/$4.00) or Opus ($15.00/$75.00). The calculator instantly shows per-call, daily, monthly, and annual costs.",
    formulaExplanation: "Cost = (Input Tokens ÷ 1,000,000 × Input Price per Million) + (Output Tokens ÷ 1,000,000 × Output Price per Million). Daily Cost = Cost per Call × Calls per Day. Monthly Cost = Daily Cost × 30. Annual Cost = Daily Cost × 365.",
    benchmarks: "Typical AI-powered SaaS applications use 500-2000 input tokens and 200-1000 output tokens per call. Chatbots often process 1000-10000 calls per day. Code generation tools may use 2000-8000 tokens per call with lower volume (100-500 calls/day). Enterprise deployments exceeding $10K/month should negotiate volume discounts with Anthropic. Monitor your usage with [Helicone](https://helicone.ai) or [Langfuse](https://langfuse.com) for cost tracking.",
    benchmarkData: [
      { metric: "Small Chatbot", value: "$50-200 / month", source: "Typical SaaS usage" },
      { metric: "Medium Customer Support AI", value: "$500-2,000 / month", source: "Typical SaaS usage" },
      { metric: "High-Volume Content Generation", value: "$2,000-10,000 / month", source: "Typical SaaS usage" },
      { metric: "Enterprise AI Pipeline", value: "$10,000-50,000+ / month", source: "Enterprise deployment" },
      { metric: "Haiku 3.5 Input Price", value: "$0.80 / 1M tokens", source: "Anthropic 2025" },
      { metric: "Sonnet 4 Input Price", value: "$3.00 / 1M tokens", source: "Anthropic 2025" },
      { metric: "Opus 4 Input Price", value: "$15.00 / 1M tokens", source: "Anthropic 2025" },
    ],
    relatedCalculators: ["chatgpt-api-cost-calculator", "gemini-api-cost-calculator", "grok-api-cost-calculator", "perplexity-api-cost-calculator", "ai-model-comparison-calculator"],
    faq: [
      { question: "Which Claude model should I use for my project?", answer: "Use Haiku for simple tasks like classification and moderation (cheapest, fastest). Use Sonnet for general-purpose chat, content generation, and customer support (best balance). Use Opus for complex reasoning, analysis, and code generation tasks (most capable). Start with Sonnet and adjust based on your quality and cost requirements." },
      { question: "How can I reduce Claude API costs?", answer: "Reduce input token usage by keeping prompts concise. Implement caching for repeated requests. Batch similar calls together. Use Haiku for simple tasks and reserve Sonnet/Opus for complex ones. Set token limits in the API call. Monitor usage with [Helicone](https://helicone.ai) to identify cost optimization opportunities." },
      { question: "Does Anthropic offer volume discounts?", answer: "Yes, Anthropic offers volume discounts for committed usage tiers. Contact their sales team for deployments exceeding $10K/month. They also offer API credits for startups through their Anthropic Startup Program." },
      { question: "What is a typical token-to-word ratio?", answer: "As a rule of thumb, 1 token equals roughly 0.75 words in English. A 1000-token prompt is approximately 750 words. Code and non-English languages may use different ratios. Use the [OpenAI Tokenizer](https://platform.openai.com/tokenizer) or Anthropic's token counting to estimate." },
      { question: "How do I estimate my token usage?", answer: "For text generation: count the average words in your prompts and responses, multiply by 1.33 to get approximate tokens. Most API providers return token counts in the response. Start with conservative estimates and adjust based on actual usage data." },
      { question: "Are there free tiers or credits for Claude API?", answer: "Anthropic occasionally offers API credits through startup programs and hackathons. Claude.ai (the chat interface) has a free tier with usage limits. For production API usage, you pay per-token with no free tier. Check the [Anthropic Console](https://console.anthropic.com) for current pricing." },
      { question: "What is prompt caching and how does it save costs?", answer: "Prompt caching allows you to reuse common prompt prefixes across multiple API calls, reducing the tokens processed per call. Anthropic offers automatic prompt caching with discounts on cached input tokens. This can reduce costs by 50-80% for applications with repetitive system prompts." },
      { question: "How does batch API pricing compare to real-time?", answer: "Anthropic offers 50% discounts on batch API requests (non-real-time processing). If your application tolerates latency (hours vs seconds), batch processing can significantly reduce costs. Use batch for data processing, content generation at scale, and nightly analysis jobs." },
      { question: "How does Claude pricing compare to ChatGPT (GPT-4o)?", answer: "Claude Sonnet 4 ($3/$15 per M tokens) is competitively priced against GPT-4o ($2.50/$10 per M tokens). Claude Haiku 3.5 at $0.80/$4 is cheaper than GPT-4o mini ($0.15/$0.60 for text, but with vision surcharges). Claude Opus 4 at $15/$75 is premium-priced for maximum capability. For most use cases, Claude Sonnet offers the best price-performance balance, often producing more concise outputs that reduce total token costs." },
      { question: "What is the most cost-effective Claude setup for a startup?", answer: "Start with Claude Haiku 3.5 for most tasks  -  it handles classification, extraction, and simple chat at the lowest cost. Use Sonnet 4 only when you need better reasoning or longer context. Implement prompt caching to reduce input token costs by up to 50-80%. Set max_token limits aggressively. Use batch API for non-urgent processing. Monitor usage with [Helicone](https://helicone.ai) or [Langfuse](https://langfuse.com) to identify cost patterns before they grow." },
      { question: "What are common mistakes when estimating API costs?", answer: "Common mistakes include: forgetting to account for output tokens (they cost more than input tokens); not considering system prompts in token counts; underestimating daily call volume as usage grows; ignoring context caching savings; not setting token limits resulting in unexpectedly large outputs; and failing to monitor cost per user as you scale. Always add 20-30% buffer to your cost estimates for production systems." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
