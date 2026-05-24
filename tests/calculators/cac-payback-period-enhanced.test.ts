import { describe, it, expect } from "vitest";
import { calculateCACPaybackPeriod } from "@/calculators/engine/cac-payback-period-enhanced";

describe("calculateCACPaybackPeriod", () => {
  it("computes standard payback correctly", () => {
    const r = calculateCACPaybackPeriod({ cac: 500, arpu: 100, grossMargin: 70 });
    expect(r.grossProfitPerMonth).toBe(70);
    expect(r.paybackMonths).toBeCloseTo(7.14, 1);
    expect(r.paybackDays).toBeCloseTo(217.43, 1);
  });

  it("computes longer payback for low margin", () => {
    const r = calculateCACPaybackPeriod({ cac: 500, arpu: 100, grossMargin: 30 });
    expect(r.grossProfitPerMonth).toBe(30);
    expect(r.paybackMonths).toBeCloseTo(16.67, 1);
  });

  it("throws for zero CAC", () => {
    expect(() => calculateCACPaybackPeriod({ cac: 0, arpu: 100, grossMargin: 70 })).toThrow();
  });
});
