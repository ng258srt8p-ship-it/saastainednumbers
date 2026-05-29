import type { CalculatorConfig } from "@/calculators/config/calculator-schema";

const registry = new Map<string, CalculatorConfig>();

export const KNOWN_CATEGORIES = [
  "revenue",
  "unit-economics",
  "churn-retention",
  "growth-efficiency",
  "ai-cost",
  "side-hustle",
  "personal-finance",
  "general-business",
  "saas-deepen",
] as const;

export const CATEGORY_META: Record<string, { name: string; description: string; icon: string }> = {
  revenue: { name: "Revenue Metrics", description: "MRR, ARR, ARPU, and revenue analysis calculators", icon: "revenue" },
  "unit-economics": { name: "Unit Economics", description: "CAC, LTV, payback period, gross margin, and burn rate", icon: "unit-economics" },
  "churn-retention": { name: "Churn & Retention", description: "Monthly churn, annual churn, and customer retention", icon: "churn-retention" },
  "growth-efficiency": { name: "Growth & Efficiency", description: "Quick ratio, magic number, rule of 40, and growth metrics", icon: "growth-efficiency" },
  "ai-cost": { name: "AI Cost", description: "API costs for Claude, ChatGPT, Gemini, and image generation models", icon: "ai-cost" },
  "side-hustle": { name: "Side Hustle", description: "YouTube, freelance, Etsy, gig work, and creator income calculators", icon: "side-hustle" },
  "personal-finance": { name: "Personal Finance", description: "FIRE, savings, investments, debt payoff, and retirement planning", icon: "personal-finance" },
  "general-business": { name: "General Business", description: "Break-even, ROI, pricing, employee cost, and valuation", icon: "general-business" },
  "saas-deepen": { name: "SaaS Deepen", description: "Advanced SaaS metrics: engagement, adoption, cohorts, efficiency", icon: "saas-deepen" },
};

export function registerCalculator(config: CalculatorConfig): void {
  if (registry.has(config.slug)) {
    return;
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

export function getAllKnownCategories(): string[] {
  return Array.from(KNOWN_CATEGORIES);
}

const CATEGORY_SLUG_TO_KEY: Record<string, string> = {
  revenue: "revenue",
  "unit-economics": "unitEconomics",
  "churn-retention": "churnRetention",
  "growth-efficiency": "growthEfficiency",
  "ai-cost": "aiCost",
  "side-hustle": "sideHustle",
  "personal-finance": "personalFinance",
  "general-business": "generalBusiness",
  "saas-deepen": "saasDeepen",
};

export function getCategoryTranslationKey(slug: string): string {
  return CATEGORY_SLUG_TO_KEY[slug] ?? slug;
}
