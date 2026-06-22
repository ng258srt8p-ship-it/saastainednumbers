"use client";

import { usePathname } from "next/navigation";
import { useCookieConsent } from "./CookieConsentContext";
import Script from "next/script";

export function AdScript() {
  const pathname = usePathname();
  const consent = useCookieConsent();

  if (pathname?.startsWith("/embed")) return null;
  if (consent !== "accepted") return null;
  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) return null;

  return (
    <Script
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
