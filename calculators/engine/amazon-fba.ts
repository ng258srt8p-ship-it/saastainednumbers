export interface AmazonFBAParams {
  itemPrice: number;
  costOfGoods: number;
  referralFeePercent: number;
  fbaFulfillmentFee: number;
  monthlyStorageFee: number;
  advertisingCostPerUnit: number;
  unitsSoldPerMonth: number;
}

export interface AmazonFBAResult {
  monthlyRevenue: number;
  monthlyCostOfGoods: number;
  monthlyReferralFees: number;
  monthlyFulfillmentFees: number;
  monthlyStorageFees: number;
  monthlyAdvertisingCost: number;
  monthlyTotalFees: number;
  monthlyTotalCosts: number;
  monthlyProfit: number;
  profitMargin: number;
  profitPerUnit: number;
}

export function calculateAmazonFBA(params: AmazonFBAParams): AmazonFBAResult {
  const { itemPrice, costOfGoods, referralFeePercent, fbaFulfillmentFee, monthlyStorageFee, advertisingCostPerUnit, unitsSoldPerMonth } = params;
  if (itemPrice < 0 || costOfGoods < 0 || referralFeePercent < 0 || fbaFulfillmentFee < 0 || monthlyStorageFee < 0 || advertisingCostPerUnit < 0 || unitsSoldPerMonth < 0) {
    throw new Error("Values must be positive");
  }
  const monthlyRevenue = itemPrice * unitsSoldPerMonth;
  const monthlyCostOfGoods = costOfGoods * unitsSoldPerMonth;
  const monthlyReferralFees = monthlyRevenue * (referralFeePercent / 100);
  const monthlyFulfillmentFees = fbaFulfillmentFee * unitsSoldPerMonth;
  const monthlyStorageFees = monthlyStorageFee;
  const monthlyAdvertisingCost = advertisingCostPerUnit * unitsSoldPerMonth;
  const monthlyTotalFees = monthlyReferralFees + monthlyFulfillmentFees + monthlyStorageFees + monthlyAdvertisingCost;
  const monthlyTotalCosts = monthlyCostOfGoods + monthlyTotalFees;
  const monthlyProfit = monthlyRevenue - monthlyTotalCosts;
  const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;
  const profitPerUnit = monthlyProfit / unitsSoldPerMonth;
  return { monthlyRevenue, monthlyCostOfGoods, monthlyReferralFees, monthlyFulfillmentFees, monthlyStorageFees, monthlyAdvertisingCost, monthlyTotalFees, monthlyTotalCosts, monthlyProfit, profitMargin, profitPerUnit };
}
