import { describe, it, expect } from "vitest";
import { calculateTAMSAMSOM } from "@/calculators/engine/tam-sam-som";

describe("calculateTAMSAMSOM", () => {
  it("calculates TAM SAM SOM correctly for normal case", () => {
    const result = calculateTAMSAMSOM({
      totalAddressableMarket: 100000000,
      serviceableAddressableMarket: 30000000,
      serviceableObtainableMarket: 5000000,
      marketGrowthRate: 10,
      years: 5,
    });
    expect(result.tam).toBe(100000000);
    expect(result.sam).toBe(30000000);
    expect(result.som).toBe(5000000);
    expect(result.tamShare).toBeCloseTo(30, 1);
    expect(result.samShare).toBeCloseTo(16.67, 1);
    expect(result.growthRate).toBe(10);
    expect(result.projectedTAM).toBeCloseTo(161051000, 0);
  });

  it("handles single year projection", () => {
    const result = calculateTAMSAMSOM({
      totalAddressableMarket: 50000000,
      serviceableAddressableMarket: 10000000,
      serviceableObtainableMarket: 2000000,
      marketGrowthRate: 15,
      years: 1,
    });
    expect(result.projectedTAM).toBe(57500000);
    expect(result.tamShare).toBeCloseTo(20, 1);
    expect(result.samShare).toBeCloseTo(20, 1);
  });

  it("handles zero SAM and SOM", () => {
    const result = calculateTAMSAMSOM({
      totalAddressableMarket: 1000000,
      serviceableAddressableMarket: 0,
      serviceableObtainableMarket: 0,
      marketGrowthRate: 0,
      years: 1,
    });
    expect(result.sam).toBe(0);
    expect(result.som).toBe(0);
    expect(result.tamShare).toBe(0);
    expect(result.samShare).toBe(0);
  });

  it("throws for negative years", () => {
    expect(() => calculateTAMSAMSOM({
      totalAddressableMarket: 1000000,
      serviceableAddressableMarket: 500000,
      serviceableObtainableMarket: 100000,
      marketGrowthRate: 10,
      years: 0,
    })).toThrow();
  });

  it("throws when SAM exceeds TAM", () => {
    expect(() => calculateTAMSAMSOM({
      totalAddressableMarket: 1000000,
      serviceableAddressableMarket: 2000000,
      serviceableObtainableMarket: 500000,
      marketGrowthRate: 10,
      years: 5,
    })).toThrow("SAM cannot exceed TAM");
  });

  it("throws when SOM exceeds SAM", () => {
    expect(() => calculateTAMSAMSOM({
      totalAddressableMarket: 1000000,
      serviceableAddressableMarket: 500000,
      serviceableObtainableMarket: 600000,
      marketGrowthRate: 10,
      years: 5,
    })).toThrow("SOM cannot exceed SAM");
  });
});
