export interface BloggingIncomeParams {
  monthlyPageviews: number;
  adRpm: number;
  affiliateRevenuePerMonth: number;
  sponsoredPostRevenuePerMonth: number;
  digitalProductRevenue: number;
}

export interface BloggingIncomeResult {
  monthlyAdRevenue: number;
  monthlyAffiliateRevenue: number;
  monthlySponsoredRevenue: number;
  monthlyDigitalProductRevenue: number;
  monthlyTotalRevenue: number;
  annualRevenue: number;
  revenuePerThousandPageviews: number;
}

export function calculateBloggingIncome(params: BloggingIncomeParams): BloggingIncomeResult {
  const { monthlyPageviews, adRpm, affiliateRevenuePerMonth, sponsoredPostRevenuePerMonth, digitalProductRevenue } = params;
  if (monthlyPageviews < 0 || adRpm < 0 || affiliateRevenuePerMonth < 0 || sponsoredPostRevenuePerMonth < 0 || digitalProductRevenue < 0) {
    throw new Error("Values must be positive");
  }
  const monthlyAdRevenue = (monthlyPageviews / 1000) * adRpm;
  const monthlyAffiliateRevenue = affiliateRevenuePerMonth;
  const monthlySponsoredRevenue = sponsoredPostRevenuePerMonth;
  const monthlyDigitalProductRevenue = digitalProductRevenue;
  const monthlyTotalRevenue = monthlyAdRevenue + monthlyAffiliateRevenue + monthlySponsoredRevenue + monthlyDigitalProductRevenue;
  const annualRevenue = monthlyTotalRevenue * 12;
  const revenuePerThousandPageviews = monthlyPageviews > 0 ? (monthlyTotalRevenue / monthlyPageviews) * 1000 : 0;
  return { monthlyAdRevenue, monthlyAffiliateRevenue, monthlySponsoredRevenue, monthlyDigitalProductRevenue, monthlyTotalRevenue, annualRevenue, revenuePerThousandPageviews };
}
