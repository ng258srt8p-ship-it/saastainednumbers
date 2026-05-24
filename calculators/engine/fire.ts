export interface FIREParams {
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  desiredMonthlyWithdrawal: number;
  currentAge: number;
  retirementAge: number;
}

export interface FIREResult {
  savingsAtRetirement: number;
  yearsToFI: number;
  fireNumber: number;
  ageAtFI: number;
  isCoastFI: boolean;
}

export function calculateFIRE(params: FIREParams): FIREResult {
  const { currentSavings, monthlyContribution, annualReturn, desiredMonthlyWithdrawal, currentAge, retirementAge } = params;
  if (currentSavings < 0 || monthlyContribution < 0 || annualReturn < 0 || desiredMonthlyWithdrawal < 0 || currentAge < 0 || retirementAge < 0) {
    throw new Error("Values must be positive");
  }
  if (retirementAge < currentAge) {
    throw new Error("Retirement age must be greater than current age");
  }
  const fireNumber = desiredMonthlyWithdrawal * 12 * 25;
  const monthlyRate = annualReturn / 100 / 12;
  const monthsToRetirement = (retirementAge - currentAge) * 12;
  let savingsAtRetirement = currentSavings;
  if (monthlyRate > 0) {
    savingsAtRetirement =
      currentSavings * Math.pow(1 + monthlyRate, monthsToRetirement) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);
  } else {
    savingsAtRetirement = currentSavings + monthlyContribution * monthsToRetirement;
  }
  let yearsToFI = 0;
  if (fireNumber > currentSavings && fireNumber > 0) {
    let tempSavings = currentSavings;
    const monthlyRateCalc = annualReturn / 100 / 12;
    let months = 0;
    if (monthlyRateCalc > 0) {
      while (tempSavings < fireNumber && months < 1200) {
        tempSavings = tempSavings * (1 + monthlyRateCalc) + monthlyContribution;
        months++;
      }
    } else {
      months = Math.ceil((fireNumber - currentSavings) / monthlyContribution);
    }
    yearsToFI = months / 12;
  }
  const ageAtFI = currentAge + yearsToFI;
  const isCoastFI = savingsAtRetirement >= fireNumber;
  return { savingsAtRetirement, yearsToFI, fireNumber, ageAtFI, isCoastFI };
}
