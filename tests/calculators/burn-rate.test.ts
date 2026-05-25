import { describe, it, expect } from "vitest";
import { calculateBurnRate, calculateRunway } from "@/calculators/engine/burn-rate";

describe("calculateBurnRate", () => {
  it("computes burn rates and burn multiple correctly", () => {
    const r = calculateBurnRate({ monthlyExpenses: 50000, monthlyRevenue: 30000, netNewARR: 20000 });
    expect(r.netBurnRate).toBe(20000);
    expect(r.grossBurnRate).toBe(50000);
    expect(r.burnMultiple).toBe(1.0);
  });

  it("computes negative net burn when revenue exceeds expenses", () => {
    const r = calculateBurnRate({ monthlyExpenses: 30000, monthlyRevenue: 50000, netNewARR: 20000 });
    expect(r.netBurnRate).toBe(-20000);
    expect(r.burnMultiple).toBe(-1.0);
  });

  it("returns null burn multiple when net new ARR is zero", () => {
    const r = calculateBurnRate({ monthlyExpenses: 50000, monthlyRevenue: 30000, netNewARR: 0 });
    expect(r.netBurnRate).toBe(20000);
    expect(r.burnMultiple).toBeNull();
  });

  it("throws for negative values", () => {
    expect(() => calculateBurnRate({ monthlyExpenses: -1, monthlyRevenue: 0, netNewARR: 0 })).toThrow();
  });
});

describe("calculateRunway", () => {
  it("computes runway and burn multiple correctly", () => {
    const r = calculateRunway({ monthlyExpenses: 50000, monthlyRevenue: 30000, netNewARR: 20000, cashReserves: 200000 });
    expect(r.netBurnRate).toBe(20000);
    expect(r.runwayMonths).toBe(10);
    expect(r.burnMultiple).toBe(1.0);
  });

  it("returns zero runway when cash reserves are zero", () => {
    const r = calculateRunway({ monthlyExpenses: 50000, monthlyRevenue: 50000, netNewARR: 0, cashReserves: 0 });
    expect(r.runwayMonths).toBe(0);
  });
});
