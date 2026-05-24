"use client";

import { useEffect, useMemo } from "react";
import { InputSlider } from "@/calculators/ui/InputSlider";
import { ResultCard } from "@/calculators/ui/ResultCard";
import { useComparisonState } from "@/lib/useComparisonState";
import { engines } from "@/lib/engine-registry";
import type { CalculatorConfig } from "@/calculators/config/calculator-schema";

interface Props {
  slug: string;
  config: CalculatorConfig;
}



export function EmbedClient({ slug, config }: Props) {
  const inputIds = config.inputs.map((i) => i.id);
  const { valuesA, valuesB, setValue } = useComparisonState(inputIds);

  const resultsA = useMemo(() => {
    const engine = engines[slug];
    let computed: Record<string, number | string> = {};
    if (engine) {
      try { computed = engine(valuesA); } catch { computed = {}; }
    }
    return config.outputs.map((o) => ({
      id: o.id, value: computed[o.id] ?? 0, label: o.label, type: o.type, isPrimary: o.isPrimary,
    }));
  }, [valuesA, slug, config]);

  const resultsB = useMemo(() => {
    const engine = engines[slug];
    let computed: Record<string, number | string> = {};
    if (engine) {
      try { computed = engine(valuesB); } catch { computed = {}; }
    }
    return config.outputs.map((o) => ({
      id: o.id, value: computed[o.id] ?? 0, label: o.label, type: o.type, isPrimary: o.isPrimary,
    }));
  }, [valuesB, slug, config]);

  // Post results to parent window for postMessage API
  useEffect(() => {
    const payload = {
      source: "saastainednumbers-embed",
      slug,
      inputs: valuesA,
      results: resultsA.reduce((acc, r) => ({ ...acc, [r.id]: r.value }), {} as Record<string, number | string>),
      inputsB: valuesB,
      resultsB: resultsB.reduce((acc, r) => ({ ...acc, [r.id]: r.value }), {} as Record<string, number | string>),
    };
    window.parent.postMessage(payload, "*");
  }, [resultsA, resultsB, valuesA, valuesB, slug]);

  // Listen for input updates from parent
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.source === "webcalc-parent" && event.data.slug === slug) {
        for (const [key, val] of Object.entries(event.data.inputs || {})) {
          if (typeof val === "number") setValue("a", key, val);
        }
        for (const [key, val] of Object.entries(event.data.inputsB || {})) {
          if (typeof val === "number") setValue("b", key, val);
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [slug, setValue]);

  return (
    <div className="min-h-0">
      <div className="space-y-4">
        {config.inputs.map((input) => (
          <InputSlider
            key={input.id}
            id={input.id}
            label={input.label}
            type={input.type}
            value={valuesA[input.id] ?? 0}
            onChange={(val) => setValue("a", input.id, val)}
          />
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {resultsA.map((r) => (
          <ResultCard key={r.id} value={String(r.value)} label={r.label} type={r.type} isPrimary={r.isPrimary} />
        ))}
      </div>
      <div className="mt-4 text-center">
        <a
          href={`https://saastainednumbers.com/${config.category}/${config.slug}`}
          target="_blank"
          rel="nofollow"
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Powered by SaaStainedNumbers
        </a>
      </div>
    </div>
  );
}
