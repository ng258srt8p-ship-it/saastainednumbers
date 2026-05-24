import { describe, it, expect } from "vitest";
import { calculateCreditCardPayoff } from "@/calculators/engine/credit-card-payoff";
describe("calculateCreditCardPayoff", () => {
  it("computes payoff correctly with default values", () => {
    const r = calculateCreditCardPayoff({ totalBalance: 5000, interestRate: 22, monthlyPayment: 200 });
    expect(r.monthsToPayoff).toBeGreaterThan(30);
    expect(r.monthsToPayoff).toBeLessThan(60);
    expect(r.yearsToPayoff).toBeGreaterThan(2);
    expect(r.totalInterestPaid).toBeGreaterThan(1000);
    expect(r.totalInterestPaid).toBeLessThan(4000);
    expect(r.totalPaid).toBe(r.totalInterestPaid + 5000);
  });
  it("reduces interest with larger payment", () => {
    const r1 = calculateCreditCardPayoff({ totalBalance: 5000, interestRate: 22, monthlyPayment: 200 });
    const r2 = calculateCreditCardPayoff({ totalBalance: 5000, interestRate: 22, monthlyPayment: 400 });
    expect(r2.monthsToPayoff).toBeLessThan(r1.monthsToPayoff);
    expect(r2.totalInterestPaid).toBeLessThan(r1.totalInterestPaid);
  });
  it("throws when payment below monthly interest", () => {
    expect(() => calculateCreditCardPayoff({ totalBalance: 10000, interestRate: 30, monthlyPayment: 100 })).toThrow();
  });
});
