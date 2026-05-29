import { getTranslations } from "@/lib/getTranslations";
import type { Locale } from "@/lib/useLocale";
import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";

export async function Nav() {
  const { t, locale } = await getTranslations();
  const links = {
    dashboard: t("nav.dashboard"),
    pricing: t("nav.pricing"),
    blog: t("nav.blog"),
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className="w-10 h-10 shrink-0" aria-hidden>
            <polygon points="20,70 60,70 40,40" fill="#008387" stroke="#008387" strokeWidth="5" strokeLinejoin="round" className="dark:fill-teal-400 dark:stroke-teal-400"/>
            <polygon points="26,32 54,32 40,10" fill="#143562" stroke="#143562" strokeWidth="5" strokeLinejoin="round" className="dark:fill-blue-400 dark:stroke-blue-400"/>
          </svg>
          <span className="font-heading text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-900 dark:from-teal-400 dark:to-blue-300 bg-clip-text text-transparent tracking-tight">
            SaaStainedNumbers
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <LocaleSwitcher locale={locale as Locale} />
          <ThemeToggle />
          <MobileNav t={links} />
        </div>
      </div>
    </nav>
  );
}
