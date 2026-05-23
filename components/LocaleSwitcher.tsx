"use client";

import type { Locale } from "@/lib/useLocale";
import { getLocale } from "@/lib/useLocale";

const locales: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "de", label: "DE" },
  { code: "pt", label: "PT" },
  { code: "fr", label: "FR" },
  { code: "ja", label: "JA" },
];

function getCurrentLocale(): Locale {
  try { return getLocale(); } catch { return "en"; }
}

export function LocaleSwitcher() {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value;
    const redirect = window.location.pathname + window.location.search;
    setTimeout(() => {
      window.location.href = `/api/locale?locale=${locale}&redirect=${encodeURIComponent(redirect)}`;
    }, 0);
  };

  return (
    <div className="relative">
      <select
        onChange={handleChange}
        defaultValue={getCurrentLocale()}
        className="appearance-none bg-white border border-gray-200 rounded-lg pl-2.5 pr-6 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:border-brand-300 hover:shadow-sm cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
        aria-label="Select language"
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
