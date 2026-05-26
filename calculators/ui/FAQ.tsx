"use client";

import { useState } from "react";
import type { FAQItem } from "@/calculators/config/calculator-schema";

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/30"
            aria-expanded={openIndex === i}
          >
            <span>{item.question}</span>
            <svg
              className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === i && (
            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
