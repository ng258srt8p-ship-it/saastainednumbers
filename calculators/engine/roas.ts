export interface ROASInputs {
  adSpend: number;
  revenueFromAds: number;
}

export interface ROASResult {
  roas: number;
  netReturn: number;
  profitMargin: number;
}

export function calculateROAS(inputs: ROASInputs): ROASResult {
  const { adSpend, revenueFromAds } = inputs;
  if (adSpend <= 0) throw new Error("Ad spend must be positive");
  if (revenueFromAds < 0) throw new Error("Revenue from ads must be non-negative");
  const roas = parseFloat((revenueFromAds / adSpend).toFixed(2));
  const netReturn = parseFloat((revenueFromAds - adSpend).toFixed(2));
  const profitMargin = revenueFromAds > 0 ? parseFloat((((revenueFromAds - adSpend) / revenueFromAds) * 100).toFixed(2)) : 0;
  return { roas, netReturn, profitMargin };
}
