import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "master-aggregator",
  category: "revenue",
  meta: {
    title: "Master Aggregator",
    description: "Aggregate and sum multiple calculator outputs into a single total. Connect up to 8 calculators and view their combined output.",
    keywords: ["aggregator", "sum", "total", "metrics", "dashboard", "consolidated"],
  },
  benchmarkMetric: undefined,
  inputs: [
    { id: "in1", label: "IN 1", type: "number" as const, defaultValue: 0 },
    { id: "in2", label: "IN 2", type: "number" as const, defaultValue: 0 },
    { id: "in3", label: "IN 3", type: "number" as const, defaultValue: 0 },
    { id: "in4", label: "IN 4", type: "number" as const, defaultValue: 0 },
    { id: "in5", label: "IN 5", type: "number" as const, defaultValue: 0 },
    { id: "in6", label: "IN 6", type: "number" as const, defaultValue: 0 },
    { id: "in7", label: "IN 7", type: "number" as const, defaultValue: 0 },
    { id: "in8", label: "IN 8", type: "number" as const, defaultValue: 0 },
  ],
  outputs: [
    { id: "master-total", label: "Total", type: "currency" as const, isPrimary: true },
  ],
  content: {
    intro: "The Master Aggregator sums values from up to 8 connected calculators into a single total. It acts as a consolidation node for your canvas workspace, letting you see the combined output of multiple metrics at a glance.",
    howToUse: "Connect calculator outputs to the Master Aggregator's input jacks (IN 1 through IN 8) using patch cables. Each jack accepts a numeric value from any calculator's output handle.",
    formulaExplanation: "The Master Aggregator simply computes: Total = IN1 + IN2 + IN3 + IN4 + IN5 + IN6 + IN7 + IN8. Each input defaults to 0 when no cable is connected.",
    relatedCalculators: [] as string[],
    faq: [] as { question: string; answer: string }[],
  },
} as CalculatorConfig;

registerCalculator(config);
export default config;
