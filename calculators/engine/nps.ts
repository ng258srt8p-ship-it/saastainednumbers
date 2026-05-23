export interface NetPromoterScoreParams {
  promoters: number;
  passives: number;
  detractors: number;
}

export interface NetPromoterScoreResult {
  nps: number;
  totalResponses: number;
  promoterPct: number;
  detractorPct: number;
}

export function calculateNetPromoterScore(params: NetPromoterScoreParams): NetPromoterScoreResult {
  const { promoters, passives, detractors } = params;
  if (promoters < 0 || passives < 0 || detractors < 0) {
    throw new Error("All values must be non-negative");
  }
  const totalResponses = promoters + passives + detractors;
  if (totalResponses === 0) {
    throw new Error("At least one response required");
  }
  const promoterPct = (promoters / totalResponses) * 100;
  const detractorPct = (detractors / totalResponses) * 100;
  const nps = promoterPct - detractorPct;
  return { nps, totalResponses, promoterPct, detractorPct };
}
