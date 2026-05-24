export interface PrintOnDemandProfitParams { itemPrice: number; baseProductCost: number; printCost: number; platformFee: number; shippingCost: number; unitsSoldPerMonth: number; }
export interface PrintOnDemandProfitResult { monthlyRevenue: number; monthlyCOGS: number; monthlyFees: number; monthlyShipping: number; monthlyProfit: number; profitMargin: number; profitPerUnit: number; }
export function calculatePrintOnDemandProfit(p: PrintOnDemandProfitParams): PrintOnDemandProfitResult {
  if (p.itemPrice < 0 || p.baseProductCost < 0 || p.printCost < 0 || p.platformFee < 0 || p.shippingCost < 0 || p.unitsSoldPerMonth < 0) throw new Error("Values must be positive");
  const rev = p.itemPrice * p.unitsSoldPerMonth; const cogs = (p.baseProductCost + p.printCost) * p.unitsSoldPerMonth;
  const fees = p.platformFee * p.unitsSoldPerMonth; const ship = p.shippingCost * p.unitsSoldPerMonth;
  const profit = rev - cogs - fees - ship; const margin = rev > 0 ? (profit / rev) * 100 : 0;
  return { monthlyRevenue: rev, monthlyCOGS: cogs, monthlyFees: fees, monthlyShipping: ship, monthlyProfit: profit, profitMargin: margin, profitPerUnit: profit / p.unitsSoldPerMonth };
}
