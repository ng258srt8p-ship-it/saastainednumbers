export interface MagicNumberParams {
  newArr: number;
  salesMarketingSpend: number;
}

export interface MagicNumberResult {
  magicNumber: number;
}

export function calculateMagicNumber(params: MagicNumberParams): MagicNumberResult {
  const { newArr, salesMarketingSpend } = params;
  if (salesMarketingSpend <= 0) {
    throw new Error("Sales and marketing spend must be positive");
  }
  if (newArr < 0) {
    throw new Error("New ARR must be non-negative");
  }
  const magicNumber = newArr / salesMarketingSpend;
  return { magicNumber };
}
