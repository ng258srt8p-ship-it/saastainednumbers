"use client";

import { useMemo, useState } from "react";
import type { CalculatorConfig } from "@/calculators/config/calculator-schema";
import { InputSlider } from "@/calculators/ui/InputSlider";
import { engines } from "@/lib/engine-registry";
import { Insights } from "@/components/Insights";

interface DashboardWidgetProps {
  config: CalculatorConfig;
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
  wiredValues: Record<string, number>;
  slug: string;
}

function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatPercent(n: number): string {
  if (!Number.isFinite(n)) return "0%";
  return `${Number(n.toFixed(1))}%`;
}

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatOutput(value: number | string, type: string): string {
  if (type === "text") return String(value);
  if (typeof value !== "number") return String(value);
  if (!Number.isFinite(value)) return "—";
  switch (type) {
    case "currency":
      return formatCurrency(value);
    case "percentage":
      return formatPercent(value);
    case "ratio":
      return value.toFixed(1);
    default:
      return formatNumber(value);
  }
}

export function DashboardWidget({ config, values, onChange, wiredValues, slug }: DashboardWidgetProps) {
  const [expanded, setExpanded] = useState(false);

  const results = useMemo(() => {
    const engine = engines[slug];
    if (!engine) {
      return { outputs: {} as Record<string, number | string>, displayPrimary: undefined as string | undefined };
    }
    try {
      const computed = engine({ ...values, ...wiredValues });
      const outputs: Record<string, number | string> = {};
      let primaryValue: number | string | undefined;
      let primaryType = "number";
      for (const output of config.outputs) {
        const v = computed[output.id];
        if (output.type === "text") {
          outputs[output.id] = v !== undefined ? String(v) : "—";
        } else {
          const num = typeof v === "number" ? v : Number(v);
          outputs[output.id] = Number.isFinite(num) ? num : 0;
        }
        if (output.isPrimary) {
          primaryValue = output.type === "text" ? String(v ?? "—") : (typeof v === "number" && Number.isFinite(v) ? v : undefined);
          primaryType = output.type;
        }
      }
      let displayPrimary: string | undefined;
      if (primaryValue !== undefined) {
        displayPrimary = formatOutput(primaryValue, primaryType);
      } else {
        const first = config.outputs[0];
        if (first) {
          const fv = outputs[first.id];
          displayPrimary = fv !== undefined ? formatOutput(fv, first.type) : undefined;
        }
      }
      return { outputs, displayPrimary };
    } catch {
      return { outputs: {} as Record<string, number | string>, displayPrimary: undefined };
    }
  }, [values, wiredValues, config, slug]);

  const wiredInputs = useMemo(() => new Set(Object.keys(wiredValues)), [wiredValues]);

  const insightsInputs = useMemo(
    () =>
      config.inputs.map((i) => ({
        id: i.id,
        label: wiredInputs.has(i.id) ? `${i.label} (auto-wired)` : i.label,
        value: wiredInputs.has(i.id) ? (wiredValues[i.id] ?? values[i.id] ?? i.defaultValue) : (values[i.id] ?? i.defaultValue),
        type: i.type,
      })),
    [config.inputs, wiredInputs, wiredValues, values],
  );

  const insightsOutputs = useMemo(
    () =>
      config.outputs.map((o) => ({
        id: o.id,
        label: o.label,
        value: results.outputs[o.id] ?? 0,
        type: o.type,
        isPrimary: o.isPrimary,
      })),
    [config.outputs, results.outputs],
  );

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-heading text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {config.meta.title}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {results.displayPrimary !== undefined && (
            <span className="font-heading text-lg font-bold text-brand-600 dark:text-brand-400">
              {results.displayPrimary}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div className={`px-4 ${expanded ? "pb-4" : "pb-3"}`}>
        <div className="space-y-3">
          {config.inputs.map((input) => {
            const isWired = wiredInputs.has(input.id);
            return (
              <div key={input.id} className="relative">
                {isWired ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3 h-3 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {input.label}
                      </label>
                      <span className="text-[10px] text-brand-500 font-medium">(auto-wired)</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/20 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{wiredValues[input.id] ?? values[input.id] ?? input.defaultValue}</span>
                      {input.type === "currency" && <span className="text-gray-400">USD</span>}
                    </div>
                  </div>
                ) : (
                  <InputSlider
                    id={`${slug}.${input.id}`}
                    label={input.label}
                    type={input.type}
                    value={values[input.id] ?? input.defaultValue}
                    onChange={(v) => onChange(input.id, v)}
                    min={input.min}
                    max={input.max}
                    placeholder={input.placeholder}
                  />
                )}
              </div>
            );
          })}
        </div>

        {results.displayPrimary !== undefined && (
          <div className="mt-3 grid gap-1.5">
            {config.outputs.map((output) => {
              const val = results.outputs[output.id];
              if (val === undefined) return null;
              return (
                <div key={output.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{output.label}</span>
                  <span
                    className={`font-semibold ${
                      output.isPrimary
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {formatOutput(val, output.type)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
            <Insights
              title={config.meta.title}
              description={config.meta.description}
              category={config.category}
              inputs={insightsInputs}
              outputs={insightsOutputs}
            />
          </div>
        )}
      </div>
    </div>
  );
}
