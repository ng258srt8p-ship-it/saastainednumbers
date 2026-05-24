export interface AIImageCostParams {
  imagesPerMonth: number;
  costPerImage: number;
}

export interface AIImageCostResult {
  monthlyCost: number;
  annualCost: number;
  costPerImage: number;
}

export function calculateAIImageCost(params: AIImageCostParams): AIImageCostResult {
  const { imagesPerMonth, costPerImage } = params;
  if (imagesPerMonth < 0 || costPerImage < 0) {
    throw new Error("Values must be positive");
  }
  const monthlyCost = imagesPerMonth * costPerImage;
  const annualCost = monthlyCost * 12;
  return { monthlyCost, annualCost, costPerImage };
}
