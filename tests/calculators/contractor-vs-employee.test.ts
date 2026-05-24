import { describe, it, expect } from "vitest";
import { calculateContractorVsEmployee } from "@/calculators/engine/contractor-vs-employee";

describe("calculateContractorVsEmployee", () => {
  it("shows contractor cheaper when employee has high overhead", () => {
    const result = calculateContractorVsEmployee({
      contractorRate: 80,
      contractorHoursPerYear: 2000,
      employeeSalary: 150000,
      employeeBonusPercent: 15,
      employeeBenefitsPercent: 30,
      employeePayrollTaxPercent: 7.65,
      employeeEquipmentCost: 8000,
      employeeOfficeCost: 12000,
    });
    expect(result.contractorAnnualCost).toBe(160000);
    expect(result.employeeAnnualCost).toBe(248975);
    expect(result.contractorCheaperBy).toBe(88975);
    expect(result.percentDiff).toBeCloseTo(35.74, 1);
  });

  it("shows employee cheaper when contractor rate is high", () => {
    const result = calculateContractorVsEmployee({
      contractorRate: 150,
      contractorHoursPerYear: 2000,
      employeeSalary: 100000,
      employeeBonusPercent: 5,
      employeeBenefitsPercent: 20,
      employeePayrollTaxPercent: 7.65,
      employeeEquipmentCost: 3000,
      employeeOfficeCost: 5000,
    });
    expect(result.contractorAnnualCost).toBe(300000);
    expect(result.employeeAnnualCost).toBe(140650);
    expect(result.contractorCheaperBy).toBe(-159350);
    expect(result.percentDiff).toBeCloseTo(53.12, 1);
  });

  it("throws for negative contractor rate", () => {
    expect(() =>
      calculateContractorVsEmployee({
        contractorRate: -1,
        contractorHoursPerYear: 2000,
        employeeSalary: 100000,
        employeeBonusPercent: 10,
        employeeBenefitsPercent: 25,
        employeePayrollTaxPercent: 7.65,
        employeeEquipmentCost: 5000,
        employeeOfficeCost: 10000,
      })
    ).toThrow();
  });
});
