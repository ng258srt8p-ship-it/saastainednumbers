export interface ROIParams {
  initialInvestment: number;
  finalValue: number;
  years: number;
}

export interface ROIResult {
  totalGain: number;
  roiPercent: number;
  annualizedROI: number;
}

export function calculateROI(params: ROIParams): ROIResult {
  const { initialInvestment, finalValue, years } = params;
  if (initialInvestment <= 0 || finalValue < 0 || years <= 0) {
    throw new Error("Values must be positive");
  }
  const totalGain = finalValue - initialInvestment;
  const roiPercent = (totalGain / initialInvestment) * 100;
  const annualizedROI = (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;
  return { totalGain, roiPercent, annualizedROI };
}
