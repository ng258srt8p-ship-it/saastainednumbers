import { describe, it, expect } from "vitest";
import { calculateRentVsBuy } from "@/calculators/engine/rent-vs-buy";
describe("calculateRentVsBuy", () => {
  it("shows buying is better with low home price and high rent", () => {
    const r = calculateRentVsBuy({ homePrice: 200000, downPayment: 40000, interestRate: 5, loanTermYears: 30, propertyTaxRate: 1, homeInsuranceMonthly: 100, maintenanceRate: 1, hoaMonthly: 100, monthlyRent: 2500, rentInsuranceMonthly: 15, yearsPlanned: 10, investmentReturn: 7, closingCostPercent: 3, sellingCostPercent: 6 });
    expect(r.buyBetter).toBe(true);
    expect(r.buyAdvantage).toBeGreaterThan(0);
    expect(r.netEquity).toBeGreaterThan(0);
    expect(r.monthlyBuyPayment).toBeGreaterThan(0);
  });
  it("shows renting is better with high home price and low rent", () => {
    const r = calculateRentVsBuy({ homePrice: 800000, downPayment: 160000, interestRate: 7, loanTermYears: 30, propertyTaxRate: 1.5, homeInsuranceMonthly: 200, maintenanceRate: 2, hoaMonthly: 400, monthlyRent: 2000, rentInsuranceMonthly: 15, yearsPlanned: 5, investmentReturn: 8, closingCostPercent: 3, sellingCostPercent: 6 });
    expect(r.buyBetter).toBe(false);
    expect(r.buyAdvantage).toBeLessThan(0);
  });
  it("throws for negative values", () => {
    expect(() => calculateRentVsBuy({ homePrice: -1, downPayment: 40000, interestRate: 5, loanTermYears: 30, propertyTaxRate: 1, homeInsuranceMonthly: 100, maintenanceRate: 1, hoaMonthly: 100, monthlyRent: 2000, rentInsuranceMonthly: 15, yearsPlanned: 7, investmentReturn: 7, closingCostPercent: 3, sellingCostPercent: 6 })).toThrow();
  });
});
