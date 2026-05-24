import { describe, it, expect } from "vitest";
import { calculateDividendIncome } from "@/calculators/engine/dividend-income";
describe("calculateDividendIncome", () => {
  it("projects dividend income with default values", () => {
    const r = calculateDividendIncome({ initialInvestment: 10000, monthlyContribution: 500, dividendYield: 4, dividendGrowthRate: 6, years: 10 });
    expect(r.totalInvested).toBe(10000 + 500 * 12 * 10);
    expect(r.portfolioValue).toBeGreaterThan(r.totalInvested);
    expect(r.annualDividendIncome).toBeGreaterThan(2000);
    expect(r.monthlyDividendIncome).toBeGreaterThan(150);
    expect(r.dividendYield).toBe(4);
  });
  it("handles zero monthly contribution", () => {
    const r = calculateDividendIncome({ initialInvestment: 10000, monthlyContribution: 0, dividendYield: 4, dividendGrowthRate: 6, years: 10 });
    expect(r.totalInvested).toBe(10000);
    expect(r.portfolioValue).toBeGreaterThan(10000);
    expect(r.annualDividendIncome).toBeGreaterThan(400);
  });
  it("throws for negative values", () => {
    expect(() => calculateDividendIncome({ initialInvestment: -1, monthlyContribution: 500, dividendYield: 4, dividendGrowthRate: 6, years: 10 })).toThrow();
  });
});
