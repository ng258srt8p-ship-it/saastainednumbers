import { describe, it, expect } from "vitest";
import { calculateEmergencyFund } from "@/calculators/engine/emergency-fund";
describe("calculateEmergencyFund", () => {
  it("computes fund metrics correctly", () => {
    const r = calculateEmergencyFund({ monthlyExpenses: 4000, currentSavings: 5000, monthlySavings: 800, targetMonths: 6 });
    expect(r.targetAmount).toBe(24000);
    expect(r.currentCoverageMonths).toBeCloseTo(1.25, 1);
    expect(r.shortfall).toBe(19000);
    expect(r.monthsToGoal).toBe(24);
    expect(r.isFunded).toBe(false);
  });
  it("detects fully funded", () => {
    const r = calculateEmergencyFund({ monthlyExpenses: 4000, currentSavings: 30000, monthlySavings: 800, targetMonths: 6 });
    expect(r.isFunded).toBe(true);
    expect(r.shortfall).toBe(0);
  });
  it("throws for zero expenses", () => {
    expect(() => calculateEmergencyFund({ monthlyExpenses: 0, currentSavings: 5000, monthlySavings: 800, targetMonths: 6 })).toThrow();
  });
});
