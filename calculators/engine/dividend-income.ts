export interface DividendIncomeParams { initialInvestment: number; monthlyContribution: number; dividendYield: number; dividendGrowthRate: number; years: number; }
export interface DividendIncomeResult { totalInvested: number; portfolioValue: number; annualDividendIncome: number; monthlyDividendIncome: number; dividendYield: number; }
export function calculateDividendIncome(p: DividendIncomeParams): DividendIncomeResult {
  if (p.initialInvestment < 0 || p.monthlyContribution < 0 || p.dividendYield < 0 || p.dividendGrowthRate < 0 || p.years < 0) throw new Error("Values must be positive");
  const totalInvested = p.initialInvestment + p.monthlyContribution * 12 * p.years;
  let portfolioValue = p.initialInvestment; let annualDividend = 0;
  const monthlyRate = p.dividendGrowthRate / 100 / 12;
  for (let y = 0; y < p.years; y++) {
    for (let m = 0; m < 12; m++) {
      portfolioValue += p.monthlyContribution;
      portfolioValue *= (1 + monthlyRate);
    }
    annualDividend = portfolioValue * (p.dividendYield / 100);
  }
  return { totalInvested, portfolioValue, annualDividendIncome: annualDividend, monthlyDividendIncome: annualDividend / 12, dividendYield: p.dividendYield };
}
