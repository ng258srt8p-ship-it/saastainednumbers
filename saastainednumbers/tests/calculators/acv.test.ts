import { describe, it, expect } from "vitest";
import { calculateACV } from "@/calculators/engine/acv";

describe("calculateACV", () => {
  it("computes ACV correctly", () => {
    const r = calculateACV({ totalContractValue: 60000, contractDurationYears: 3 });
    expect(r.acv).toBe(20000);
    expect(r.tcv).toBe(60000);
  });

  it("throws for zero duration", () => {
    expect(() => calculateACV({ totalContractValue: 1000, contractDurationYears: 0 })).toThrow();
  });
});
