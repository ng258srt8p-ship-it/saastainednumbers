"use client";

import { useState } from "react";
import { useCurrency } from "./CurrencyProvider";
import { SUPPORTED_CURRENCIES, getCurrencySymbolStatic } from "@/lib/currencies";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select currency"
      >
        <span>{getCurrencySymbolStatic(currency)}{currency}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div
            className="absolute left-0 z-50 mt-1 min-w-[140px] max-h-[300px] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1"
            role="listbox"
            aria-label="Select currency"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                role="option"
                aria-selected={currency === c.code}
                onClick={() => { setCurrency(c.code); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  currency === c.code
                    ? "bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                }`}
              >
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
