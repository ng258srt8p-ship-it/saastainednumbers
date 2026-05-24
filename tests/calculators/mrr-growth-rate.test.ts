import { describe, it, expect } from "vitest";
import { calculateMRRGrowthRate } from "@/calculators/engine/mrr-growth-rate";

describe("calculateMRRGrowthRate", () => {
  it("computes growth rate correctly", () => {
    const r = calculateMRRGrowthRate({ previousMrr: 80000, currentMrr: 100000 });
    expect(r.growthRate).toBe(25);
    expect(r.mrrChange).toBe(20000);
  });

  it("returns Infinity for zero starting MRR", () => {
    const r = calculateMRRGrowthRate({ previousMrr: 0, currentMrr: 10000 });
    expect(r.growthRate).toBe(Infinity);
  });

  it("handles negative growth", () => {
    const r = calculateMRRGrowthRate({ previousMrr: 100000, currentMrr: 80000 });
    expect(r.growthRate).toBe(-20);
  });
});
