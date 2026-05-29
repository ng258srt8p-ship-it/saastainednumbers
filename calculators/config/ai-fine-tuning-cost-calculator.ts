import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "ai-fine-tuning-cost-calculator",
  category: "ai-cost",
  meta: {
    title: "AI Fine-Tuning Cost Calculator",
    description: "Calculate the cost of fine-tuning AI models including training and ongoing inference expenses.",
    keywords: ["fine tuning cost", "model training", "ai training cost", "gpt fine tuning", "llm fine tuning"],
  },
  inputs: [
    { id: "trainingTokens", label: "Training Dataset Tokens", type: "number" as const, defaultValue: 1000000, min: 0 },
    { id: "trainingCostPerMillion", label: "Training Cost per 1M Tokens ($)", type: "currency" as const, defaultValue: 8.00, min: 0 },
    { id: "monthlyInferenceTokens", label: "Monthly Inference Tokens", type: "number" as const, defaultValue: 5000000, min: 0 },
    { id: "inferenceInputPricePerMillion", label: "Inference Input Price per 1M Tokens ($)", type: "currency" as const, defaultValue: 3.00, min: 0 },
    { id: "inferenceOutputPricePerMillion", label: "Inference Output Price per 1M Tokens ($)", type: "currency" as const, defaultValue: 6.00, min: 0 },
    { id: "epochs", label: "Training Epochs", type: "number" as const, defaultValue: 3, min: 1 },
  ],
  outputs: [
    { id: "trainingCost", label: "Training Cost (One-Time)", type: "currency" as const, isPrimary: true },
    { id: "monthlyInferenceCost", label: "Monthly Inference Cost", type: "currency" as const, isPrimary: false },
    { id: "annualInferenceCost", label: "Annual Inference Cost", type: "currency" as const, isPrimary: false },
    { id: "totalFirstYearCost", label: "Total First-Year Cost", type: "currency" as const, isPrimary: true },
  ],
  content: {
    intro: "Fine-tuning an AI model tailors a pre-trained foundation model to your specific domain, use case, or brand voice. While the base models are powerful, fine-tuning can dramatically improve performance on specialized tasks. However, the costs add up  -  you pay for training compute, then ongoing inference at fine-tuned model rates. This calculator helps you budget for the total cost of fine-tuning including both the one-time training and ongoing inference.",
    howToUse: "Enter your training dataset size in tokens, training cost per million tokens, monthly inference volume, inference pricing, and number of training epochs. Default values reflect GPT-3.5 Turbo fine-tuning pricing. The calculator shows one-time training cost, monthly inference, and total first-year cost.",
    formulaExplanation: "Training Cost = (Dataset Tokens ÷ 1,000,000) × Cost per Million × Epochs. Monthly Inference = (Monthly Tokens ÷ 1,000,000) × Average Inference Price. First Year = Training + (Monthly Inference × 12). For GPT-3.5 Turbo: training is $8.00/M tokens, inference is $3.00/M input and $6.00/M output.",
    benchmarks: "Fine-tuning costs vary significantly by model: GPT-3.5 Turbo ($8/M training tokens), GPT-4o ($25/M), Llama 3 (self-hosted GPU costs). A typical fine-tuning dataset is 100K-10M tokens. Epochs typically range from 1-4. The total cost for a moderate fine-tuning project runs $200-2,000 for training plus ongoing inference. Self-hosting fine-tuned open-source models eliminates per-token inference costs but requires GPU infrastructure.",
    benchmarkData: [
      { metric: "GPT-3.5 Turbo Fine-Tuning", value: "$8.00 / 1M training tokens", source: "OpenAI 2025" },
      { metric: "GPT-4o Fine-Tuning", value: "$25.00 / 1M training tokens", source: "OpenAI 2025" },
      { metric: "Fine-Tuned GPT-3.5 Inference", value: "$3.00/$6.00 per 1M tokens", source: "OpenAI 2025" },
      { metric: "Typical Dataset Size", value: "100K - 10M tokens", source: "Industry Standard" },
      { metric: "Self-Hosted Llama 3 (A100)", value: "~$1-3 / hour GPU", source: "Cloud Providers" },
      { metric: "Recommended Epoch Range", value: "1-4 epochs", source: "OpenAI" },
    ],
    relatedCalculators: ["claude-api-cost-calculator", "chatgpt-api-cost-calculator"],
    faq: [
      { question: "When should I fine-tune vs use prompt engineering?", answer: "Fine-tune when: you have at least 500+ high-quality examples, need consistent output formatting, want to reduce prompt length/cost, or need the model to learn domain-specific knowledge. Use prompt engineering for most cases  -  it's cheaper and faster to iterate. Only fine-tune when prompt engineering hits a ceiling." },
      { question: "How much training data do I need for fine-tuning?", answer: "Minimum: 100-500 examples for simple tasks. Ideal: 1,000-10,000 examples for reliable performance. OpenAI recommends at least 50-100 well-curated examples to see meaningful improvement. Quality > quantity  -  500 excellent examples outperform 5,000 noisy ones." },
      { question: "What factors affect fine-tuning cost most?", answer: "Dataset size (more tokens = higher cost), number of epochs (more epochs = higher cost), and model size (GPT-4o costs 3x more than GPT-3.5 to fine-tune). Inference cost depends on monthly usage volume and whether you self-host or use API." },
      { question: "Is fine-tuning worth the cost vs using a base model?", answer: "For most applications, no  -  prompt engineering with a good base model (GPT-4o, Claude Sonnet) achieves 90%+ of fine-tuning results. Fine-tuning becomes worth it when you need: consistent output format, reduced latency (shorter prompts), domain-specific knowledge, or better performance on specialized tasks." },
      { question: "Can I fine-tune open-source models to avoid per-token costs?", answer: "Yes. Fine-tuning Llama 3, Mistral, or DeepSeek models costs GPU compute ($1-5/hour) and then you own the model weights. Inference has near-zero per-token cost (just GPU compute). Break-even vs API-based fine-tuning is typically 1-5M inference tokens/month. Use [Ollama](https://ollama.ai) or [vLLM](https://vllm.readthedocs.io) for self-hosting." },
      { question: "How does LoRA reduce fine-tuning costs?", answer: "LoRA (Low-Rank Adaptation) fine-tunes a small number of parameters instead of all of them, reducing training cost by 80-90% and storage by 99%. LoRA adapters can be swapped at inference time without multiple model deployments. Most modern fine-tuning frameworks use LoRA or QLoRA (quantized LoRA)." },
      { question: "What is the difference between fine-tuning and RAG?", answer: "Fine-tuning changes the model's weights to embed domain knowledge. RAG (Retrieval-Augmented Generation) keeps the model unchanged and provides relevant documents in the prompt. RAG is cheaper, more flexible, and easier to update. Fine-tuning is better when: latency matters, you need the model to internalize patterns, or prompts are too long." },
      { question: "How do I evaluate fine-tuning ROI?", answer: "Compare performance (accuracy, relevance, format compliance) before and after fine-tuning on a held-out test set. Calculate cost savings from shorter prompts (fine-tuned models need fewer few-shot examples). Measure improved user satisfaction or task completion rates. If fine-tuning improves accuracy by 20%+ or reduces prompt costs by 50%+, it's likely worth it." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "AIファインチューニング費用計算機",
        description: "AIモデルのファインチューニング費用をトレーニング費用と推論費用を含めて計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
