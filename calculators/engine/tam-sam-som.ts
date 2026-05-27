export interface TAMSAMSOMInputs {
  totalAddressableMarket: number;
  serviceableAddressableMarket: number;
  serviceableObtainableMarket: number;
  marketGrowthRate: number;
  years: number;
}

export interface TAMSAMSOMResult {
  tam: number;
  sam: number;
  som: number;
  tamShare: number;
  samShare: number;
  growthRate: number;
  projectedTAM: number;
}

export function calculateTAMSAMSOM(inputs: TAMSAMSOMInputs): TAMSAMSOMResult {
  const { totalAddressableMarket, serviceableAddressableMarket, serviceableObtainableMarket, marketGrowthRate, years } = inputs;
  if (totalAddressableMarket <= 0) throw new Error("TAM must be positive");
  if (serviceableAddressableMarket < 0) throw new Error("SAM must be non-negative");
  if (serviceableObtainableMarket < 0) throw new Error("SOM must be non-negative");
  if (serviceableAddressableMarket > totalAddressableMarket) throw new Error("SAM cannot exceed TAM");
  if (serviceableObtainableMarket > serviceableAddressableMarket) throw new Error("SOM cannot exceed SAM");
  if (marketGrowthRate < -100) throw new Error("Growth rate cannot be below -100%");
  if (years <= 0) throw new Error("Years must be positive");
  const tam = totalAddressableMarket;
  const sam = serviceableAddressableMarket;
  const som = serviceableObtainableMarket;
  const tamShare = parseFloat(((sam / tam) * 100).toFixed(2));
  const samShare = sam > 0 ? parseFloat(((som / sam) * 100).toFixed(2)) : 0;
  const growthRate = marketGrowthRate;
  const projectedTAM = parseFloat((tam * Math.pow(1 + marketGrowthRate / 100, years)).toFixed(2));
  return { tam, sam, som, tamShare, samShare, growthRate, projectedTAM };
}
