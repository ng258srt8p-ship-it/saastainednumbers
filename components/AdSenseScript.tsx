"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export function AdSenseScript() {
  const pathname = usePathname();
  if (pathname.startsWith("/embed")) return null;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID ?? "0000000000000000"}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
