import { describe, it, expect } from "vitest";
import { calculateGigWorkerTakeHome } from "@/calculators/engine/gig-worker-take-home";

describe("calculateGigWorkerTakeHome", () => {
  it("computes take-home correctly", () => {
    const result = calculateGigWorkerTakeHome({ hoursPerWeek: 30, hourlyEarnings: 25, weeklyExpenses: 150, taxRate: 20 });
    expect(result.grossWeeklyIncome).toBe(750);
    expect(result.weeklyExpenses).toBe(150);
    expect(result.netWeeklyIncome).toBeCloseTo(480, 0);
    expect(result.netMonthlyIncome).toBeCloseTo(2078.4, 1);
    expect(result.netAnnualIncome).toBeCloseTo(24960, 0);
    expect(result.effectiveHourlyRate).toBeCloseTo(16, 0);
  });

  it("handles zero expenses", () => {
    const result = calculateGigWorkerTakeHome({ hoursPerWeek: 20, hourlyEarnings: 20, weeklyExpenses: 0, taxRate: 15 });
    expect(result.netWeeklyIncome).toBeCloseTo(340, 0);
  });

  it("throws for negative values", () => {
    expect(() => calculateGigWorkerTakeHome({ hoursPerWeek: -1, hourlyEarnings: 25, weeklyExpenses: 150, taxRate: 20 })).toThrow();
  });
});
