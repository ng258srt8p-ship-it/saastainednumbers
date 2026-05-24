export interface InvestmentReturnsParams {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
}

export interface InvestmentReturnsResult {
  totalContributions: number;
  totalValue: number;
  totalEarnings: number;
  annualizedReturn: number;
}

export function calculateInvestmentReturns(params: InvestmentReturnsParams): InvestmentReturnsResult {
  const { initialInvestment, monthlyContribution, annualReturn, years } = params;
  if (initialInvestment < 0 || monthlyContribution < 0 || annualReturn < 0 || years < 0) {
    throw new Error("Values must be positive");
  }
  const totalContributions = initialInvestment + monthlyContribution * 12 * years;
  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = years * 12;
  let totalValue: number;
  if (monthlyRate > 0) {
    totalValue =
      initialInvestment * Math.pow(1 + monthlyRate, totalMonths) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  } else {
    totalValue = totalContributions;
  }
  const totalEarnings = totalValue - totalContributions;
  const annualizedReturn = initialInvestment > 0 || monthlyContribution > 0
    ? (Math.pow(totalValue / totalContributions, 1 / years) - 1) * 100
    : 0;
  return { totalContributions, totalValue, totalEarnings, annualizedReturn };
}
