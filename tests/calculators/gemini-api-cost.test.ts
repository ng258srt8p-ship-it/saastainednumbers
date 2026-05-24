import { describe, it, expect } from "vitest";
import { calculateGeminiAPICost } from "@/calculators/engine/gemini-api-cost";
describe("calculateGeminiAPICost", () => {
  it("computes costs correctly for Gemini Pro", () => {
    const r = calculateGeminiAPICost({ inputTokens: 1000, outputTokens: 500, callsPerDay: 1000, inputPricePerMillion: 1.25, outputPricePerMillion: 5.00 });
    expect(r.costPerCall).toBeCloseTo(0.00375, 5);
    expect(r.costPerDay).toBeCloseTo(3.75, 2);
    expect(r.costPerMonth).toBeCloseTo(112.50, 2);
  });
  it("returns zero for zero usage", () => {
    const r = calculateGeminiAPICost({ inputTokens: 0, outputTokens: 0, callsPerDay: 0, inputPricePerMillion: 1.25, outputPricePerMillion: 5.00 });
    expect(r.costPerCall).toBe(0);
  });
  it("throws for negative values", () => {
    expect(() => calculateGeminiAPICost({ inputTokens: -1, outputTokens: 500, callsPerDay: 1000, inputPricePerMillion: 1.25, outputPricePerMillion: 5.00 })).toThrow();
  });
});
