import { describe, it, expect } from "vitest";
import { calculateInvestmentReturns } from "@/calculators/engine/investment-returns";
describe("calculateInvestmentReturns", () => {
  it("computes growth correctly", () => {
    const r = calculateInvestmentReturns({ initialInvestment: 10000, monthlyContribution: 500, annualReturn: 7, years: 10 });
    expect(r.totalContributions).toBe(70000);
    expect(r.totalValue).toBeGreaterThan(70000);
    expect(r.totalEarnings).toBeGreaterThan(0);
  });
  it("handles zero contributions", () => {
    const r = calculateInvestmentReturns({ initialInvestment: 10000, monthlyContribution: 0, annualReturn: 7, years: 10 });
    expect(r.totalContributions).toBe(10000);
    expect(r.totalValue).toBeGreaterThan(10000);
  });
  it("throws for negative values", () => {
    expect(() => calculateInvestmentReturns({ initialInvestment: -1, monthlyContribution: 500, annualReturn: 7, years: 10 })).toThrow();
  });
});
