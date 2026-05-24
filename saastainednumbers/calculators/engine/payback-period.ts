export interface PaybackPeriodParams {
  cac: number;
  arpu: number;
  grossMargin: number;
}

export interface PaybackPeriodResult {
  paybackPeriodMonths: number;
  yearlyProfit: number;
}

export function calculatePaybackPeriod(params: PaybackPeriodParams): PaybackPeriodResult {
  const { cac, arpu, grossMargin } = params;
  if (cac <= 0 || arpu < 0 || grossMargin < 0) {
    throw new Error("CAC must be positive, ARPU and gross margin must be non-negative");
  }
  const monthlyContribution = arpu * (grossMargin / 100);
  if (monthlyContribution <= 0) {
    return { paybackPeriodMonths: 0, yearlyProfit: 0 };
  }
  const paybackPeriodMonths = cac / monthlyContribution;
  const yearlyProfit = monthlyContribution * 12 - cac;
  return { paybackPeriodMonths, yearlyProfit };
}
