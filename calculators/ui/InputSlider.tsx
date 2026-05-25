"use client";

import { useState, useCallback } from "react";

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
}: InputSliderProps) {
  const [localValue, setLocalValue] = useState(String(value));

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalValue(raw);
      const num = parseFloat(raw);
      if (!isNaN(num) && num >= 0) {
        onChange(num);
      }
    },
    [onChange]
  );

  const prefix = type === "currency" ? "$" : "";
  const suffix = type === "percentage" ? "%" : "";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          value={localValue}
          onChange={handleChange}
          min={min ?? 0}
          max={max}
          placeholder={placeholder}
          className={`w-full rounded-xl border px-3 py-3 text-sm text-gray-100 placeholder:text-gray-500 bg-gray-800/50 transition-shadow focus:outline-none focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-700 focus:border-brand-500 focus:ring-brand-500/20"
          } ${prefix ? "pl-7" : ""} ${suffix ? "pr-7" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
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
        className="mt-1 h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-700 accent-brand-500"
        aria-hidden
      />
    </div>
  );
}
