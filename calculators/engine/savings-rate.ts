export interface SavingsRateParams {
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  targetSavings: number;
}

export interface SavingsRateResult {
  monthlySavings: number;
  savingsRate: number;
  monthsToTarget: number;
  yearsToTarget: number;
}

export function calculateSavingsRate(params: SavingsRateParams): SavingsRateResult {
  const { monthlyIncome, monthlyExpenses, currentSavings, targetSavings } = params;
  if (monthlyIncome < 0 || monthlyExpenses < 0 || currentSavings < 0 || targetSavings < 0) {
    throw new Error("Values must be positive");
  }
  if (monthlyExpenses > monthlyIncome) {
    throw new Error("Monthly expenses cannot exceed monthly income");
  }
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = (monthlySavings / monthlyIncome) * 100;
  const remainingNeeded = targetSavings - currentSavings;
  const monthsToTarget = remainingNeeded > 0 ? Math.ceil(remainingNeeded / monthlySavings) : 0;
  const yearsToTarget = monthsToTarget / 12;
  return { monthlySavings, savingsRate, monthsToTarget, yearsToTarget };
}
