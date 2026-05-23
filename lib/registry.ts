import type { CalculatorConfig } from "@/calculators/config/calculator-schema";

const registry = new Map<string, CalculatorConfig>();

export function registerCalculator(config: CalculatorConfig): void {
  if (registry.has(config.slug)) {
    throw new Error(`Calculator "${config.slug}" is already registered`);
  }
  registry.set(config.slug, config);
}

export function getCalculator(slug: string): CalculatorConfig | undefined {
  return registry.get(slug);
}

export function getAllCalculators(): CalculatorConfig[] {
  return Array.from(registry.values());
}

export function getCalculatorsByCategory(category: string): CalculatorConfig[] {
  return getAllCalculators().filter((c) => c.category === category);
}

export function getCategories(): string[] {
  const cats = new Set(getAllCalculators().map((c) => c.category));
  return Array.from(cats).sort();
}
