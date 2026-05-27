export interface AOVInputs {
  totalRevenue: number;
  numberOfOrders: number;
}

export interface AOVResult {
  aov: number;
  totalRevenue: number;
  numberOfOrders: number;
}

export function calculateAOV(inputs: AOVInputs): AOVResult {
  const { totalRevenue, numberOfOrders } = inputs;
  if (totalRevenue < 0) throw new Error("Total revenue must be non-negative");
  if (numberOfOrders <= 0) throw new Error("Number of orders must be positive");
  const aov = parseFloat((totalRevenue / numberOfOrders).toFixed(2));
  return { aov, totalRevenue, numberOfOrders };
}
