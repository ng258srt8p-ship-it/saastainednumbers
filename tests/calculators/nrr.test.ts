import { describe, it, expect } from "vitest";
import { calculateNRR } from "@/calculators/engine/nrr";

describe("calculateNRR", () => {
  it("computes NRR correctly", () => {
    const r = calculateNRR({ startMrr: 100000, expansionMrr: 15000, churnedMrr: 8000, contractionMrr: 3000 });
    expect(r.nrr).toBeCloseTo(104, 0);
  });

  it("computes NRR above 100% with heavy expansion", () => {
    const r = calculateNRR({ startMrr: 100000, expansionMrr: 30000, churnedMrr: 5000, contractionMrr: 2000 });
    expect(r.nrr).toBeGreaterThan(100);
  });

  it("throws for negative starting MRR", () => {
    expect(() => calculateNRR({ startMrr: 0, expansionMrr: 0, churnedMrr: 0, contractionMrr: 0 })).toThrow();
  });
});
