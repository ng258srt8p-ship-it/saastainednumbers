import { describe, it, expect } from "vitest";
import { calculateSaaSCapitalEfficiency } from "@/calculators/engine/saas-capital-efficiency";

describe("calculateSaaSCapitalEfficiency", () => {
  it("returns Excellent for default values", () => {
    const r = calculateSaaSCapitalEfficiency({ totalRaised: 5000000, arr: 3000000, arrGrowthLastYear: 30 });
    expect(r.arrPerDollarRaised).toBe(0.6);
    expect(r.efficiencyRatio).toBeCloseTo(0.78, 1);
    expect(r.category).toBe("Good");
  });

  it("returns Average for weaker efficiency", () => {
    const r = calculateSaaSCapitalEfficiency({ totalRaised: 10000000, arr: 2000000, arrGrowthLastYear: 20 });
    expect(r.arrPerDollarRaised).toBe(0.2);
    expect(r.efficiencyRatio).toBeCloseTo(0.24, 1);
    expect(r.category).toBe("Poor");
  });

  it("throws for zero total raised", () => {
    expect(() => calculateSaaSCapitalEfficiency({ totalRaised: 0, arr: 1000000, arrGrowthLastYear: 30 })).toThrow();
  });
});
