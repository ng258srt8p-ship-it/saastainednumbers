import { describe, it, expect } from "vitest";
import { calculateStudentLoanPayoff } from "@/calculators/engine/student-loan-payoff";
describe("calculateStudentLoanPayoff", () => {
  it("computes payoff correctly with default values", () => {
    const r = calculateStudentLoanPayoff({ totalLoan: 35000, interestRate: 5.5, monthlyPayment: 400 });
    expect(r.monthsToPayoff).toBeGreaterThan(80);
    expect(r.monthsToPayoff).toBeLessThan(120);
    expect(r.yearsToPayoff).toBeGreaterThan(6);
    expect(r.yearsToPayoff).toBeLessThan(10);
    expect(r.totalInterestPaid).toBeGreaterThan(7000);
    expect(r.totalInterestPaid).toBeLessThan(11000);
    expect(r.totalPaid).toBe(r.totalInterestPaid + 35000);
  });
  it("saves interest with faster payment", () => {
    const r1 = calculateStudentLoanPayoff({ totalLoan: 35000, interestRate: 5.5, monthlyPayment: 400 });
    const r2 = calculateStudentLoanPayoff({ totalLoan: 35000, interestRate: 5.5, monthlyPayment: 600 });
    expect(r2.monthsToPayoff).toBeLessThan(r1.monthsToPayoff);
    expect(r2.totalInterestPaid).toBeLessThan(r1.totalInterestPaid);
  });
  it("throws when payment below monthly interest", () => {
    expect(() => calculateStudentLoanPayoff({ totalLoan: 50000, interestRate: 20, monthlyPayment: 50 })).toThrow();
  });
});
