import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "ai-model-comparison-calculator",
  category: "ai-cost",
  meta: {
    title: "AI Model Cost Comparison Calculator",
    description: "Compare API costs across Claude, GPT, and Gemini models by input/output tokens and daily call volume to find the most cost-effective AI provider.",
    keywords: ["ai model comparison", "claude vs gpt vs gemini", "ai api cost comparison", "llm pricing", "anthropic vs openai vs google", "ai cost optimizer"],
  },
  inputs: [
    { id: "claudeInputTokens", label: "Claude Input Tokens per Call", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "claudeOutputTokens", label: "Claude Output Tokens per Call", type: "number" as const, defaultValue: 500, min: 0 },
    { id: "claudeCallsPerDay", label: "Claude Calls per Day", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "gptInputTokens", label: "GPT Input Tokens per Call", type: "number" as const, defaultValue: 1200, min: 0 },
    { id: "gptOutputTokens", label: "GPT Output Tokens per Call", type: "number" as const, defaultValue: 600, min: 0 },
    { id: "gptCallsPerDay", label: "GPT Calls per Day", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "geminiInputTokens", label: "Gemini Input Tokens per Call", type: "number" as const, defaultValue: 800, min: 0 },
    { id: "geminiOutputTokens", label: "Gemini Output Tokens per Call", type: "number" as const, defaultValue: 400, min: 0 },
    { id: "geminiCallsPerDay", label: "Gemini Calls per Day", type: "number" as const, defaultValue: 1000, min: 0 },
  ],
  outputs: [
    { id: "claudeMonthlyCost", label: "Claude Monthly Cost", type: "currency" as const, isPrimary: false },
    { id: "gptMonthlyCost", label: "GPT Monthly Cost", type: "currency" as const, isPrimary: false },
    { id: "geminiMonthlyCost", label: "Gemini Monthly Cost", type: "currency" as const, isPrimary: false },
    { id: "cheapest", label: "Cheapest Model", type: "text" as const, isPrimary: false },
    { id: "savingsVsAvg", label: "Savings vs Average", type: "currency" as const, isPrimary: true },
  ],
  content: {
    intro: "Choosing the right AI model provider can significantly impact your project's budget. Claude (Anthropic), GPT (OpenAI), and Gemini (Google) each offer different pricing tiers and capabilities. Claude Sonnet 4 ($3.00/M input, $15.00/M output) excels at nuanced reasoning and code generation. GPT-4o ($2.50/M input, $10.00/M output) balances speed and intelligence across a wide range of tasks. Gemini Pro ($1.25/M input, $5.00/M output) offers competitive pricing with strong multimodal capabilities and a 1M token context window. This comparison calculator uses the standard mid-tier pricing for each provider so you can see at a glance which model is cheapest for your specific usage pattern and how much you could save by switching.",
    howToUse: "Enter your expected input tokens, output tokens, and daily call volume for each model. The calculator uses the standard mid-tier pricing for each provider (Claude Sonnet 4, GPT-4o, Gemini Pro). Adjust token counts based on your actual usage patterns  -  most applications use 2-3x more input than output tokens. The results show monthly costs for each provider, which model is cheapest, and the potential savings compared to the average cost across all three.",
    formulaExplanation: "Monthly Cost = ((Input Tokens ÷ 1,000,000 × Input Price) + (Output Tokens ÷ 1,000,000 × Output Price)) × Calls per Day × 30. Claude uses $3.00/M input + $15.00/M output. GPT uses $2.50/M input + $10.00/M output. Gemini uses $1.25/M input + $5.00/M output. The cheapest model is the one with the lowest monthly cost. Savings vs Average is the average of all three monthly costs minus the cheapest monthly cost.",
    benchmarks: "Small applications with 500-1000 calls/day often find Gemini the most affordable option. Medium-scale deployments (1000-5000 calls/day) may prefer GPT-4o for its balance of capability and cost. Large-scale enterprise applications (10K+ calls/day) should negotiate volume discounts with their chosen provider. Use tools like [Helicone](https://helicone.ai) or [Langfuse](https://langfuse.com) to monitor actual usage across providers and compare real costs.",
    benchmarkData: [
      { metric: "Claude Sonnet 4 Input Price", value: "$3.00 / 1M tokens", source: "Anthropic 2025" },
      { metric: "GPT-4o Input Price", value: "$2.50 / 1M tokens", source: "OpenAI 2025" },
      { metric: "Gemini Pro Input Price", value: "$1.25 / 1M tokens", source: "Google AI 2025" },
      { metric: "Small App Monthly (1K calls/day)", value: "$90-315 / month", source: "Typical usage" },
      { metric: "Medium App Monthly (5K calls/day)", value: "$450-1,575 / month", source: "Typical usage" },
    ],
    relatedCalculators: ["claude-api-cost-calculator", "chatgpt-api-cost-calculator", "gemini-api-cost-calculator"],
    faq: [
      { question: "Which AI model is the cheapest overall?", answer: "Gemini Pro is typically the cheapest at $1.25/M input tokens, followed by GPT-4o at $2.50/M, then Claude Sonnet 4 at $3.00/M. However, the cheapest model depends on your specific usage pattern  -  models with lower input prices but higher output prices may be cheaper for applications with very long prompts and short responses. Use this calculator to compare based on your actual token splits." },
      { question: "Does cheaper mean worse quality?", answer: "Not necessarily. Gemini Pro offers excellent performance for most tasks despite being the cheapest. GPT-4o is considered the best all-around model. Claude Sonnet excels at nuanced reasoning and code. The best value is the cheapest model that meets your quality requirements for each specific task type." },
      { question: "How do I switch between providers?", answer: "Each provider offers compatible API interfaces. Libraries like LangChain, Vercel AI SDK, and OpenRouter provide unified APIs that let you switch providers with minimal code changes. Test your application with each provider to compare quality, latency, and cost before committing." },
      { question: "Do these providers offer volume discounts?", answer: "Yes, all three offer volume discounts for committed usage. Anthropic offers discounts for $10K+/month. OpenAI has committed throughput tiers. Google offers committed use discounts for $5K+/month. Batch processing across all providers offers 50% discount for non-real-time requests." },
      { question: "How does context window size affect cost comparison?", answer: "Gemini has a 1M token context window, Claude supports 200K tokens, and GPT-4o supports 128K tokens. Applications requiring very long context (document analysis, codebase analysis) may need Gemini for the larger window, but longer contexts mean higher per-call costs." },
      { question: "Should I use multiple providers or stick with one?", answer: "Many teams use multiple providers  -  a cheaper model for simple tasks and a premium model for complex ones. For example, use Gemini Flash for classification, GPT-4o for chat, and Claude for code generation. This optimizes cost while maintaining quality. Use routing tools like OpenRouter or Portkey to automate provider selection." },
      { question: "How does multimodal pricing differ between providers?", answer: "Claude charges per token for images (roughly 800-1600 tokens per image). GPT-4o charges based on image resolution. Gemini charges per token based on image size. For audio and video, Gemini is the most mature option. Consider multimodal costs separately if your application processes images or audio." },
      { question: "What is the best strategy for reducing AI API costs?", answer: "Use prompt caching across all providers (50% discount on cached tokens). Implement semantic caching to avoid redundant API calls. Use the cheapest model that handles each task. Batch non-real-time requests for 50% discount. Monitor usage with Langfuse or Helicone to identify cost optimization opportunities." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "AIモデル比較計算機",
        description: "Claude、GPT、GeminiモデルのAPI費用を入出力トークンと日間呼び出し数で比較します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
