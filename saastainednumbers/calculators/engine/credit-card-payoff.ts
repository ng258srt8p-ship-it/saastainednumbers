export interface CreditCardPayoffParams { totalBalance: number; interestRate: number; monthlyPayment: number; }
export interface CreditCardPayoffResult { monthsToPayoff: number; yearsToPayoff: number; totalInterestPaid: number; totalPaid: number; }
export function calculateCreditCardPayoff(p: CreditCardPayoffParams): CreditCardPayoffResult {
  if (p.totalBalance < 0 || p.interestRate < 0 || p.monthlyPayment <= 0) throw new Error("Values must be positive");
  if (p.monthlyPayment <= p.totalBalance * (p.interestRate / 100 / 12)) throw new Error("Monthly payment must exceed interest accrual");
  let balance = p.totalBalance; let months = 0; let totalInterest = 0;
  const monthlyRate = p.interestRate / 100 / 12;
  while (balance > 0 && months < 1200) { const interest = balance * monthlyRate; totalInterest += interest; balance -= p.monthlyPayment - interest; months++; }
  return { monthsToPayoff: months, yearsToPayoff: months / 12, totalInterestPaid: totalInterest, totalPaid: p.totalBalance + totalInterest };
}
