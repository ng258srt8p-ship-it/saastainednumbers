export interface CohortAnalysisParams { initialCohortSize: number; retentionRates: number[]; months: number; }
export interface CohortAnalysisResult { retainedUsers: number[]; retentionPercentages: number[]; averageRetention: number; }
export function calculateCohortAnalysis(p: CohortAnalysisParams): CohortAnalysisResult {
  if (p.initialCohortSize <= 0 || p.retentionRates.some(r => r < 0 || r > 100) || p.months < 0) throw new Error("Invalid inputs");
  if (p.retentionRates.length < p.months) throw new Error("Not enough retention rate data");
  const retained: number[] = []; const pcts: number[] = []; let current = p.initialCohortSize;
  for (let i = 0; i < p.months; i++) {
    const rate = p.retentionRates[i] / 100;
    if (i > 0) current = retained[i - 1] * rate;
    else current = p.initialCohortSize * rate;
    retained.push(Math.round(current));
    pcts.push(p.retentionRates[i]);
  }
  const avg = pcts.reduce((a, b) => a + b, 0) / pcts.length;
  return { retainedUsers: retained, retentionPercentages: pcts, averageRetention: avg };
}
