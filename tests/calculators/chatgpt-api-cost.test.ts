import { describe, it, expect } from "vitest";
import { calculateChatGPTAPICost } from "@/calculators/engine/chatgpt-api-cost";

describe("calculateChatGPTAPICost", () => {
  it("computes costs correctly for GPT-4o defaults", () => {
    const result = calculateChatGPTAPICost({ inputTokens: 1000, outputTokens: 500, callsPerDay: 1000, inputPricePerMillion: 2.50, outputPricePerMillion: 10.00 });
    expect(result.costPerCall).toBeCloseTo(0.0075, 4);
    expect(result.costPerDay).toBeCloseTo(7.50, 2);
    expect(result.costPerMonth).toBeCloseTo(225.00, 2);
  });

  it("computes costs for GPT-3.5 Turbo", () => {
    const result = calculateChatGPTAPICost({ inputTokens: 1000, outputTokens: 500, callsPerDay: 1000, inputPricePerMillion: 0.50, outputPricePerMillion: 1.50 });
    expect(result.costPerCall).toBeCloseTo(0.00125, 5);
    expect(result.costPerDay).toBeCloseTo(1.25, 2);
  });

  it("returns zero for zero usage", () => {
    const result = calculateChatGPTAPICost({ inputTokens: 0, outputTokens: 0, callsPerDay: 0, inputPricePerMillion: 2.50, outputPricePerMillion: 10.00 });
    expect(result.costPerCall).toBe(0);
    expect(result.costPerDay).toBe(0);
  });

  it("throws for negative values", () => {
    expect(() => calculateChatGPTAPICost({ inputTokens: 1000, outputTokens: -1, callsPerDay: 1000, inputPricePerMillion: 2.50, outputPricePerMillion: 10.00 })).toThrow();
  });
});
