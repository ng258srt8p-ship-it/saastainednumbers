export interface LeadConversionRateParams {
  leads: number;
  customers: number;
}

export interface LeadConversionRateResult {
  conversionRate: number;
  lostLeads: number;
}

export function calculateLeadConversionRate(params: LeadConversionRateParams): LeadConversionRateResult {
  const { leads, customers } = params;
  if (leads < 0 || customers < 0) throw new Error("Values must be non-negative");
  if (customers > leads) throw new Error("Customers cannot exceed leads");
  const conversionRate = leads > 0 ? (customers / leads) * 100 : 0;
  const lostLeads = leads - customers;
  return { conversionRate, lostLeads };
}
