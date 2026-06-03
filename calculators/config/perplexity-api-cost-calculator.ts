import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "perplexity-api-cost-calculator",
  category: "ai-cost",
  meta: {
    title: "Perplexity API Cost Calculator",
    description: "Calculate your Perplexity API costs for Sonar and Sonar Pro models by tokens and usage volume for search-augmented generation.",
    keywords: ["perplexity api cost", "perplexity pricing", "sonar api", "sonar pro", "search augmented generation", "ai api costs", "perplexity tokens"],
  },
  inputs: [
    { id: "inputTokens", label: "Input Tokens per Call", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "outputTokens", label: "Output Tokens per Call", type: "number" as const, defaultValue: 500, min: 0 },
    { id: "callsPerDay", label: "Calls per Day", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "inputPricePerMillion", label: "Input Price per 1M Tokens ($)", type: "currency" as const, defaultValue: 1.00, min: 0 },
    { id: "outputPricePerMillion", label: "Output Price per 1M Tokens ($)", type: "currency" as const, defaultValue: 5.00, min: 0 },
  ],
  outputs: [
    { id: "costPerCall", label: "Cost per Call", type: "currency" as const, isPrimary: false },
    { id: "costPerDay", label: "Cost per Day", type: "currency" as const, isPrimary: false },
    { id: "costPerMonth", label: "Cost per Month", type: "currency" as const, isPrimary: true },
    { id: "costPerYear", label: "Cost per Year", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Perplexity's API provides search-augmented generation (SAG)  -  combining large language models with real-time web search to deliver accurate, up-to-date answers with citations. Their Sonar models are designed for applications that need grounded responses with source attribution: Sonar (basic search-augmented generation) and Sonar Pro (deeper research capabilities with more citations). This differs from traditional LLM APIs because each API call includes web search results as additional context, making it ideal for research assistants, knowledge bases, fact-checking tools, and customer support systems that need current information. Current pricing: Sonar ($1.00/M input, $5.00/M output), Sonar Pro ($3.00/M input, $15.00/M output). Adjust the price fields above to match your model tier.",
    howToUse: "Enter your average input tokens per call, output tokens per call, daily call volume, and the model pricing. Use the defaults for Sonar ($1.00/$5.00) or change to Sonar Pro ($3.00/$15.00) for deeper research capabilities. The calculator shows per-call, daily, monthly, and annual costs instantly. Note that input tokens for Perplexity API include both your prompt and the search results context, so input token counts tend to be higher than with standard LLM APIs.",
    formulaExplanation: "Cost per Call = (Input Tokens ÷ 1,000,000 × Input Price) + (Output Tokens ÷ 1,000,000 × Output Price). Daily Cost = Cost per Call × Calls per Day. Monthly Cost = Daily Cost × 30. Annual Cost = Daily Cost × 365. Perplexity bills only for tokens  -  there are no additional search or citation fees beyond the per-token pricing.",
    benchmarks: "Perplexity API is ideal for applications requiring grounded, cited answers. Search-augmented generation typically uses 1000-3000 input tokens per call due to the appended search context. Knowledge base applications may use 500-2000 calls per day. Customer support systems often process 2000-10000 calls per day with shorter contexts. Monitor usage with Perplexity's dashboard or [Helicone](https://helicone.ai) for cost tracking.",
    benchmarkData: [
      { metric: "Sonar Input Price", value: "$1.00 / 1M tokens", source: "Perplexity 2025" },
      { metric: "Sonar Pro Input Price", value: "$3.00 / 1M tokens", source: "Perplexity 2025" },
      { metric: "Small Research Assistant", value: "$50-300 / month", source: "General benchmark" },
      { metric: "Medium Customer Support AI", value: "$300-1,500 / month", source: "General benchmark" },
      { metric: "High-Volume Knowledge Base", value: "$1,500-5,000 / month", source: "General benchmark" },
    ],
    relatedCalculators: ["claude-api-cost-calculator", "chatgpt-api-cost-calculator", "ai-model-comparison-calculator"],
    faq: [
      { question: "How is Perplexity API different from ChatGPT or Claude API?", answer: "Perplexity API is search-augmented  -  each API call runs a web search and includes the results as context for the model. This means answers are grounded in real-time information with citations. Input tokens are higher (you pay for the search context) but you get verified, up-to-date answers without needing a separate RAG pipeline." },
      { question: "What is the difference between Sonar and Sonar Pro?", answer: "Sonar is the standard model for search-augmented generation with basic citations ($1.00/M input, $5.00/M output). Sonar Pro ($3.00/M input, $15.00/M output) provides deeper research with more sources, longer-form answers, and better reasoning. Use Sonar for simple Q&A and Sonar Pro for comprehensive research and analysis." },
      { question: "Why are input tokens higher for Perplexity API?", answer: "Perplexity's search context adds approximately 500-2000 tokens per call depending on the query complexity and number of search results. This context is included in your input token count. Factor this in when budgeting  -  a 1000-token prompt may actually cost as 2000-3000 input tokens after search augmentation." },
      { question: "Can I control the number of search results?", answer: "Yes, Perplexity's API allows you to configure search parameters including the number of sources, search domain filters, and recency requirements. Fewer search results means lower input token costs but potentially less comprehensive answers. Balance thoroughness with cost based on your use case." },
      { question: "Does Perplexity offer volume discounts?", answer: "Perplexity offers custom pricing for high-volume users (typically $5K+/month). Contact their sales team for committed usage tiers. They also offer a free tier with limited credits for prototyping and evaluation. Enterprise plans include dedicated support and custom rate limits." },
      { question: "What are the best use cases for Perplexity API?", answer: "Perplexity API excels at: research assistants that need cited answers, customer support systems that need current product information, knowledge bases that update automatically, fact-checking and verification tools, competitive analysis, and any application where accuracy and source attribution are critical." },
      { question: "How does Perplexity handle citations and source attribution?", answer: "Perplexity returns citations inline in the response and provides a sources object with URLs and metadata. This makes it easy to display verified answers with clickable sources. Citations are formatted similarly to the Perplexity chat interface users are familiar with." },
      { question: "Can I use Perplexity API without web search?", answer: "Perplexity API is designed for search-augmented generation. If you don't need web search capabilities, a standard LLM API (Claude, GPT, Gemini) will be more cost-effective. Perplexity's value proposition is the integration of search and generation in a single API call with no additional infrastructure." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "Perplexity API費用計算機",
        description: "SonarおよびSonar ProモデルのPerplexity API費用をトークン数と使用量で計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
