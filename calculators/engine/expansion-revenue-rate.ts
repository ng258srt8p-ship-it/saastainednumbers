export interface ExpansionRevenueRateParams {
  beginningMrr: number;
  expansionMrr: number;
}

export interface ExpansionRevenueRateResult {
  expansionRevenueRate: number;
}

export function calculateExpansionRevenueRate(params: ExpansionRevenueRateParams): ExpansionRevenueRateResult {
  const { beginningMrr, expansionMrr } = params;
  if (beginningMrr < 0 || expansionMrr < 0) throw new Error("Values must be non-negative");
  const expansionRevenueRate = beginningMrr > 0 ? (expansionMrr / beginningMrr) * 100 : 0;
  return { expansionRevenueRate };
}
