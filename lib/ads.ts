export type AdPlacement = "below-results" | "sticky-footer";

export const adsConfig = {
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_ID ?? "",
  enabled: !!process.env.NEXT_PUBLIC_ADSENSE_ID,
} as const;

export const noAdsPaths = ["/embed"];

export const AD_DIMENSIONS: Record<AdPlacement, { minHeight: number }> = {
  "below-results": { minHeight: 90 },
  "sticky-footer": { minHeight: 50 },
};
