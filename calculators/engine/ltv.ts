export interface LTVParams {
  arpu: number;
  grossMargin: number;
  churnRate: number;
}

export interface LTVResult {
  ltv: number;
  ltvCacRatio: number;
}

export function calculateLTV(params: LTVParams): LTVResult {
  const { arpu, grossMargin, churnRate } = params;
  if (arpu < 0 || grossMargin < 0 || grossMargin > 100 || churnRate <= 0 || churnRate > 100) {
    throw new Error("ARPUs must be >= 0, 0 < churnRate <= 100, 0 <= grossMargin <= 100");
  }
  const netProfit = arpu * (grossMargin / 100);
  const monthlyChurnDecimal = churnRate / 100;
  const avgLifetimeMonths = 1 / monthlyChurnDecimal;
  const ltv = netProfit * avgLifetimeMonths;
  const ltvCacRatio = 0;
  return { ltv, ltvCacRatio };
}

export function calculateLTVWithCAC(params: LTVParams & { cac: number }): LTVResult & { ltvCacRatio: number } {
  const { ltv } = calculateLTV(params);
  const ltvCacRatio = params.cac > 0 ? ltv / params.cac : 0;
  return { ltv, ltvCacRatio };
}
