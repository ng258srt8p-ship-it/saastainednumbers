import { describe, it, expect } from "vitest";
import { calculateBurnRate, calculateRunway } from "@/calculators/engine/burn-rate";

describe("calculateBurnRate", () => {
  it("computes burn rates correctly when expenses exceed revenue", () => {
    const r = calculateBurnRate({ monthlyExpenses: 50000, monthlyRevenue: 30000 });
    expect(r.netBurnRate).toBe(20000);
    expect(r.grossBurnRate).toBe(50000);
  });

  it("computes negative net burn when revenue exceeds expenses", () => {
    const r = calculateBurnRate({ monthlyExpenses: 30000, monthlyRevenue: 50000 });
    expect(r.netBurnRate).toBe(-20000);
  });

  it("throws for negative values", () => {
    expect(() => calculateBurnRate({ monthlyExpenses: -1, monthlyRevenue: 0 })).toThrow();
  });
});

describe("calculateRunway", () => {
  it("computes runway correctly", () => {
    const r = calculateRunway({ monthlyExpenses: 50000, monthlyRevenue: 30000, cashReserves: 200000 });
    expect(r.netBurnRate).toBe(20000);
    expect(r.runwayMonths).toBe(10);
  });

  it("returns zero runway when cash reserves are zero", () => {
    const r = calculateRunway({ monthlyExpenses: 50000, monthlyRevenue: 50000, cashReserves: 0 });
    expect(r.runwayMonths).toBe(0);
  });
});
