export interface MRRParams {
  customers: number;
  arpu: number;
}

export interface MRRResult {
  mrr: number;
  arr: number;
}

export function calculateMRR(params: MRRParams): MRRResult {
  const { customers, arpu } = params;
  if (customers < 0 || arpu < 0) {
    throw new Error("Values must be positive");
  }
  const mrr = customers * arpu;
  const arr = mrr * 12;
  return { mrr, arr };
}
