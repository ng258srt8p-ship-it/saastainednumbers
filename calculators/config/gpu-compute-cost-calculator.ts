import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "gpu-compute-cost-calculator",
  category: "ai-cost",
  isNew: true,
  meta: {
    title: "GPU Compute Cost Calculator",
    description: "Calculate GPU cloud compute costs including on-demand vs spot pricing, monthly and annual projections for AI/ML workloads.",
    keywords: ["gpu cost", "gpu compute", "cloud gpu", "ai training cost", "ml cost", "spot instances", "aws gpu", "azure gpu", "gcp gpu", "deep learning cost"],
  },
  inputs: [
    { id: "gpuCostPerHour", label: "GPU Cost per Hour ($)", type: "currency" as const, defaultValue: 3.06, min: 0.01 },
    { id: "gpuHoursPerDay", label: "GPU Hours per Day", type: "number" as const, defaultValue: 8, min: 0, max: 24 },
    { id: "daysPerMonth", label: "Days per Month", type: "number" as const, defaultValue: 30, min: 0, max: 31 },
    { id: "numberOfGPUs", label: "Number of GPUs", type: "number" as const, defaultValue: 1, min: 1 },
    { id: "spotDiscount", label: "Spot Instance Discount (%)", type: "percentage" as const, defaultValue: 60, min: 0, max: 90 },
  ],
  outputs: [
    { id: "monthlyOnDemandCost", label: "Monthly On-Demand Cost", type: "currency" as const, isPrimary: true },
    { id: "monthlySpotCost", label: "Monthly Spot Cost", type: "currency" as const, isPrimary: true },
    { id: "monthlySavings", label: "Monthly Savings (Spot vs On-Demand)", type: "currency" as const, isPrimary: true },
    { id: "annualCost", label: "Annual On-Demand Cost", type: "currency" as const, isPrimary: false },
    { id: "effectiveHourlyRate", label: "Effective Hourly Rate (On-Demand)", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "GPU compute is the most significant cost driver for AI/ML workloads, from training large language models to running inference at scale. Cloud providers offer GPUs on two pricing models: on-demand (pay full price, guaranteed availability) and spot (60-90% discount, can be interrupted). This calculator helps you model GPU compute costs across both pricing models, projecting monthly and annual expenses so you can budget accurately for your AI infrastructure needs.",
    howToUse: "Enter your GPU hourly cost, daily usage hours, days per month, number of GPUs, and expected spot discount percentage. The calculator shows on-demand vs spot costs, monthly savings, annual projections, and the effective hourly rate. Use the spot discount slider to model cost savings for interruptible workloads like training, batch inference, and development.",
    formulaExplanation: "Monthly On-Demand = GPU Cost/Hour × Hours/Day × Days × Number of GPUs. Monthly Spot = On-Demand × (1 − Spot Discount ÷ 100). Annual = Monthly On-Demand × 12. Effective Hourly Rate = Monthly On-Demand ÷ (Hours/Day × Days × Number of GPUs). Example: 1 A100 at $3.06/hr for 8 hrs/day × 30 days = $734.40/month on-demand. With 60% spot discount: $293.76/month — saving $440.64.",
    benchmarks: "GPU pricing varies by provider and GPU type. NVIDIA A100: $1-4/hour (cloud), H100: $2-8/hour (cloud), A10G: $0.70-1.50/hour, T4: $0.30-0.80/hour. Spot discounts range from 50-90% depending on GPU demand. Training workloads typical costs: fine-tuning LLaMA 70B (~$500-2000), training a small transformer model (~$100-500), and stable diffusion inference at scale (~$100-1000/month). Use [Lambda Labs](https://lambdalabs.com/service/gpu-cloud), [Vast.ai](https://vast.ai), or cloud provider calculators for current GPU pricing.",
    benchmarkData: [
      { metric: "NVIDIA A100 Cloud Price", value: "$1-4/hr", source: "Major Cloud Providers" },
      { metric: "NVIDIA H100 Cloud Price", value: "$2-8/hr", source: "Major Cloud Providers" },
      { metric: "NVIDIA A10G Cloud Price", value: "$0.70-1.50/hr", source: "AWS/GCP" },
      { metric: "NVIDIA T4 Cloud Price", value: "$0.30-0.80/hr", source: "AWS/GCP/Azure" },
      { metric: "Typical Spot Discount", value: "50-90%", source: "Cloud Providers" },
      { metric: "Fine-Tune LLaMA 70B Cost", value: "$500-2,000", source: "Community Estimates" },
    ],
    relatedCalculators: ["cloud-infrastructure-cost-calculator", "ai-model-comparison-calculator", "ai-fine-tuning-cost-calculator", "chatgpt-api-cost-calculator"],
    faq: [
      { question: "What is the difference between on-demand and spot GPU instances?", answer: "On-demand GPUs guarantee availability and are billed by the second/hour — you can run continuously without interruption. Spot instances offer 50-90% discounts but can be terminated with 2-minute notice when cloud providers need capacity back. Spot is ideal for fault-tolerant workloads: training (can checkpoint/resume), batch inference, and dev/test. On-demand is necessary for production inference requiring consistent availability." },
      { question: "Which GPU is best for my AI workload?", answer: "Training large language models: H100 (best), A100 (great). Fine-tuning and smaller models: A10G, L40S. Inference: T4 (cost-effective), L4 (balanced). Image generation: A10G, A100. For most users, pick based on VRAM needs: LLaMA 70B needs 80GB+ (A100/H100), LLaMA 7B needs 16GB+ (T4/A10G), stable diffusion needs 8GB+ (T4/A10G). Consider using [Hugging Face](https://huggingface.co) for optimized inference without managing GPUs." },
      { question: "How can I reduce GPU compute costs?", answer: "Use spot instances (60-90% savings for interruptible workloads), choose the right GPU for your task (don't over-provision), use multi-GPU training with gradient checkpointing and mixed precision, implement automatic shutdown of idle instances, reserve instances for baseline capacity (20-40% discount), use cloud GPU spot markets (Lambda Labs, Vast.ai, RunPod offer 30-50% below major cloud providers), and optimize model size with quantization and pruning." },
      { question: "What are typical GPU utilization rates and how do they affect costs?", answer: "Most teams achieve 30-60% GPU utilization during training (due to data loading bottlenecks, checkpointing, and compilation), and 10-30% during inference (due to traffic patterns). Improving utilization directly reduces effective cost per unit of work. Use tools like NVTOP, DCGM, and Weights & Biases to monitor utilization. Aim for 70%+ training utilization through optimized data pipelines and larger batch sizes." },
      { question: "How do reserved GPU instances compare to spot pricing?", answer: "Reserved instances (1-3 year commitments) offer 20-40% discounts vs on-demand. Spot instances offer 50-90% discounts but can be interrupted. The best cost strategy combines both: use reserved instances for baseline/predictable workloads (20-40% off), spot instances for burst/fault-tolerant workloads (60-90% off), and a small pool of on-demand for guaranteed capacity. This hybrid approach can reduce total GPU costs by 50-70%." },
      { question: "What is the cost of GPU inference vs training?", answer: "Inference costs are typically 30-50% of training costs over the lifetime of a model. For a model that costs $10,000 to train, expect $3,000-5,000/month for inference at moderate scale. Inference benefits more from optimization (quantization, distillation, batching) which can reduce costs 2-5x. Training costs are fixed per model; inference costs scale with usage. At scale, inference almost always dominates total GPU spend." },
      { question: "Which cloud provider has the cheapest GPU pricing?", answer: "Major providers (AWS, Azure, GCP) have similar pricing for equivalent GPUs, though GCP offers sustained-use discounts and Azure has reserved instance options. Specialist providers are often cheaper: Lambda Labs ($0.50-2/hr for A100), Vast.ai ($0.50-1.50/hr for A100, variable pricing), RunPod ($0.60-1.50/hr). For large-scale training, negotiating a private pricing agreement with your chosen provider (usually needed at $50K+/month) yields the best rates." },
      { question: "How does GPU memory affect pricing and performance?", answer: "GPU memory (VRAM) is the primary cost driver. H100 80GB costs 2-4x more than T4 16GB. More VRAM allows larger models, bigger batch sizes, and higher throughput. Key VRAM thresholds: Model weights (LLaMA 7B = 14GB FP16, LLaMA 70B = 140GB FP16, requiring multiple GPUs), plus overhead for activations, optimizer states, and batch data. Use gradient checkpointing and LoRA/QLoRA fine-tuning to reduce VRAM requirements." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
