"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";


type MobileNavProps = {
  t: Record<string, string>;
};

export function MobileNav({ t }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  // Close on browser back/forward
  useEffect(() => {
    if (!open) return;
    const handler = () => close();
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [open, close]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  // Outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open, close]);

  // Focus trap
  useEffect(() => {
    if (!open || !menuRef.current) return;
    const focusable = Array.from(
      menuRef.current.querySelectorAll<HTMLElement>("a, button, [tabindex='0']")
    );
    if (focusable.length) focusable[0].focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !menuRef.current) return;
      const items = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>("a, button, [tabindex='0']")
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Scroll shadow on nav
  useEffect(() => {
    const nav = document.querySelector("nav");
    if (!nav) return;
    const handler = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const items = [
    { href: "/calculators", label: "Calculators" },
    { href: "/dashboard", label: t.dashboard },
    { href: "/pricing", label: t.pricing },
    { href: "/blog", label: t.blog },
  ];

  return (
    <>
      <div className="hidden md:flex items-center gap-5 text-sm text-gray-700">
        <Link href="/calculators" className="transition-colors hover:text-gray-900">
          Calculators
        </Link>
        <Link href="/dashboard" className="transition-colors hover:text-gray-900">
          {t.dashboard}
        </Link>
        <Link href="/pricing" className="transition-colors hover:text-gray-900">
          {t.pricing}
        </Link>
        <Link href="/blog" className="transition-colors hover:text-gray-900">
          {t.blog}
        </Link>
      </div>

      <button
        ref={hamburgerRef}
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="md:hidden flex items-center justify-center w-11 h-11 relative z-50"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="w-6 h-6 text-gray-800">
          <line className="hamburger-bar" x1="3" y1="6" x2="21" y2="6" />
          <line className="hamburger-bar" x1="3" y1="12" x2="21" y2="12" />
          <line className="hamburger-bar" x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={`md:hidden fixed left-0 right-0 top-[80px] bg-white border-t border-gray-100 shadow-lg z-40 transition-all duration-300 ${
          open
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        }`}
      >
        <div className="px-4 py-5 flex flex-col gap-4">
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col gap-1">
              {items.map((item) => {
                const isCurrent = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={isCurrent ? "page" : undefined}
                      className="block px-3 py-3 text-[15px] font-medium text-gray-800 border-b border-gray-100 transition-colors hover:text-brand-600 last:border-b-0"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
