export interface Retire401kParams { currentBalance: number; annualContribution: number; employerMatchPercent: number; employerMatchCap: number; annualReturn: number; currentAge: number; retirementAge: number; }
export interface Retire401kResult { balanceAtRetirement: number; totalContributions: number; totalEmployerMatch: number; totalEarnings: number; annualIncomeAtRetirement: number; }
export function calculateRetire401k(p: Retire401kParams): Retire401kResult {
  if (p.currentBalance < 0 || p.annualContribution < 0 || p.employerMatchPercent < 0 || p.employerMatchCap < 0 || p.annualReturn < 0 || p.currentAge < 0 || p.retirementAge < 0) throw new Error("Values must be positive");
  if (p.retirementAge <= p.currentAge) throw new Error("Retirement age must exceed current age");
  const match = Math.min(p.annualContribution * (p.employerMatchPercent / 100), p.employerMatchCap);
  const totalAnnual = p.annualContribution + match;
  const years = p.retirementAge - p.currentAge;
  const monthlyRate = p.annualReturn / 100 / 12; const months = years * 12;
  let balance = p.currentBalance;
  for (let i = 0; i < months; i++) { balance = balance * (1 + monthlyRate) + totalAnnual / 12; }
  const totalContrib = p.currentBalance + p.annualContribution * years;
  const totalMatch = match * years;
  const totalEarnings = balance - totalContrib - totalMatch;
  const annualIncome = balance * 0.04;
  return { balanceAtRetirement: balance, totalContributions: totalContrib, totalEmployerMatch: totalMatch, totalEarnings, annualIncomeAtRetirement: annualIncome };
}
