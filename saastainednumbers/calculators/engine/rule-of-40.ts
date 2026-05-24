export interface RuleOf40Params {
  revenueGrowthRate: number;
  profitMargin: number;
}

export interface RuleOf40Result {
  ruleOf40Score: number;
  meetsThreshold: boolean;
}

export function calculateRuleOf40(params: RuleOf40Params): RuleOf40Result {
  const { revenueGrowthRate, profitMargin } = params;
  if (revenueGrowthRate < -100 || profitMargin < -100) {
    throw new Error("Rates must be realistic (above -100%)");
  }
  const ruleOf40Score = revenueGrowthRate + profitMargin;
  return { ruleOf40Score, meetsThreshold: ruleOf40Score >= 40 };
}
