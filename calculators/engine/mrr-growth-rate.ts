export interface MRRGrowthRateParams {
  previousMrr: number;
  currentMrr: number;
}

export interface MRRGrowthRateResult {
  growthRate: number;
  mrrChange: number;
}

export function calculateMRRGrowthRate(params: MRRGrowthRateParams): MRRGrowthRateResult {
  const { previousMrr, currentMrr } = params;
  if (previousMrr < 0 || currentMrr < 0) {
    throw new Error("MRR values must be non-negative");
  }
  const mrrChange = currentMrr - previousMrr;
  const growthRate = previousMrr > 0 ? (mrrChange / previousMrr) * 100 : currentMrr > 0 ? Infinity : 0;
  return { growthRate, mrrChange };
}
