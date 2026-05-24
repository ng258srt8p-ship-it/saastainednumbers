export interface CACParams {
  salesCost: number;
  marketingCost: number;
  newCustomers: number;
}

export interface CACResult {
  cac: number;
}

export function calculateCAC(params: CACParams): CACResult {
  const { salesCost, marketingCost, newCustomers } = params;
  if (salesCost < 0 || marketingCost < 0 || newCustomers <= 0) {
    throw new Error("Values must be positive and new customers > 0");
  }
  const totalCost = salesCost + marketingCost;
  const cac = totalCost / newCustomers;
  return { cac };
}
