export type Stage = "seed" | "series-a" | "series-b" | "series-c" | "growth";

export type HealthStatus = "healthy" | "watch" | "critical" | "reference";

interface Threshold {
  healthy: number;
  watch: number;
}

const THRESHOLDS: Record<string, Record<Stage, Threshold>> = {
  "churn-rate": {
    seed: { healthy: 5, watch: 7 },
    "series-a": { healthy: 4, watch: 6 },
    "series-b": { healthy: 3, watch: 5 },
    "series-c": { healthy: 2, watch: 4 },
    growth: { healthy: 2, watch: 3 },
  },
  "ltv-cac": {
    seed: { healthy: 5, watch: 3 },
    "series-a": { healthy: 5, watch: 3 },
    "series-b": { healthy: 4, watch: 3 },
    "series-c": { healthy: 4, watch: 3 },
    growth: { healthy: 3, watch: 2 },
  },
  nrr: {
    seed: { healthy: 110, watch: 100 },
    "series-a": { healthy: 110, watch: 100 },
    "series-b": { healthy: 115, watch: 105 },
    "series-c": { healthy: 120, watch: 110 },
    growth: { healthy: 120, watch: 110 },
  },
  grr: {
    seed: { healthy: 90, watch: 85 },
    "series-a": { healthy: 92, watch: 87 },
    "series-b": { healthy: 95, watch: 90 },
    "series-c": { healthy: 95, watch: 90 },
    growth: { healthy: 95, watch: 90 },
  },
  "gross-margin": {
    seed: { healthy: 75, watch: 60 },
    "series-a": { healthy: 75, watch: 60 },
    "series-b": { healthy: 75, watch: 60 },
    "series-c": { healthy: 75, watch: 60 },
    growth: { healthy: 70, watch: 55 },
  },
  "cac-payback": {
    seed: { healthy: 12, watch: 18 },
    "series-a": { healthy: 12, watch: 18 },
    "series-b": { healthy: 14, watch: 20 },
    "series-c": { healthy: 16, watch: 22 },
    growth: { healthy: 18, watch: 24 },
  },
  "magic-number": {
    seed: { healthy: 0.75, watch: 0.4 },
    "series-a": { healthy: 0.75, watch: 0.4 },
    "series-b": { healthy: 0.7, watch: 0.4 },
    "series-c": { healthy: 0.7, watch: 0.4 },
    growth: { healthy: 0.5, watch: 0.3 },
  },
  "rule-of-40": {
    seed: { healthy: 40, watch: 20 },
    "series-a": { healthy: 40, watch: 25 },
    "series-b": { healthy: 40, watch: 25 },
    "series-c": { healthy: 40, watch: 30 },
    growth: { healthy: 40, watch: 30 },
  },
  "burn-multiple": {
    seed: { healthy: 1, watch: 2 },
    "series-a": { healthy: 1, watch: 2 },
    "series-b": { healthy: 0.75, watch: 1.5 },
    "series-c": { healthy: 0.5, watch: 1 },
    growth: { healthy: 0.5, watch: 1 },
  },
  "customer-health": {
    seed: { healthy: 70, watch: 50 },
    "series-a": { healthy: 70, watch: 50 },
    "series-b": { healthy: 70, watch: 50 },
    "series-c": { healthy: 70, watch: 50 },
    growth: { healthy: 70, watch: 50 },
  },
  "quick-ratio": {
    seed: { healthy: 4, watch: 2 },
    "series-a": { healthy: 4, watch: 2 },
    "series-b": { healthy: 3, watch: 1.5 },
    "series-c": { healthy: 3, watch: 1.5 },
    growth: { healthy: 2, watch: 1 },
  },
  "revenue-growth": {
    seed: { healthy: 20, watch: 10 },
    "series-a": { healthy: 15, watch: 8 },
    "series-b": { healthy: 10, watch: 5 },
    "series-c": { healthy: 7, watch: 3 },
    growth: { healthy: 5, watch: 2 },
  },
  "trial-to-paid": {
    seed: { healthy: 10, watch: 5 },
    "series-a": { healthy: 15, watch: 8 },
    "series-b": { healthy: 20, watch: 12 },
    "series-c": { healthy: 25, watch: 15 },
    growth: { healthy: 25, watch: 15 },
  },
  "activation-rate": {
    seed: { healthy: 40, watch: 25 },
    "series-a": { healthy: 40, watch: 25 },
    "series-b": { healthy: 50, watch: 35 },
    "series-c": { healthy: 60, watch: 40 },
    growth: { healthy: 60, watch: 40 },
  },
  nps: {
    seed: { healthy: 40, watch: 20 },
    "series-a": { healthy: 40, watch: 20 },
    "series-b": { healthy: 50, watch: 30 },
    "series-c": { healthy: 50, watch: 30 },
    growth: { healthy: 50, watch: 30 },
  },
  "operating-margin": {
    seed: { healthy: 15, watch: 5 },
    "series-a": { healthy: 15, watch: 5 },
    "series-b": { healthy: 20, watch: 10 },
    "series-c": { healthy: 20, watch: 10 },
    growth: { healthy: 20, watch: 10 },
  },
  "lead-conversion": {
    seed: { healthy: 5, watch: 2 },
    "series-a": { healthy: 8, watch: 4 },
    "series-b": { healthy: 12, watch: 6 },
    "series-c": { healthy: 15, watch: 10 },
    growth: { healthy: 15, watch: 10 },
  },
  "revenue-per-employee": {
    seed: { healthy: 100000, watch: 50000 },
    "series-a": { healthy: 150000, watch: 80000 },
    "series-b": { healthy: 200000, watch: 120000 },
    "series-c": { healthy: 250000, watch: 150000 },
    growth: { healthy: 300000, watch: 200000 },
  },
};

export function getMetricKey(slug: string): string | null {
  const map: Record<string, string | null> = {
    "mrr-calculator": null,
    "arpu-calculator": null,
    "acv-calculator": null,
    "mrr-growth-rate-calculator": "revenue-growth",
    "churn-calculator": "churn-rate",
    "nrr-calculator": "nrr",
    "customer-health-score-calculator": "customer-health",
    "gross-margin-calculator": "gross-margin",
    "ltv-calculator": null,
    "cac-calculator": null,
    "cac-ltv-ratio-calculator": "ltv-cac",
    "payback-period-calculator": "cac-payback",
    "magic-number-calculator": "magic-number",
    "rule-of-40-calculator": "rule-of-40",
    "burn-rate-calculator": "burn-multiple",
    "quick-ratio-calculator": "quick-ratio",
    "contribution-margin-calculator": null,
    "operating-margin-calculator": "operating-margin",
    "revenue-per-employee-calculator": "revenue-per-employee",
    "net-cash-flow-calculator": null,
    "expansion-revenue-rate-calculator": null,
    "lead-conversion-rate-calculator": "lead-conversion",
    "trial-to-paid-calculator": "trial-to-paid",
    "activation-rate-calculator": "activation-rate",
    "nps-calculator": "nps",
  };
  return map[slug] ?? null;
}

export function getHealthStatus(metricKey: string, value: number, stage: Stage): HealthStatus {
  const thresholds = THRESHOLDS[metricKey]?.[stage];
  if (!thresholds) return "reference";

  const lowerIsBetter = ["churn-rate", "cac-payback", "burn-multiple"].includes(metricKey);

  if (lowerIsBetter) {
    if (value <= thresholds.healthy) return "healthy";
    if (value <= thresholds.watch) return "watch";
    return "critical";
  }

  if (value >= thresholds.healthy) return "healthy";
  if (value >= thresholds.watch) return "watch";
  return "critical";
}

export function getHealthLabel(status: HealthStatus): string {
  switch (status) {
    case "healthy":
      return "Healthy";
    case "watch":
      return "Watch";
    case "critical":
      return "Critical";
    case "reference":
      return "Reference";
  }
}

export function getHealthColor(status: HealthStatus): string {
  switch (status) {
    case "healthy":
      return "bg-green-100 text-green-700 border-green-200";
    case "watch":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "critical":
      return "bg-red-100 text-red-700 border-red-200";
    case "reference":
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

export function getBarColor(status: HealthStatus): string {
  switch (status) {
    case "healthy":
      return "bg-green-500";
    case "watch":
      return "bg-amber-500";
    case "critical":
      return "bg-red-500";
    case "reference":
      return "bg-gray-300";
  }
}

// ── Benchmark Reference Data (for display on calculator pages) ──

export interface BenchmarkData {
  poor: string;
  average: string;
  good: string;
  excellent: string;
  source: string;
  date: string;
  notes?: string;
}

export const benchmarkReferences: Record<string, BenchmarkData> = {
  "ltv-cac": {
    poor: "< 1x",
    average: "1-3x",
    good: "3-5x",
    excellent: "> 5x",
    source: "SaaS Capital / KeyBanc benchmarks",
    date: "2025",
    notes: "LTV:CAC > 3x is considered healthy for most SaaS businesses"
  },
  "churn-rate": {
    poor: "> 10% monthly",
    average: "5-10% monthly",
    good: "3-5% monthly",
    excellent: "< 3% monthly",
    source: "Recurly Research / SaaS Benchmarks",
    date: "2025",
  },
  nps: {
    poor: "< 0",
    average: "0-30",
    good: "30-70",
    excellent: "> 70",
    source: "Satmetrix / Net Promoter System",
    date: "2024",
  },
  "mrr-growth-rate": {
    poor: "< 5%",
    average: "5-10%",
    good: "10-20%",
    excellent: "> 20%",
    source: "KeyBanc / SaaS Capital benchmarks",
    date: "2025",
  },
  "gross-margin": {
    poor: "< 50%",
    average: "50-65%",
    good: "65-80%",
    excellent: "> 80%",
    source: "KeyBanc SaaS Survey",
    date: "2025",
  },
  "quick-ratio": {
    poor: "< 1",
    average: "1-2",
    good: "2-4",
    excellent: "> 4",
    source: "David Sacks / SaaS Capital",
    date: "2025",
  },
  "cac-payback": {
    poor: "> 24 months",
    average: "12-24 months",
    good: "6-12 months",
    excellent: "< 6 months",
    source: "General benchmark",
    date: "2025",
  },
  "burn-multiple": {
    poor: "> 2x",
    average: "1-2x",
    good: "0.5-1x",
    excellent: "< 0.5x",
    source: "Bessemer Venture Partners",
    date: "2025",
  },
  "rule-of-40": {
    poor: "< 20",
    average: "20-30",
    good: "30-40",
    excellent: "> 40",
    source: "Brad Feld / SaaS Capital",
    date: "2025",
  },
  arpu: {
    poor: "< $10",
    average: "$10-50",
    good: "$50-150",
    excellent: "> $150",
    source: "KeyBanc / SaaS Capital benchmarks",
    date: "2025",
  },
  "magic-number": {
    poor: "< 0.5",
    average: "0.5-0.75",
    good: "0.75-1.0",
    excellent: "> 1.0",
    source: "General benchmark",
    date: "2025",
  },
  "employee-cost": {
    poor: "Above market",
    average: "Market rate",
    good: "10-15% below market with equity",
    excellent: "Below market with high equity upside",
    source: "Pave / Radford Salary Surveys",
    date: "2025",
  },
};

export function getGradientPercent(metricKey: string, value: number, stage: Stage = "series-a"): number {
  const thresholds = THRESHOLDS[metricKey]?.[stage];
  if (!thresholds) return 50;

  const lowerIsBetter = ["churn-rate", "cac-payback", "burn-multiple"].includes(metricKey);

  if (lowerIsBetter) {
    if (value <= thresholds.healthy) return 80;
    if (value <= thresholds.watch) return 50;
    return 20;
  }

  if (value >= thresholds.healthy) return 80;
  if (value >= thresholds.watch) return 50;
  return 20;
}
