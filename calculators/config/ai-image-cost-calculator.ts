import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "ai-image-cost-calculator",
  category: "ai-cost",
  meta: {
    title: "AI Image Generation Cost Calculator",
    description: "Compare costs for AI image generation across DALL-E, Midjourney, and Stable Diffusion models.",
    keywords: ["ai image generation", "dalle pricing", "midjourney cost", "stable diffusion", "ai art cost", "image generation"],
  },
  inputs: [
    { id: "imagesPerMonth", label: "Images per Month", type: "number" as const, defaultValue: 100, min: 0 },
    { id: "costPerImage", label: "Cost per Image ($)", type: "currency" as const, defaultValue: 0.04, min: 0 },
  ],
  outputs: [
    { id: "monthlyCost", label: "Monthly Cost", type: "currency" as const, isPrimary: true },
    { id: "annualCost", label: "Annual Cost", type: "currency" as const, isPrimary: false },
    { id: "costPerImage", label: "Cost per Image", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "AI image generation has become increasingly accessible and affordable, with multiple platforms offering different quality levels and pricing models. DALL-E 3 costs $0.04/image (standard) to $0.08/image (HD). Midjourney charges $10-60/month for subscriptions with limited generations. Stable Diffusion can be self-hosted for a fixed infrastructure cost with near-zero per-image costs. This calculator helps you compare costs across platforms based on your monthly generation volume.",
    howToUse: "Enter your monthly image generation volume and cost per image. Use the benchmarks below for typical pricing: DALL-E 3 ($0.04-0.08), Midjourney (~$0.05/image with subscription), or Stable Diffusion API ($0.002-0.01/image). The calculator shows monthly and annual costs.",
    formulaExplanation: "Monthly Cost = Images per Month × Cost per Image. Annual Cost = Monthly × 12. Self-hosted Stable Diffusion costs are dominated by GPU compute ($0.50-1.50/hour), making cost per image dependent on generation speed and batch size.",
    benchmarks: "DALL-E 3 charges $0.04/standard image and $0.08/HD image. Midjourney plans range from $10/month (200 images) to $60/month (unlimited slow generation). Stable Diffusion via API providers costs $0.002-0.01/image. Self-hosted SD with an A100 GPU costs ~$1/hour for ~1,000 images/hour ($0.001/image). For high volume (10K+ images/month), self-hosting or API providers are most cost-effective.",
    benchmarkData: [
      { metric: "DALL-E 3 Standard", value: "$0.04 / image", source: "OpenAI 2025" },
      { metric: "DALL-E 3 HD", value: "$0.08 / image", source: "OpenAI 2025" },
      { metric: "Midjourney Basic (200 images/mo)", value: "$10 / month", source: "Midjourney 2025" },
      { metric: "Stable Diffusion API", value: "$0.002-0.01 / image", source: "Replicate / Together AI" },
      { metric: "Self-Hosted SD (A100)", value: "~$0.001 / image", source: "Estimated (GPU + power)" },
      { metric: "Flux Pro (Black Forest Labs)", value: "$0.05 / image", source: "BFL 2025" },
    ],
    relatedCalculators: ["claude-api-cost-calculator", "ai-fine-tuning-cost-calculator"],
    faq: [
      { question: "Which AI image generator is most cost-effective?", answer: "For high volume (10K+ images/month): Stable Diffusion API or self-hosting ($0.001-0.01/image). For moderate volume (100-1K/month): DALL-E 3 ($0.04/image) or Midjourney subscription ($10-30/month). For best quality with low volume: Midjourney or Flux Pro." },
      { question: "How does Midjourney pricing work?", answer: "Midjourney operates on a subscription model: Basic ($10/month ~200 images), Standard ($30/month ~900 images), Pro ($60/month ~1,800 images). Extra GPU time costs $4/hour. Images don't have a fixed per-unit cost  -  you pay for GPU compute time." },
      { question: "What is the cheapest way to generate AI images at scale?", answer: "Self-hosted Stable Diffusion or Flux is the cheapest at scale. A single A100 GPU generates ~1,000 images/hour at $1/hour GPU cost = $0.001/image. For very high volume (100K+/month), dedicated GPU instances or enterprise agreements with API providers offer the best rates." },
      { question: "Does DALL-E offer volume discounts?", answer: "OpenAI offers tiered pricing for high-volume DALL-E usage through API access. Enterprise customers can negotiate custom rates. DALL-E is also available through ChatGPT Plus ($20/month) with limited included generations." },
      { question: "How do resolution and quality affect AI image costs?", answer: "Higher resolutions and more generation steps cost more. DALL-E HD ($0.08) costs 2x standard ($0.04). Midjourney charges more GPU time for higher quality settings. SD API costs scale with output resolution. Use the minimum quality that meets your needs." },
      { question: "Can I use AI-generated images commercially?", answer: "Most platforms allow commercial use: OpenAI (DALL-E) grants full usage rights. Midjourney requires paid subscription for commercial use. SD models have permissive licenses (OpenRAIL-M). Always check the specific terms of service for your chosen platform." },
      { question: "What is Flux and how does it compare to other generators?", answer: "Flux by Black Forest Labs (created by former Stability AI researchers) offers state-of-the-art image quality at $0.05/image via API. It rivals Midjourney in quality but is available via API for easier integration. Flux is open-weight, enabling self-hosting for lower costs." },
      { question: "How do I optimize AI image generation costs?", answer: "Use lower resolutions when quality isn't critical. Batch generations to reduce overhead. Use SD API or self-hosting for high volume. Reserve premium models (Midjourney, Flux) for final assets and use cheaper models for iterations and drafts." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
