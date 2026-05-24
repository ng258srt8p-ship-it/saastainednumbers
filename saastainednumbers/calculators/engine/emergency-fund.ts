export interface EmergencyFundParams {
  monthlyExpenses: number;
  currentSavings: number;
  monthlySavings: number;
  targetMonths: number;
}

export interface EmergencyFundResult {
  targetAmount: number;
  currentCoverageMonths: number;
  shortfall: number;
  monthsToGoal: number;
  isFunded: boolean;
}

export function calculateEmergencyFund(params: EmergencyFundParams): EmergencyFundResult {
  const { monthlyExpenses, currentSavings, monthlySavings, targetMonths } = params;
  if (monthlyExpenses <= 0 || currentSavings < 0 || monthlySavings < 0 || targetMonths < 0) {
    throw new Error("Values must be positive");
  }
  const targetAmount = monthlyExpenses * targetMonths;
  const currentCoverageMonths = monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0;
  const shortfall = Math.max(0, targetAmount - currentSavings);
  const monthsToGoal = shortfall > 0 && monthlySavings > 0 ? Math.ceil(shortfall / monthlySavings) : 0;
  const isFunded = currentSavings >= targetAmount;
  return { targetAmount, currentCoverageMonths, shortfall, monthsToGoal, isFunded };
}
