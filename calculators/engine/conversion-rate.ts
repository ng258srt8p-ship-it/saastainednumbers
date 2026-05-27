export interface ConversionRateInputs {
  totalVisitors: number;
  totalConversions: number;
}

export interface ConversionRateResult {
  conversionRate: number;
  totalConversions: number;
  visitorsNotConverted: number;
}

export function calculateConversionRate(inputs: ConversionRateInputs): ConversionRateResult {
  const { totalVisitors, totalConversions } = inputs;
  if (totalVisitors <= 0) throw new Error("Total visitors must be positive");
  if (totalConversions < 0) throw new Error("Total conversions must be non-negative");
  if (totalConversions > totalVisitors) throw new Error("Conversions cannot exceed visitors");
  const conversionRate = parseFloat(((totalConversions / totalVisitors) * 100).toFixed(2));
  const visitorsNotConverted = totalVisitors - totalConversions;
  return { conversionRate, totalConversions, visitorsNotConverted };
}
