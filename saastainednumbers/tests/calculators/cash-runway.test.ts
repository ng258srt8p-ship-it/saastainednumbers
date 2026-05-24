import { describe, it, expect } from "vitest";
import { calculateCashRunway } from "@/calculators/engine/cash-runway";

describe("calculateCashRunway", () => {
  it("computes runway for default loss-making scenario", () => {
    const result = calculateCashRunway({
      currentCash: 100000,
      monthlyRevenue: 20000,
      monthlyExpenses: 50000,
      monthlyGrowthRate: 0,
    });
    expect(result.grossBurn).toBe(50000);
    expect(result.netBurn).toBe(30000);
    expect(result.runwayMonths).toBe(4);
    expect(result.revenueRunwayMonths).toBe(2);
  });

  it("returns infinite runway when profitable (negative net burn)", () => {
    const result = calculateCashRunway({
      currentCash: 200000,
      monthlyRevenue: 80000,
      monthlyExpenses: 50000,
      monthlyGrowthRate: 5,
    });
    expect(result.grossBurn).toBe(50000);
    expect(result.netBurn).toBe(-30000);
    expect(result.runwayMonths).toBe(999);
    expect(result.revenueRunwayMonths).toBe(4);
  });

  it("throws for negative current cash", () => {
    expect(() =>
      calculateCashRunway({
        currentCash: -1,
        monthlyRevenue: 50000,
        monthlyExpenses: 80000,
        monthlyGrowthRate: 5,
      })
    ).toThrow();
  });
});
