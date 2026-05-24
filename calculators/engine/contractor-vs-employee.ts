export interface ContractorVsEmployeeParams { contractorRate: number; contractorHoursPerYear: number; employeeSalary: number; employeeBonusPercent: number; employeeBenefitsPercent: number; employeePayrollTaxPercent: number; employeeEquipmentCost: number; employeeOfficeCost: number; }
export interface ContractorVsEmployeeResult { contractorAnnualCost: number; employeeAnnualCost: number; difference: number; contractorCheaperBy: number; percentDiff: number; }
export function calculateContractorVsEmployee(p: ContractorVsEmployeeParams): ContractorVsEmployeeResult {
  if (p.contractorRate < 0 || p.contractorHoursPerYear < 0 || p.employeeSalary < 0 || p.employeeBonusPercent < 0 || p.employeeBenefitsPercent < 0 || p.employeePayrollTaxPercent < 0 || p.employeeEquipmentCost < 0 || p.employeeOfficeCost < 0) throw new Error("Values must be positive");
  const contractor = p.contractorRate * p.contractorHoursPerYear;
  const bonus = p.employeeSalary * (p.employeeBonusPercent / 100);
  const benefits = p.employeeSalary * (p.employeeBenefitsPercent / 100);
  const payroll = p.employeeSalary * (p.employeePayrollTaxPercent / 100);
  const employee = p.employeeSalary + bonus + benefits + payroll + p.employeeEquipmentCost + p.employeeOfficeCost;
  const diff = Math.abs(contractor - employee); const cheaper = contractor < employee;
  const percent = Math.max(contractor, employee) > 0 ? (diff / Math.max(contractor, employee)) * 100 : 0;
  return { contractorAnnualCost: contractor, employeeAnnualCost: employee, difference: diff, contractorCheaperBy: cheaper ? diff : -diff, percentDiff: percent };
}
