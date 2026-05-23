export interface ARPUParams {
  mrr: number;
  totalCustomers: number;
}

export interface ARPUResult {
  arpu: number;
}

export function calculateARPU(params: ARPUParams): ARPUResult {
  const { mrr, totalCustomers } = params;
  if (mrr < 0 || totalCustomers <= 0) {
    throw new Error("MRR must be >= 0 and total customers must be > 0");
  }
  const arpu = mrr / totalCustomers;
  return { arpu };
}
