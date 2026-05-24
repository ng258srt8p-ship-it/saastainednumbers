export interface QuickRatioParams {
  newMrr: number;
  expansionMrr: number;
  churnedMrr: number;
  contractionMrr: number;
}

export interface QuickRatioResult {
  quickRatio: number;
  growthMrr: number;
  lostMrr: number;
}

export function calculateQuickRatio(params: QuickRatioParams): QuickRatioResult {
  const { newMrr, expansionMrr, churnedMrr, contractionMrr } = params;
  if (newMrr < 0 || expansionMrr < 0 || churnedMrr < 0 || contractionMrr < 0) {
    throw new Error("All values must be non-negative");
  }
  const growthMrr = newMrr + expansionMrr;
  const lostMrr = churnedMrr + contractionMrr;
  const quickRatio = lostMrr > 0 ? growthMrr / lostMrr : growthMrr > 0 ? Infinity : 1;
  return { quickRatio, growthMrr, lostMrr };
}
