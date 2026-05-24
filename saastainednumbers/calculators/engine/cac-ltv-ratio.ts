export interface CACLTVRatioParams {
  ltv: number;
  cac: number;
}

export interface CACLTVRatioResult {
  ratio: number;
}

export function calculateCACLTVRatio(params: CACLTVRatioParams): CACLTVRatioResult {
  const { ltv, cac } = params;
  if (cac <= 0) {
    throw new Error("CAC must be positive");
  }
  if (ltv < 0) {
    throw new Error("LTV must be non-negative");
  }
  const ratio = ltv / cac;
  return { ratio };
}
