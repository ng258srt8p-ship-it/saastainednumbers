"use client";

import { useEffect, useMemo } from "react";
import { InputSlider } from "@/calculators/ui/InputSlider";
import { ResultCard } from "@/calculators/ui/ResultCard";
import { useCalculatorState } from "@/lib/useCalculatorState";
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
import type { CalculatorConfig } from "@/calculators/config/calculator-schema";

interface Props {
  slug: string;
  config: CalculatorConfig;
}

const engines: Record<string, (params: Record<string, number>) => Record<string, number>> = {
  "mrr-calculator": (p) => { const r = calculateMRR({ customers: p.customers, arpu: p.arpu }); return { mrr: r.mrr, arr: r.arr }; },
  "cac-calculator": (p) => { const r = calculateCAC({ salesCost: p.salesCost, marketingCost: p.marketingCost, newCustomers: p.newCustomers }); return { cac: r.cac }; },
  "ltv-calculator": (p) => { const r = calculateLTV({ arpu: p.arpu, grossMargin: p.grossMargin, churnRate: p.churnRate }); return { ltv: r.ltv, ltvCacRatio: r.ltvCacRatio }; },
  "churn-calculator": (p) => { const r = calculateChurn({ customersStart: p.customersStart, customersEnd: p.customersEnd, lostCustomers: p.lostCustomers }); return { monthlyChurnPct: r.monthlyChurnPct, annualChurnPct: r.annualChurnPct, retainedCustomers: r.retainedCustomers }; },
  "arpu-calculator": (p) => { const r = calculateARPU({ mrr: p.mrr, totalCustomers: p.totalCustomers }); return { arpu: r.arpu }; },
  "burn-rate-calculator": (p) => {
    const r = p.cashReserves > 0
      ? calculateRunway({ monthlyExpenses: p.monthlyExpenses, monthlyRevenue: p.monthlyRevenue, cashReserves: p.cashReserves })
      : { ...calculateBurnRate({ monthlyExpenses: p.monthlyExpenses, monthlyRevenue: p.monthlyRevenue }), runwayMonths: 0, cashReserves: 0 };
    return { netBurnRate: r.netBurnRate, grossBurnRate: r.grossBurnRate, runwayMonths: r.runwayMonths };
  },
  "payback-period-calculator": (p) => { const r = calculatePaybackPeriod({ cac: p.cac, arpu: p.arpu, grossMargin: p.grossMargin }); return { paybackPeriodMonths: r.paybackPeriodMonths, yearlyProfit: r.yearlyProfit }; },
  "nrr-calculator": (p) => { const r = calculateNRR({ startMrr: p.startMrr, expansionMrr: p.expansionMrr, churnedMrr: p.churnedMrr, contractionMrr: p.contractionMrr }); return { nrr: r.nrr, netRetentionRate: r.netRetentionRate, grossRetentionRate: r.grossRetentionRate }; },
  "gross-margin-calculator": (p) => { const r = calculateGrossMargin({ revenue: p.revenue, cogs: p.cogs }); return { grossMargin: r.grossMargin, grossProfit: r.grossProfit, cogsPercentage: r.cogsPercentage }; },
  "quick-ratio-calculator": (p) => { const r = calculateQuickRatio({ newMrr: p.newMrr, expansionMrr: p.expansionMrr, churnedMrr: p.churnedMrr, contractionMrr: p.contractionMrr }); return { quickRatio: r.quickRatio, growthMrr: r.growthMrr, lostMrr: r.lostMrr }; },
  "cac-ltv-ratio-calculator": (p) => { const r = calculateCACLTVRatio({ ltv: p.ltv, cac: p.cac }); return { ratio: r.ratio }; },
  "magic-number-calculator": (p) => { const r = calculateMagicNumber({ newArr: p.newArr, salesMarketingSpend: p.salesMarketingSpend }); return { magicNumber: r.magicNumber }; },
  "rule-of-40-calculator": (p) => { const r = calculateRuleOf40({ revenueGrowthRate: p.revenueGrowthRate, profitMargin: p.profitMargin }); return { ruleOf40Score: r.ruleOf40Score, meetsThreshold: r.meetsThreshold ? 1 : 0 }; },
  "contribution-margin-calculator": (p) => { const r = calculateContributionMargin({ revenue: p.revenue, variableCosts: p.variableCosts }); return { contributionMargin: r.contributionMargin, contributionMarginPct: r.contributionMarginPct }; },
  "operating-margin-calculator": (p) => { const r = calculateOperatingMargin({ operatingIncome: p.operatingIncome, revenue: p.revenue }); return { operatingMargin: r.operatingMargin }; },
  "revenue-per-employee-calculator": (p) => { const r = calculateRevenuePerEmployee({ totalRevenue: p.totalRevenue, headcount: p.headcount }); return { revenuePerEmployee: r.revenuePerEmployee }; },
  "mrr-growth-rate-calculator": (p) => { const r = calculateMRRGrowthRate({ previousMrr: p.previousMrr, currentMrr: p.currentMrr }); return { growthRate: r.growthRate, mrrChange: r.mrrChange }; },
  "acv-calculator": (p) => { const r = calculateACV({ totalContractValue: p.totalContractValue, contractDurationYears: p.contractDurationYears }); return { acv: r.acv, tcv: r.tcv }; },
  "customer-health-score-calculator": (p) => { const r = calculateCustomerHealthScore({ nps: p.nps, productUsageScore: p.productUsageScore, supportTickets: p.supportTickets, daysSinceLastLogin: p.daysSinceLastLogin }); return { healthScore: r.healthScore, healthCategory: 0 }; },
  "nps-calculator": (p) => { const r = calculateNetPromoterScore({ promoters: p.promoters, passives: p.passives, detractors: p.detractors }); return { nps: r.nps, totalResponses: r.totalResponses, promoterPct: r.promoterPct }; },
  "activation-rate-calculator": (p) => { const r = calculateActivationRate({ signups: p.signups, activated: p.activated }); return { activationRate: r.activationRate, notActivated: r.notActivated }; },
  "trial-to-paid-calculator": (p) => { const r = calculateTrialToPaid({ trialSignups: p.trialSignups, paidConversions: p.paidConversions }); return { conversionRate: r.conversionRate, notConverted: r.notConverted }; },
  "expansion-revenue-rate-calculator": (p) => { const r = calculateExpansionRevenueRate({ beginningMrr: p.beginningMrr, expansionMrr: p.expansionMrr }); return { expansionRevenueRate: r.expansionRevenueRate }; },
  "net-cash-flow-calculator": (p) => { const r = calculateNetCashFlow({ cashIn: p.cashIn, cashOut: p.cashOut }); return { netCashFlow: r.netCashFlow, burnRate: r.burnRate, isPositive: r.isPositive ? 1 : 0 }; },
  "lead-conversion-rate-calculator": (p) => { const r = calculateLeadConversionRate({ leads: p.leads, customers: p.customers }); return { conversionRate: r.conversionRate, lostLeads: r.lostLeads }; },
};

export function EmbedClient({ slug, config }: Props) {
  const inputIds = config.inputs.map((i) => i.id);
  const { values, setValue } = useCalculatorState(inputIds);

  const results = useMemo(() => {
    const engine = engines[slug];
    let computed: Record<string, number> = {};
    if (engine) {
      try { computed = engine(values); } catch { computed = {}; }
    }
    return config.outputs.map((o) => ({
      id: o.id, value: computed[o.id] ?? 0, label: o.label, type: o.type, isPrimary: o.isPrimary,
    }));
  }, [values, slug, config]);

  // Post results to parent window for postMessage API
  useEffect(() => {
    const payload = {
      source: "saasifactory-embed",
      slug,
      inputs: values,
      results: results.reduce((acc, r) => ({ ...acc, [r.id]: r.value }), {} as Record<string, number>),
    };
    window.parent.postMessage(payload, "*");
  }, [results, values, slug]);

  // Listen for input updates from parent
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.source === "webcalc-parent" && event.data.slug === slug) {
        for (const [key, val] of Object.entries(event.data.inputs || {})) {
          if (typeof val === "number") setValue(key, val);
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
            value={values[input.id] ?? 0}
            onChange={(val) => setValue(input.id, val)}
          />
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {results.map((r) => (
          <ResultCard key={r.id} value={String(r.value)} label={r.label} type={r.type} isPrimary={r.isPrimary} />
        ))}
      </div>
      <div className="mt-4 text-center">
        <a
          href={`https://saasifactory.io/${config.category}/${config.slug}`}
          target="_blank"
          rel="nofollow"
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Powered by Saasifactory
        </a>
      </div>
    </div>
  );
}
