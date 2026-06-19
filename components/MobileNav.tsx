"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";

interface NavLinks {
  pricing?: string;
  blog?: string;
  calculators?: string;
  canvas?: string;
}

interface MobileNavProps {
  t: NavLinks;
  locale: string;
}

export function MobileNav({ t, locale }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const links = [
    { label: t.calculators ?? "Calculators", href: "/calculators" },
    { label: t.canvas ?? "Canvas", href: "/canvas" },
    { label: t.pricing ?? "Pricing", href: "/pricing" },
    { label: t.blog ?? "Blog", href: "/blog" },
  ];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open && menuRef.current) {
      menuRef.current.focus();
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((o) => !o)}
        className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-[rgb(20,20,20)] dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        {open ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M4 6h16" />
            <path strokeLinecap="round" d="M4 12h16" />
            <path strokeLinecap="round" d="M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            ref={menuRef}
            tabIndex={-1}
            role="dialog"
            aria-label="Mobile navigation"
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl backdrop-blur-[48px] bg-[rgba(237,237,237,0.64)] dark:bg-[rgba(30,30,30,0.64)] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-black/[0.04] dark:border-white/[0.06] p-2 animate-slide-in"
            onKeyDown={handleKeyDown}
          >
            <div className="flex flex-col gap-0.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-3 text-sm font-semibold tracking-[0.2px] rounded-xl transition-colors ${
                    pathname === link.href
                      ? "bg-black/5 dark:bg-white/10 text-brand-600 dark:text-brand-400"
                      : "text-[rgb(20,20,20)] dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
