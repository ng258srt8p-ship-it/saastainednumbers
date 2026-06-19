"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { InputSlider } from "@/calculators/ui/InputSlider";
import { ResultCard } from "@/calculators/ui/ResultCard";
import { useComparisonState } from "@/lib/useComparisonState";
import { engines } from "@/lib/engine-registry";
import { Insights } from "@/components/Insights";
import type { CalculatorConfig } from "@/calculators/config/calculator-schema";
import type { Locale } from "@/lib/useLocale";

interface Props {
  slug: string;
  config: CalculatorConfig;
  locale: Locale;
  strings: {
    disclaimer: string;
  };
}

export function EmbedClient({ slug, config, locale, strings }: Props) {
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme") ?? "light";
  const embedHeight = Number(searchParams.get("height")) || 600;
  const hideHeader = searchParams.get("hideHeader") === "true";

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

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

  const aiInputs = config.inputs.map((i) => ({
    id: i.id,
    label: i.label,
    value: valuesA[i.id] ?? 0,
    type: i.type,
  }));

  const aiOutputs = resultsA;

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
    <div className="min-h-0 p-4" style={{ minHeight: embedHeight }}>
      {!hideHeader && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {config.meta.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {config.meta.description}
          </p>
        </div>
      )}
      <div className="space-y-4">
        {config.inputs.map((input) => (
          <InputSlider
            key={input.id}
            id={input.id}
            label={input.label}
            type={input.type}
            value={valuesA[input.id] ?? 0}
            onChange={(val) => setValue("a", input.id, val)}
            locale={locale}
          />
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {resultsA.map((r) => (
          <ResultCard key={r.id} value={String(r.value)} label={r.label} type={r.type} isPrimary={r.isPrimary} locale={locale} />
        ))}
      </div>
      <Insights
        title={config.meta.title}
        description={config.meta.description}
        category={config.category}
        inputs={aiInputs}
        outputs={aiOutputs}
      />
      <div className="mt-4 flex items-center justify-center gap-3">
        <a
          href={`https://saastainednumbers.com/${config.category}/${config.slug}`}
          target="_blank"
          rel="nofollow"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:border-brand-300 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className="w-5 h-5 shrink-0" aria-hidden>
            <polygon points="20,70 60,70 40,40" fill="#008387" stroke="#008387" strokeWidth="5" strokeLinejoin="round"/>
            <polygon points="26,32 54,32 40,10" fill="#143562" stroke="#143562" strokeWidth="5" strokeLinejoin="round"/>
          </svg>
          <span>
            <span className="font-medium">SaaStainedNumbers</span>
            <span className="ml-1 text-gray-400 dark:text-gray-500">· saastainednumbers.com</span>
          </span>
        </a>
      </div>
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center px-2">
        {strings.disclaimer}
      </p>
    </div>
  );
}
