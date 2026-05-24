import { describe, it, expect } from "vitest";
import { calculateEmployeeCost } from "@/calculators/engine/employee-cost";
describe("calculateEmployeeCost", () => {
  it("computes total cost correctly", () => {
    const r = calculateEmployeeCost({ baseSalary: 80000, bonusPercent: 10, payrollTaxPercent: 7.65, benefitsPercent: 30, equipmentCost: 5000, officeSpaceCost: 6000, headcount: 1 });
    expect(r.totalCostPerEmployee).toBeCloseTo(129120, 0);
    expect(r.salaryBurdenPercent).toBeCloseTo(61.4, 1);
    expect(r.monthlyCostPerEmployee).toBeCloseTo(10760, 0);
  });
  it("scales with headcount", () => {
    const r = calculateEmployeeCost({ baseSalary: 80000, bonusPercent: 10, payrollTaxPercent: 7.65, benefitsPercent: 30, equipmentCost: 5000, officeSpaceCost: 6000, headcount: 5 });
    expect(r.totalCostAllEmployees).toBeCloseTo(645600, 0);
  });
  it("throws for negative values", () => {
    expect(() => calculateEmployeeCost({ baseSalary: -1, bonusPercent: 10, payrollTaxPercent: 7.65, benefitsPercent: 30, equipmentCost: 5000, officeSpaceCost: 6000, headcount: 1 })).toThrow();
  });
});
