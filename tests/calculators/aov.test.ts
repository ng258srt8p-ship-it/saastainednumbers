import { describe, it, expect } from "vitest";
import { calculateAOV } from "@/calculators/engine/aov";

describe("calculateAOV", () => {
  it("calculates AOV correctly for normal case", () => {
    const result = calculateAOV({ totalRevenue: 50000, numberOfOrders: 1250 });
    expect(result.aov).toBe(40);
    expect(result.totalRevenue).toBe(50000);
    expect(result.numberOfOrders).toBe(1250);
  });

  it("handles single order", () => {
    const result = calculateAOV({ totalRevenue: 299.99, numberOfOrders: 1 });
    expect(result.aov).toBe(299.99);
  });

  it("handles large volume", () => {
    const result = calculateAOV({ totalRevenue: 1000000, numberOfOrders: 50000 });
    expect(result.aov).toBe(20);
  });

  it("throws for invalid inputs", () => {
    expect(() => calculateAOV({ totalRevenue: 1000, numberOfOrders: 0 })).toThrow();
    expect(() => calculateAOV({ totalRevenue: -100, numberOfOrders: 10 })).toThrow();
  });
});
