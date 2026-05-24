export interface FreelanceRateParams {
  desiredIncome: number;
  billableHoursPerWeek: number;
  weeksPerYear: number;
  expenses: number;
  taxRate: number;
}

export interface FreelanceRateResult {
  hourlyRate: number;
  monthlyRevenue: number;
  annualRevenue: number;
  monthlyTakeHome: number;
  annualTakeHome: number;
}

export function calculateFreelanceRate(params: FreelanceRateParams): FreelanceRateResult {
  const { desiredIncome, billableHoursPerWeek, weeksPerYear, expenses, taxRate } = params;
  if (desiredIncome < 0 || billableHoursPerWeek <= 0 || weeksPerYear <= 0 || expenses < 0 || taxRate < 0) {
    throw new Error("Values must be positive");
  }
  const annualRevenue = (desiredIncome + expenses) / (1 - taxRate / 100);
  const totalHours = billableHoursPerWeek * weeksPerYear;
  const hourlyRate = annualRevenue / totalHours;
  const monthlyRevenue = annualRevenue / 12;
  const annualTakeHome = annualRevenue - expenses - (annualRevenue * taxRate / 100);
  const monthlyTakeHome = annualTakeHome / 12;
  return { hourlyRate, monthlyRevenue, annualRevenue, monthlyTakeHome, annualTakeHome };
}
