export interface ACVParams {
  totalContractValue: number;
  contractDurationYears: number;
}

export interface ACVResult {
  acv: number;
  tcv: number;
}

export function calculateACV(params: ACVParams): ACVResult {
  const { totalContractValue, contractDurationYears } = params;
  if (contractDurationYears <= 0) {
    throw new Error("Contract duration must be positive");
  }
  if (totalContractValue < 0) {
    throw new Error("Contract value must be non-negative");
  }
  const acv = totalContractValue / contractDurationYears;
  return { acv, tcv: totalContractValue };
}
