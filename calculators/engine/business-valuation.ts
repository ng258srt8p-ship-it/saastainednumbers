export interface BusinessValuationParams { annualRevenue: number; ebitdaMargin: number; revenueMultiple: number; ebitdaMultiple: number; growthRate: number; }
export interface BusinessValuationResult { revenueBasedValue: number; ebitdaBasedValue: number; blendedValue: number; ebitda: number; }
export function calculateBusinessValuation(p: BusinessValuationParams): BusinessValuationResult {
  if (p.annualRevenue < 0 || p.ebitdaMargin < 0 || p.revenueMultiple < 0 || p.ebitdaMultiple < 0 || p.growthRate < 0) throw new Error("Values must be positive");
  const ebitda = p.annualRevenue * (p.ebitdaMargin / 100);
  const revValue = p.annualRevenue * p.revenueMultiple;
  const ebitdaValue = ebitda * p.ebitdaMultiple;
  const growthPremium = p.growthRate > 20 ? 1.2 : p.growthRate > 10 ? 1.1 : 1.0;
  const blended = ((revValue + ebitdaValue) / 2) * growthPremium;
  return { revenueBasedValue: revValue, ebitdaBasedValue: ebitdaValue, blendedValue: blended, ebitda };
}
