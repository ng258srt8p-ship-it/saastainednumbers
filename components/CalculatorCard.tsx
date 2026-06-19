import Link from "next/link";

interface CalculatorCardProps {
  calc: {
    slug: string;
    category: string;
    isNew?: boolean;
    meta: {
      title: string;
      description: string;
    };
  };
  categoryLabel?: string;
  newLabel?: string;
}

/** Mobbin-style calculator card with thumbnail area, bold title, category tag, and hover elevation. */
export function CalculatorCard({ calc, categoryLabel, newLabel }: CalculatorCardProps) {
  return (
    <Link
      href={`/${calc.category}/${calc.slug}`}
      className="group block rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,131,135,0.12)] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
    >
      {/* Thumbnail / Icon area */}
      <div className="h-32 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950/50 dark:to-brand-900/20 flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center">
          <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          {categoryLabel && (
            <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-400">
              {categoryLabel}
            </span>
          )}
          {calc.isNew && newLabel && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300 shrink-0">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {newLabel}
            </span>
          )}
        </div>
        <h3 className="font-heading text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight">
          {calc.meta.title}
        </h3>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {calc.meta.description}
        </p>
      </div>
    </Link>
  );
}
