import { describe, it, expect } from "vitest";
import { calculateSavingsRate } from "@/calculators/engine/savings-rate";

describe("calculateSavingsRate", () => {
  it("computes savings metrics correctly", () => {
    const result = calculateSavingsRate({ monthlyIncome: 5000, monthlyExpenses: 3500, currentSavings: 10000, targetSavings: 50000 });
    expect(result.monthlySavings).toBe(1500);
    expect(result.savingsRate).toBe(30);
    expect(result.monthsToTarget).toBe(27);
    expect(result.yearsToTarget).toBe(2.25);
  });

  it("handles zero target (already met)", () => {
    const result = calculateSavingsRate({ monthlyIncome: 5000, monthlyExpenses: 3500, currentSavings: 60000, targetSavings: 50000 });
    expect(result.monthsToTarget).toBe(0);
    expect(result.yearsToTarget).toBe(0);
  });

  it("throws when expenses exceed income", () => {
    expect(() => calculateSavingsRate({ monthlyIncome: 3000, monthlyExpenses: 4000, currentSavings: 10000, targetSavings: 50000 })).toThrow();
  });

  it("throws for negative values", () => {
    expect(() => calculateSavingsRate({ monthlyIncome: -1, monthlyExpenses: 1000, currentSavings: 0, targetSavings: 10000 })).toThrow();
  });
});
