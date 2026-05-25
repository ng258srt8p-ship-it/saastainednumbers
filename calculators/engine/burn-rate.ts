export interface BurnRateParams {
  monthlyExpenses: number;
  monthlyRevenue: number;
  netNewARR: number;
}

export interface BurnRateResult {
  netBurnRate: number;
  grossBurnRate: number;
  runwayMonths: number;
  cashReserves: number;
  burnMultiple: number | null;
}

export function calculateBurnRate(params: BurnRateParams): BurnRateResult {
  const { monthlyExpenses, monthlyRevenue, netNewARR } = params;
  if (monthlyExpenses < 0 || monthlyRevenue < 0 || netNewARR < 0) {
    throw new Error("Values must be positive");
  }
  const netBurnRate = monthlyExpenses - monthlyRevenue;
  const grossBurnRate = monthlyExpenses;
  const burnMultiple = netNewARR > 0 ? netBurnRate / netNewARR : null;
  return { netBurnRate, grossBurnRate, runwayMonths: 0, cashReserves: 0, burnMultiple };
}

export function calculateRunway(params: BurnRateParams & { cashReserves: number }): BurnRateResult & { runwayMonths: number } {
  const { monthlyExpenses, monthlyRevenue, netNewARR, cashReserves } = params;
  if (monthlyExpenses < 0 || monthlyRevenue < 0 || netNewARR < 0 || cashReserves < 0) {
    throw new Error("Values must be positive");
  }
  const netBurnRate = monthlyExpenses - monthlyRevenue;
  const grossBurnRate = monthlyExpenses;
  const netMonthlyBurn = netBurnRate > 0 ? netBurnRate : 0;
  const runwayMonths = netMonthlyBurn > 0 ? Math.floor(cashReserves / netMonthlyBurn) : 0;
  const burnMultiple = netNewARR > 0 ? netBurnRate / netNewARR : null;
  return { netBurnRate, grossBurnRate, runwayMonths, cashReserves, burnMultiple };
}
