import { describe, it, expect } from "vitest";
import { calculateAIFineTuningCost } from "@/calculators/engine/ai-fine-tuning-cost";
describe("calculateAIFineTuningCost", () => {
  it("computes costs correctly for GPT-3.5", () => {
    const r = calculateAIFineTuningCost({ trainingTokens: 1000000, trainingCostPerMillion: 8, monthlyInferenceTokens: 5000000, inferenceInputPricePerMillion: 3, inferenceOutputPricePerMillion: 6, epochs: 3 });
    expect(r.trainingCost).toBe(24);
    expect(r.monthlyInferenceCost).toBeCloseTo(22.50, 2);
    expect(r.totalFirstYearCost).toBeCloseTo(294, 0);
  });
  it("handles zero training", () => {
    const r = calculateAIFineTuningCost({ trainingTokens: 0, trainingCostPerMillion: 8, monthlyInferenceTokens: 1000000, inferenceInputPricePerMillion: 3, inferenceOutputPricePerMillion: 6, epochs: 3 });
    expect(r.trainingCost).toBe(0);
  });
  it("throws for negative values", () => {
    expect(() => calculateAIFineTuningCost({ trainingTokens: -1, trainingCostPerMillion: 8, monthlyInferenceTokens: 1000000, inferenceInputPricePerMillion: 3, inferenceOutputPricePerMillion: 6, epochs: 3 })).toThrow();
  });
});
