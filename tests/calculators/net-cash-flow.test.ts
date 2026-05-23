import { describe, it, expect } from "vitest";
import { calculateNetCashFlow } from "@/calculators/engine/net-cash-flow";

describe("calculateNetCashFlow", () => {
  it("computes net cash flow correctly (positive)", () => {
    const r = calculateNetCashFlow({ cashIn: 100000, cashOut: 80000 });
    expect(r.netCashFlow).toBe(20000);
    expect(r.burnRate).toBe(0);
    expect(r.isPositive).toBe(true);
  });

  it("computes net cash flow correctly (negative)", () => {
    const r = calculateNetCashFlow({ cashIn: 80000, cashOut: 95000 });
    expect(r.netCashFlow).toBe(-15000);
    expect(r.burnRate).toBe(15000);
    expect(r.isPositive).toBe(false);
  });

  it("throws for negative values", () => {
    expect(() => calculateNetCashFlow({ cashIn: -100, cashOut: 50 })).toThrow();
  });
});
