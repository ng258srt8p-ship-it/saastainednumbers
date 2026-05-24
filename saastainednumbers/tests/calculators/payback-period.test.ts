import { describe, it, expect } from "vitest";
import { calculatePaybackPeriod } from "@/calculators/engine/payback-period";

describe("calculatePaybackPeriod", () => {
  it("computes payback period correctly", () => {
    const r = calculatePaybackPeriod({ cac: 300, arpu: 50, grossMargin: 80 });
    expect(r.paybackPeriodMonths).toBeCloseTo(7.5, 1);
    expect(r.yearlyProfit).toBeCloseTo(180, 0);
  });

  it("throws for zero CAC", () => {
    expect(() => calculatePaybackPeriod({ cac: 0, arpu: 50, grossMargin: 80 })).toThrow();
  });

  it("returns zero payback for zero contribution", () => {
    const r = calculatePaybackPeriod({ cac: 300, arpu: 0, grossMargin: 0 });
    expect(r.paybackPeriodMonths).toBe(0);
  });
});
