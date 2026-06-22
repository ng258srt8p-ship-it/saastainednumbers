"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useCookieConsent, useSetCookieConsent } from "./CookieConsentContext";

export function CookieConsentBanner() {
  const consent = useCookieConsent();
  const setConsent = useSetCookieConsent();

  const handleAccept = useCallback(() => setConsent("accepted"), [setConsent]);
  const handleReject = useCallback(() => setConsent("rejected"), [setConsent]);

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-[60] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-2xl">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          We use cookies and similar technologies for analytics (Google Analytics) and advertising (Google AdSense). By clicking &ldquo;Accept,&rdquo; you consent to the use of cookies for these purposes. You can reject non-essential cookies to browse the site without analytics or ads.
          For more details, see our{" "}
          <Link href="/legal#cookies" className="underline text-brand-600 dark:text-brand-400 hover:text-brand-700">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline text-brand-600 dark:text-brand-400 hover:text-brand-700">
            Privacy Policy
          </Link>.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Reject Non-Essential
          </button>
        </div>
      </div>
    </div>
  );
}
