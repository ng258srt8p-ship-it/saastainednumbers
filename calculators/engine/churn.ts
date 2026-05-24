export interface ChurnParams {
  customersStart: number;
  customersEnd: number;
  lostCustomers: number;
}

export interface ChurnResult {
  monthlyChurnPct: number;
  annualChurnPct: number;
  retainedCustomers: number;
}

export function calculateChurn(params: ChurnParams): ChurnResult {
  const { customersStart, customersEnd, lostCustomers } = params;
  if (customersStart <= 0 || customersEnd < 0 || lostCustomers < 0) {
    throw new Error("customersStart must be > 0, all values must be >= 0");
  }
  if (lostCustomers > customersStart) {
    throw new Error("Lost customers cannot exceed starting customers");
  }
  const monthlyChurnPct = (lostCustomers / customersStart) * 100;
  const annualChurnPct = (1 - Math.pow(1 - monthlyChurnPct / 100, 12)) * 100;
  const retainedCustomers = customersEnd;
  return { monthlyChurnPct, annualChurnPct, retainedCustomers };
}
