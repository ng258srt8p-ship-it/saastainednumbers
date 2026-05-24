"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { AdPlacement } from "@/lib/ads";
import { adsConfig, noAdsPaths, AD_DIMENSIONS } from "@/lib/ads";

interface AdSlotProps {
  placement: AdPlacement;
  slug?: string;
}

export function AdSlot({ placement, slug }: AdSlotProps) {
  const pathname = usePathname();
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const [dismissed, setDismissed] = useState(() => {
    if (placement === "sticky-footer" && slug && typeof window !== "undefined") {
      try {
        return localStorage.getItem(`ad-dismissed-${slug}`) === "true";
      } catch { /* */ }
    }
    return false;
  });

  useEffect(() => {
    if (insRef.current && !pushedRef.current) {
      try {
        const w = window as unknown as { adsbygoogle?: unknown[] };
        if (Array.isArray(w.adsbygoogle)) {
          w.adsbygoogle.push({});
        }
        pushedRef.current = true;
      } catch { /* */ }
    }
  }, []);

  if (!pathname || noAdsPaths.some((p) => pathname.startsWith(p))) return null;
  if (!adsConfig.enabled || dismissed) return null;

  const dims = AD_DIMENSIONS[placement];
  const isSticky = placement === "sticky-footer";

  const handleDismiss = () => {
    setDismissed(true);
    if (slug) {
      try { localStorage.setItem(`ad-dismissed-${slug}`, "true"); } catch { /* */ }
    }
  };

  return (
    <div
      className={
        isSticky
          ? "fixed bottom-0 left-0 right-0 z-50 border-t border-gray-700 bg-gray-900/95 backdrop-blur md:static md:z-auto md:border-0 md:bg-transparent"
          : "rounded-xl border border-gray-700 bg-gray-800/30 p-3"
      }
      style={{ minHeight: dims.minHeight }}
      role="complementary"
      aria-label="Advertisement"
    >
      {!isSticky && (
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 mb-1">
          Sponsored
        </p>
      )}
      <div className="relative">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={`ca-pub-${adsConfig.publisherId}`}
          data-ad-slot={placement}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        {isSticky && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close ad"
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700/80 text-gray-300 text-xs hover:bg-gray-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
