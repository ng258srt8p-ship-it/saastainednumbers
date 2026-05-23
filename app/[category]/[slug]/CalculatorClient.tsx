"use client";

import type { CalculatorConfig } from "@/calculators/config/calculator-schema";
import { CalculatorShell } from "@/calculators/ui/CalculatorShell";
import { InputSlider } from "@/calculators/ui/InputSlider";
import { ResultCard } from "@/calculators/ui/ResultCard";
import { useCalculatorState } from "@/lib/useCalculatorState";
import { useEffect, useMemo, useState } from "react";
import { EmbedModal } from "@/calculators/ui/EmbedModal";
import { FeedbackWidget } from "@/calculators/ui/FeedbackWidget";
import { VerifiedBadge } from "@/calculators/ui/VerifiedBadge";
import { PremiumGate } from "@/components/PremiumGate";
import { analytics } from "@/lib/posthog";
import { getMetricKey } from "@/lib/benchmarks";
import type { Stage } from "@/lib/benchmarks";
import { calculateMRR } from "@/calculators/engine/mrr";
import { calculateCAC } from "@/calculators/engine/cac";
import { calculateLTV } from "@/calculators/engine/ltv";
import { calculateChurn } from "@/calculators/engine/churn";
import { calculateARPU } from "@/calculators/engine/arpu";
import { calculateBurnRate, calculateRunway } from "@/calculators/engine/burn-rate";
import { calculatePaybackPeriod } from "@/calculators/engine/payback-period";
import { calculateNRR } from "@/calculators/engine/nrr";
import { calculateGrossMargin } from "@/calculators/engine/gross-margin";
import { calculateQuickRatio } from "@/calculators/engine/quick-ratio";
import { calculateCACLTVRatio } from "@/calculators/engine/cac-ltv-ratio";
import { calculateMagicNumber } from "@/calculators/engine/magic-number";
import { calculateRuleOf40 } from "@/calculators/engine/rule-of-40";
import { calculateContributionMargin } from "@/calculators/engine/contribution-margin";
import { calculateOperatingMargin } from "@/calculators/engine/operating-margin";
import { calculateRevenuePerEmployee } from "@/calculators/engine/revenue-per-employee";
import { calculateMRRGrowthRate } from "@/calculators/engine/mrr-growth-rate";
import { calculateACV } from "@/calculators/engine/acv";
import { calculateCustomerHealthScore } from "@/calculators/engine/customer-health-score";
import { calculateNetPromoterScore } from "@/calculators/engine/nps";
import { calculateActivationRate } from "@/calculators/engine/activation-rate";
import { calculateTrialToPaid } from "@/calculators/engine/trial-to-paid";
import { calculateExpansionRevenueRate } from "@/calculators/engine/expansion-revenue-rate";
import { calculateNetCashFlow } from "@/calculators/engine/net-cash-flow";
import { calculateLeadConversionRate } from "@/calculators/engine/lead-conversion-rate";

interface RelatedCalc {
  slug: string;
  category: string;
  meta: { title: string; description: string };
}

interface Props {
  config: CalculatorConfig;
  relatedCalculators?: RelatedCalc[];
}

const engines: Record<string, (params: Record<string, number>) => Record<string, number>> = {
  "mrr-calculator": (p) => {
    const r = calculateMRR({ customers: p.customers, arpu: p.arpu });
    return { mrr: r.mrr, arr: r.arr };
  },
  "cac-calculator": (p) => {
    const r = calculateCAC({ salesCost: p.salesCost, marketingCost: p.marketingCost, newCustomers: p.newCustomers });
    return { cac: r.cac };
  },
  "ltv-calculator": (p) => {
    const r = calculateLTV({ arpu: p.arpu, grossMargin: p.grossMargin, churnRate: p.churnRate });
    return { ltv: r.ltv, ltvCacRatio: r.ltvCacRatio };
  },
  "churn-calculator": (p) => {
    const r = calculateChurn({ customersStart: p.customersStart, customersEnd: p.customersEnd, lostCustomers: p.lostCustomers });
    return { monthlyChurnPct: r.monthlyChurnPct, annualChurnPct: r.annualChurnPct, retainedCustomers: r.retainedCustomers };
  },
  "arpu-calculator": (p) => {
    const r = calculateARPU({ mrr: p.mrr, totalCustomers: p.totalCustomers });
    return { arpu: r.arpu };
  },
  "burn-rate-calculator": (p) => {
    const r = p.cashReserves > 0
      ? calculateRunway({ monthlyExpenses: p.monthlyExpenses, monthlyRevenue: p.monthlyRevenue, cashReserves: p.cashReserves })
      : { ...calculateBurnRate({ monthlyExpenses: p.monthlyExpenses, monthlyRevenue: p.monthlyRevenue }), runwayMonths: 0, cashReserves: 0 };
    return { netBurnRate: r.netBurnRate, grossBurnRate: r.grossBurnRate, runwayMonths: r.runwayMonths };
  },
  "payback-period-calculator": (p) => {
    const r = calculatePaybackPeriod({ cac: p.cac, arpu: p.arpu, grossMargin: p.grossMargin });
    return { paybackPeriodMonths: r.paybackPeriodMonths, yearlyProfit: r.yearlyProfit };
  },
  "nrr-calculator": (p) => {
    const r = calculateNRR({ startMrr: p.startMrr, expansionMrr: p.expansionMrr, churnedMrr: p.churnedMrr, contractionMrr: p.contractionMrr });
    return { nrr: r.nrr, netRetentionRate: r.netRetentionRate, grossRetentionRate: r.grossRetentionRate };
  },
  "gross-margin-calculator": (p) => {
    const r = calculateGrossMargin({ revenue: p.revenue, cogs: p.cogs });
    return { grossMargin: r.grossMargin, grossProfit: r.grossProfit, cogsPercentage: r.cogsPercentage };
  },
  "quick-ratio-calculator": (p) => {
    const r = calculateQuickRatio({ newMrr: p.newMrr, expansionMrr: p.expansionMrr, churnedMrr: p.churnedMrr, contractionMrr: p.contractionMrr });
    return { quickRatio: r.quickRatio, growthMrr: r.growthMrr, lostMrr: r.lostMrr };
  },
  "cac-ltv-ratio-calculator": (p) => {
    const r = calculateCACLTVRatio({ ltv: p.ltv, cac: p.cac });
    return { ratio: r.ratio };
  },
  "magic-number-calculator": (p) => {
    const r = calculateMagicNumber({ newArr: p.newArr, salesMarketingSpend: p.salesMarketingSpend });
    return { magicNumber: r.magicNumber };
  },
  "rule-of-40-calculator": (p) => {
    const r = calculateRuleOf40({ revenueGrowthRate: p.revenueGrowthRate, profitMargin: p.profitMargin });
    return { ruleOf40Score: r.ruleOf40Score, meetsThreshold: r.meetsThreshold ? 1 : 0 };
  },
  "contribution-margin-calculator": (p) => {
    const r = calculateContributionMargin({ revenue: p.revenue, variableCosts: p.variableCosts });
    return { contributionMargin: r.contributionMargin, contributionMarginPct: r.contributionMarginPct };
  },
  "operating-margin-calculator": (p) => {
    const r = calculateOperatingMargin({ operatingIncome: p.operatingIncome, revenue: p.revenue });
    return { operatingMargin: r.operatingMargin };
  },
  "revenue-per-employee-calculator": (p) => {
    const r = calculateRevenuePerEmployee({ totalRevenue: p.totalRevenue, headcount: p.headcount });
    return { revenuePerEmployee: r.revenuePerEmployee };
  },
  "mrr-growth-rate-calculator": (p) => {
    const r = calculateMRRGrowthRate({ previousMrr: p.previousMrr, currentMrr: p.currentMrr });
    return { growthRate: r.growthRate, mrrChange: r.mrrChange };
  },
  "acv-calculator": (p) => {
    const r = calculateACV({ totalContractValue: p.totalContractValue, contractDurationYears: p.contractDurationYears });
    return { acv: r.acv, tcv: r.tcv };
  },
  "customer-health-score-calculator": (p) => {
    const r = calculateCustomerHealthScore({ nps: p.nps, productUsageScore: p.productUsageScore, supportTickets: p.supportTickets, daysSinceLastLogin: p.daysSinceLastLogin });
    return { healthScore: r.healthScore, healthCategory: 0 };
  },
  "nps-calculator": (p) => {
    const r = calculateNetPromoterScore({ promoters: p.promoters, passives: p.passives, detractors: p.detractors });
    return { nps: r.nps, totalResponses: r.totalResponses, promoterPct: r.promoterPct };
  },
  "activation-rate-calculator": (p) => {
    const r = calculateActivationRate({ signups: p.signups, activated: p.activated });
    return { activationRate: r.activationRate, notActivated: r.notActivated };
  },
  "trial-to-paid-calculator": (p) => {
    const r = calculateTrialToPaid({ trialSignups: p.trialSignups, paidConversions: p.paidConversions });
    return { conversionRate: r.conversionRate, notConverted: r.notConverted };
  },
  "expansion-revenue-rate-calculator": (p) => {
    const r = calculateExpansionRevenueRate({ beginningMrr: p.beginningMrr, expansionMrr: p.expansionMrr });
    return { expansionRevenueRate: r.expansionRevenueRate };
  },
  "net-cash-flow-calculator": (p) => {
    const r = calculateNetCashFlow({ cashIn: p.cashIn, cashOut: p.cashOut });
    return { netCashFlow: r.netCashFlow, burnRate: r.burnRate, isPositive: r.isPositive ? 1 : 0 };
  },
  "lead-conversion-rate-calculator": (p) => {
    const r = calculateLeadConversionRate({ leads: p.leads, customers: p.customers });
    return { conversionRate: r.conversionRate, lostLeads: r.lostLeads };
  },
};

export function CalculatorClient({ config, relatedCalculators }: Props) {
  const [embedOpen, setEmbedOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("series-a");
  const inputIds = config.inputs.map((i) => i.id);
  const { values, setValue, reset } = useCalculatorState(inputIds);

  const metricKey = getMetricKey(config.slug);

  const results = useMemo(() => {
    const engine = engines[config.slug];
    let computedValues: Record<string, number> = {};
    if (engine) {
      try {
        computedValues = engine(values);
      } catch {
        computedValues = {};
      }
    }
    return config.outputs.map((output) => ({
      id: output.id,
      value: computedValues[output.id] ?? 0,
      label: output.label,
      type: output.type,
      isPrimary: output.isPrimary,
    }));
  }, [values, config]);

  const primaryValue = results.find((r) => r.isPrimary)?.value ?? 0;
  useEffect(() => {
    if (primaryValue > 0) {
      analytics.calculate(config.slug, values);
    }
  }, [primaryValue, config.slug, values]);

  return (
    <CalculatorShell
      title={config.meta.title}
      description={config.meta.description}
      stageSelector={
        <div className="flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-900 p-0.5 text-xs">
          {(["seed", "series-a", "series-b", "series-c", "growth"] as Stage[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStage(s)}
              className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                stage === s
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {s === "series-a" ? "Series A" : s === "series-b" ? "Series B" : s === "series-c" ? "Series C" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      }
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: config.category.charAt(0).toUpperCase() + config.category.slice(1), href: `/${config.category}` },
        { label: config.meta.title },
      ]}
      verifiedBadge={
        <VerifiedBadge
          source="SaaS Industry Reports 2025"
          sourceUrl="https://saasifactory.io"
          date="May 2026"
        />
      }
      feedbackWidget={<FeedbackWidget slug={config.slug} />}
      contentSection={
        <div className="space-y-8">
          <section>
            <p className="text-lg leading-relaxed text-gray-300">{config.content.intro}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100">How to Use This Calculator</h2>
            <ol className="list-decimal pl-5 space-y-2">
              {config.content.howToUse.split(".").filter(Boolean).map((step, i) => (
                <li key={i} className="text-gray-400">{step.trim()}.</li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl bg-brand-950/40 border border-brand-800/50 p-6">
            <h2 className="text-xl font-bold text-gray-100 mb-3">Formula & Worked Example</h2>
            <div className="font-mono text-sm bg-gray-800/50 rounded-lg p-4 border border-brand-800/30 mb-4">
              {config.content.formulaExplanation.split(". ").map((part, i) => (
                <p key={i} className="mb-1 text-gray-300">{part}{i === 0 ? ":" : "."}</p>
              ))}
            </div>
          </section>

          {config.content.benchmarks && (
          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-3">Industry Benchmarks</h2>
              <p className="text-gray-300 mb-4">{config.content.benchmarks}</p>
              {config.content.benchmarkData && config.content.benchmarkData.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 font-medium text-gray-400">Metric</th>
                        <th className="text-left py-2 font-medium text-gray-400">Value</th>
                        <th className="text-left py-2 font-medium text-gray-400">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {config.content.benchmarkData.map((row, i) => (
                        <tr key={i} className="border-b border-gray-800">
                          <td className="py-2 text-gray-200">{row.metric}</td>
                          <td className="py-2 text-gray-300">{row.value}</td>
                          <td className="py-2 text-gray-500">{row.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </div>
      }
      faqSection={
        <div className="space-y-3">
          {config.content.faq.map((item, i) => (
            <details key={i} className="group rounded-lg border border-gray-700 bg-card-bg">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-gray-200 hover:bg-gray-700/30">
                {item.question}
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="border-t border-gray-700 px-4 py-3 text-sm text-gray-400">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      }
      embedButton={
        <button
          type="button"
          onClick={() => setEmbedOpen(true)}
          className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-700/30 transition-colors"
        >
          Embed
        </button>
      }
      relatedCalculators={
        relatedCalculators && relatedCalculators.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedCalculators.map((rc) => (
              <a
                key={rc.slug}
                href={`/${rc.category}/${rc.slug}`}
                className="group rounded-xl border border-gray-700 bg-card-bg p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <h3 className="font-medium text-gray-200 group-hover:text-brand-400 transition-colors">
                  {rc.meta.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{rc.meta.description}</p>
              </a>
            ))}
          </div>
        ) : undefined
      }
    >
      <PremiumGate premium={config.premium ?? false}>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            {config.inputs.map((input) => (
              <InputSlider
                key={input.id}
                id={input.id}
                label={input.label}
                type={input.type}
                value={values[input.id] ?? 0}
                onChange={(val) => setValue(input.id, val)}
              />
            ))}
            <button
              type="button"
              onClick={reset}
              className="text-sm text-brand-600 hover:text-brand-700 underline"
            >
              Reset all values
            </button>
          </div>
        <div className="flex-1 space-y-3" aria-live="polite" aria-label="Calculation results">
          {results.map((r) => (
            <ResultCard key={r.id} value={String(r.value)} label={r.label} type={r.type} isPrimary={r.isPrimary} metricKey={metricKey ?? undefined} rawValue={r.value} stage={stage} />
          ))}
        </div>
        </div>
      </PremiumGate>
      <EmbedModal
        slug={config.slug}
        title={config.meta.title}
        open={embedOpen}
        onClose={() => setEmbedOpen(false)}
      />
    </CalculatorShell>
  );
}
