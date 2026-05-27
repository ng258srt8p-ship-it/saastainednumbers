export interface CPCInputs {
  totalCost: number;
  totalClicks: number;
}

export interface CPCResult {
  cpc: number;
  totalCost: number;
  totalClicks: number;
}

export function calculateCPC(inputs: CPCInputs): CPCResult {
  const { totalCost, totalClicks } = inputs;
  if (totalCost < 0) throw new Error("Total cost must be non-negative");
  if (totalClicks <= 0) throw new Error("Total clicks must be positive");
  const cpc = parseFloat((totalCost / totalClicks).toFixed(2));
  return { cpc, totalCost, totalClicks };
}
