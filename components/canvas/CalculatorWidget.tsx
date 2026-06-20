"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getCalculator } from "@/lib/registry";
import { engines } from "@/lib/engine-registry";
import { InputSlider } from "@/calculators/ui/InputSlider";
import type { CalculatorInput } from "@/calculators/config/calculator-schema";

interface CalculatorWidgetProps {
  slug: string;
  onRemove: () => void;
  onOutputsChange?: (slug: string, outputs: Record<string, number | string>) => void;
}

function formatOutput(value: number | string, type: string = "number"): string {
  if (typeof value === "string") return value;
  if (Number.isNaN(value) || value === undefined || value === null) return "\u2014";

  if (type === "currency" || type === "number") {
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })}`;
  }
  if (type === "percentage") return `${value.toFixed(1)}%`;
  if (type === "ratio") return value.toFixed(2);
  return String(value);
}

function buildDefaults(inputs: CalculatorInput[]): Record<string, number> {
  const init: Record<string, number> = {};
  for (const input of inputs) {
    init[input.id] = input.defaultValue ?? 0;
  }
  return init;
}

/**
 * Compute engine outputs from raw values.
 * Returns the outputs object, or `null` if the engine is unavailable.
 */
function computeOutputs(
  values: Record<string, number>,
  calcSlug: string
): Record<string, number | string> | null {
  const engine = engines[calcSlug as keyof typeof engines] as
    | ((params: Record<string, number>) => Record<string, number | string>)
    | undefined;
  if (!engine) return null;
  try {
    return engine(values) ?? {};
  } catch {
    return {};
  }
}

export const CalculatorWidget = function CalculatorWidget({ slug, onRemove, onOutputsChange }: CalculatorWidgetProps) {
  const calc = useMemo(() => getCalculator(slug), [slug]);

  // Initialize state once per slug change
  const [values, setValues] = useState<Record<string, number>>(() =>
    calc ? buildDefaults(calc.inputs) : {}
  );

  // Refs to avoid stale closures in handleChange + mount propagation
  const onOutputsChangeRef = useRef(onOutputsChange);
  onOutputsChangeRef.current = onOutputsChange;
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const calcRef = useRef(calc);
  calcRef.current = calc;

  // Reset values when slug changes
  useEffect(() => {
    if (calc) {
      setValues(buildDefaults(calc.inputs));
    }
  }, [slug, calc]);

  // Compute outputs for display
  const engineSlug = calc ? calc.slug : slug;
  const engine = engines[engineSlug as keyof typeof engines] as ((params: Record<string, number>) => Record<string, number | string>) | undefined;

  const outputs = useMemo<Record<string, number | string>>(() => {
    if (!calc) return {};
    if (!engine) return {};
    try {
      return engine(values) ?? {};
    } catch {
      return {};
    }
  }, [calc, engine, values]);

  // Handle slider changes — update local state AND propagate to parent
  const handleChange = useCallback((id: string) => (v: number) => {
    // Update local state
    setValues(prev => {
      const newValues = { ...prev, [id]: v };
      // Read refs inside the updater — they hold the latest values
      const c = calcRef.current;
      const notify = onOutputsChangeRef.current;
      if (c && notify) {
        try {
          const newOutputs = computeOutputs(newValues, c.slug);
          if (newOutputs) {
            notify(c.slug, newOutputs);
          }
        } catch {
          // Engine error — ignore
        }
      }
      return newValues;
    });
  }, []);

  // Propagate outputs to parent on mount and whenever calc/slug changes
  const hasPropagated = useRef(false);
  useEffect(() => {
    if (!calc) return;
    const notify = onOutputsChangeRef.current;
    if (!notify) return;

    // Recompute outputs from current values and propagate
    const newOutputs = computeOutputs(values, calc.slug);
    if (newOutputs && Object.keys(newOutputs).length > 0) {
      notify(calc.slug, newOutputs);
    }
    hasPropagated.current = true;
    // Intentionally run when slug/calc changes, not when values or outputs change
    // (slider changes are handled synchronously in handleChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, calc]);

  if (!calc) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <p className="text-sm text-gray-400">Calculator not found: {slug}</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
        <h3 className="font-heading text-sm font-semibold text-gray-900 dark:text-gray-100 truncate mr-2">
          {calc.meta.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <a
            href={`/${calc.category}/${calc.slug}`}
            className="text-gray-400 hover:text-brand-500 transition-colors p-1 rounded hover:bg-brand-50 dark:hover:bg-brand-900/20"
            aria-label={`Open ${calc.meta.title} full page`}
            title="Open full page"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
            aria-label={`Remove ${calc.meta.title}`}
            title="Remove from workspace"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="px-4 py-3 space-y-3">
        {calc.inputs.slice(0, 4).map(input => (
          <InputSlider
            key={input.id}
            id={input.id}
            label={input.label}
            type={input.type}
            value={values[input.id] ?? input.defaultValue ?? 0}
            onChange={handleChange(input.id)}
            min={input.min}
            max={input.max}
            placeholder={input.placeholder}
          />
        ))}
        {calc.inputs.length > 4 && (
          <p className="text-xs text-gray-400 text-center">+ {calc.inputs.length - 4} more inputs</p>
        )}
      </div>

      {/* Outputs */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-2">Results</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {calc.outputs.slice(0, 4).map(output => {
            const value = outputs[output.id];
            const display = value !== undefined ? formatOutput(typeof value === 'number' ? value : 0, output.type) : "\u2014";
            return (
              <div key={output.id}>
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 truncate">{output.label}</p>
                <p className={`font-numbers text-sm font-bold ${
                  output.isPrimary ? "text-brand-600 dark:text-brand-400" : "text-gray-900 dark:text-gray-100"
                }`}>
                  {display}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <a
        href={`/${calc.category}/${calc.slug}`}
        className="block px-4 py-2 text-[11px] text-center text-brand-600 dark:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 transition-colors font-medium"
      >
        Open Full Calculator &rarr;
      </a>
    </motion.div>
  );
};
