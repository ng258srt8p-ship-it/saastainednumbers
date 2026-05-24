export interface ActivationRateParams {
  signups: number;
  activated: number;
}

export interface ActivationRateResult {
  activationRate: number;
  notActivated: number;
}

export function calculateActivationRate(params: ActivationRateParams): ActivationRateResult {
  const { signups, activated } = params;
  if (signups < 0 || activated < 0) throw new Error("Values must be non-negative");
  if (activated > signups) throw new Error("Activated cannot exceed signups");
  const activationRate = signups > 0 ? (activated / signups) * 100 : 0;
  const notActivated = signups - activated;
  return { activationRate, notActivated };
}
