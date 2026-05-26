"use client";

import { useEffect, useRef } from "react";

interface AdSenseProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  style?: React.CSSProperties;
}

const PUBLISHER_ID = `ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID ?? "0000000000000000"}`;

export function AdSense({ slot, format = "auto", className, style }: AdSenseProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      ((window as unknown as Record<string, unknown>).adsbygoogle as unknown[]).push({});
    } catch {
      /* AdSense not available */
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
