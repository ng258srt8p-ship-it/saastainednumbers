export interface AIModelComparisonParams {
  claudeInputTokens: number; claudeOutputTokens: number; claudeCallsPerDay: number;
  gptInputTokens: number; gptOutputTokens: number; gptCallsPerDay: number;
  geminiInputTokens: number; geminiOutputTokens: number; geminiCallsPerDay: number;
}
export interface AIModelComparisonResult {
  claudeMonthlyCost: number; gptMonthlyCost: number; geminiMonthlyCost: number; cheapest: string; savingsVsAvg: number;
}
export function calculateAIModelComparison(p: AIModelComparisonParams): AIModelComparisonResult {
  if (p.claudeInputTokens < 0 || p.claudeOutputTokens < 0 || p.claudeCallsPerDay < 0 || p.gptInputTokens < 0 || p.gptOutputTokens < 0 || p.gptCallsPerDay < 0 || p.geminiInputTokens < 0 || p.geminiOutputTokens < 0 || p.geminiCallsPerDay < 0) throw new Error("Values must be positive");
  const c = (t: number, o: number, d: number, ip: number, op: number) => ((t/1e6)*ip + (o/1e6)*op) * d * 30;
  const claudeMonthly = c(p.claudeInputTokens, p.claudeOutputTokens, p.claudeCallsPerDay, 3, 15);
  const gptMonthly = c(p.gptInputTokens, p.gptOutputTokens, p.gptCallsPerDay, 2.5, 10);
  const geminiMonthly = c(p.geminiInputTokens, p.geminiOutputTokens, p.geminiCallsPerDay, 1.25, 5);
  const costs = [{ n: "Claude", v: claudeMonthly }, { n: "GPT", v: gptMonthly }, { n: "Gemini", v: geminiMonthly }];
  const cheapest = costs.reduce((a, b) => a.v < b.v ? a : b).n;
  const avg = (claudeMonthly + gptMonthly + geminiMonthly) / 3;
  const min = Math.min(claudeMonthly, gptMonthly, geminiMonthly);
  return { claudeMonthlyCost: claudeMonthly, gptMonthlyCost: gptMonthly, geminiMonthlyCost: geminiMonthly, cheapest, savingsVsAvg: avg - min };
}
