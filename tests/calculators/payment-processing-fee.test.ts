import { describe, it, expect } from "vitest";
import { calculatePaymentProcessingFee } from "@/calculators/engine/payment-processing-fee";

describe("calculatePaymentProcessingFee", () => {
  it("calculates Stripe-like scenario correctly", () => {
    const result = calculatePaymentProcessingFee({
      monthlyRevenue: 50000,
      averageTransactionSize: 75,
      processorFeePercent: 2.9,
      processorFixedFee: 0.30,
      chargebackRate: 0.5,
      chargebackFee: 15,
    });
    expect(result.monthlyTransactionFees).toBeCloseTo(1650, 0);
    expect(result.monthlyChargebackFees).toBeCloseTo(50, 0);
    expect(result.totalMonthlyFees).toBeCloseTo(1700, 0);
    expect(result.effectiveRate).toBeCloseTo(3.4, 1);
    expect(result.annualFees).toBeCloseTo(20400, 0);
  });

  it("calculates flat fee scenario (no percentage)", () => {
    const result = calculatePaymentProcessingFee({
      monthlyRevenue: 10000,
      averageTransactionSize: 50,
      processorFeePercent: 0,
      processorFixedFee: 0.50,
      chargebackRate: 0,
      chargebackFee: 0,
    });
    expect(result.monthlyTransactionFees).toBe(100);
    expect(result.monthlyChargebackFees).toBe(0);
    expect(result.totalMonthlyFees).toBe(100);
    expect(result.effectiveRate).toBe(1);
  });

  it("calculates high chargeback scenario", () => {
    const result = calculatePaymentProcessingFee({
      monthlyRevenue: 10000,
      averageTransactionSize: 50,
      processorFeePercent: 2.9,
      processorFixedFee: 0.30,
      chargebackRate: 5,
      chargebackFee: 25,
    });
    expect(result.monthlyChargebackFees).toBe(250);
    expect(result.totalMonthlyFees).toBeGreaterThan(result.monthlyTransactionFees);
  });

  it("throws for invalid inputs", () => {
    expect(() => calculatePaymentProcessingFee({
      monthlyRevenue: 0,
      averageTransactionSize: 75,
      processorFeePercent: 2.9,
      processorFixedFee: 0.30,
      chargebackRate: 0.5,
      chargebackFee: 15,
    })).toThrow();
  });
});
