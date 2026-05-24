import { describe, it, expect } from "vitest";
import { calculateGrokAPICost } from "@/calculators/engine/grok-api-cost";
describe("calculateGrokAPICost", () => {
  it("computes costs correctly", () => {
    const r = calculateGrokAPICost({ inputTokens: 1000, outputTokens: 500, callsPerDay: 1000, inputPricePerMillion: 2.00, outputPricePerMillion: 10.00 });
    expect(r.costPerCall).toBeCloseTo(0.007, 4);
    expect(r.costPerDay).toBeCloseTo(7.00, 2);
    expect(r.costPerMonth).toBeCloseTo(210.00, 2);
  });
  it("returns zero for zero usage", () => {
    const r = calculateGrokAPICost({ inputTokens: 0, outputTokens: 0, callsPerDay: 0, inputPricePerMillion: 2.00, outputPricePerMillion: 10.00 });
    expect(r.costPerDay).toBe(0);
  });
  it("throws for negative values", () => {
    expect(() => calculateGrokAPICost({ inputTokens: 1000, outputTokens: -5, callsPerDay: 1000, inputPricePerMillion: 2.00, outputPricePerMillion: 10.00 })).toThrow();
  });
});
