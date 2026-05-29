"use client";

import { useCallback, useState } from "react";
import type { Locale } from "@/lib/useLocale";
import { switchLocalePath } from "@/lib/locale-url";

const locales: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "fr", label: "Français" },
  { code: "ja", label: "日本語" },
];

export function LocaleSwitcher({ locale: current }: { locale: Locale }) {
  const [open, setOpen] = useState(false);

  const switchLocale = useCallback((code: Locale) => {
    document.cookie = `locale=${code};path=/;max-age=31536000;SameSite=Lax`;
    window.location.href = switchLocalePath(window.location.pathname, code);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="hidden sm:inline">{current.toUpperCase()}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div
            className="absolute right-0 z-50 mt-1 min-w-[140px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1"
            role="listbox"
            aria-label="Select language"
          >
            {locales.map((l) => (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={current === l.code}
                onClick={() => switchLocale(l.code)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  current === l.code
                    ? "bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
