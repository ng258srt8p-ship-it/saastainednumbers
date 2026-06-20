"use client";

import { useMemo, useState } from "react";
import { getAllCalculators } from "@/lib/registry";
import { getTemplates, TEMPLATE_CATEGORIES } from "@/lib/canvas-templates";
import type { CalculatorConfig } from "@/calculators/config/calculator-schema";

interface CalculatorCatalogProps {
  onAddCalculator: (slug: string) => void;
  onApplyTemplate: (templateId: string) => void;
  addedSlugs: string[];
}

export function CalculatorCatalog({ onAddCalculator, onApplyTemplate, addedSlugs }: CalculatorCatalogProps) {
  const [search, setSearch] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [showTemplates, setShowTemplates] = useState(true);

  const allCalculators = useMemo(() => getAllCalculators(), []);
  const templates = useMemo(() => getTemplates(), []);

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  // Group by category with search filter
  const grouped = useMemo(() => {
    const map: Record<string, CalculatorConfig[]> = {};
    const normalizedSearch = search.toLowerCase().trim();

    for (const calc of allCalculators) {
      if (normalizedSearch && !calc.slug.includes(normalizedSearch) && !calc.meta.title.toLowerCase().includes(normalizedSearch)) {
        continue;
      }
      if (!map[calc.category]) map[calc.category] = [];
      map[calc.category].push(calc);
    }
    return map;
  }, [allCalculators, search]);

  const handleDragStart = (e: React.DragEvent, slug: string) => {
    e.dataTransfer.setData("text/plain", slug);
    e.dataTransfer.effectAllowed = "copy";
  };

  // Drag end cleanup — no-op needed to clear drag state

  return (
    <aside className="w-72 lg:w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto shrink-0 flex flex-col pt-[66px]">
      {/* Templates section */}
      <div className="border-b border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors"
        >
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Quick Start Templates
          </h2>
          <svg
            className={`w-3 h-3 text-gray-400 transition-transform ${showTemplates ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showTemplates && (
          <div className="px-3 pb-3 space-y-3 max-h-[45vh] overflow-y-auto">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const catTemplates = templates.filter((t) => t.category === cat.id);
              if (catTemplates.length === 0) return null;
              return (
                <div key={cat.id}>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1 mb-1">
                    {cat.label}
                  </p>
                  <div className="space-y-1.5">
                    {catTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onApplyTemplate(t.id)}
                      className="flex items-center gap-2.5 w-full rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-2.5 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all text-left group"
                      title={`Load ${t.name}: ${t.slugs.length} calculator${t.slugs.length !== 1 ? "s" : ""}`}
                    >
                      <span className="material-symbols-outlined text-base shrink-0 leading-none">{t.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {t.name}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {t.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {t.slugs.length > 0 && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              for (const s of t.slugs) onAddCalculator(s);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 hover:bg-brand-600 text-white cursor-pointer"
                            title={`Add ${t.slugs.length} calculator${t.slugs.length !== 1 ? "s" : ""} to workspace`}
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                          </span>
                        )}
                        <span className="shrink-0 text-[10px] font-medium text-gray-400 dark:text-gray-500 tabular-nums">
                          {t.slugs.length}
                        </span>
                      </div>
                    </button>
                  ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Calculator catalog header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="font-heading text-base font-bold text-gray-900 dark:text-gray-100">
          Calculator Catalog
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Click or drag calculators onto the workspace
        </p>
        {/* Search */}
        <div className="mt-3 relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search calculators..."
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 pl-8 pr-3 py-1.5 text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Catalog items */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-3 pt-3">
        {Object.entries(grouped).length === 0 && (
          <p className="text-xs text-gray-400 text-center py-8">No calculators match your search</p>
        )}
        {Object.entries(grouped).map(([category, calcs]) => (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {category.replace(/-/g, " ")}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400 font-numbers">{calcs.length}</span>
                <svg
                  className={`w-3 h-3 text-gray-400 transition-transform ${collapsedCategories.has(category) ? "" : "rotate-180"}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {!collapsedCategories.has(category) && (
              <div className="mt-0.5 space-y-0.5">
                {calcs.map(calc => {
                  const isAdded = addedSlugs.includes(calc.slug);
                  return (
                    <button
                      key={calc.slug}
                      draggable={isAdded ? "false" : "true"}
                      onDragStart={(e) => handleDragStart(e, calc.slug)}
                      onClick={() => !isAdded && onAddCalculator(calc.slug)}
                      title={calc.meta.title}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        isAdded
                          ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 cursor-default"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-grab active:cursor-grabbing"
                      }`}
                    >
                      <span className="truncate flex-1">{calc.meta.title}</span>
                      {isAdded && (
                        <span className="shrink-0 flex items-center gap-0.5 text-[10px] text-brand-500 font-medium">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Added
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
