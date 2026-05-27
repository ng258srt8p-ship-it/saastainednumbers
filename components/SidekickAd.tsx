import Link from "next/link";

const AFFILIATE_LINK = "https://shopify.pxf.io/2R5Dza";

export function SidekickAd() {
  return (
    <aside className="sticky top-24 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-card-bg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <svg viewBox="40 -25 75 95" className="h-6 w-6 text-brand-500" fill="currentColor">
          <path d="M106.639,3.898c0,18.415-11.618,36.61-29.375,36.61-5.773,0-8.879-1.973-8.879-1.973h-.329L63.891,60.896h-15.127L59.287,5.542c1.206-6.248,2.412-14.578,3.07-20.059h13.372l-.877,8.111h.219c0,0,5.794-8.988,16.003-8.988c11.071,0,15.565,9.098,15.565,19.292ZM90.855,5.432c0-4.055-1.425-8.33-6.028-8.33-5.261,0-10.194,6.248-11.948,15.674L70.358,26.917c0,0,2.32,2.191,6.248,2.191c8.44,0,14.249-13.92,14.249-23.676Z"/>
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
