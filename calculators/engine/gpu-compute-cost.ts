export interface GPUComputeCostInputs {
  gpuCostPerHour: number;
  gpuHoursPerDay: number;
  daysPerMonth: number;
  numberOfGPUs: number;
  spotDiscount: number;
}

export interface GPUComputeCostResult {
  monthlyOnDemandCost: number;
  monthlySpotCost: number;
  monthlySavings: number;
  annualCost: number;
  effectiveHourlyRate: number;
}

export function calculateGPUComputeCost(inputs: GPUComputeCostInputs): GPUComputeCostResult {
  const { gpuCostPerHour, gpuHoursPerDay, daysPerMonth, numberOfGPUs, spotDiscount } = inputs;
  if (gpuCostPerHour <= 0) throw new Error("GPU cost per hour must be positive");
  if (gpuHoursPerDay < 0 || gpuHoursPerDay > 24) throw new Error("GPU hours per day must be between 0 and 24");
  if (daysPerMonth < 0 || daysPerMonth > 31) throw new Error("Days per month must be between 0 and 31");
  if (numberOfGPUs <= 0) throw new Error("Number of GPUs must be positive");
  if (spotDiscount < 0 || spotDiscount > 100) throw new Error("Spot discount must be between 0 and 100");
  const monthlyOnDemandCost = parseFloat((gpuCostPerHour * gpuHoursPerDay * daysPerMonth * numberOfGPUs).toFixed(2));
  const monthlySpotCost = parseFloat((monthlyOnDemandCost * (1 - spotDiscount / 100)).toFixed(2));
  const monthlySavings = parseFloat((monthlyOnDemandCost - monthlySpotCost).toFixed(2));
  const annualCost = parseFloat((monthlyOnDemandCost * 12).toFixed(2));
  const totalHours = gpuHoursPerDay * daysPerMonth * numberOfGPUs;
  const effectiveHourlyRate = totalHours > 0 ? parseFloat((monthlyOnDemandCost / totalHours).toFixed(2)) : 0;
  return { monthlyOnDemandCost, monthlySpotCost, monthlySavings, annualCost, effectiveHourlyRate };
}
