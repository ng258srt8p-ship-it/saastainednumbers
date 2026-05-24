export interface DebtPayoffParams {
  totalDebt: number;
  interestRate: number;
  monthlyPayment: number;
}

export interface DebtPayoffResult {
  monthsToPayoff: number;
  yearsToPayoff: number;
  totalInterestPaid: number;
  totalPaid: number;
}

export function calculateDebtPayoff(params: DebtPayoffParams): DebtPayoffResult {
  const { totalDebt, interestRate, monthlyPayment } = params;
  if (totalDebt < 0 || interestRate < 0 || monthlyPayment <= 0) {
    throw new Error("Values must be positive");
  }
  if (monthlyPayment <= totalDebt * (interestRate / 100 / 12)) {
    throw new Error("Monthly payment must exceed interest accrual");
  }
  const monthlyRate = interestRate / 100 / 12;
  let balance = totalDebt;
  let months = 0;
  let totalInterest = 0;
  while (balance > 0 && months < 1200) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    const principal = monthlyPayment - interest;
    balance -= principal;
    months++;
  }
  const totalPaid = totalDebt + totalInterest;
  return { monthsToPayoff: months, yearsToPayoff: months / 12, totalInterestPaid: totalInterest, totalPaid };
}
