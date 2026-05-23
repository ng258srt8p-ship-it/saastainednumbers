export interface KillSwitchStatus {
  rpm: { current: number; threshold: number; triggered: boolean };
  traffic: { current: number; threshold: number; triggered: boolean };
  freemiumConversion: { current: number; threshold: number; triggered: boolean };
}

const THRESHOLDS = {
  RPM: { value: 3, minSessions: 10000, label: "RPM < $3 at 10K sessions" },
  TRAFFIC: { value: 500, month: 6, label: "Traffic < 500 sessions at month 6" },
  FREEMIUM_CONVERSION: { value: 0.5, minUsers: 500, label: "Freemium conversion < 0.5% at 500 users" },
} as const;

export function evaluateKillSwitches(
  rpm: number,
  monthlySessions: number,
  registeredUsers: number,
  conversionRate: number,
  monthsSinceLaunch: number
): KillSwitchStatus {
  const rpmTriggered = monthlySessions >= THRESHOLDS.RPM.minSessions && rpm < THRESHOLDS.RPM.value;
  const trafficTriggered = monthsSinceLaunch >= THRESHOLDS.TRAFFIC.month && monthlySessions < THRESHOLDS.TRAFFIC.value;
  const conversionTriggered =
    registeredUsers >= THRESHOLDS.FREEMIUM_CONVERSION.minUsers &&
    conversionRate < THRESHOLDS.FREEMIUM_CONVERSION.value;

  const triggered: string[] = [];
  if (rpmTriggered) triggered.push(THRESHOLDS.RPM.label);
  if (trafficTriggered) triggered.push(THRESHOLDS.TRAFFIC.label);
  if (conversionTriggered) triggered.push(THRESHOLDS.FREEMIUM_CONVERSION.label);

  if (triggered.length > 0) {
    console.warn("[KILL SWITCH] Thresholds breached:", triggered.join(", "));
  }

  return {
    rpm: { current: rpm, threshold: THRESHOLDS.RPM.value, triggered: rpmTriggered },
    traffic: { current: monthlySessions, threshold: THRESHOLDS.TRAFFIC.value, triggered: trafficTriggered },
    freemiumConversion: { current: conversionRate, threshold: THRESHOLDS.FREEMIUM_CONVERSION.value, triggered: conversionTriggered },
  };
}
