"use client";

import React, { useMemo, useCallback, useState, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DashboardWidget } from "@/components/DashboardWidget";
import { DashboardTotalWidget } from "@/components/DashboardTotalWidget";
import { DashboardCalculatorPicker } from "@/components/DashboardCalculatorPicker";
import { SidekickAd } from "@/components/SidekickAd";
import type { Locale } from "@/lib/useLocale";
import { getAllCalculators } from "@/lib/registry";
import { getCalculator } from "@/lib/registry";
import { engines } from "@/lib/engine-registry";
import { findInputWiring, TEMPLATES } from "@/lib/dashboard-wiring";
import "@/calculators/config/_all";

interface DashboardStrings {
  locale: string;
  heading: string;
  subtitle: string;
  share: string;
  copied: string;
  addCalculator: string;
  noCalculatorsSelected: string;
  browseCalculators: string;
  calculatorsActive: string;
  remove: string;
}

interface DashboardClientProps {
  strings: DashboardStrings;
}

class WidgetErrorBoundary extends React.Component<{ children: React.ReactNode; title: string }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4 text-sm text-red-600 dark:text-red-400">
          {this.props.title} encountered an error.
        </div>
      );
    }
    return this.props.children;
  }
}

export function DashboardClient({ strings }: DashboardClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const allCalculators = useMemo(() => getAllCalculators(), []);

  const selectedSlugs = useMemo(() => {
    const raw = searchParams.getAll("calc");
    if (raw.length === 0) {
      return ["mrr-calculator", "cac-calculator", "ltv-calculator", "churn-calculator", "arpu-calculator"];
    }
    return raw;
  }, [searchParams]);

  const selectedConfigs = useMemo(() => {
    return selectedSlugs
      .map((slug) => getCalculator(slug))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);
  }, [selectedSlugs]);

  const inputValuesBySlug = useMemo(() => {
    const all: Record<string, Record<string, number>> = {};
    for (const config of selectedConfigs) {
      const slugValues: Record<string, number> = {};
      for (const input of config.inputs) {
        const paramKey = `${config.slug}.${input.id}`;
        const raw = searchParams.get(paramKey);
        const parsed = raw !== null ? Number.parseFloat(raw) : NaN;
        slugValues[input.id] = Number.isFinite(parsed) ? parsed : input.defaultValue;
      }
      all[config.slug] = slugValues;
    }
    return all;
  }, [selectedConfigs, searchParams]);

  const allResults = useMemo(() => {
    const results = new Map<string, Record<string, number>>();

    for (const config of selectedConfigs) {
      const engine = engines[config.slug];
      if (!engine) continue;
      try {
        const computed = engine(inputValuesBySlug[config.slug] ?? {});
        const outputs: Record<string, number> = {};
        for (const [key, value] of Object.entries(computed)) {
          outputs[key] = typeof value === "number" ? value : Number(value);
        }
        results.set(config.slug, outputs);
      } catch {
        results.set(config.slug, {});
      }
    }

    return results;
  }, [selectedConfigs, inputValuesBySlug]);

  const wiredValuesBySlug = useMemo(() => {
    const wired: Record<string, Record<string, number>> = {};

    for (const config of selectedConfigs) {
      const inputWiring: Record<string, number> = {};
      for (const input of config.inputs) {
        const wiredValue = findInputWiring(input.id, config.slug, allResults);
        if (wiredValue !== undefined) {
          inputWiring[input.id] = wiredValue;
        }
      }
      wired[config.slug] = inputWiring;
    }

    return wired;
  }, [selectedConfigs, allResults]);

  const setInput = useCallback(
    (slug: string, id: string, value: number) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        const paramKey = `${slug}.${id}`;
        if (Number.isFinite(value)) {
          params.set(paramKey, value.toString());
        } else {
          params.delete(paramKey);
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }, 300);
    },
    [searchParams, router, pathname],
  );

  const toggleCalculator = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll("calc");

      if (current.includes(slug)) {
        params.delete("calc");
        for (const s of current) {
          if (s !== slug) params.append("calc", s);
        }
        for (const key of Array.from(params.keys())) {
          if (key.startsWith(`${slug}.`)) {
            params.delete(key);
          }
        }
      } else {
        params.append("calc", slug);
      }

      if (Array.from(params.keys()).length === 0) {
        router.replace(pathname, { scroll: false });
      } else {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    [searchParams, router, pathname],
  );

  const applyTemplate = useCallback(
    (calcs: string[]) => {
      const params = new URLSearchParams();
      for (const slug of calcs) {
        params.append("calc", slug);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            {strings.heading}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {strings.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={copyShareLink}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {copied ? strings.copied : strings.share}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {strings.addCalculator}
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block" />

        {Object.entries(TEMPLATES).map(([key, tmpl]) => (
          <button
            key={key}
            type="button"
            onClick={() => applyTemplate(tmpl.calcs)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            {tmpl.label}
          </button>
        ))}
      </div>

      <div className="mb-6 space-y-6">
        <DashboardTotalWidget allOutputs={allResults} locale={strings.locale as Locale} />
      </div>

      {selectedConfigs.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {strings.noCalculatorsSelected}
          </p>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            {strings.browseCalculators}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selectedConfigs.map((config) => (
            <WidgetErrorBoundary key={config.slug} title={config.meta.title}>
              <DashboardWidget
                slug={config.slug}
                config={config}
                values={inputValuesBySlug[config.slug] ?? {}}
                onChange={(id, value) => setInput(config.slug, id, value)}
                wiredValues={wiredValuesBySlug[config.slug] ?? {}}
                locale={strings.locale as Locale}
              />
            </WidgetErrorBoundary>
          ))}
        </div>
      )}

      {selectedConfigs.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {selectedConfigs.length} {strings.calculatorsActive}{selectedConfigs.length !== 1 ? "s" : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedConfigs.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => toggleCalculator(c.slug)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-colors group"
              >
                <span className="truncate max-w-32">{c.meta.title}</span>
                <svg className="w-3 h-3 text-gray-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <SidekickAd />
      </div>

      {pickerOpen && (
        <DashboardCalculatorPicker
          allCalculators={allCalculators}
          selected={selectedSlugs}
          onToggle={toggleCalculator}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
