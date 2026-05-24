export interface DropshippingMarginParams { productPrice: number; supplierCost: number; shippingCost: number; platformFeePercent: number; advertisingCostPerUnit: number; unitsSoldPerMonth: number; returnRate: number; }
export interface DropshippingMarginResult { monthlyRevenue: number; monthlyCOGS: number; monthlyShipping: number; monthlyPlatformFees: number; monthlyAdCost: number; monthlyReturnCost: number; monthlyTotalCosts: number; monthlyProfit: number; profitMargin: number; profitPerUnit: number; }
export function calculateDropshippingMargin(p: DropshippingMarginParams): DropshippingMarginResult {
  if (p.productPrice < 0 || p.supplierCost < 0 || p.shippingCost < 0 || p.platformFeePercent < 0 || p.advertisingCostPerUnit < 0 || p.unitsSoldPerMonth < 0 || p.returnRate < 0) throw new Error("Values must be positive");
  const rev = p.productPrice * p.unitsSoldPerMonth; const cogs = p.supplierCost * p.unitsSoldPerMonth;
  const ship = p.shippingCost * p.unitsSoldPerMonth; const fees = rev * (p.platformFeePercent / 100);
  const ad = p.advertisingCostPerUnit * p.unitsSoldPerMonth; const returns = (p.unitsSoldPerMonth * (p.returnRate / 100)) * p.productPrice;
  const totalCosts = cogs + ship + fees + ad + returns; const profit = rev - totalCosts; const margin = rev > 0 ? (profit / rev) * 100 : 0;
  return { monthlyRevenue: rev, monthlyCOGS: cogs, monthlyShipping: ship, monthlyPlatformFees: fees, monthlyAdCost: ad, monthlyReturnCost: returns, monthlyTotalCosts: totalCosts, monthlyProfit: profit, profitMargin: margin, profitPerUnit: profit / p.unitsSoldPerMonth };
}
