export interface RevenuePerUserTrendParams { monthlyRevenue: number[]; monthlyUsers: number[]; }
export interface RevenuePerUserTrendResult { currentArpu: number; prevArpu: number; arpuGrowth: number; trend: string; }
export function calculateRevenuePerUserTrend(p: RevenuePerUserTrendParams): RevenuePerUserTrendResult {
  if (p.monthlyRevenue.length < 2 || p.monthlyUsers.length < 2) throw new Error("Need at least 2 months of data");
  if (p.monthlyRevenue.some(r => r < 0) || p.monthlyUsers.some(u => u < 0)) throw new Error("Values must be positive");
  const len = p.monthlyRevenue.length;
  const currentArpu = p.monthlyUsers[len - 1] > 0 ? p.monthlyRevenue[len - 1] / p.monthlyUsers[len - 1] : 0;
  const prevArpu = p.monthlyUsers[len - 2] > 0 ? p.monthlyRevenue[len - 2] / p.monthlyUsers[len - 2] : 0;
  const growth = prevArpu > 0 ? ((currentArpu - prevArpu) / prevArpu) * 100 : 0;
  const trend = growth > 5 ? "Growing" : growth > -5 ? "Stable" : "Declining";
  return { currentArpu, prevArpu, arpuGrowth: growth, trend };
}
