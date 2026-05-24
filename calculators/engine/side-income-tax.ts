export interface SideIncomeTaxParams { sideIncome: number; employmentIncome: number; filingStatus: string; state: string; expenses: number; }
export interface SideIncomeTaxResult { taxableSideIncome: number; selfEmploymentTax: number; estimatedFederalTax: number; estimatedStateTax: number; totalAdditionalTax: number; effectiveTaxRate: number; afterTaxSideIncome: number; }
export function calculateSideIncomeTax(p: SideIncomeTaxParams): SideIncomeTaxResult {
  if (p.sideIncome < 0 || p.employmentIncome < 0 || p.expenses < 0) throw new Error("Values must be positive");
  const taxable = Math.max(0, p.sideIncome - p.expenses);
  const seTax = taxable * 0.153 * 0.5; // Employer portion
  const totalIncome = p.employmentIncome + taxable;
  const fedEstimate = (totalIncome > 60000 ? (totalIncome - 60000) * 0.22 + 6000 : totalIncome * 0.10);
  const fedOnEmployment = p.employmentIncome > 60000 ? (p.employmentIncome - 60000) * 0.22 + 6000 : p.employmentIncome * 0.10;
  const additionalFed = fedEstimate - fedOnEmployment;
  const stateRate = 0.05; const stateTax = taxable * stateRate;
  const total = seTax + additionalFed + stateTax;
  const effectiveRate = taxable > 0 ? (total / taxable) * 100 : 0;
  return { taxableSideIncome: taxable, selfEmploymentTax: seTax, estimatedFederalTax: additionalFed, estimatedStateTax: stateTax, totalAdditionalTax: total, effectiveTaxRate: effectiveRate, afterTaxSideIncome: taxable - total };
}
