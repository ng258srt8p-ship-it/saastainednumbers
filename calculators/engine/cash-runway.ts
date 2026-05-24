export interface CashRunwayParams { currentCash: number; monthlyRevenue: number; monthlyExpenses: number; monthlyGrowthRate: number; }
export interface CashRunwayResult { grossBurn: number; netBurn: number; runwayMonths: number; revenueRunwayMonths: number; }
export function calculateCashRunway(p: CashRunwayParams): CashRunwayResult {
  if (p.currentCash < 0 || p.monthlyRevenue < 0 || p.monthlyExpenses < 0 || p.monthlyGrowthRate < 0) throw new Error("Values must be positive");
  const grossBurn = p.monthlyExpenses;
  const netBurn = p.monthlyExpenses - p.monthlyRevenue;
  if (netBurn <= 0) return { grossBurn, netBurn, runwayMonths: 999, revenueRunwayMonths: p.currentCash / (p.monthlyExpenses || 1) };
  let cash = p.currentCash; let months = 0; let rev = p.monthlyRevenue;
  while (cash > 0 && months < 1200) { cash -= (p.monthlyExpenses - rev); rev *= (1 + p.monthlyGrowthRate / 100); months++; }
  return { grossBurn, netBurn, runwayMonths: months, revenueRunwayMonths: p.currentCash / grossBurn };
}
