export interface SubscriptionContentRevenueParams { freeFollowers: number; conversionRate: number; monthlyPrice: number; payPerViewRevenue: number; tipsPerMonth: number; }
export interface SubscriptionContentRevenueResult { paidSubscribers: number; monthlySubRevenue: number; monthlyPPVRevenue: number; monthlyTipsRevenue: number; monthlyTotal: number; annualRevenue: number; }
export function calculateSubscriptionContentRevenue(p: SubscriptionContentRevenueParams): SubscriptionContentRevenueResult {
  if (p.freeFollowers < 0 || p.conversionRate < 0 || p.monthlyPrice < 0 || p.payPerViewRevenue < 0 || p.tipsPerMonth < 0) throw new Error("Values must be positive");
  const paid = Math.round(p.freeFollowers * (p.conversionRate / 100));
  const sub = paid * p.monthlyPrice; const total = sub + p.payPerViewRevenue + p.tipsPerMonth;
  return { paidSubscribers: paid, monthlySubRevenue: sub, monthlyPPVRevenue: p.payPerViewRevenue, monthlyTipsRevenue: p.tipsPerMonth, monthlyTotal: total, annualRevenue: total * 12 };
}
