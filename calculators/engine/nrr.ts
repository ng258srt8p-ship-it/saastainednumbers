export interface NRRParams {
  startMrr: number;
  expansionMrr: number;
  churnedMrr: number;
  contractionMrr: number;
}

export interface NRRResult {
  nrr: number;
  netRetentionRate: number;
  grossRetentionRate: number;
}

export function calculateNRR(params: NRRParams): NRRResult {
  const { startMrr, expansionMrr, churnedMrr, contractionMrr } = params;
  if (startMrr <= 0) {
    throw new Error("Starting MRR must be positive");
  }
  if (expansionMrr < 0 || churnedMrr < 0 || contractionMrr < 0) {
    throw new Error("Values must be non-negative");
  }
  const endMrr = startMrr + expansionMrr - churnedMrr - contractionMrr;
  const nrr = (endMrr / startMrr) * 100;
  const grossRetentionRate = ((startMrr - churnedMrr - contractionMrr) / startMrr) * 100;
  return { nrr, netRetentionRate: nrr, grossRetentionRate };
}
