import { describe, it, expect } from "vitest";
import { calculateGPUComputeCost } from "@/calculators/engine/gpu-compute-cost";

describe("calculateGPUComputeCost", () => {
  it("calculates on-demand cost correctly", () => {
    const result = calculateGPUComputeCost({
      gpuCostPerHour: 3.06,
      gpuHoursPerDay: 8,
      daysPerMonth: 30,
      numberOfGPUs: 1,
      spotDiscount: 0,
    });
    expect(result.monthlyOnDemandCost).toBeCloseTo(734.40, 1);
    expect(result.monthlySpotCost).toBe(734.40);
    expect(result.monthlySavings).toBe(0);
    expect(result.annualCost).toBeCloseTo(8812.80, 1);
    expect(result.effectiveHourlyRate).toBe(3.06);
  });

  it("applies spot discount correctly", () => {
    const result = calculateGPUComputeCost({
      gpuCostPerHour: 3.06,
      gpuHoursPerDay: 8,
      daysPerMonth: 30,
      numberOfGPUs: 1,
      spotDiscount: 60,
    });
    expect(result.monthlyOnDemandCost).toBeCloseTo(734.40, 1);
    expect(result.monthlySpotCost).toBeCloseTo(293.76, 1);
    expect(result.monthlySavings).toBeCloseTo(440.64, 1);
  });

  it("models 24/7 operation", () => {
    const result = calculateGPUComputeCost({
      gpuCostPerHour: 2.00,
      gpuHoursPerDay: 24,
      daysPerMonth: 31,
      numberOfGPUs: 4,
      spotDiscount: 50,
    });
    expect(result.monthlyOnDemandCost).toBeCloseTo(5952, 0);
    expect(result.monthlySpotCost).toBeCloseTo(2976, 0);
    expect(result.effectiveHourlyRate).toBe(2.00);
  });

  it("throws for invalid inputs", () => {
    expect(() => calculateGPUComputeCost({
      gpuCostPerHour: 0,
      gpuHoursPerDay: 8,
      daysPerMonth: 30,
      numberOfGPUs: 1,
      spotDiscount: 0,
    })).toThrow();
  });
});
