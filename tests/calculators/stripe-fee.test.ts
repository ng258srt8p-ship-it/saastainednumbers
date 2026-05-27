import { describe, it, expect } from "vitest";
import { calculateStripeFee } from "@/calculators/engine/stripe-fee";

describe("calculateStripeFee", () => {
  it("calculates standard fee correctly", () => {
    const result = calculateStripeFee({
      transactionAmount: 50,
      monthlyVolume: 10000,
      averageTransactionSize: 50,
      refundRate: 0,
    });
    expect(result.percentageFee).toBeCloseTo(1.45, 2);
    expect(result.perTransactionFee).toBeCloseTo(1.75, 2);
    expect(result.totalFee).toBeCloseTo(1.75, 2);
    expect(result.effectiveRate).toBeCloseTo(3.5, 1);
    expect(result.monthlyTotalFees).toBeCloseTo(350, 0);
    expect(result.annualTotalFees).toBeCloseTo(4200, 0);
  });

  it("applies enterprise rate for volume over $80K", () => {
    const result = calculateStripeFee({
      transactionAmount: 100,
      monthlyVolume: 100000,
      averageTransactionSize: 100,
      refundRate: 0,
    });
    expect(result.percentageFee).toBeCloseTo(2.70, 2);
    expect(result.perTransactionFee).toBeCloseTo(3.00, 2);
    expect(result.effectiveRate).toBeCloseTo(3.0, 1);
    expect(result.monthlyTotalFees).toBeCloseTo(3000, 0);
  });

  it("accounts for refund rate", () => {
    const result = calculateStripeFee({
      transactionAmount: 100,
      monthlyVolume: 10000,
      averageTransactionSize: 100,
      refundRate: 10,
    });
    const withoutRefund = calculateStripeFee({
      transactionAmount: 100,
      monthlyVolume: 10000,
      averageTransactionSize: 100,
      refundRate: 0,
    });
    expect(result.monthlyTotalFees).toBeCloseTo(withoutRefund.monthlyTotalFees * 1.1, 2);
  });

  it("throws for invalid inputs", () => {
    expect(() => calculateStripeFee({
      transactionAmount: 0,
      monthlyVolume: 10000,
      averageTransactionSize: 50,
      refundRate: 0,
    })).toThrow();
  });
});
