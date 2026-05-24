import { describe, it, expect } from "vitest";
import { calculateRetire401k } from "@/calculators/engine/retire-401k";
describe("calculateRetire401k", () => {
  it("projects retirement balance with default values", () => {
    const r = calculateRetire401k({ currentBalance: 50000, annualContribution: 19500, employerMatchPercent: 100, employerMatchCap: 9750, annualReturn: 7, currentAge: 30, retirementAge: 65 });
    expect(r.balanceAtRetirement).toBeGreaterThan(2000000);
    expect(r.balanceAtRetirement).toBeLessThan(6000000);
    expect(r.totalContributions).toBe(50000 + 19500 * 35);
    expect(r.totalEmployerMatch).toBe(9750 * 35);
    expect(r.totalEarnings).toBeGreaterThan(0);
    expect(r.annualIncomeAtRetirement).toBe(r.balanceAtRetirement * 0.04);
  });
  it("handles zero current balance", () => {
    const r = calculateRetire401k({ currentBalance: 0, annualContribution: 19500, employerMatchPercent: 100, employerMatchCap: 9750, annualReturn: 7, currentAge: 30, retirementAge: 65 });
    expect(r.balanceAtRetirement).toBeGreaterThan(0);
    expect(r.totalContributions).toBe(19500 * 35);
    expect(r.totalEarnings).toBeGreaterThan(0);
  });
  it("throws when retirement age <= current age", () => {
    expect(() => calculateRetire401k({ currentBalance: 50000, annualContribution: 19500, employerMatchPercent: 100, employerMatchCap: 9750, annualReturn: 7, currentAge: 65, retirementAge: 65 })).toThrow();
  });
});
