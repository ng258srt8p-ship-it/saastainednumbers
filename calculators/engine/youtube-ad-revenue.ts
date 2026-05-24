export interface YouTubeAdRevenueParams {
  viewsPerMonth: number;
  rpm: number;
}

export interface YouTubeAdRevenueResult {
  monthlyRevenue: number;
  annualRevenue: number;
  revenuePerThousandViews: number;
}

export function calculateYouTubeAdRevenue(params: YouTubeAdRevenueParams): YouTubeAdRevenueResult {
  const { viewsPerMonth, rpm } = params;
  if (viewsPerMonth < 0 || rpm < 0) {
    throw new Error("Values must be positive");
  }
  const monthlyRevenue = (viewsPerMonth / 1000) * rpm;
  const annualRevenue = monthlyRevenue * 12;
  const revenuePerThousandViews = rpm;
  return { monthlyRevenue, annualRevenue, revenuePerThousandViews };
}
