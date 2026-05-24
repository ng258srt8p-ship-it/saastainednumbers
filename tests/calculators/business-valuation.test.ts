import { describe, it, expect } from "vitest";
import { calculateBusinessValuation } from "@/calculators/engine/business-valuation";

describe("calculateBusinessValuation", () => {
  it("computes valuation with default values and growth premium", () => {
    const result = calculateBusinessValuation({
      annualRevenue: 2000000,
      ebitdaMargin: 20,
      revenueMultiple: 3,
      ebitdaMultiple: 10,
      growthRate: 15,
    });
    expect(result.ebitda).toBe(400000);
    expect(result.revenueBasedValue).toBe(6000000);
    expect(result.ebitdaBasedValue).toBe(4000000);
    expect(result.blendedValue).toBe(5500000);
  });

  it("returns zero for zero revenue", () => {
    const result = calculateBusinessValuation({
      annualRevenue: 0,
      ebitdaMargin: 20,
      revenueMultiple: 3,
      ebitdaMultiple: 10,
      growthRate: 0,
    });
    expect(result.ebitda).toBe(0);
    expect(result.revenueBasedValue).toBe(0);
    expect(result.ebitdaBasedValue).toBe(0);
    expect(result.blendedValue).toBe(0);
  });

  it("throws for negative revenue", () => {
    expect(() =>
      calculateBusinessValuation({
        annualRevenue: -1,
        ebitdaMargin: 20,
        revenueMultiple: 3,
        ebitdaMultiple: 10,
        growthRate: 10,
      })
    ).toThrow();
  });
});
