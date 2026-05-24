import { describe, it, expect } from "vitest";
import { calculateBreakEven } from "@/calculators/engine/break-even";

describe("calculateBreakEven", () => {
  it("computes break-even correctly", () => {
    const result = calculateBreakEven({ fixedCosts: 10000, variableCostPerUnit: 15, pricePerUnit: 39 });
    expect(result.contributionMargin).toBe(24);
    expect(result.contributionMarginPercent).toBeCloseTo(61.54, 1);
    expect(result.breakEvenUnits).toBe(417);
    expect(result.breakEvenRevenue).toBeCloseTo(16263, 0);
  });

  it("handles high-margin SaaS scenario", () => {
    const result = calculateBreakEven({ fixedCosts: 50000, variableCostPerUnit: 5, pricePerUnit: 100 });
    expect(result.breakEvenUnits).toBe(527); // 50000 / 95 = 526.3 -> ceil 527
    expect(result.contributionMarginPercent).toBe(95);
  });

  it("throws for zero price", () => {
    expect(() => calculateBreakEven({ fixedCosts: 10000, variableCostPerUnit: 15, pricePerUnit: 0 })).toThrow();
  });

  it("throws when price <= variable cost", () => {
    expect(() => calculateBreakEven({ fixedCosts: 10000, variableCostPerUnit: 20, pricePerUnit: 15 })).toThrow();
  });
});
