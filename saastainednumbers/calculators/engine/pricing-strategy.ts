export interface PricingStrategyParams {
  costPerUnit: number;
  desiredMarginPercent: number;
  competitorPrice: number;
  customerPerceivedValue: number;
}

export interface PricingStrategyResult {
  costPlusPrice: number;
  targetMarginPrice: number;
  competitivePricePosition: string;
  valueBasedPrice: number;
  recommendedPrice: number;
  recommendedMargin: number;
}

export function calculatePricingStrategy(params: PricingStrategyParams): PricingStrategyResult {
  const { costPerUnit, desiredMarginPercent, competitorPrice, customerPerceivedValue } = params;
  if (costPerUnit < 0 || desiredMarginPercent < 0 || competitorPrice < 0 || customerPerceivedValue < 0) {
    throw new Error("Values must be positive");
  }
  if (desiredMarginPercent >= 100) {
    throw new Error("Desired margin must be less than 100%");
  }
  const costPlusPrice = costPerUnit * (1 + desiredMarginPercent / 100);
  const targetMarginPrice = costPerUnit / (1 - desiredMarginPercent / 100);
  const priceDiffPercent = ((targetMarginPrice - competitorPrice) / competitorPrice) * 100;
  let competitivePricePosition: string;
  if (priceDiffPercent < -15) {
    competitivePricePosition = "Below Market";
  } else if (priceDiffPercent > 15) {
    competitivePricePosition = "Above Market";
  } else {
    competitivePricePosition = "At Market";
  }
  const valueBasedPrice = (competitorPrice + customerPerceivedValue) / 2;
  const recommendedPrice = Math.max(targetMarginPrice, Math.min(valueBasedPrice, customerPerceivedValue));
  const recommendedMargin = recommendedPrice > 0 ? ((recommendedPrice - costPerUnit) / recommendedPrice) * 100 : 0;
  return { costPlusPrice, targetMarginPrice, competitivePricePosition, valueBasedPrice, recommendedPrice, recommendedMargin };
}
