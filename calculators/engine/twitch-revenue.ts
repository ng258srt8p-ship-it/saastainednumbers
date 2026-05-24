export interface TwitchRevenueParams { avgViewers: number; streamHoursPerMonth: number; subCount: number; subPrice: number; adRevenuePerHour: number; bitsRevenuePerMonth: number; }
export interface TwitchRevenueResult { monthlySubRevenue: number; monthlyAdRevenue: number; monthlyBitsRevenue: number; monthlyTotal: number; annualRevenue: number; revenuePerStreamHour: number; }
export function calculateTwitchRevenue(p: TwitchRevenueParams): TwitchRevenueResult {
  if (p.avgViewers < 0 || p.streamHoursPerMonth < 0 || p.subCount < 0 || p.subPrice < 0 || p.adRevenuePerHour < 0 || p.bitsRevenuePerMonth < 0) throw new Error("Values must be positive");
  const sub = p.subCount * p.subPrice; const ad = p.streamHoursPerMonth * p.adRevenuePerHour; const bits = p.bitsRevenuePerMonth;
  const total = sub + ad + bits; const rph = p.streamHoursPerMonth > 0 ? total / p.streamHoursPerMonth : 0;
  return { monthlySubRevenue: sub, monthlyAdRevenue: ad, monthlyBitsRevenue: bits, monthlyTotal: total, annualRevenue: total * 12, revenuePerStreamHour: rph };
}
