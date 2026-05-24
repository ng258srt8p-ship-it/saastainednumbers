export interface BreakEvenParams {
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
}

export interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginPercent: number;
}

export function calculateBreakEven(params: BreakEvenParams): BreakEvenResult {
  const { fixedCosts, variableCostPerUnit, pricePerUnit } = params;
  if (fixedCosts < 0 || variableCostPerUnit < 0 || pricePerUnit <= 0) {
    throw new Error("Values must be positive");
  }
  if (pricePerUnit <= variableCostPerUnit) {
    throw new Error("Price must exceed variable cost per unit");
  }
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  const contributionMarginPercent = (contributionMargin / pricePerUnit) * 100;
  const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;
  return { breakEvenUnits, breakEvenRevenue, contributionMargin, contributionMarginPercent };
}
