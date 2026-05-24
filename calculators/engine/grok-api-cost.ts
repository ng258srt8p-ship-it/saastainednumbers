export interface GrokAPICostParams {
  inputTokens: number;
  outputTokens: number;
  callsPerDay: number;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
}

export interface GrokAPICostResult {
  costPerCall: number;
  costPerDay: number;
  costPerMonth: number;
  costPerYear: number;
}

export function calculateGrokAPICost(params: GrokAPICostParams): GrokAPICostResult {
  const { inputTokens, outputTokens, callsPerDay, inputPricePerMillion, outputPricePerMillion } = params;
  if (inputTokens < 0 || outputTokens < 0 || callsPerDay < 0 || inputPricePerMillion < 0 || outputPricePerMillion < 0) {
    throw new Error("Values must be positive");
  }
  const inputCost = (inputTokens / 1_000_000) * inputPricePerMillion;
  const outputCost = (outputTokens / 1_000_000) * outputPricePerMillion;
  const costPerCall = inputCost + outputCost;
  const costPerDay = costPerCall * callsPerDay;
  const costPerMonth = costPerDay * 30;
  const costPerYear = costPerDay * 365;
  return { costPerCall, costPerDay, costPerMonth, costPerYear };
}
