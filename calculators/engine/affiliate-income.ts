export interface AffiliateIncomeParams {
  monthlyVisitors: number;
  clickThroughRate: number;
  conversionRate: number;
  averageCommission: number;
  cookieDurationDays: number;
}

export interface AffiliateIncomeResult {
  monthlyClicks: number;
  monthlyConversions: number;
  monthlyRevenue: number;
  annualRevenue: number;
  revenuePerVisitor: number;
  revenuePerClick: number;
}

export function calculateAffiliateIncome(params: AffiliateIncomeParams): AffiliateIncomeResult {
  const { monthlyVisitors, clickThroughRate, conversionRate, averageCommission, cookieDurationDays } = params;
  if (monthlyVisitors < 0 || clickThroughRate < 0 || conversionRate < 0 || averageCommission < 0 || cookieDurationDays < 0) {
    throw new Error("Values must be positive");
  }
  const monthlyClicks = monthlyVisitors * (clickThroughRate / 100);
  const monthlyConversions = monthlyClicks * (conversionRate / 100);
  const monthlyRevenue = monthlyConversions * averageCommission;
  const annualRevenue = monthlyRevenue * 12;
  const revenuePerVisitor = monthlyVisitors > 0 ? monthlyRevenue / monthlyVisitors : 0;
  const revenuePerClick = monthlyClicks > 0 ? monthlyRevenue / monthlyClicks : 0;
  return { monthlyClicks, monthlyConversions, monthlyRevenue, annualRevenue, revenuePerVisitor, revenuePerClick };
}
