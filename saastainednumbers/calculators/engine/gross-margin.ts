export interface GrossMarginParams {
  revenue: number;
  cogs: number;
}

export interface GrossMarginResult {
  grossMargin: number;
  grossProfit: number;
  cogsPercentage: number;
}

export function calculateGrossMargin(params: GrossMarginParams): GrossMarginResult {
  const { revenue, cogs } = params;
  if (revenue <= 0) {
    throw new Error("Revenue must be positive");
  }
  if (cogs < 0) {
    throw new Error("COGS must be non-negative");
  }
  if (cogs > revenue) {
    throw new Error("COGS cannot exceed revenue");
  }
  const grossProfit = revenue - cogs;
  const grossMargin = (grossProfit / revenue) * 100;
  const cogsPercentage = (cogs / revenue) * 100;
  return { grossMargin, grossProfit, cogsPercentage };
}
