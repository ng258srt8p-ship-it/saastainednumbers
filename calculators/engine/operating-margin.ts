export interface OperatingMarginParams {
  operatingIncome: number;
  revenue: number;
}

export interface OperatingMarginResult {
  operatingMargin: number;
}

export function calculateOperatingMargin(params: OperatingMarginParams): OperatingMarginResult {
  const { operatingIncome, revenue } = params;
  if (revenue <= 0) {
    throw new Error("Revenue must be positive");
  }
  const operatingMargin = (operatingIncome / revenue) * 100;
  return { operatingMargin };
}
