export interface CloudInfrastructureCostInputs {
  computeInstances: number;
  costPerInstanceHour: number;
  hoursPerMonth: number;
  storageGB: number;
  storageCostPerGB: number;
  dataTransferGB: number;
  dataTransferCostPerGB: number;
  managedServicesCost: number;
}

export interface CloudInfrastructureCostResult {
  monthlyComputeCost: number;
  monthlyStorageCost: number;
  monthlyDataTransferCost: number;
  monthlyManagedServicesCost: number;
  totalMonthlyCost: number;
  annualProjectedCost: number;
}

export function calculateCloudInfrastructureCost(inputs: CloudInfrastructureCostInputs): CloudInfrastructureCostResult {
  const { computeInstances, costPerInstanceHour, hoursPerMonth, storageGB, storageCostPerGB, dataTransferGB, dataTransferCostPerGB, managedServicesCost } = inputs;
  if (computeInstances < 0) throw new Error("Compute instances must be non-negative");
  if (costPerInstanceHour < 0) throw new Error("Cost per instance hour must be non-negative");
  if (hoursPerMonth < 0) throw new Error("Hours per month must be non-negative");
  if (storageGB < 0) throw new Error("Storage GB must be non-negative");
  if (storageCostPerGB < 0) throw new Error("Storage cost per GB must be non-negative");
  if (dataTransferGB < 0) throw new Error("Data transfer GB must be non-negative");
  if (dataTransferCostPerGB < 0) throw new Error("Data transfer cost per GB must be non-negative");
  if (managedServicesCost < 0) throw new Error("Managed services cost must be non-negative");
  const monthlyComputeCost = parseFloat((computeInstances * costPerInstanceHour * hoursPerMonth).toFixed(2));
  const monthlyStorageCost = parseFloat((storageGB * storageCostPerGB).toFixed(2));
  const monthlyDataTransferCost = parseFloat((dataTransferGB * dataTransferCostPerGB).toFixed(2));
  const monthlyManagedServicesCost = managedServicesCost;
  const totalMonthlyCost = parseFloat((monthlyComputeCost + monthlyStorageCost + monthlyDataTransferCost + monthlyManagedServicesCost).toFixed(2));
  const annualProjectedCost = parseFloat((totalMonthlyCost * 12).toFixed(2));
  return { monthlyComputeCost, monthlyStorageCost, monthlyDataTransferCost, monthlyManagedServicesCost, totalMonthlyCost, annualProjectedCost };
}
