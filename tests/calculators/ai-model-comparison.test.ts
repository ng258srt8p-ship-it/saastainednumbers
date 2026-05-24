import { describe, it, expect } from "vitest";
import { calculateAIModelComparison } from "@/calculators/engine/ai-model-comparison";

describe("calculateAIModelComparison", () => {
  it("computes costs correctly for default values", () => {
    const result = calculateAIModelComparison({
      claudeInputTokens: 1000, claudeOutputTokens: 500, claudeCallsPerDay: 1000,
      gptInputTokens: 1200, gptOutputTokens: 600, gptCallsPerDay: 1000,
      geminiInputTokens: 800, geminiOutputTokens: 400, geminiCallsPerDay: 1000,
    });
    expect(result.claudeMonthlyCost).toBeCloseTo(315.00, 2);
    expect(result.gptMonthlyCost).toBeCloseTo(270.00, 2);
    expect(result.geminiMonthlyCost).toBeCloseTo(90.00, 2);
    expect(result.cheapest).toBe("Gemini");
    expect(result.savingsVsAvg).toBeCloseTo(135.00, 2);
  });

  it("picks cheapest model with equal usage across all three", () => {
    const result = calculateAIModelComparison({
      claudeInputTokens: 1000, claudeOutputTokens: 500, claudeCallsPerDay: 1000,
      gptInputTokens: 1000, gptOutputTokens: 500, gptCallsPerDay: 1000,
      geminiInputTokens: 1000, geminiOutputTokens: 500, geminiCallsPerDay: 1000,
    });
    expect(result.claudeMonthlyCost).toBeCloseTo(315.00, 2);
    expect(result.gptMonthlyCost).toBeCloseTo(225.00, 2);
    expect(result.geminiMonthlyCost).toBeCloseTo(112.50, 2);
    expect(result.cheapest).toBe("Gemini");
    expect(result.savingsVsAvg).toBeCloseTo(105.00, 2);
  });

  it("throws for negative values", () => {
    expect(() => calculateAIModelComparison({
      claudeInputTokens: -1, claudeOutputTokens: 500, claudeCallsPerDay: 1000,
      gptInputTokens: 1000, gptOutputTokens: 600, gptCallsPerDay: 1000,
      geminiInputTokens: 800, geminiOutputTokens: 400, geminiCallsPerDay: 1000,
    })).toThrow();
  });
});
