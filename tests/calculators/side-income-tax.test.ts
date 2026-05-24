import { describe, it, expect } from "vitest";
import { calculateSideIncomeTax } from "@/calculators/engine/side-income-tax";

describe("calculateSideIncomeTax", () => {
  it("computes tax correctly with default values", () => {
    const result = calculateSideIncomeTax({ sideIncome: 20000, employmentIncome: 80000, filingStatus: "Single", state: "CA", expenses: 3000 });
    expect(result.taxableSideIncome).toBe(17000);
    expect(result.selfEmploymentTax).toBe(1300.5);
    expect(result.estimatedFederalTax).toBe(3740);
    expect(result.estimatedStateTax).toBe(850);
    expect(result.totalAdditionalTax).toBe(5890.5);
    expect(result.effectiveTaxRate).toBeCloseTo(34.65, 1);
    expect(result.afterTaxSideIncome).toBe(11109.5);
  });

  it("computes with zero expenses", () => {
    const result = calculateSideIncomeTax({ sideIncome: 20000, employmentIncome: 80000, filingStatus: "Single", state: "CA", expenses: 0 });
    expect(result.taxableSideIncome).toBe(20000);
    expect(result.selfEmploymentTax).toBe(1530);
    expect(result.estimatedFederalTax).toBe(4400);
    expect(result.estimatedStateTax).toBe(1000);
    expect(result.totalAdditionalTax).toBe(6930);
    expect(result.afterTaxSideIncome).toBe(13070);
  });

  it("throws for negative side income", () => {
    expect(() => calculateSideIncomeTax({ sideIncome: -1, employmentIncome: 80000, filingStatus: "Single", state: "CA", expenses: 3000 })).toThrow();
  });
});
