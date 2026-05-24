"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { adsConfig, noAdsPaths } from "@/lib/ads";

export function AdScripts() {
  const pathname = usePathname();

  if (!pathname || noAdsPaths.some((p) => pathname.startsWith(p))) {
    return null;
  }

  if (!adsConfig.enabled) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${adsConfig.publisherId}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}
