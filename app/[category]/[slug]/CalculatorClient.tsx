"use client";

import type { CalculatorConfig } from "@/calculators/config/calculator-schema";
import { CalculatorShell } from "@/calculators/ui/CalculatorShell";
import { InputSlider } from "@/calculators/ui/InputSlider";
import { ResultCard } from "@/calculators/ui/ResultCard";
import { CompareToggle } from "@/calculators/ui/CompareToggle";
import { ComparisonChart } from "@/calculators/ui/ComparisonChart";
import { DeltaBadge, type DeltaMode } from "@/calculators/ui/DeltaBadge";
import { useComparisonState } from "@/lib/useComparisonState";
import { useEffect, useMemo, useRef, useState } from "react";
import { EmbedModal } from "@/calculators/ui/EmbedModal";
import { FeedbackWidget } from "@/calculators/ui/FeedbackWidget";
import { renderContent } from "@/lib/renderContent";
import { analytics } from "@/lib/analytics";
import { getMetricKey } from "@/lib/benchmarks";
import type { Stage } from "@/lib/benchmarks";
import { engines } from "@/lib/engine-registry";
import { ShareButton } from "@/components/ShareButton";
import { AdUnit } from "@/components/AdUnit";
import { Insights } from "@/components/Insights";
import { SidekickAd } from "@/components/SidekickAd";

interface RelatedCalc {
  slug: string;
  category: string;
  meta: { title: string; description: string };
}

interface Props {
  config: CalculatorConfig;
  relatedCalculators?: RelatedCalc[];
  hideContent?: boolean;
}



function runEngine(slug: string, params: Record<string, number>): Record<string, number | string> {
  const engine = engines[slug];
  if (!engine) return {};
  try { return engine(params); } catch { return {}; }
}

export function CalculatorClient({ config, relatedCalculators, hideContent }: Props) {
  const [embedOpen, setEmbedOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("series-a");
  const [compareMode, setCompareMode] = useState(false);
  const [deltaMode, setDeltaMode] = useState<DeltaMode>("both");
  const compareTracked = useRef(false);

  const inputIds = config.inputs.map((i) => i.id);
  const defaults = Object.fromEntries(config.inputs.map((i) => [i.id, i.defaultValue]));
  const { valuesA, valuesB, setValue, reset } = useComparisonState(inputIds, defaults);

  const metricKey = config.benchmarkMetric ?? getMetricKey(config.slug);

  const resultsA = useMemo(() => {
    const computed = runEngine(config.slug, valuesA);
    return config.outputs.map((output) => ({
      id: output.id,
      value: computed[output.id] ?? 0,
      label: output.label,
      type: output.type,
      isPrimary: output.isPrimary,
    }));
  }, [valuesA, config]);

  const resultsB = useMemo(() => {
    const computed = runEngine(config.slug, valuesB);
    return config.outputs.map((output) => ({
      id: output.id,
      value: computed[output.id] ?? 0,
      label: output.label,
      type: output.type,
      isPrimary: output.isPrimary,
    }));
  }, [valuesB, config]);

  const aiInputs = config.inputs.map((i) => ({
    id: i.id,
    label: i.label,
    value: valuesA[i.id] ?? 0,
    type: i.type,
  }));

  const aiOutputs = resultsA;

  const primaryValue = Number(resultsA.find((r) => r.isPrimary)?.value ?? 0);
  useEffect(() => {
    if (primaryValue <= 0) return;
    const timer = setTimeout(() => {
      const primary = resultsA.find((r) => r.isPrimary);
      analytics.calculate(config.slug, valuesA, primary ? { value: Number(primary.value), label: primary.label, type: primary.type } : undefined);
    }, 500);
    return () => clearTimeout(timer);
  }, [primaryValue, config.slug, valuesA]);

  useEffect(() => {
    if (compareMode && !compareTracked.current) {
      compareTracked.current = true;
      analytics.compare(config.slug, valuesA, valuesB);
    }
  }, [compareMode, config.slug, valuesA, valuesB]);

  const chartData = compareMode ? resultsA
    .filter((r) => r.type !== "text")
    .map((r) => {
      const b = resultsB.find((rb) => rb.id === r.id);
      return {
        label: r.label,
        scenarioA: typeof r.value === "number" ? r.value : 0,
        scenarioB: typeof b?.value === "number" ? b.value : 0,
        type: r.type,
      };
    }) : [];

  const chartSection = compareMode && chartData.length > 0 ? (
    <ComparisonChart data={chartData} />
  ) : null;

  const stageSelector = (
        <div className="flex items-center gap-2 flex-wrap">
      {metricKey && (
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 p-0.5 text-xs">
          {(["seed", "series-a", "series-b", "series-c", "growth"] as Stage[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStage(s)}
              className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                stage === s
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {s === "series-a" ? "Series A" : s === "series-b" ? "Series B" : s === "series-c" ? "Series C" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}
      <CompareToggle compareMode={compareMode} onToggle={() => setCompareMode((v) => !v)} />
    </div>
  );

  const deltaModeToggle = compareMode ? (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-medium text-gray-600 dark:text-gray-500">Delta:</span>
      {(["absolute", "percent", "both"] as DeltaMode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setDeltaMode(m)}
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
            deltaMode === m ? "text-brand-700 dark:text-brand-600 bg-brand-50 dark:bg-brand-950" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          {m === "absolute" ? "$" : m === "percent" ? "%" : "Both"}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <>
    <CalculatorShell
      title={config.meta.title}
      description={config.meta.description}
      stageSelector={stageSelector}
      feedbackWidget={<FeedbackWidget slug={config.slug} />}
      sidebarAd={<SidekickAd />}
      afterContentAd={hideContent ? undefined : <AdUnit slot="calculator-below-content" />}
      contentSection={hideContent ? undefined : (
        <div className="space-y-8">
          <section>
            <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">{renderContent(config.content.intro, config.slug)}</div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">How to Use This Calculator</h2>
            <ol className="list-decimal pl-5 space-y-2">
              {config.content.howToUse.split(". ").filter(Boolean).map((step, i) => (
                <li key={i} className="text-gray-600 dark:text-gray-400">{step.trim()}.</li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/50 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Formula & Worked Example</h2>
            <div className="font-mono text-sm bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-4 border border-brand-200 dark:border-brand-800/30 mb-4">
              {config.content.formulaExplanation.split(". ").map((part, i) => (
                <p key={i} className="mb-1 text-gray-700 dark:text-gray-300">{part}{i === 0 ? ":" : "."}</p>
              ))}
            </div>
          </section>

          {config.content.benchmarks && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Industry Benchmarks</h2>
              <div className="text-gray-700 dark:text-gray-300 mb-4">{renderContent(config.content.benchmarks, config.slug)}</div>
              {config.content.benchmarkData && config.content.benchmarkData.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">Metric</th>
                        <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">Value</th>
                        <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {config.content.benchmarkData.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-2 text-gray-800 dark:text-gray-200">{row.metric}</td>
                          <td className="py-2 text-gray-700 dark:text-gray-300">{row.value}</td>
                          <td className="py-2 text-gray-600 dark:text-gray-400">{row.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
          <AdUnit slot="calculator-in-content" className="mt-8" />
        </div>
      )}
      faqSection={hideContent ? undefined : (
        <div className="space-y-3">
          {config.content.faq.map((item, i) => (
            <details key={i} className="group rounded-lg border border-gray-200 dark:border-gray-700 bg-card-bg">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                {item.question}
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-500 group-open:rotate-180 transition-transform text-xl leading-none select-none" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>expand_more</span>
              </summary>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {renderContent(item.answer, config.slug)}
              </div>
            </details>
          ))}
        </div>
      )}
      embedButton={
        <div className="flex items-center gap-2">
          <ShareButton inputs={valuesA} category={config.category} slug={config.slug} />
          <button
            type="button"
            onClick={() => setEmbedOpen(true)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
          >
            Embed
          </button>
        </div>
      }
      relatedCalculators={
        relatedCalculators && relatedCalculators.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedCalculators.map((rc) => (
              <a
                key={rc.slug}
                href={`/${rc.category}/${rc.slug}`}
                className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-card-bg p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <h3 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {rc.meta.title}
                </h3>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{rc.meta.description}</p>
              </a>
            ))}
          </div>
        ) : undefined
      }
    >
      {compareMode ? (
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-[#008387]" aria-hidden />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#008387]">Scenario A</h3>
            </div>
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
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-[#143562]" aria-hidden />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#143562]">Scenario B</h3>
            </div>
            {config.inputs.map((input) => (
              <InputSlider
                key={input.id}
                id={input.id}
                label={input.label}
                type={input.type}
                value={valuesB[input.id] ?? 0}
                onChange={(val) => setValue("b", input.id, val)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
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
            <button
              type="button"
              onClick={reset}
              className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 underline"
            >
              Reset all values
            </button>
          </div>
          <div className="flex-1 space-y-3" aria-live="polite" aria-label="Calculation results">
            {resultsA.map((r) => (
              <ResultCard key={r.id} value={String(r.value)} label={r.label} type={r.type} isPrimary={r.isPrimary} metricKey={metricKey ?? undefined} rawValue={typeof r.value === "number" ? r.value : undefined} stage={stage} />
            ))}
          </div>
        </div>
      )}

      {!compareMode && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700/50 pt-4">
          <button
            type="button"
            onClick={() => setCompareMode(true)}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-500/50 px-4 py-3 text-sm font-medium text-brand-600 dark:text-brand-400 transition-all hover:border-brand-500 hover:bg-brand-500/5 hover:text-brand-700 dark:hover:text-brand-300"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add Scenario B to compare
          </button>
          <Insights
            title={config.meta.title}
            description={config.meta.description}
            category={config.category}
            inputs={aiInputs}
            outputs={aiOutputs}
          />
        </div>
      )}

      {compareMode && (
        <div className="mt-8 space-y-6 border-t border-gray-200 dark:border-gray-700/50 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Results Comparison</h3>
            {deltaModeToggle}
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#008387]" aria-hidden />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Scenario A</span>
              </div>
              {resultsA.map((r) => (
                <ResultCard key={r.id} value={String(r.value)} label={r.label} type={r.type} isPrimary={r.isPrimary} metricKey={metricKey ?? undefined} rawValue={typeof r.value === "number" ? r.value : undefined} stage={stage} />
              ))}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#143562]" aria-hidden />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Scenario B</span>
              </div>
              {resultsB.map((r) => {
                const other = resultsA.find((ra) => ra.id === r.id);
                return (
                  <div key={r.id} className="relative">
                    <ResultCard value={String(r.value)} label={r.label} type={r.type} isPrimary={r.isPrimary} metricKey={metricKey ?? undefined} rawValue={typeof r.value === "number" ? r.value : undefined} stage={stage} />
                    {other && (
                      <div className="mt-1 flex justify-center">
                        <DeltaBadge valueA={typeof other.value === "number" ? other.value : 0} valueB={typeof r.value === "number" ? r.value : 0} type={r.type} mode={deltaMode} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {chartSection}

          <div className="flex items-center justify-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700/50">
            <button
              type="button"
              onClick={() => setCompareMode(false)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
            >
              Back to single view
            </button>
            <button
              type="button"
              onClick={reset}
              className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 underline"
            >
              Reset both scenarios
            </button>
          </div>
        </div>
      )}

      <p className="mt-8 text-xs text-gray-600 dark:text-gray-400 text-center px-4">
        Disclaimer: Results are for informational purposes only and should not be considered financial advice.
        SaaStainedNumbers is not responsible for any decisions made based on these calculations.
      </p>
      <EmbedModal
        slug={config.slug}
        title={config.meta.title}
        open={embedOpen}
        onClose={() => setEmbedOpen(false)}
      />
    </CalculatorShell>
    </>
  );
}
