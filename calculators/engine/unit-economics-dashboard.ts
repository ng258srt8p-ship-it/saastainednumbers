export interface UnitEconomicsDashboardParams { cac: number; ltv: number; arpu: number; grossMargin: number; churnRate: number; customerCount: number; }
export interface UnitEconomicsDashboardResult { ltvCacRatio: number; contributionMargin: number; paybackPeriodMonths: number; mrr: number; grossProfitPerCustomer: number; }
export function calculateUnitEconomicsDashboard(p: UnitEconomicsDashboardParams): UnitEconomicsDashboardResult {
  if (p.cac <= 0 || p.ltv < 0 || p.arpu < 0 || p.grossMargin < 0 || p.churnRate < 0 || p.customerCount < 0) throw new Error("Values must be positive");
  const ltvCac = p.ltv / p.cac;
  const cMargin = p.arpu * (p.grossMargin / 100);
  const monthlyChurn = p.churnRate / 100;
  const payback = monthlyChurn > 0 ? p.cac / cMargin : 999;
  const mrr = p.arpu * p.customerCount;
  const gpPerCustomer = p.arpu * (p.grossMargin / 100);
  return { ltvCacRatio: ltvCac, contributionMargin: cMargin, paybackPeriodMonths: payback, mrr, grossProfitPerCustomer: gpPerCustomer };
}
