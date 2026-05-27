export interface CTRInputs {
  totalImpressions: number;
  totalClicks: number;
}

export interface CTRResult {
  ctr: number;
  totalImpressions: number;
  totalClicks: number;
}

export function calculateCTR(inputs: CTRInputs): CTRResult {
  const { totalImpressions, totalClicks } = inputs;
  if (totalImpressions <= 0) throw new Error("Total impressions must be positive");
  if (totalClicks < 0) throw new Error("Total clicks must be non-negative");
  if (totalClicks > totalImpressions) throw new Error("Clicks cannot exceed impressions");
  const ctr = parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2));
  return { ctr, totalImpressions, totalClicks };
}
