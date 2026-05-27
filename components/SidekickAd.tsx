import Link from "next/link";

const AFFILIATE_LINK = "https://shopify.pxf.io/2R5Dza";

export function SidekickAd() {
  return (
    <aside className="sticky top-24 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-card-bg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-500" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Sponsored</span>
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
        Start your online store
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Trusted by millions. Free trial — no credit card needed.
      </p>
      <Link
        href={AFFILIATE_LINK}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
      >
        Start Free Trial
      </Link>
    </aside>
  );
}
