export interface AIFineTuningCostParams {
  trainingTokens: number;
  trainingCostPerMillion: number;
  monthlyInferenceTokens: number;
  inferenceInputPricePerMillion: number;
  inferenceOutputPricePerMillion: number;
  epochs: number;
}

export interface AIFineTuningCostResult {
  trainingCost: number;
  monthlyInferenceCost: number;
  annualInferenceCost: number;
  totalFirstYearCost: number;
  costPerInferenceCall: number;
}

export function calculateAIFineTuningCost(params: AIFineTuningCostParams): AIFineTuningCostResult {
  const { trainingTokens, trainingCostPerMillion, monthlyInferenceTokens, inferenceInputPricePerMillion, inferenceOutputPricePerMillion, epochs } = params;
  if (trainingTokens < 0 || trainingCostPerMillion < 0 || monthlyInferenceTokens < 0 || inferenceInputPricePerMillion < 0 || inferenceOutputPricePerMillion < 0 || epochs < 0) {
    throw new Error("Values must be positive");
  }
  const trainingCost = (trainingTokens / 1_000_000) * trainingCostPerMillion * epochs;
  const avgInferencePrice = (inferenceInputPricePerMillion + inferenceOutputPricePerMillion) / 2;
  const monthlyInferenceCost = (monthlyInferenceTokens / 1_000_000) * avgInferencePrice;
  const annualInferenceCost = monthlyInferenceCost * 12;
  const totalFirstYearCost = trainingCost + annualInferenceCost;
  const costPerInferenceCall = avgInferencePrice / 1_000_000;
  return { trainingCost, monthlyInferenceCost, annualInferenceCost, totalFirstYearCost, costPerInferenceCall };
}
