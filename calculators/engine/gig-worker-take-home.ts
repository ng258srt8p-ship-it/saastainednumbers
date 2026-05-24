export interface GigWorkerTakeHomeParams {
  hoursPerWeek: number;
  hourlyEarnings: number;
  weeklyExpenses: number;
  taxRate: number;
}

export interface GigWorkerTakeHomeResult {
  grossWeeklyIncome: number;
  weeklyExpenses: number;
  netWeeklyIncome: number;
  netMonthlyIncome: number;
  netAnnualIncome: number;
  effectiveHourlyRate: number;
}

export function calculateGigWorkerTakeHome(params: GigWorkerTakeHomeParams): GigWorkerTakeHomeResult {
  const { hoursPerWeek, hourlyEarnings, weeklyExpenses, taxRate } = params;
  if (hoursPerWeek < 0 || hourlyEarnings < 0 || weeklyExpenses < 0 || taxRate < 0) {
    throw new Error("Values must be positive");
  }
  const grossWeeklyIncome = hoursPerWeek * hourlyEarnings;
  const weekExpenses = weeklyExpenses;
  const netWeeklyBeforeTax = grossWeeklyIncome - weekExpenses;
  const netWeeklyIncome = netWeeklyBeforeTax * (1 - taxRate / 100);
  const netMonthlyIncome = netWeeklyIncome * 4.33;
  const netAnnualIncome = netWeeklyIncome * 52;
  const effectiveHourlyRate = netWeeklyIncome / hoursPerWeek;
  return { grossWeeklyIncome, weeklyExpenses: weekExpenses, netWeeklyIncome, netMonthlyIncome, netAnnualIncome, effectiveHourlyRate };
}
