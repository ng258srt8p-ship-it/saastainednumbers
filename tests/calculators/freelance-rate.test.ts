import { describe, it, expect } from "vitest";
import { calculateFreelanceRate } from "@/calculators/engine/freelance-rate";

describe("calculateFreelanceRate", () => {
  it("computes rate correctly", () => {
    const result = calculateFreelanceRate({ desiredIncome: 80000, billableHoursPerWeek: 25, weeksPerYear: 48, expenses: 10000, taxRate: 25 });
    expect(result.hourlyRate).toBeCloseTo(100, 0);
    expect(result.annualRevenue).toBeCloseTo(120000, 0);
    expect(result.monthlyRevenue).toBeCloseTo(10000, 0);
  });

  it("handles zero expenses", () => {
    const result = calculateFreelanceRate({ desiredIncome: 60000, billableHoursPerWeek: 30, weeksPerYear: 48, expenses: 0, taxRate: 20 });
    expect(result.hourlyRate).toBeGreaterThan(0);
    expect(result.annualRevenue).toBe(75000);
  });

  it("throws for negative values", () => {
    expect(() => calculateFreelanceRate({ desiredIncome: -1, billableHoursPerWeek: 25, weeksPerYear: 48, expenses: 10000, taxRate: 25 })).toThrow();
  });

  it("throws for zero hours", () => {
    expect(() => calculateFreelanceRate({ desiredIncome: 80000, billableHoursPerWeek: 0, weeksPerYear: 48, expenses: 10000, taxRate: 25 })).toThrow();
  });
});
