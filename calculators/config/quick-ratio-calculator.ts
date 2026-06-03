import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "quick-ratio-calculator",
  category: "growth-efficiency",
  meta: {
    title: "Quick Ratio Calculator",
    description: "Calculate your SaaS quick ratio to measure growth efficiency  -  the ratio of new + expansion MRR to churned + contraction MRR.",
    keywords: ["quick ratio", "saas quick ratio", "growth efficiency", "mrr", "saas metrics"],
  },
  benchmarkMetric: "quick-ratio",
  inputs: [
    { id: "newMrr", label: "New MRR (new customers)", type: "currency" as const, defaultValue: 20000 },
    { id: "expansionMrr", label: "Expansion MRR (upgrades)", type: "currency" as const, defaultValue: 10000 },
    { id: "churnedMrr", label: "Churned MRR (cancellations)", type: "currency" as const, defaultValue: 5000 },
    { id: "contractionMrr", label: "Contraction MRR (downgrades)", type: "currency" as const, defaultValue: 2000 },
  ],
  outputs: [
    { id: "quickRatio", label: "Quick Ratio", type: "number" as const, isPrimary: true },
    { id: "growthMrr", label: "Growth MRR (New + Expansion)", type: "currency" as const, isPrimary: false },
    { id: "lostMrr", label: "Lost MRR (Churned + Contraction)", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "The SaaS Quick Ratio measures growth efficiency by comparing revenue gained from new customers and expansions against revenue lost to churn and contractions. It's one of the most powerful diagnostic metrics because it captures both growth and retention in a single number. A quick ratio above 4 means you're growing efficiently; below 1 means you're shrinking despite your acquisition efforts. Investors use this metric to evaluate whether a company's growth is sustainable or built on a leaky bucket. This calculator helps you track your quick ratio and understand the dynamics of your revenue changes.",
    howToUse: "Enter your new MRR from new customers, expansion MRR from upgrades, churned MRR from cancellations, and contraction MRR from downgrades. The calculator will compute your quick ratio. A ratio above 4 is excellent, 2-4 is good, 1-2 needs attention, below 1 is critical.",
    formulaExplanation: "Quick Ratio = (New MRR + Expansion MRR) ÷ (Churned MRR + Contraction MRR). Growth MRR = New MRR + Expansion MRR. Lost MRR = Churned MRR + Contraction MRR. Example: $20K new + $10K expansion = $30K growth. $5K churned + $2K contraction = $7K lost. Quick Ratio = $30K ÷ $7K = 4.3",
    benchmarks: "According to KeyBanc Capital Markets 2025 SaaS Survey, the median public SaaS quick ratio is 3.5. Top-quartile companies achieve 5.0+. Companies with quick ratios above 4 are considered hyper-efficient. Below 2.0 requires attention to churn. Below 1.0 indicates the company is shrinking despite spending on acquisition.",
    benchmarkData: [
      { metric: "Hyper-Efficient", value: "4.0+", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Top Quartile", value: "5.0+", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Median", value: "3.5", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Needs Attention", value: "1.0 - 2.0", source: "General benchmark" },
      { metric: "Critical (Shrinking)", value: "< 1.0", source: "General benchmark" },
    ],
    relatedCalculators: ["mrr-calculator", "nrr-calculator", "burn-rate-calculator"],
    faq: [
      { question: "What is a good quick ratio for a SaaS company?", answer: "Above 4.0 is excellent, 2.0-4.0 is good, 1.0-2.0 needs attention. Below 1.0 means you're shrinking  -  you lose more revenue than you gain. The industry median is approximately 3.5." },
      { question: "How is quick ratio different from NRR?", answer: "NRR measures retention from existing customers including expansions. Quick Ratio adds new customer revenue to the numerator, measuring total growth vs total loss. Quick Ratio is a broader efficiency metric." },
      { question: "Why does a high quick ratio matter?", answer: "A high quick ratio means growth is efficient. Every dollar of lost revenue is replaced by $4+ of new revenue. This allows sustainable growth without excessive spending on acquisition." },
      { question: "Can the quick ratio be infinite?", answer: "Yes, if you have zero churn and contraction. In practice, no SaaS company achieves infinite quick ratio. A very high quick ratio (20+) usually means the company is very early stage with minimal churn." },
      { question: "How do I improve my quick ratio?", answer: "Two approaches: increase the numerator (faster new customer acquisition, more expansion revenue) or decrease the denominator (reduce churn, minimize downgrades). Fixing churn is typically more cost-effective. Monitor quick ratio trends with [Baremetrics](https://baremetrics.com?via=saastainednumbers)." },
      { question: "Does quick ratio apply to all SaaS companies?", answer: "Yes, but interpretation varies by stage. Early-stage companies naturally have higher quick ratios because they have few customers to churn. Mature companies should maintain 2.0+." },
      { question: "How often should I track quick ratio?", answer: "Monthly. Track the trend  -  a declining quick ratio over 3-6 months signals that churn is growing faster than new acquisition." },
      { question: "What is the relationship between quick ratio and growth rate?", answer: "Higher quick ratios enable faster growth. If quick ratio is 4.0, you can grow 4x faster than if quick ratio is 1.0 given the same acquisition spending." },
    ],
  },
  locales: {
    es: {
      meta: {
        title: "Calculadora de Quick Ratio",
        description: "Calcula tu quick ratio SaaS para medir la eficiencia de crecimiento – la relación entre el MRR nuevo + expansión y el MRR perdido por cancelaciones + contracciones.",
      },
      inputs: [
        { id: "newMrr", label: "MRR Nuevo (nuevos clientes)" },
        { id: "expansionMrr", label: "MRR de Expansión (mejoras)" },
        { id: "churnedMrr", label: "MRR Perdido (cancelaciones)" },
        { id: "contractionMrr", label: "MRR por Contracción (degradaciones)" },
      ],
      outputs: [
        { id: "quickRatio", label: "Quick Ratio" },
        { id: "growthMrr", label: "MRR de Crecimiento (Nuevo + Expansión)" },
        { id: "lostMrr", label: "MRR Perdido (Cancelaciones + Contracción)" },
      ],
    },
    de: {
      meta: {
        title: "Quick-Ratio-Rechner",
        description: "Berechne deine SaaS-Quick-Ratio zur Messung der Wachstumseffizienz – das Verhältnis von neuem + expansionsbedingtem MRR zu abgewandertem + rückläufigem MRR.",
      },
      inputs: [
        { id: "newMrr", label: "Neuer MRR (Neukunden)" },
        { id: "expansionMrr", label: "Expansions-MRR (Upgrades)" },
        { id: "churnedMrr", label: "Abgewanderter MRR (Kündigungen)" },
        { id: "contractionMrr", label: "Rückläufiger MRR (Downgrades)" },
      ],
      outputs: [
        { id: "quickRatio", label: "Quick Ratio" },
        { id: "growthMrr", label: "Wachstums-MRR (Neu + Expansion)" },
        { id: "lostMrr", label: "Verlorener MRR (Abwanderung + Rückgang)" },
      ],
    },
    pt: {
      meta: {
        title: "Calculadora de Quick Ratio",
        description: "Calcule seu quick ratio SaaS para medir a eficiência de crescimento – a relação entre o MRR novo + expansão e o MRR perdido por cancelamentos + contrações.",
      },
      inputs: [
        { id: "newMrr", label: "Novo MRR (novos clientes)" },
        { id: "expansionMrr", label: "MRR de Expansão (upgrades)" },
        { id: "churnedMrr", label: "MRR Perdido (cancelamentos)" },
        { id: "contractionMrr", label: "MRR por Contração (rebaixamentos)" },
      ],
      outputs: [
        { id: "quickRatio", label: "Quick Ratio" },
        { id: "growthMrr", label: "MRR de Crescimento (Novo + Expansão)" },
        { id: "lostMrr", label: "MRR Perdido (Cancelamentos + Contração)" },
      ],
    },
    fr: {
      meta: {
        title: "Calculateur de Quick Ratio",
        description: "Calculez votre quick ratio SaaS pour mesurer l'efficacité de croissance – le rapport entre le nouveau MRR + l'expansion et le MRR perdu par désabonnement + contraction.",
      },
      inputs: [
        { id: "newMrr", label: "Nouveau MRR (nouveaux clients)" },
        { id: "expansionMrr", label: "MRR d'Expansion (upgrades)" },
        { id: "churnedMrr", label: "MRR Perdu (annulations)" },
        { id: "contractionMrr", label: "MRR de Contraction (rétrogradations)" },
      ],
      outputs: [
        { id: "quickRatio", label: "Quick Ratio" },
        { id: "growthMrr", label: "MRR de Croissance (Nouveau + Expansion)" },
        { id: "lostMrr", label: "MRR Perdu (Annulations + Contraction)" },
      ],
    },
    ja: {
      meta: {
        title: "クイックレシオ計算機",
        description: "SaaSのクイックレシオを計算して成長効率を測定 – 新規MRR＋拡張MRRと解約MRR＋縮小MRRの比率です。",
      },
      inputs: [
        { id: "newMrr", label: "新規MRR（新規顧客）" },
        { id: "expansionMrr", label: "拡張MRR（アップグレード）" },
        { id: "churnedMrr", label: "解約MRR（キャンセル）" },
        { id: "contractionMrr", label: "縮小MRR（ダウングレード）" },
      ],
      outputs: [
        { id: "quickRatio", label: "クイックレシオ" },
        { id: "growthMrr", label: "成長MRR（新規＋拡張）" },
        { id: "lostMrr", label: "損失MRR（解約＋縮小）" },
      ],
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
