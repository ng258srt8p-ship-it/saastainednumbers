import { describe, it, expect } from "vitest";
import { calculateQuickRatio } from "@/calculators/engine/quick-ratio";

describe("calculateQuickRatio", () => {
  it("computes quick ratio correctly", () => {
    const r = calculateQuickRatio({ newMrr: 20000, expansionMrr: 10000, churnedMrr: 5000, contractionMrr: 2000 });
    expect(r.quickRatio).toBeCloseTo(4.29, 1);
  });

  it("returns Infinity for zero lost MRR", () => {
    const r = calculateQuickRatio({ newMrr: 10000, expansionMrr: 0, churnedMrr: 0, contractionMrr: 0 });
    expect(r.quickRatio).toBe(Infinity);
  });

  it("throws for negative values", () => {
    expect(() => calculateQuickRatio({ newMrr: -1, expansionMrr: 0, churnedMrr: 0, contractionMrr: 0 })).toThrow();
  });
});
