import { describe, it, expect } from "vitest";
import { calculateGrossMargin } from "@/calculators/engine/gross-margin";

describe("calculateGrossMargin", () => {
  it("computes gross margin correctly", () => {
    const r = calculateGrossMargin({ revenue: 100000, cogs: 25000 });
    expect(r.grossMargin).toBe(75);
    expect(r.grossProfit).toBe(75000);
  });

  it("throws for zero revenue", () => {
    expect(() => calculateGrossMargin({ revenue: 0, cogs: 0 })).toThrow();
  });

  it("throws for COGS exceeding revenue", () => {
    expect(() => calculateGrossMargin({ revenue: 100, cogs: 200 })).toThrow();
  });
});
