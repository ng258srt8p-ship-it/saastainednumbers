import { describe, it, expect } from "vitest";
import { calculateCPC } from "@/calculators/engine/cpc";

describe("calculateCPC", () => {
  it("calculates standard CPC", () => {
    const result = calculateCPC({ totalCost: 1000, totalClicks: 500 });
    expect(result.cpc).toBe(2);
    expect(result.totalCost).toBe(1000);
    expect(result.totalClicks).toBe(500);
  });

  it("handles zero cost", () => {
    const result = calculateCPC({ totalCost: 0, totalClicks: 100 });
    expect(result.cpc).toBe(0);
  });

  it("throws for invalid inputs", () => {
    expect(() => calculateCPC({ totalCost: 100, totalClicks: 0 })).toThrow();
    expect(() => calculateCPC({ totalCost: -50, totalClicks: 100 })).toThrow();
  });
});
