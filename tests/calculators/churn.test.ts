import { describe, it, expect } from "vitest";
import { calculateChurn } from "@/calculators/engine/churn";

describe("calculateChurn", () => {
  it("computes churn correctly", () => {
    const result = calculateChurn({ customersStart: 1000, customersEnd: 950, lostCustomers: 50 });
    expect(result.monthlyChurnPct).toBe(5);
    expect(result.retainedCustomers).toBe(950);
  });

  it("throws for invalid inputs", () => {
    expect(() => calculateChurn({ customersStart: 0, customersEnd: 0, lostCustomers: 0 })).toThrow();
    expect(() => calculateChurn({ customersStart: 100, customersEnd: 90, lostCustomers: 200 })).toThrow();
  });

  it("handles zero churn", () => {
    const result = calculateChurn({ customersStart: 1000, customersEnd: 1000, lostCustomers: 0 });
    expect(result.monthlyChurnPct).toBe(0);
    expect(result.annualChurnPct).toBe(0);
  });
});
