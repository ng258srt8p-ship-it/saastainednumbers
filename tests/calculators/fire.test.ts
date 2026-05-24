import { describe, it, expect } from "vitest";
import { calculateFIRE } from "@/calculators/engine/fire";

describe("calculateFIRE", () => {
  it("computes FIRE metrics correctly for standard inputs", () => {
    const result = calculateFIRE({ currentSavings: 50000, monthlyContribution: 2000, annualReturn: 7, desiredMonthlyWithdrawal: 4000, currentAge: 30, retirementAge: 55 });
    expect(result.fireNumber).toBe(1200000);
    expect(result.savingsAtRetirement).toBeGreaterThan(0);
    expect(result.yearsToFI).toBeGreaterThan(0);
    expect(result.ageAtFI).toBeGreaterThan(30);
  });

  it("achieves Coast FI when savings exceed FIRE number", () => {
    const result = calculateFIRE({ currentSavings: 2000000, monthlyContribution: 0, annualReturn: 7, desiredMonthlyWithdrawal: 4000, currentAge: 30, retirementAge: 55 });
    expect(result.isCoastFI).toBe(true);
    expect(result.yearsToFI).toBe(0);
  });

  it("computes zero-year FI for already FI", () => {
    const result = calculateFIRE({ currentSavings: 2000000, monthlyContribution: 0, annualReturn: 7, desiredMonthlyWithdrawal: 4000, currentAge: 30, retirementAge: 55 });
    expect(result.isCoastFI).toBe(true);
    expect(result.savingsAtRetirement).toBeGreaterThanOrEqual(result.fireNumber);
  });

  it("throws for negative values", () => {
    expect(() => calculateFIRE({ currentSavings: -1, monthlyContribution: 2000, annualReturn: 7, desiredMonthlyWithdrawal: 4000, currentAge: 30, retirementAge: 55 })).toThrow();
  });

  it("throws when retirement age <= current age", () => {
    expect(() => calculateFIRE({ currentSavings: 50000, monthlyContribution: 2000, annualReturn: 7, desiredMonthlyWithdrawal: 4000, currentAge: 55, retirementAge: 50 })).toThrow();
  });
});
