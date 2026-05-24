import { describe, it, expect } from "vitest";
import { calculateCAC } from "@/calculators/engine/cac";

describe("calculateCAC", () => {
  it("computes CAC correctly", () => {
    const result = calculateCAC({ salesCost: 10000, marketingCost: 5000, newCustomers: 50 });
    expect(result.cac).toBe(300);
  });

  it("throws for zero new customers", () => {
    expect(() => calculateCAC({ salesCost: 1000, marketingCost: 500, newCustomers: 0 })).toThrow();
  });

  it("throws for negative costs", () => {
    expect(() => calculateCAC({ salesCost: -100, marketingCost: 0, newCustomers: 10 })).toThrow();
  });
});
