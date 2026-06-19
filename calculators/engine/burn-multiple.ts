export interface BurnMultipleParams {
  netBurn: number;
  netNewARR: number;
}

export interface BurnMultipleResult {
  burnMultiple: number;
  efficiencyRating: string;
}

/**
 * Calculates the Burn Multiple, a key efficiency metric for SaaS companies.
 * Formula: Net Burn / Net New ARR
 * 
 * A lower burn multiple indicates higher efficiency (spending less to generate each dollar of new ARR).
 */
export function calculateBurnMultiple(params: BurnMultipleParams): BurnMultipleResult {
  const { netBurn, netNewARR } = params;

  // Handle edge case: zero net new ARR to avoid division by zero.
  if (netNewARR <= 0) {
    return {
      burnMultiple: Infinity,
      efficiencyRating: netBurn > 0 ? "Inefficient (No Net New ARR)" : "N/A",
    };
  }

  const burnMultiple = netBurn / netNewARR;

  // Define efficiency ratings based on common SaaS benchmarks
  let efficiencyRating: string;
  if (burnMultiple < 1.0) {
    efficiencyRating = "Excellent";
  } else if (burnMultiple <= 1.5) {
    efficiencyRating = "Good";
  } else if (burnMultiple <= 2.5) {
    efficiencyRating = "Average";
  } else {
    efficiencyRating = "Needs Improvement";
  }

  return { burnMultiple, efficiencyRating };
}
