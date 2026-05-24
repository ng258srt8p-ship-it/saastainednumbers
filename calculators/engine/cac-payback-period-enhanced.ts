export interface CACPaybackPeriodParams { cac: number; arpu: number; grossMargin: number; }
export interface CACPaybackPeriodResult { paybackMonths: number; paybackDays: number; grossProfitPerMonth: number; }
export function calculateCACPaybackPeriod(p: CACPaybackPeriodParams): CACPaybackPeriodResult {
  if (p.cac <= 0 || p.arpu <= 0 || p.grossMargin <= 0) throw new Error("Values must be positive");
  if (p.grossMargin >= 100) throw new Error("Gross margin must be less than 100%");
  const gpPerMonth = p.arpu * (p.grossMargin / 100);
  const months = p.cac / gpPerMonth;
  return { paybackMonths: months, paybackDays: months * 30.44, grossProfitPerMonth: gpPerMonth };
}
