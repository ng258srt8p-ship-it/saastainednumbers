import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "chatgpt-api-cost-calculator",
  category: "ai-cost",
  meta: {
    title: "ChatGPT API Cost Calculator",
    description: "Calculate your OpenAI ChatGPT API costs by model (GPT-4o, GPT-4, GPT-3.5 Turbo), tokens, and usage volume.",
    keywords: ["chatgpt api cost", "openai pricing", "gpt-4o", "gpt-4", "gpt-3.5", "ai api costs", "openai tokens"],
  },
  inputs: [
    { id: "inputTokens", label: "Input Tokens per Call", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "outputTokens", label: "Output Tokens per Call", type: "number" as const, defaultValue: 500, min: 0 },
    { id: "callsPerDay", label: "Calls per Day", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "inputPricePerMillion", label: "Input Price per 1M Tokens ($)", type: "currency" as const, defaultValue: 2.50, min: 0 },
    { id: "outputPricePerMillion", label: "Output Price per 1M Tokens ($)", type: "currency" as const, defaultValue: 10.00, min: 0 },
  ],
  outputs: [
    { id: "costPerCall", label: "Cost per Call", type: "currency" as const, isPrimary: false },
    { id: "costPerDay", label: "Cost per Day", type: "currency" as const, isPrimary: false },
    { id: "costPerMonth", label: "Cost per Month", type: "currency" as const, isPrimary: true },
    { id: "costPerYear", label: "Cost per Year", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "OpenAI's GPT models power thousands of applications worldwide, from chatbots and content generators to code assistants and data analysis tools. Each model offers different capabilities and pricing: GPT-4o balances intelligence and speed as the default model, GPT-4 delivers with higher capability, and GPT-3.5 Turbo offers the most affordable option for simpler tasks. Understanding your API costs is critical for budgeting and choosing the right model. This calculator helps you estimate costs based on your actual token usage. Current pricing: GPT-4o ($2.50/M input, $10.00/M output), GPT-4 ($30.00/M input, $60.00/M output), GPT-3.5 Turbo ($0.50/M input, $1.50/M output). Adjust the price fields to match your model and any negotiated discounts.",
    howToUse: "Enter your average input tokens per call, output tokens per call, daily call volume, and estimated token pricing. Adjust the price fields for your OpenAI model  -  default values are for GPT-4o. For GPT-4 use ($30/$60), for GPT-3.5 Turbo use ($0.50/$1.50). The calculator shows per-call, daily, monthly, and annual costs instantly.",
    formulaExplanation: "Cost = (Input Tokens ÷ 1,000,000 × Input Price per Million) + (Output Tokens ÷ 1,000,000 × Output Price per Million). Daily Cost = Cost per Call × Calls per Day. Monthly Cost = Daily Cost × 30. Annual Cost = Daily Cost × 365.",
    benchmarks: "Applications running on GPT-3.5 Turbo typically cost $20-200/month for moderate usage. GPT-4o applications range from $200-2,000/month. Heavy GPT-4 usage can exceed $5,000/month. Enterprise deployments with fine-tuned models and batch processing can reduce costs by 50-75%. Monitor usage with [Langfuse](https://langfuse.com) or [Arize AI](https://arize.com) for cost observability.",
    benchmarkData: [
      { metric: "GPT-3.5 Turbo Small Bot", value: "$20-200 / month", source: "Typical SaaS usage" },
      { metric: "GPT-4o Customer Support", value: "$500-2,000 / month", source: "Typical SaaS usage" },
      { metric: "GPT-4 Heavy Usage", value: "$5,000+ / month", source: "Enterprise deployment" },
      { metric: "Batch Processing Discount", value: "50% off", source: "OpenAI 2025" },
      { metric: "GPT-4o Input Price", value: "$2.50 / 1M tokens", source: "OpenAI 2025" },
      { metric: "GPT-3.5 Turbo Input Price", value: "$0.50 / 1M tokens", source: "OpenAI 2025" },
    ],
    relatedCalculators: ["claude-api-cost-calculator", "break-even-calculator"],
    faq: [
      { question: "Which OpenAI model is most cost-effective?", answer: "GPT-3.5 Turbo is the most cost-effective for simple tasks at $0.50/M input tokens. GPT-4o offers the best price-performance balance at $2.50/M for most applications. GPT-4 is best for complex reasoning but costs 12x more than GPT-3.5 Turbo. Use the simplest model that meets your quality needs." },
      { question: "How can I reduce OpenAI API costs?", answer: "Reduce prompt length (fewer input tokens). Implement semantic caching for repeated queries. Use GPT-3.5 Turbo for simple tasks and GPT-4o only when needed. Set max_tokens limits. Process in batches (50% discount). Use streaming for better user experience without cost difference." },
      { question: "Does OpenAI offer volume discounts?", answer: "Yes, OpenAI offers committed throughput tiers with discounted pricing for high-volume users ($10K+/month). They also have an API credits program for startups through Microsoft for Startups. Batch API calls offer 50% discount for non-real-time processing." },
      { question: "What is token caching and how does it save money?", answer: "OpenAI and other providers offer automated prompt caching  -  frequently used prompt prefixes are cached and charged at a lower rate (approximately 50% discount on cached input tokens). This significantly reduces costs for applications with consistent system prompts or few-shot examples." },
      { question: "How do fine-tuned models compare in cost?", answer: "Fine-tuned GPT-3.5 Turbo costs $3.00/M input tokens and $6.00/M output tokens  -  6x and 4x the base model. However, fine-tuned models often need shorter prompts (no few-shot examples needed), reducing total tokens per call by 30-50%. Evaluate total cost, not per-token price." },
      { question: "What is the difference between prompt tokens and completion tokens?", answer: "Prompt tokens are the input you send to the API (system message, user message, conversation history). Completion tokens are the model's response. Most applications use 2-3x more input than output tokens. Both are billed, typically at different rates." },
      { question: "How do I estimate tokens before making an API call?", answer: "Use OpenAI's tiktoken library to count tokens client-side before sending. Rule of thumb: 1 token ≈ 0.75 words in English, 1 token ≈ 0.5 words in code. Most prompts are 500-2000 tokens. Responses for chat average 200-800 tokens." },
      { question: "Are there open-source alternatives to reduce costs?", answer: "Yes. Llama 3 (Meta), Mistral, and DeepSeek models can be self-hosted or accessed through providers like Together AI, Groq, and Perplexity at lower costs. Self-hosting has high fixed infrastructure costs but near-zero per-token costs at scale  -  break-even is typically 5-10M tokens/day." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "ChatGPT API費用計算機",
        description: "モデル（GPT-4o、GPT-4、GPT-3.5 Turbo）、トークン数、使用量に応じたOpenAI ChatGPT API費用を計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
