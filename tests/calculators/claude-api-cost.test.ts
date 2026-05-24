import { describe, it, expect } from "vitest";
import { calculateClaudeAPICost } from "@/calculators/engine/claude-api-cost";

describe("calculateClaudeAPICost", () => {
  it("computes costs correctly for Sonnet 4 defaults", () => {
    const result = calculateClaudeAPICost({ inputTokens: 1000, outputTokens: 500, callsPerDay: 1000, inputPricePerMillion: 3.00, outputPricePerMillion: 15.00 });
    expect(result.costPerCall).toBeCloseTo(0.0105, 4);
    expect(result.costPerDay).toBeCloseTo(10.50, 2);
    expect(result.costPerMonth).toBeCloseTo(315.00, 2);
    expect(result.costPerYear).toBeCloseTo(3832.50, 2);
  });

  it("computes costs correctly for Haiku 3.5", () => {
    const result = calculateClaudeAPICost({ inputTokens: 1000, outputTokens: 500, callsPerDay: 1000, inputPricePerMillion: 0.80, outputPricePerMillion: 4.00 });
    expect(result.costPerCall).toBeCloseTo(0.0028, 4);
    expect(result.costPerDay).toBeCloseTo(2.80, 2);
  });

  it("returns zero for zero usage", () => {
    const result = calculateClaudeAPICost({ inputTokens: 0, outputTokens: 0, callsPerDay: 0, inputPricePerMillion: 3.00, outputPricePerMillion: 15.00 });
    expect(result.costPerCall).toBe(0);
    expect(result.costPerDay).toBe(0);
    expect(result.costPerMonth).toBe(0);
  });

  it("throws for negative values", () => {
    expect(() => calculateClaudeAPICost({ inputTokens: -1, outputTokens: 500, callsPerDay: 1000, inputPricePerMillion: 3, outputPricePerMillion: 15 })).toThrow();
  });
});
