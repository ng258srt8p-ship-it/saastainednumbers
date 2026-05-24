export interface MortgageAffordabilityParams { annualIncome: number; monthlyDebtPayments: number; downPayment: number; interestRate: number; loanTermYears: number; propertyTaxRate: number; insuranceMonthly: number; }
export interface MortgageAffordabilityResult { maxHomePrice: number; monthlyPayment: number; downPaymentPercent: number; debtToIncomeRatio: number; loanAmount: number; totalInterestPaid: number; }
export function calculateMortgageAffordability(p: MortgageAffordabilityParams): MortgageAffordabilityResult {
  if (p.annualIncome < 0 || p.monthlyDebtPayments < 0 || p.downPayment < 0 || p.interestRate < 0 || p.loanTermYears <= 0 || p.propertyTaxRate < 0 || p.insuranceMonthly < 0) throw new Error("Values must be positive");
  const monthlyIncome = p.annualIncome / 12;
  const maxMonthlyPayment = monthlyIncome * 0.36 - p.monthlyDebtPayments;
  if (maxMonthlyPayment <= 0) throw new Error("Debt payments exceed 36% DTI threshold");
  const monthlyRate = p.interestRate / 100 / 12; const totalPayments = p.loanTermYears * 12;
  const maxLoan = maxMonthlyPayment * ((Math.pow(1 + monthlyRate, totalPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)));
  const maxHomePrice = maxLoan + p.downPayment;
  const loanAmount = maxLoan;
  const monthlyPI = maxMonthlyPayment - p.insuranceMonthly - (maxHomePrice * (p.propertyTaxRate / 100) / 12);
  const monthlyPayment = monthlyPI + p.insuranceMonthly + (maxHomePrice * (p.propertyTaxRate / 100) / 12);
  const totalPaid = monthlyPayment * totalPayments; const totalInterest = totalPaid - loanAmount;
  const dti = ((maxMonthlyPayment + p.monthlyDebtPayments) / monthlyIncome) * 100;
  return { maxHomePrice, monthlyPayment, downPaymentPercent: (p.downPayment / (maxHomePrice || 1)) * 100, debtToIncomeRatio: dti, loanAmount, totalInterestPaid: Math.max(0, totalInterest) };
}
