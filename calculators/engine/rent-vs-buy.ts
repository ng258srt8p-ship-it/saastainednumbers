export interface RentVsBuyParams { homePrice: number; downPayment: number; interestRate: number; loanTermYears: number; propertyTaxRate: number; homeInsuranceMonthly: number; maintenanceRate: number; hoaMonthly: number; monthlyRent: number; rentInsuranceMonthly: number; yearsPlanned: number; investmentReturn: number; closingCostPercent: number; sellingCostPercent: number; }
export interface RentVsBuyResult { totalRentCost: number; totalBuyCost: number; netEquity: number; buyAdvantage: number; buyBetter: boolean; monthlyBuyPayment: number; }
export function calculateRentVsBuy(p: RentVsBuyParams): RentVsBuyResult {
  if (p.homePrice < 0 || p.downPayment < 0 || p.interestRate < 0 || p.loanTermYears <= 0 || p.propertyTaxRate < 0 || p.homeInsuranceMonthly < 0 || p.maintenanceRate < 0 || p.hoaMonthly < 0 || p.monthlyRent < 0 || p.rentInsuranceMonthly < 0 || p.yearsPlanned < 0 || p.investmentReturn < 0 || p.closingCostPercent < 0 || p.sellingCostPercent < 0) throw new Error("Values must be positive");
  const loanAmount = p.homePrice - p.downPayment; const monthlyRate = p.interestRate / 100 / 12; const totalMonths = p.loanTermYears * 12;
  const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const monthlyTax = p.homePrice * (p.propertyTaxRate / 100) / 12;
  const monthlyMaint = p.homePrice * (p.maintenanceRate / 100) / 12;
  const monthlyBuy = monthlyPI + monthlyTax + p.homeInsuranceMonthly + monthlyMaint + p.hoaMonthly;
  const closingCosts = p.homePrice * (p.closingCostPercent / 100);
  const sellingCosts = p.homePrice * (p.sellingCostPercent / 100);
  const totalRent = (p.monthlyRent + p.rentInsuranceMonthly) * 12 * p.yearsPlanned;
  const totalBuyMonthly = monthlyBuy * 12 * p.yearsPlanned;
  const totalBuy = closingCosts + totalBuyMonthly + sellingCosts;
  const remainingBalance = loanAmount * (Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + monthlyRate, p.yearsPlanned * 12)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const equity = p.homePrice - remainingBalance - sellingCosts + (p.downPayment > 0 ? 0 : 0);
  const buyAdvantage = totalRent - (totalBuy - equity);
  return { totalRentCost: totalRent, totalBuyCost: totalBuy, netEquity: Math.max(0, equity), buyAdvantage, buyBetter: buyAdvantage > 0, monthlyBuyPayment: monthlyBuy };
}
