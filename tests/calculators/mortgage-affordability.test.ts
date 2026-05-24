import { describe, it, expect } from "vitest";
import { calculateMortgageAffordability } from "@/calculators/engine/mortgage-affordability";
describe("calculateMortgageAffordability", () => {
  it("computes affordability correctly with default values", () => {
    const r = calculateMortgageAffordability({ annualIncome: 100000, monthlyDebtPayments: 500, downPayment: 50000, interestRate: 6.5, loanTermYears: 30, propertyTaxRate: 1.2, insuranceMonthly: 150 });
    expect(r.maxHomePrice).toBeGreaterThan(300000);
    expect(r.maxHomePrice).toBeLessThan(500000);
    expect(r.monthlyPayment).toBeGreaterThan(2000);
    expect(r.monthlyPayment).toBeLessThan(4000);
    expect(r.downPaymentPercent).toBeGreaterThan(10);
    expect(r.debtToIncomeRatio).toBeLessThanOrEqual(36);
    expect(r.loanAmount).toBeGreaterThan(200000);
    expect(r.totalInterestPaid).toBeGreaterThan(0);
  });
  it("throws when DTI exceeds 36% threshold", () => {
    expect(() => calculateMortgageAffordability({ annualIncome: 50000, monthlyDebtPayments: 2000, downPayment: 10000, interestRate: 6.5, loanTermYears: 30, propertyTaxRate: 1.2, insuranceMonthly: 150 })).toThrow();
  });
  it("handles zero down payment", () => {
    const r = calculateMortgageAffordability({ annualIncome: 100000, monthlyDebtPayments: 500, downPayment: 0, interestRate: 6.5, loanTermYears: 30, propertyTaxRate: 1.2, insuranceMonthly: 150 });
    expect(r.downPaymentPercent).toBe(0);
    expect(r.maxHomePrice).toBe(r.loanAmount);
    expect(r.maxHomePrice).toBeGreaterThan(0);
  });
});
