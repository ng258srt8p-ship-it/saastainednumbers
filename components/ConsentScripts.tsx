"use client";

import Script from "next/script";
import { useCookieConsent } from "./CookieConsentContext";

/** Loads Google Analytics, AdSense, and Skimlinks only after consent is granted. */
export function ConsentScripts() {
  const consent = useCookieConsent();

  if (consent !== "accepted") return null;

  return (
    <>
      {/* Google Analytics */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-BHDH2PETBK" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-BHDH2PETBK');`}
      </Script>

      {/* Google AdSense */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />

      {/* Skimlinks affiliate */}
      <Script src="https://s.skimresources.com/js/303938X1792076.skimlinks.js" strategy="afterInteractive" />
    </>
  );
}
