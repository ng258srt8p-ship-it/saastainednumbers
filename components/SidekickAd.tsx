import Link from "next/link";

const AFFILIATE_LINK = "https://shopify.pxf.io/2R5Dza";

export function SidekickAd() {
  return (
    <aside className="sticky top-24 w-full rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <img src="/shopify-glyph.png" alt="" className="h-6 w-auto" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60">Sponsored</span>
      </div>
      <p className="text-sm font-medium text-white mb-1">
        Start your online store
      </p>
      <p className="text-xs text-white/70 mb-4 leading-relaxed">
        Trusted by millions. Free trial — no credit card needed.
      </p>
      <Link
        href={AFFILIATE_LINK}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full rounded-lg bg-white/15 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-white/25"
      >
        Start Free Trial
      </Link>
    </aside>
  );
}
