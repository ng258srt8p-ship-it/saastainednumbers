import Link from "next/link";
import { getTranslations } from "@/lib/getTranslations";

export default async function NotFound() {
  const { t } = await getTranslations();
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-32">
      <div className="text-center max-w-md">
        {/* Illustration area */}
        <div className="mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/40 dark:to-brand-800/20 flex items-center justify-center mb-8">
          <svg className="w-12 h-12 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="font-heading text-7xl font-bold text-gray-200 dark:text-gray-700 font-numbers select-none">404</p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">{t("error.pageNotFound")}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{t("error.notFoundDescription")}</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/" className="mobbin-btn-primary">
            {t("error.goHome")}
          </Link>
          <Link href="/calculators" className="mobbin-btn-secondary">
            {t("nav.calculators") ?? "Browse Calculators"}
          </Link>
        </div>
      </div>
    </div>
  );
}
