import { describe, it, expect } from "vitest";
import { calculateCloudInfrastructureCost } from "@/calculators/engine/cloud-infrastructure-cost";

describe("calculateCloudInfrastructureCost", () => {
  it("calculates standard setup costs correctly", () => {
    const result = calculateCloudInfrastructureCost({
      computeInstances: 3,
      costPerInstanceHour: 0.50,
      hoursPerMonth: 730,
      storageGB: 500,
      storageCostPerGB: 0.10,
      dataTransferGB: 1000,
      dataTransferCostPerGB: 0.09,
      managedServicesCost: 200,
    });
    expect(result.monthlyComputeCost).toBeCloseTo(1095, 0);
    expect(result.monthlyStorageCost).toBe(50);
    expect(result.monthlyDataTransferCost).toBe(90);
    expect(result.monthlyManagedServicesCost).toBe(200);
    expect(result.totalMonthlyCost).toBeCloseTo(1435, 0);
    expect(result.annualProjectedCost).toBeCloseTo(17220, 0);
  });

  it("handles zero usage", () => {
    const result = calculateCloudInfrastructureCost({
      computeInstances: 0,
      costPerInstanceHour: 0,
      hoursPerMonth: 0,
      storageGB: 0,
      storageCostPerGB: 0,
      dataTransferGB: 0,
      dataTransferCostPerGB: 0,
      managedServicesCost: 0,
    });
    expect(result.totalMonthlyCost).toBe(0);
    expect(result.annualProjectedCost).toBe(0);
  });

  it("handles enterprise scale", () => {
    const result = calculateCloudInfrastructureCost({
      computeInstances: 50,
      costPerInstanceHour: 1.20,
      hoursPerMonth: 730,
      storageGB: 50000,
      storageCostPerGB: 0.08,
      dataTransferGB: 100000,
      dataTransferCostPerGB: 0.05,
      managedServicesCost: 5000,
    });
    expect(result.monthlyComputeCost).toBeCloseTo(43800, 0);
    expect(result.monthlyStorageCost).toBe(4000);
    expect(result.monthlyDataTransferCost).toBe(5000);
    expect(result.monthlyManagedServicesCost).toBe(5000);
    expect(result.totalMonthlyCost).toBeCloseTo(57800, 0);
  });

  it("throws for negative values", () => {
    expect(() => calculateCloudInfrastructureCost({
      computeInstances: -1,
      costPerInstanceHour: 0.50,
      hoursPerMonth: 730,
      storageGB: 500,
      storageCostPerGB: 0.10,
      dataTransferGB: 1000,
      dataTransferCostPerGB: 0.09,
      managedServicesCost: 200,
    })).toThrow();
  });
});
