export interface CustomerHealthScoreParams {
  nps: number;
  productUsageScore: number;
  supportTickets: number;
  daysSinceLastLogin: number;
}

export interface CustomerHealthScoreResult {
  healthScore: number;
  healthCategory: "At Risk" | "Needs Attention" | "Healthy" | "Champion";
}

export function calculateCustomerHealthScore(params: CustomerHealthScoreParams): CustomerHealthScoreResult {
  const { nps, productUsageScore, supportTickets, daysSinceLastLogin } = params;
  if (nps < -100 || nps > 100 || productUsageScore < 0 || productUsageScore > 100 ||
      supportTickets < 0 || daysSinceLastLogin < 0) {
    throw new Error("Invalid input values");
  }
  const npsScore = (nps + 100) / 2;
  const usageScore = productUsageScore;
  const supportScore = Math.max(0, 100 - supportTickets * 10);
  const engagementScore = Math.max(0, 100 - daysSinceLastLogin * 2);
  const healthScore = Math.round((npsScore * 0.25 + usageScore * 0.35 + supportScore * 0.2 + engagementScore * 0.2));
  let healthCategory: CustomerHealthScoreResult["healthCategory"];
  if (healthScore >= 80) healthCategory = "Champion";
  else if (healthScore >= 60) healthCategory = "Healthy";
  else if (healthScore >= 40) healthCategory = "Needs Attention";
  else healthCategory = "At Risk";
  return { healthScore, healthCategory };
}
