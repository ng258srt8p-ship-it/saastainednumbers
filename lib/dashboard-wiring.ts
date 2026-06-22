export const METRIC_ALIASES: Record<string, string> = {
  monthlyChurnPct: "churnRate",
  annualChurnPct: "churnRate",
  nps: "nps",
  ltv: "ltv",
  cac: "cac",
  mrr: "mrr",
  arr: "arr",
  arpu: "arpu",
  grossMargin: "grossMargin",
  totalCustomers: "customers",
  totalRevenue: "revenue",
  totalMonthlySessions: "sessionsPerUserPerMonth",
};

export function findInputWiring(
  inputId: string,
  slug: string,
  allOutputs: Map<string, Record<string, number>>,
): number | undefined {
  const directMatch = findMetricInOutputs(inputId, allOutputs, slug);
  if (directMatch !== undefined) return directMatch;

  const aliasedMetric = METRIC_ALIASES[inputId];
  if (aliasedMetric) {
    const aliasMatch = findMetricInOutputs(aliasedMetric, allOutputs, slug);
    if (aliasMatch !== undefined) return aliasMatch;
  }

  for (const [aliasSource, aliasTarget] of Object.entries(METRIC_ALIASES)) {
    if (aliasTarget === inputId) {
      const reverseMatch = findMetricInOutputs(aliasSource, allOutputs, slug);
      if (reverseMatch !== undefined) return reverseMatch;
    }
  }

  return undefined;
}

function findMetricInOutputs(
  metricId: string,
  allOutputs: Map<string, Record<string, number>>,
  excludeSlug: string,
): number | undefined {
  for (const [otherSlug, outputs] of allOutputs) {
    if (otherSlug === excludeSlug) continue;
    const value = outputs[metricId];
    if (value !== undefined) return value;
  }
  return undefined;
}

export const TEMPLATES: Record<string, { label: string; description: string; calcs: string[] }> = {
  "startup-metrics": {
    label: "Startup Metrics",
    description: "MRR, CAC, LTV, Churn, ARPU, the core SaaS metrics",
    calcs: ["mrr-calculator", "cac-calculator", "ltv-calculator", "churn-calculator", "arpu-calculator"],
  },
  "unit-economics": {
    label: "Unit Economics",
    description: "Gross Margin, Contribution Margin, Payback Period, Burn Rate",
    calcs: ["gross-margin-calculator", "contribution-margin-calculator", "payback-period-calculator", "burn-rate-calculator"],
  },
  "saas-health": {
    label: "SaaS Health",
    description: "NRR, Churn, LTV:CAC, Quick Ratio, Capital Efficiency",
    calcs: ["nrr-calculator", "churn-calculator", "cac-ltv-ratio-calculator", "quick-ratio-calculator", "saas-capital-efficiency-calculator"],
  },
  "growth-engine": {
    label: "Growth Engine",
    description: "CAC, Payback Period, Magic Number, Rule of 40",
    calcs: ["cac-calculator", "cac-payback-period-enhanced-calculator", "magic-number-calculator", "rule-of-40-calculator"],
  },
  "personal-finance": {
    label: "Personal Finance",
    description: "FIRE, Savings Rate, Investment Returns, Debt Payoff",
    calcs: ["fire-calculator", "savings-rate-calculator", "investment-returns-calculator", "debt-payoff-calculator"],
  },
};
