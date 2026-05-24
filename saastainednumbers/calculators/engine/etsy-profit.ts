export interface EtsyProfitParams {
  itemPrice: number;
  costOfGoods: number;
  shippingCost: number;
  listingFee: number;
  transactionFeePercent: number;
  paymentFeePercent: number;
  paymentFixedFee: number;
  quantitySold: number;
}

export interface EtsyProfitResult {
  revenue: number;
  totalCostOfGoods: number;
  totalShipping: number;
  totalListingFees: number;
  totalTransactionFees: number;
  totalPaymentFees: number;
  totalFees: number;
  totalCosts: number;
  profit: number;
  profitMargin: number;
  profitPerItem: number;
}

export function calculateEtsyProfit(params: EtsyProfitParams): EtsyProfitResult {
  const { itemPrice, costOfGoods, shippingCost, listingFee, transactionFeePercent, paymentFeePercent, paymentFixedFee, quantitySold } = params;
  if (itemPrice < 0 || costOfGoods < 0 || shippingCost < 0 || listingFee < 0 || transactionFeePercent < 0 || paymentFeePercent < 0 || paymentFixedFee < 0 || quantitySold < 0) {
    throw new Error("Values must be positive");
  }
  const revenue = itemPrice * quantitySold;
  const totalCostOfGoods = costOfGoods * quantitySold;
  const totalShipping = shippingCost * quantitySold;
  const totalListingFees = listingFee * quantitySold;
  const totalTransactionFees = (itemPrice * quantitySold) * (transactionFeePercent / 100);
  const totalPaymentFees = (itemPrice * quantitySold) * (paymentFeePercent / 100) + paymentFixedFee * quantitySold;
  const totalFees = totalListingFees + totalTransactionFees + totalPaymentFees;
  const totalCosts = totalCostOfGoods + totalShipping + totalFees;
  const profit = revenue - totalCosts;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const profitPerItem = profit / quantitySold;
  return { revenue, totalCostOfGoods, totalShipping, totalListingFees, totalTransactionFees, totalPaymentFees, totalFees, totalCosts, profit, profitMargin, profitPerItem };
}
