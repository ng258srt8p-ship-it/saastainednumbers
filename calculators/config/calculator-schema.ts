export interface CalculatorConfig {
  slug: string;
  category: "revenue" | "unit-economics" | "churn-retention" | "growth-efficiency" | "ai-cost" | "side-hustle" | "personal-finance" | "general-business" | "saas-deepen";
  isNew?: boolean;
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
  content: CalculatorContent;

  benchmarkMetric?: string;
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: "number" | "currency" | "percentage";
  defaultValue: number;
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface CalculatorOutput {
  id: string;
  label: string;
  type: "currency" | "percentage" | "number" | "ratio" | "text";
  isPrimary?: boolean;
  prefix?: string;
  suffix?: string;
}

export interface CalculatorContent {
  intro: string;
  howToUse: string;
  formulaExplanation: string;
  benchmarks?: string;
  benchmarkData?: BenchmarkRow[];
  relatedCalculators: string[];
  faq: FAQItem[];
}

export interface BenchmarkRow {
  metric: string;
  value: string;
  source: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ChartConfig {
  type: "bar" | "line" | "area";
  title: string;
  dataKey: string;
  xAxisKey: string;
  color?: string;
}
