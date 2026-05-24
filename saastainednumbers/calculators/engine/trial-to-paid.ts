export interface TrialToPaidParams {
  trialSignups: number;
  paidConversions: number;
}

export interface TrialToPaidResult {
  conversionRate: number;
  notConverted: number;
}

export function calculateTrialToPaid(params: TrialToPaidParams): TrialToPaidResult {
  const { trialSignups, paidConversions } = params;
  if (trialSignups < 0 || paidConversions < 0) throw new Error("Values must be non-negative");
  if (paidConversions > trialSignups) throw new Error("Conversions cannot exceed trial signups");
  const conversionRate = trialSignups > 0 ? (paidConversions / trialSignups) * 100 : 0;
  const notConverted = trialSignups - paidConversions;
  return { conversionRate, notConverted };
}
