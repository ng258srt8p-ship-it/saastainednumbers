"use client";

import Link from "next/link";

export function AffiliateDisclosure() {
  return (
    <div className="rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
      <span className="font-semibold">Affiliate Disclosure:</span>{" "}
      Some links on this page are affiliate links. We may earn a commission if you click through and make a purchase, at no extra cost to you. This does not influence our calculator results or editorial content. For more details, see our{" "}
      <Link href="/advertisers" className="underline hover:text-amber-900 dark:hover:text-amber-200">
        Advertisers &amp; Affiliates page
      </Link>.
    </div>
  );
}
