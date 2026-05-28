"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { CalculatorConfig } from "@/calculators/config/calculator-schema";
import { CATEGORY_META } from "@/lib/registry";

interface DashboardCalculatorPickerProps {
  allCalculators: CalculatorConfig[];
  selected: string[];
  onToggle: (slug: string) => void;
  onClose: () => void;
}

export function DashboardCalculatorPicker({
  allCalculators,
  selected,
  onToggle,
  onClose,
}: DashboardCalculatorPickerProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const categories = useMemo(() => {
    const cats = new Set(allCalculators.map((c) => c.category));
    return Array.from(cats).sort();
  }, [allCalculators]);

  const filtered = useMemo(() => {
    let list = allCalculators;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.meta.title.toLowerCase().includes(q) ||
          c.meta.keywords.some((k) => k.toLowerCase().includes(q)),
      );
    }
    if (categoryFilter) {
      list = list.filter((c) => c.category === categoryFilter);
    }
    return list;
  }, [allCalculators, search, categoryFilter]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl mx-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-gray-100">
            Add Calculators
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close calculator picker"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex flex-col gap-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search calculators..."
              aria-label="Search calculators"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              autoFocus
            />
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Category filter">
            <button
              type="button"
              onClick={() => setCategoryFilter(null)}
              aria-pressed={categoryFilter === null}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                categoryFilter === null
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
                  aria-pressed={categoryFilter === cat}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {meta?.name ?? cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-0.5" role="listbox" aria-label="Calculator list">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
              No calculators found
            </p>
          ) : (
            filtered.map((calc) => {
              const isSelected = selected.includes(calc.slug);
              const meta = CATEGORY_META[calc.category];
              return (
                <button
                  key={calc.slug}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onToggle(calc.slug)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${
                    isSelected
                      ? "bg-brand-50 dark:bg-brand-950/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-750"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-brand-600 border-brand-600"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 block truncate">
                      {calc.meta.title}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                      {meta?.name ?? calc.category}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {selected.length} selected
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
