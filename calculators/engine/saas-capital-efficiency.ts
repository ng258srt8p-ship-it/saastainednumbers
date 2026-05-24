export interface SaaSCapitalEfficiencyParams { totalRaised: number; arr: number; arrGrowthLastYear: number; }
export interface SaaSCapitalEfficiencyResult { efficiencyRatio: number; category: string; arrPerDollarRaised: number; }
export function calculateSaaSCapitalEfficiency(p: SaaSCapitalEfficiencyParams): SaaSCapitalEfficiencyResult {
  if (p.totalRaised <= 0 || p.arr < 0 || p.arrGrowthLastYear < 0) throw new Error("Values must be positive");
  const arrPerDollar = p.arr / p.totalRaised;
  const growthComponent = p.arrGrowthLastYear / 100;
  const efficiency = arrPerDollar * (1 + growthComponent);
  const category = efficiency >= 1.0 ? "Excellent" : efficiency >= 0.5 ? "Good" : efficiency >= 0.25 ? "Average" : "Poor";
  return { efficiencyRatio: efficiency, category, arrPerDollarRaised: arrPerDollar };
}
