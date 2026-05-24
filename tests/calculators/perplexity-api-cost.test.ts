import { describe, it, expect } from "vitest";
import { calculatePerplexityAPICost } from "@/calculators/engine/perplexity-api-cost";

describe("calculatePerplexityAPICost", () => {
  it("computes costs correctly for default values", () => {
    const result = calculatePerplexityAPICost({ inputTokens: 1000, outputTokens: 500, callsPerDay: 1000, inputPricePerMillion: 1.00, outputPricePerMillion: 5.00 });
    expect(result.costPerCall).toBeCloseTo(0.0035, 4);
    expect(result.costPerDay).toBeCloseTo(3.50, 2);
    expect(result.costPerMonth).toBeCloseTo(105.00, 2);
    expect(result.costPerYear).toBeCloseTo(1277.50, 2);
  });

  it("returns zero for zero usage", () => {
    const result = calculatePerplexityAPICost({ inputTokens: 0, outputTokens: 0, callsPerDay: 0, inputPricePerMillion: 1.00, outputPricePerMillion: 5.00 });
    expect(result.costPerCall).toBe(0);
    expect(result.costPerDay).toBe(0);
    expect(result.costPerMonth).toBe(0);
    expect(result.costPerYear).toBe(0);
  });

  it("throws for negative values", () => {
    expect(() => calculatePerplexityAPICost({ inputTokens: -1, outputTokens: 500, callsPerDay: 1000, inputPricePerMillion: 1, outputPricePerMillion: 5 })).toThrow();
  });
});
