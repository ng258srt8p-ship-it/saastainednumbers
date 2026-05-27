export interface CPMInputs {
  totalCost: number;
  totalImpressions: number;
}

export interface CPMResult {
  cpm: number;
  totalCost: number;
  totalImpressions: number;
}

export function calculateCPM(inputs: CPMInputs): CPMResult {
  const { totalCost, totalImpressions } = inputs;
  if (totalCost < 0) throw new Error("Total cost must be non-negative");
  if (totalImpressions <= 0) throw new Error("Total impressions must be positive");
  const cpm = parseFloat(((totalCost / totalImpressions) * 1000).toFixed(2));
  return { cpm, totalCost, totalImpressions };
}
