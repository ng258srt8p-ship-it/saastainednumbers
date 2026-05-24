export interface CustomerEngagementScoreParams {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  sessionsPerUserPerMonth: number;
  avgSessionDurationMinutes: number;
  featureAdoptionRate: number;
}

export interface CustomerEngagementScoreResult {
  dauMauRatio: number;
  engagementScore: number;
  engagementCategory: string;
  totalMonthlySessions: number;
  totalMonthlyMinutes: number;
}

export function calculateCustomerEngagementScore(params: CustomerEngagementScoreParams): CustomerEngagementScoreResult {
  const { dailyActiveUsers, monthlyActiveUsers, sessionsPerUserPerMonth, avgSessionDurationMinutes, featureAdoptionRate } = params;
  if (dailyActiveUsers < 0 || monthlyActiveUsers < 0 || sessionsPerUserPerMonth < 0 || avgSessionDurationMinutes < 0 || featureAdoptionRate < 0) {
    throw new Error("Values must be positive");
  }
  if (dailyActiveUsers > monthlyActiveUsers) {
    throw new Error("DAU cannot exceed MAU");
  }
  const dauMauRatio = monthlyActiveUsers > 0 ? (dailyActiveUsers / monthlyActiveUsers) * 100 : 0;
  const engagementScore =
    (dauMauRatio / 100) * 40 +
    Math.min(sessionsPerUserPerMonth / 30, 1) * 25 +
    Math.min(avgSessionDurationMinutes / 30, 1) * 20 +
    (featureAdoptionRate / 100) * 15;
  let engagementCategory: string;
  if (engagementScore >= 80) {
    engagementCategory = "Highly Engaged";
  } else if (engagementScore >= 60) {
    engagementCategory = "Engaged";
  } else if (engagementScore >= 40) {
    engagementCategory = "Moderate";
  } else {
    engagementCategory = "At Risk";
  }
  const totalMonthlySessions = monthlyActiveUsers * sessionsPerUserPerMonth;
  const totalMonthlyMinutes = totalMonthlySessions * avgSessionDurationMinutes;
  return { dauMauRatio, engagementScore, engagementCategory, totalMonthlySessions, totalMonthlyMinutes };
}
