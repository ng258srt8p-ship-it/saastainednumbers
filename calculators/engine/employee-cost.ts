export interface EmployeeCostParams {
  baseSalary: number;
  bonusPercent: number;
  payrollTaxPercent: number;
  benefitsPercent: number;
  equipmentCost: number;
  officeSpaceCost: number;
  headcount: number;
}

export interface EmployeeCostResult {
  totalCostPerEmployee: number;
  totalCostAllEmployees: number;
  salaryBurdenPercent: number;
  monthlyCostPerEmployee: number;
  annualBenefitsCost: number;
  annualPayrollTaxCost: number;
}

export function calculateEmployeeCost(params: EmployeeCostParams): EmployeeCostResult {
  const { baseSalary, bonusPercent, payrollTaxPercent, benefitsPercent, equipmentCost, officeSpaceCost, headcount } = params;
  if (baseSalary < 0 || bonusPercent < 0 || payrollTaxPercent < 0 || benefitsPercent < 0 || equipmentCost < 0 || officeSpaceCost < 0 || headcount < 0) {
    throw new Error("Values must be positive");
  }
  const bonusCost = baseSalary * (bonusPercent / 100);
  const payrollTaxCost = baseSalary * (payrollTaxPercent / 100);
  const benefitsCost = baseSalary * (benefitsPercent / 100);
  const totalCostPerEmployee = baseSalary + bonusCost + payrollTaxCost + benefitsCost + equipmentCost + officeSpaceCost;
  const totalCostAllEmployees = totalCostPerEmployee * headcount;
  const salaryBurdenPercent = baseSalary > 0 ? ((totalCostPerEmployee - baseSalary) / baseSalary) * 100 : 0;
  const monthlyCostPerEmployee = totalCostPerEmployee / 12;
  const annualBenefitsCost = benefitsCost;
  const annualPayrollTaxCost = payrollTaxCost;
  return { totalCostPerEmployee, totalCostAllEmployees, salaryBurdenPercent, monthlyCostPerEmployee, annualBenefitsCost, annualPayrollTaxCost };
}
