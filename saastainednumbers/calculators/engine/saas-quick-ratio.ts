export interface SaaSQuickRatioParams { newMRR: number; expansionMRR: number; churnedMRR: number; contractionMRR: number; }
export interface SaaSQuickRatioResult { quickRatio: number; isHealthy: boolean; category: string; }
export function calculateSaaSQuickRatio(p: SaaSQuickRatioParams): SaaSQuickRatioResult {
  if (p.newMRR < 0 || p.expansionMRR < 0 || p.churnedMRR < 0 || p.contractionMRR < 0) throw new Error("Values must be positive");
  const denominator = p.churnedMRR + p.contractionMRR;
  const ratio = denominator > 0 ? (p.newMRR + p.expansionMRR) / denominator : 999;
  const isHealthy = ratio >= 4;
  const category = ratio >= 4 ? "Excellent" : ratio >= 2 ? "Good" : ratio >= 1 ? "Needs Attention" : "Critical";
  return { quickRatio: ratio, isHealthy, category };
}
