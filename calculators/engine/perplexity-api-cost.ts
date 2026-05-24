export interface PerplexityAPICostParams { inputTokens: number; outputTokens: number; callsPerDay: number; inputPricePerMillion: number; outputPricePerMillion: number; }
export interface PerplexityAPICostResult { costPerCall: number; costPerDay: number; costPerMonth: number; costPerYear: number; }
export function calculatePerplexityAPICost(p: PerplexityAPICostParams): PerplexityAPICostResult {
  if (p.inputTokens < 0 || p.outputTokens < 0 || p.callsPerDay < 0 || p.inputPricePerMillion < 0 || p.outputPricePerMillion < 0) throw new Error("Values must be positive");
  const c = (p.inputTokens/1e6)*p.inputPricePerMillion + (p.outputTokens/1e6)*p.outputPricePerMillion;
  return { costPerCall: c, costPerDay: c*p.callsPerDay, costPerMonth: c*p.callsPerDay*30, costPerYear: c*p.callsPerDay*365 };
}
