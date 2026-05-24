import type { CalculatorConfig, CalculatorOutput } from "@/calculators/config/calculator-schema";

export function createMockConfig(overrides: Partial<CalculatorConfig> = {}): CalculatorConfig {
  return {
    slug: "test-calc",
    category: "revenue",
    meta: {
      title: "Test Calculator",
      description: "A test calculator",
      keywords: ["test"],
    },
    inputs: [
      { id: "value1", label: "Value 1", type: "number", defaultValue: 100 },
      { id: "value2", label: "Value 2", type: "currency", defaultValue: 50 },
    ],
    outputs: [
      { id: "result", label: "Result", type: "currency", isPrimary: true },
    ],
    content: {
      intro: "This is a test calculator.",
      howToUse: "Enter values and see results.",
      formulaExplanation: "Result = Value 1 × Value 2",
      relatedCalculators: [],
      faq: [{ question: "How does it work?", answer: "It multiplies two values." }],
    },
    ...overrides,
  } satisfies CalculatorConfig;
}

export function expectOutputType(outputs: CalculatorOutput[], id: string, type: string): boolean {
  const output = outputs.find((o) => o.id === id);
  return output?.type === type;
}

