"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { CurrencySwitcher } from "./CurrencySwitcher";
import type { Locale } from "@/lib/useLocale";

interface NavLinks {
  pricing?: string;
  blog?: string;
  calculators?: string;
  canvas?: string;
}

export function Nav({ t, locale }: { t: NavLinks; locale: Locale }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const navLinks = [
    { label: t.calculators ?? "Calculators", href: "/calculators" },
    { label: t.canvas ?? "Canvas", href: "/canvas" },
    { label: t.pricing ?? "Pricing", href: "/pricing" },
    { label: t.blog ?? "Blog", href: "/blog" },
  ];

  return (
    <header className="fixed top-0 left-1/2 z-50 -translate-x-1/2 w-full px-4 pt-4 pointer-events-none bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <nav
        className={`pointer-events-auto mx-auto max-w-[880px] ${
            mobileMenuOpen ? "rounded-[20px]" : "rounded-full"
          } backdrop-blur-[48px] bg-[rgba(237,237,237,0.88)] dark:bg-[rgba(30,30,30,0.88)] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-black/[0.04] dark:border-white/[0.06] [&:not(:has([role="listbox"]))]:overflow-hidden transition-[border-radius] duration-300`}
        style={{
          gridTemplateRows: "48px 1fr",
          display: "grid",
          transition: "box-shadow 0.3s ease",
          boxShadow: mobileMenuOpen
            ? "0_8px_32px_rgba(0,0,0,0.12)"
            : "0_2px_12px_rgba(0,0,0,0.08)",
        }}
      >
        {/* Row 1: Logo + Desktop links + Action buttons */}
        <div className="flex items-center justify-between px-4 h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className="w-7 h-7" aria-hidden>
              <polygon points="20,70 60,70 40,40" fill="#008387" stroke="#008387" strokeWidth="5" strokeLinejoin="round" className="dark:fill-teal-400 dark:stroke-teal-400" />
              <polygon points="26,32 54,32 40,10" fill="#143562" stroke="#143562" strokeWidth="5" strokeLinejoin="round" className="dark:fill-blue-400 dark:stroke-blue-400" />
            </svg>
            <span className="hidden sm:inline font-heading text-base font-bold bg-gradient-to-r from-brand-500 to-brand-900 dark:from-teal-400 dark:to-blue-300 bg-clip-text text-transparent tracking-tight">
              SaaStainedNumbers
            </span>
          </Link>

          {/* Trailing: desktop links + action buttons */}
          <div className="flex items-center gap-0.5">
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-0.5">
              <Link
                href="/calculators"
                className="px-3 py-1.5 text-sm font-semibold tracking-[0.2px] text-[rgb(20,20,20)] dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                {t.calculators}
              </Link>
              <Link
                href="/pricing"
                className="px-3 py-1.5 text-sm font-semibold tracking-[0.2px] text-[rgb(20,20,20)] dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                {t.pricing}
              </Link>
              <Link
                href="/blog"
                className="px-3 py-1.5 text-sm font-semibold tracking-[0.2px] text-[rgb(20,20,20)] dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                {t.blog}
              </Link>
              <Link
                href="/canvas"
                data-testid="canvas-nav-link"
                className="px-3 py-1.5 text-sm font-semibold tracking-[0.2px] text-brand-600 dark:text-brand-400 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                {t.canvas}
              </Link>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 md:gap-0.5">
              <CurrencySwitcher />
              <LocaleSwitcher locale={locale} />
              <ThemeToggle />

              {/* Hamburger button */}
              <button
                type="button"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                onClick={toggleMobileMenu}
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-[rgb(20,20,20)] dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <span className="sr-only">{mobileMenuOpen ? "Close" : "Menu"}</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <>
                      <path strokeLinecap="round" d="M4 6h16" />
                      <path strokeLinecap="round" d="M4 12h16" />
                      <path strokeLinecap="round" d="M4 18h16" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Mobile nav links (animated height) */}
        <div
          ref={mobileMenuRef}
          className="overflow-hidden"
          style={{
            height: mobileMenuOpen ? "auto" : 0,
            transition: "height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1 px-4 pb-3">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 py-2.5 text-sm font-semibold tracking-[0.2px] rounded-xl transition-colors ${
                  pathname === link.href
                    ? "bg-black/5 dark:bg-white/10 text-brand-600 dark:text-brand-400"
                    : "text-[rgb(20,20,20)] dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  opacity: mobileMenuOpen ? 1 : 0,
                  transform: mobileMenuOpen ? "translateY(0)" : "translateY(-4px)",
                  transition: `opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
