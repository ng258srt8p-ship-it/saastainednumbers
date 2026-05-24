export interface StudentLoanPayoffParams { totalLoan: number; interestRate: number; monthlyPayment: number; }
export interface StudentLoanPayoffResult { monthsToPayoff: number; yearsToPayoff: number; totalInterestPaid: number; totalPaid: number; }
export function calculateStudentLoanPayoff(p: StudentLoanPayoffParams): StudentLoanPayoffResult {
  if (p.totalLoan < 0 || p.interestRate < 0 || p.monthlyPayment <= 0) throw new Error("Values must be positive");
  if (p.monthlyPayment <= p.totalLoan * (p.interestRate / 100 / 12)) throw new Error("Monthly payment must exceed interest accrual");
  let balance = p.totalLoan; let months = 0; let totalInterest = 0;
  const monthlyRate = p.interestRate / 100 / 12;
  while (balance > 0 && months < 1200) { const interest = balance * monthlyRate; totalInterest += interest; balance -= p.monthlyPayment - interest; months++; }
  return { monthsToPayoff: months, yearsToPayoff: months / 12, totalInterestPaid: totalInterest, totalPaid: p.totalLoan + totalInterest };
}
