export interface BurnRateParams {
  monthlyExpenses: number;
  monthlyRevenue: number;
}

export interface BurnRateResult {
  netBurnRate: number;
  grossBurnRate: number;
  runwayMonths: number;
  cashReserves: number;
}

export function calculateBurnRate(params: BurnRateParams): BurnRateResult {
  const { monthlyExpenses, monthlyRevenue } = params;
  if (monthlyExpenses < 0 || monthlyRevenue < 0) {
    throw new Error("Values must be positive");
  }
  const netBurnRate = monthlyExpenses - monthlyRevenue;
  const grossBurnRate = monthlyExpenses;
  return { netBurnRate, grossBurnRate, runwayMonths: 0, cashReserves: 0 };
}

export function calculateRunway(params: BurnRateParams & { cashReserves: number }): BurnRateResult & { runwayMonths: number } {
  const { monthlyExpenses, monthlyRevenue, cashReserves } = params;
  if (monthlyExpenses < 0 || monthlyRevenue < 0 || cashReserves < 0) {
    throw new Error("Values must be positive");
  }
  const netBurnRate = monthlyExpenses - monthlyRevenue;
  const grossBurnRate = monthlyExpenses;
  const netMonthlyBurn = netBurnRate > 0 ? netBurnRate : 0;
  const runwayMonths = netMonthlyBurn > 0 ? Math.floor(cashReserves / netMonthlyBurn) : 0;
  return { netBurnRate, grossBurnRate, runwayMonths, cashReserves };
}
