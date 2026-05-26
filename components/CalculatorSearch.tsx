"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface CalculatorItem {
  slug: string;
  category: string;
  title: string;
  description: string;
}

interface Props {
  calculators: CalculatorItem[];
  placeholder?: string;
}

export function CalculatorSearch({ calculators, placeholder = "Search calculators..." }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return calculators
      .filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [query, calculators]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 pl-10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
      />
      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base leading-none select-none">
        search
      </span>
      {filtered.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 shadow-lg z-50">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.category}/${c.slug}`}
              onClick={() => setQuery("")}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-brand-50 dark:hover:bg-brand-900/30"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">{c.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
