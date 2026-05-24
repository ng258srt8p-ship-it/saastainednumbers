import { describe, it, expect } from "vitest";
import { calculateMagicNumber } from "@/calculators/engine/magic-number";

describe("calculateMagicNumber", () => {
  it("computes magic number correctly", () => {
    const r = calculateMagicNumber({ newArr: 300000, salesMarketingSpend: 200000 });
    expect(r.magicNumber).toBe(1.5);
  });

  it("throws for zero S&M spend", () => {
    expect(() => calculateMagicNumber({ newArr: 100000, salesMarketingSpend: 0 })).toThrow();
  });
});
