export interface RevenuePerEmployeeParams {
  totalRevenue: number;
  headcount: number;
}

export interface RevenuePerEmployeeResult {
  revenuePerEmployee: number;
}

export function calculateRevenuePerEmployee(params: RevenuePerEmployeeParams): RevenuePerEmployeeResult {
  const { totalRevenue, headcount } = params;
  if (headcount <= 0) {
    throw new Error("Headcount must be positive");
  }
  if (totalRevenue < 0) {
    throw new Error("Revenue must be non-negative");
  }
  const revenuePerEmployee = totalRevenue / headcount;
  return { revenuePerEmployee };
}
