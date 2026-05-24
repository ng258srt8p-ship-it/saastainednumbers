export interface ContributionMarginParams {
  revenue: number;
  variableCosts: number;
}

export interface ContributionMarginResult {
  contributionMargin: number;
  contributionMarginPct: number;
}

export function calculateContributionMargin(params: ContributionMarginParams): ContributionMarginResult {
  const { revenue, variableCosts } = params;
  if (revenue <= 0) {
    throw new Error("Revenue must be positive");
  }
  if (variableCosts < 0) {
    throw new Error("Variable costs must be non-negative");
  }
  const contributionMargin = revenue - variableCosts;
  const contributionMarginPct = (contributionMargin / revenue) * 100;
  return { contributionMargin, contributionMarginPct };
}
