export interface TikTokCreatorFundParams { monthlyViews: number; region: string; engagementRate: number; avgVideoLengthSec: number; }
export interface TikTokCreatorFundResult { estimatedMonthlyPayout: number; annualPayout: number; rpm: number; }
export function calculateTikTokCreatorFund(p: TikTokCreatorFundParams): TikTokCreatorFundResult {
  if (p.monthlyViews < 0 || p.engagementRate < 0 || p.avgVideoLengthSec < 0) throw new Error("Values must be positive");
  const baseRpm = 0.03; const regionMultiplier = { US: 1.0, UK: 0.8, CA: 0.9, AU: 0.85, OTHER: 0.4 };
  const mult = regionMultiplier[p.region as keyof typeof regionMultiplier] ?? 0.4;
  const lengthBonus = Math.min(p.avgVideoLengthSec / 60, 1) * 0.5;
  const rpm = baseRpm * mult * (1 + lengthBonus) * (1 + p.engagementRate / 100);
  const monthly = (p.monthlyViews / 1000) * rpm;
  return { estimatedMonthlyPayout: monthly, annualPayout: monthly * 12, rpm };
}
