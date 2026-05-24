import { describe, it, expect } from "vitest";
import { calculateDebtPayoff } from "@/calculators/engine/debt-payoff";
describe("calculateDebtPayoff", () => {
  it("computes payoff correctly", () => {
    const r = calculateDebtPayoff({ totalDebt: 15000, interestRate: 18, monthlyPayment: 500 });
    expect(r.monthsToPayoff).toBeGreaterThan(0);
    expect(r.yearsToPayoff).toBeGreaterThan(0);
    expect(r.totalInterestPaid).toBeGreaterThan(0);
    expect(r.totalPaid).toBeGreaterThan(15000);
  });
  it("high payment pays off faster", () => {
    const fast = calculateDebtPayoff({ totalDebt: 15000, interestRate: 18, monthlyPayment: 1000 });
    const slow = calculateDebtPayoff({ totalDebt: 15000, interestRate: 18, monthlyPayment: 500 });
    expect(fast.monthsToPayoff).toBeLessThan(slow.monthsToPayoff);
  });
  it("throws for zero payment", () => {
    expect(() => calculateDebtPayoff({ totalDebt: 10000, interestRate: 18, monthlyPayment: 0 })).toThrow();
  });
});
