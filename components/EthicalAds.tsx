"use client";

import { useEffect } from "react";

interface EthicalAdsProps {
  placement?: string;
  className?: string;
}

const ETHICAL_ADS_ID = process.env.NEXT_PUBLIC_ETHICAL_ADS_ID;

export function EthicalAds({ placement = "calculator-in-content", className }: EthicalAdsProps) {
  useEffect(() => {
    if (!ETHICAL_ADS_ID) return;
    try {
      ((window as unknown as Record<string, unknown>).ethicalads as unknown[] ?? []).push({});
    } catch {
      /* EthicalAds not available */
    }
  }, []);

  if (!ETHICAL_ADS_ID) return null;

  return (
    <div
      className={className}
      data-ea-publisher={ETHICAL_ADS_ID}
      data-ea-type="text"
      data-ea-keywords="saas|calculators"
      data-ea-campaign-types="community|paid"
    />
  );
}
