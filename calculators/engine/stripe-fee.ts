export interface StripeFeeInputs {
  transactionAmount: number;
  monthlyVolume: number;
  averageTransactionSize: number;
  refundRate: number;
}

export interface StripeFeeResult {
  perTransactionFee: number;
  percentageFee: number;
  totalFee: number;
  effectiveRate: number;
  monthlyTotalFees: number;
  annualTotalFees: number;
}

export function calculateStripeFee(inputs: StripeFeeInputs): StripeFeeResult {
  const { transactionAmount, monthlyVolume, averageTransactionSize, refundRate } = inputs;
  if (transactionAmount <= 0) throw new Error("Transaction amount must be positive");
  if (monthlyVolume < 0) throw new Error("Monthly volume must be non-negative");
  if (averageTransactionSize < 0) throw new Error("Average transaction size must be non-negative");
  if (refundRate < 0 || refundRate > 100) throw new Error("Refund rate must be between 0 and 100");
  const feePercent = monthlyVolume > 80000 ? 2.7 : 2.9;
  const fixedFee = 0.30;
  const percentageFee = parseFloat((transactionAmount * feePercent / 100).toFixed(2));
  const perTransactionFee = parseFloat((percentageFee + fixedFee).toFixed(2));
  const totalFee = perTransactionFee;
  const effectiveRate = parseFloat(((totalFee / transactionAmount) * 100).toFixed(2));
  const numTransactions = averageTransactionSize > 0 ? monthlyVolume / averageTransactionSize : 1;
  const monthlyPercentageFees = monthlyVolume * feePercent / 100;
  const monthlyFixedFees = numTransactions * fixedFee;
  const refundMultiplier = 1 + refundRate / 100;
  const monthlyTotalFees = parseFloat(((monthlyPercentageFees + monthlyFixedFees) * refundMultiplier).toFixed(2));
  const annualTotalFees = parseFloat((monthlyTotalFees * 12).toFixed(2));
  return { perTransactionFee, percentageFee, totalFee, effectiveRate, monthlyTotalFees, annualTotalFees };
}
