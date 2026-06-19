import { getTranslations } from "@/lib/getTranslations";
import type { Locale } from "@/lib/useLocale";
import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { CurrencySwitcher } from "./CurrencySwitcher";

export async function Nav() {
  const { t, locale } = await getTranslations();
  const links = {
    pricing: t("nav.pricing"),
    blog: t("nav.blog"),
    calculators: t("nav.calculators"),
    canvas: "Canvas",
  };

  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-full px-4 pointer-events-none">
      <nav className="pointer-events-auto mx-auto flex max-w-[880px] items-center justify-between px-4 h-12 rounded-full backdrop-blur-[48px] bg-[rgba(237,237,237,0.88)] dark:bg-[rgba(30,30,30,0.88)] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-black/[0.04] dark:border-white/[0.06]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className="w-7 h-7" aria-hidden>
            <polygon points="20,70 60,70 40,40" fill="#008387" stroke="#008387" strokeWidth="5" strokeLinejoin="round" className="dark:fill-teal-400 dark:stroke-teal-400"/>
            <polygon points="26,32 54,32 40,10" fill="#143562" stroke="#143562" strokeWidth="5" strokeLinejoin="round" className="dark:fill-blue-400 dark:stroke-blue-400"/>
          </svg>
          <span className="hidden sm:inline font-heading text-base font-bold bg-gradient-to-r from-brand-500 to-brand-900 dark:from-teal-400 dark:to-blue-300 bg-clip-text text-transparent tracking-tight">
            SaaStainedNumbers
          </span>
        </Link>

        {/* Trailing: links + actions */}
        <div className="flex items-center gap-0.5">
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            <Link
              href="/calculators"
              className="px-3 py-1.5 text-sm font-semibold tracking-[0.2px] text-[rgb(20,20,20)] dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              {links.calculators}
            </Link>
            <Link
              href="/pricing"
              className="px-3 py-1.5 text-sm font-semibold tracking-[0.2px] text-[rgb(20,20,20)] dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              {links.pricing}
            </Link>
            <Link
              href="/blog"
              className="px-3 py-1.5 text-sm font-semibold tracking-[0.2px] text-[rgb(20,20,20)] dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              {links.blog}
            </Link>
            <Link
              href="/canvas"
              data-testid="canvas-nav-link"
              className="px-3 py-1.5 text-sm font-semibold tracking-[0.2px] text-brand-600 dark:text-brand-400 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              {links.canvas}
            </Link>
          </div>

          {/* Action buttons */}
          <div className="flex items-center">
            <CurrencySwitcher />
            <LocaleSwitcher locale={locale as Locale} />
            <ThemeToggle />
            <MobileNav t={links} locale={locale as Locale} />
          </div>
        </div>
      </nav>
    </header>
  );
}
