export interface FeatureAdoptionRateParams { totalUsers: number; usersUsingFeature: number; targetAdoptionRate: number; }
export interface FeatureAdoptionRateResult { adoptionRate: number; gapToTarget: number; usersNeeded: number; status: string; }
export function calculateFeatureAdoptionRate(p: FeatureAdoptionRateParams): FeatureAdoptionRateResult {
  if (p.totalUsers <= 0 || p.usersUsingFeature < 0 || p.targetAdoptionRate < 0) throw new Error("Values must be positive");
  if (p.usersUsingFeature > p.totalUsers) throw new Error("Feature users cannot exceed total users");
  const rate = (p.usersUsingFeature / p.totalUsers) * 100;
  const gap = p.targetAdoptionRate - rate;
  const needed = gap > 0 ? Math.ceil(p.totalUsers * (p.targetAdoptionRate / 100) - p.usersUsingFeature) : 0;
  const status = rate >= p.targetAdoptionRate ? "On Track" : rate >= p.targetAdoptionRate * 0.75 ? "Needs Improvement" : "Critical";
  return { adoptionRate: rate, gapToTarget: gap, usersNeeded: needed, status };
}
