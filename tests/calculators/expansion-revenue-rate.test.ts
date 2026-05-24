import { describe, it, expect } from "vitest";
import { calculateExpansionRevenueRate } from "@/calculators/engine/expansion-revenue-rate";

describe("calculateExpansionRevenueRate", () => {
  it("computes expansion revenue rate correctly", () => {
    const r = calculateExpansionRevenueRate({ beginningMrr: 100000, expansionMrr: 15000 });
    expect(r.expansionRevenueRate).toBeCloseTo(15, 1);
  });

  it("returns 0 for zero beginning MRR", () => {
    const r = calculateExpansionRevenueRate({ beginningMrr: 0, expansionMrr: 5000 });
    expect(r.expansionRevenueRate).toBe(0);
  });

  it("throws for negative values", () => {
    expect(() => calculateExpansionRevenueRate({ beginningMrr: -100, expansionMrr: 50 })).toThrow();
  });
});
