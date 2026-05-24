export interface NetCashFlowParams {
  cashIn: number;
  cashOut: number;
}

export interface NetCashFlowResult {
  netCashFlow: number;
  burnRate: number;
  isPositive: boolean;
}

export function calculateNetCashFlow(params: NetCashFlowParams): NetCashFlowResult {
  const { cashIn, cashOut } = params;
  if (cashIn < 0 || cashOut < 0) throw new Error("Values must be non-negative");
  const netCashFlow = cashIn - cashOut;
  const burnRate = netCashFlow < 0 ? cashOut - cashIn : 0;
  return { netCashFlow, burnRate, isPositive: netCashFlow >= 0 };
}
