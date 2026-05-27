export interface PaymentProcessingFeeInputs {
  monthlyRevenue: number;
  averageTransactionSize: number;
  processorFeePercent: number;
  processorFixedFee: number;
  chargebackRate: number;
  chargebackFee: number;
}

export interface PaymentProcessingFeeResult {
  monthlyTransactionFees: number;
  monthlyChargebackFees: number;
  totalMonthlyFees: number;
  effectiveRate: number;
  annualFees: number;
  feesAsPercentOfRevenue: number;
}

export function calculatePaymentProcessingFee(inputs: PaymentProcessingFeeInputs): PaymentProcessingFeeResult {
  const { monthlyRevenue, averageTransactionSize, processorFeePercent, processorFixedFee, chargebackRate, chargebackFee } = inputs;
  if (monthlyRevenue <= 0) throw new Error("Monthly revenue must be positive");
  if (averageTransactionSize <= 0) throw new Error("Average transaction size must be positive");
  if (processorFeePercent < 0) throw new Error("Processor fee percent must be non-negative");
  if (processorFixedFee < 0) throw new Error("Processor fixed fee must be non-negative");
  if (chargebackRate < 0 || chargebackRate > 100) throw new Error("Chargeback rate must be between 0 and 100");
  if (chargebackFee < 0) throw new Error("Chargeback fee must be non-negative");
  const numTransactions = averageTransactionSize > 0 ? monthlyRevenue / averageTransactionSize : 0;
  const monthlyTransactionFees = parseFloat((monthlyRevenue * processorFeePercent / 100 + numTransactions * processorFixedFee).toFixed(2));
  const monthlyChargebackFees = parseFloat((numTransactions * chargebackRate / 100 * chargebackFee).toFixed(2));
  const totalMonthlyFees = parseFloat((monthlyTransactionFees + monthlyChargebackFees).toFixed(2));
  const effectiveRate = parseFloat(((totalMonthlyFees / monthlyRevenue) * 100).toFixed(2));
  const annualFees = parseFloat((totalMonthlyFees * 12).toFixed(2));
  const feesAsPercentOfRevenue = effectiveRate;
  return { monthlyTransactionFees, monthlyChargebackFees, totalMonthlyFees, effectiveRate, annualFees, feesAsPercentOfRevenue };
}
