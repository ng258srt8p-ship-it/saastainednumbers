"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { getCurrencySymbol } from "@/lib/formatNumber";
import { useCurrency } from "@/components/CurrencyProvider";
import type { Locale } from "@/lib/useLocale";

interface InputSliderProps {
  id: string;
  label: string;
  type: "number" | "currency" | "percentage";
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  error?: string;
  locale?: Locale;
}

export function InputSlider({
  id,
  label,
  type,
  value,
  onChange,
  min,
  max,
  placeholder,
  error,
  locale,
}: InputSliderProps) {
  const [localValue, setLocalValue] = useState(String(value));

   // Sync localValue when the value prop changes externally (e.g. from another input or stage selector)
  useEffect(() => {
    setLocalValue(String(value));
    }, [value]);

   // Ref-based debounce: fire onChange on every keystroke for immediate recalc,
   // but only update localValue onBlur to avoid caret jumps in the text field
  const changeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleChange = useCallback(
     (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalValue(raw);
      const num = parseFloat(raw);
      if (!isNaN(num) && num >= 0) {
        onChange(num);
        clearTimeout(changeTimer.current);
        changeTimer.current = setTimeout(() => {
          setLocalValue(String(num));
          }, 300);
        }
     },
     [onChange]
    );

   // On blur, snap localValue back to the real numeric value to avoid drift
  const handleBlur = useCallback(
     () => {
      clearTimeout(changeTimer.current);
      setLocalValue(String(value));
      },
     [value]
    );

  const { currency } = useCurrency();
  const currencySymbol = useMemo(() => getCurrencySymbol(locale, currency), [locale, currency]);
  const prefix = type === "currency" ? currencySymbol : "";
  const suffix = type === "percentage" ? "%" : "";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
        <div className="relative">
          {prefix && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {prefix}
            </span>
          )}
          <input
           id={id}
           type="number"
           value={localValue}
           onChange={handleChange}
           onBlur={handleBlur}
          min={min ?? 0}
          max={max}
          placeholder={placeholder}
          className={`w-full rounded-xl border px-3 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 bg-white dark:bg-gray-800/50 transition-shadow focus:outline-none focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500/20"
          } ${prefix ? "pl-7" : ""} ${suffix ? "pr-7" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
      <input
        type="range"
        min={min ?? 0}
        max={max ?? 100000}
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          setLocalValue(String(v));
          onChange(v);
        }}
        className="mt-1 h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-gray-700 accent-brand-500"
        aria-hidden
        tabIndex={-1}
      />
    </div>
  );
}
