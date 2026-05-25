interface InputValue {
  id: string;
  label: string;
  value: number;
  type: string;
}

interface OutputValue {
  id: string;
  label: string;
  value: string | number;
  type: string;
  isPrimary?: boolean;
}

interface InsightContext {
  title: string;
  description: string;
  category: string;
  inputs?: InputValue[];
  outputs?: OutputValue[];
}

function fmt(val: string | number, type: string): string {
  if (typeof val === "string") return val;
  if (typeof val !== "number" || isNaN(val) || !isFinite(val)) return "N/A";
  if (type === "currency") {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val.toLocaleString()}`;
  }
  if (type === "percentage") return `${val.toFixed(1)}%`;
  if (type === "ratio") return `${val.toFixed(2)}x`;
  return `${val.toFixed(1)}`;
}

function primaryOutput(outputs: OutputValue[] | undefined): OutputValue | undefined {
  if (!outputs || !outputs.length) return undefined;
  return outputs.find((o) => o.isPrimary) || outputs[0];
}

function primaryNum(outputs: OutputValue[] | undefined): number | null {
  const p = primaryOutput(outputs);
  if (!p) return null;
  if (typeof p.value !== "number") return null;
  if (isNaN(p.value) || !isFinite(p.value)) return null;
  return p.value;
}

function findInput(inputs: InputValue[] | undefined, labelKeywords: string[]): number | null {
  if (!inputs) return null;
  for (const inp of inputs) {
    if (inp.label && labelKeywords.some((kw) => inp.label.toLowerCase().includes(kw))) {
      return inp.value;
    }
  }
  return null;
}

function findOutput(outputs: OutputValue[] | undefined, idSubstring: string): OutputValue | undefined {
  if (!outputs) return undefined;
  return outputs.find((o) => o.id && o.id.includes(idSubstring));
}

function typeOfPrimary(outputs: OutputValue[] | undefined): string {
  if (!outputs || !outputs.length) return "number";
  const p = primaryOutput(outputs);
  return p?.type || "number";
}

/* ─── Generic type-based handlers ─────────────────────────────────── */

function numberInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const label = primaryOutput(ctx.outputs)?.label || "value";
  const id = primaryOutput(ctx.outputs)?.id || "";
  const insights: string[] = [];

  if (id.includes("score") || id.includes("nps") || label.toLowerCase().includes("score")) {
    if (val >= 72) {
      insights.push(`Your ${label} of ${val} is excellent. Scores above 72 indicate strong performance  -  you're in the top tier for this metric.`);
    } else if (val >= 50) {
      insights.push(`Your ${label} of ${val} is good. Above 50 is considered healthy  -  focus on understanding what's driving the score to maintain momentum.`);
    } else if (val >= 30) {
      insights.push(`Your ${label} of ${val} is average. Below 50 indicates room for improvement  -  identify the key drivers and create an action plan.`);
    } else {
      insights.push(`Your ${label} of ${val} needs attention. Scores below 30 signal significant issues  -  conduct a root cause analysis to identify the core problems.`);
    }
  } else if (id.includes("month") || id.includes("payback") || label.toLowerCase().includes("month")) {
    if (val <= 6) {
      insights.push(`Your ${label} of ${val} months is excellent. Quick payback means efficient capital deployment  -  reinvest in growth channels that work.`);
    } else if (val <= 12) {
      insights.push(`Your ${label} of ${val} months is healthy. This is within the target range for most SaaS businesses  -  monitor it quarterly.`);
    } else if (val <= 24) {
      insights.push(`Your ${label} of ${val} months is average but above the ideal 12-month target. Reducing this by improving retention or margin will improve unit economics.`);
    } else {
      insights.push(`Your ${label} of ${val} months is concerning. Long payback periods strain cash flow  -  focus on higher-margin products or shorter sales cycles.`);
    }
  } else {
    insights.push(`Your ${label} is ${val}. Monitor this over time  -  trends matter more than a single data point. Compare against your historical data to gauge direction.`);
  }

  return insights;
}

function ratioInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const label = primaryOutput(ctx.outputs)?.label || "value";
  const insights: string[] = [];

  if (val < 0) {
    insights.push(`Your ${label.toLowerCase()} is negative (${fmt(val, "ratio")})  -  losses exceed gains. This is a critical signal that requires immediate strategic review.`);
  } else if (val > 10) {
    insights.push(`Your ${label.toLowerCase()} of ${fmt(val, "ratio")} is exceptionally high. Verify the underlying data  -  extreme ratios can indicate measurement issues or exceptional performance.`);
  } else {
    insights.push(`Your ${label.toLowerCase()} is ${fmt(val, "ratio")}. Track this ratio over consecutive periods  -  improving or stable trends confirm healthy operations.`);
  }

  return insights;
}

function percentageInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const label = primaryOutput(ctx.outputs)?.label || "rate";
  const insights: string[] = [];

  if (val > 90) {
    insights.push(`Your ${label.toLowerCase()} of ${fmt(val, "percentage")} is outstanding. You're in the top tier of performance  -  focus on maintaining this level as you scale.`);
  } else if (val > 75) {
    insights.push(`Your ${label.toLowerCase()} of ${fmt(val, "percentage")} is strong. Well above average  -  look for incremental improvements in the areas with the most leverage.`);
  } else if (val > 50) {
    insights.push(`Your ${label.toLowerCase()} of ${fmt(val, "percentage")} is solid. Room for improvement exists  -  benchmark against industry leaders to identify your biggest gaps.`);
  } else if (val > 25) {
    insights.push(`Your ${label.toLowerCase()} of ${fmt(val, "percentage")} is below the healthy range. This should be a priority focus area  -  small improvements compound significantly.`);
  } else {
    insights.push(`Your ${label.toLowerCase()} of ${fmt(val, "percentage")} needs urgent attention. Develop a focused strategy to improve this metric  -  it's critical to business health.`);
  }

  return insights;
}

function currencyInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const label = primaryOutput(ctx.outputs)?.label || "amount";
  const insights: string[] = [];

  if (val > 1_000_000) {
    insights.push(`Your ${label.toLowerCase()} of ${fmt(val, "currency")} is substantial. Track this against your targets and understand the key drivers behind the number.`);
  } else if (val > 100_000) {
    insights.push(`Your ${label.toLowerCase()} of ${fmt(val, "currency")} is significant. Review the components driving this and identify optimization opportunities.`);
  } else if (val > 10_000) {
    insights.push(`Your ${label.toLowerCase()} of ${fmt(val, "currency")} shows real traction. Focus on the channels and activities driving this result.`);
  } else {
    insights.push(`Your ${label.toLowerCase()} of ${fmt(val, "currency")} is manageable at your current stage. As you scale, keep a close eye on how this trends.`);
  }

  return insights;
}

function categoryFallback(ctx: InsightContext): string[] {
  const type = typeOfPrimary(ctx.outputs);
  switch (type) {
    case "currency": return currencyInsights(ctx);
    case "percentage": return percentageInsights(ctx);
    case "ratio": return ratioInsights(ctx);
    case "number": return numberInsights(ctx);
    default: return [];
  }
}

/* ─── Dedicated: Revenue ──────────────────────────────────────────── */

function nrrInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val >= 120) {
    insights.push(`NRR of ${fmt(val, "percentage")} is best-in-class (>120%). Your existing customers are expanding faster than churn is reducing revenue  -  the hallmark of a truly product-led growth engine.`);
  } else if (val >= 110) {
    insights.push(`NRR of ${fmt(val, "percentage")} is strong (110-120%). Net negative churn drives compounding growth  -  every dollar from last year is worth more this year.`);
  } else if (val >= 100) {
    insights.push(`NRR of ${fmt(val, "percentage")} is average (100-110%). Your growth from expansions roughly offsets churn. Improving onboarding and upsell paths can push this above 110%.`);
  } else if (val >= 90) {
    insights.push(`NRR of ${fmt(val, "percentage")} means you're shrinking (below 100%). Revenue from existing customers is declining  -  reducing churn should be your top priority.`);
  } else {
    insights.push(`NRR of ${fmt(val, "percentage")} is concerning. Significant contraction means customers are downsizing or leaving. Conduct exit interviews to understand the root causes.`);
  }

  return insights;
}

function grossMarginInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val >= 85) {
    insights.push(`Gross margin of ${fmt(val, "percentage")} is elite. Top-quartile SaaS companies maintain 80%+ margins  -  your cost of delivering service is well optimized.`);
  } else if (val >= 75) {
    insights.push(`Gross margin of ${fmt(val, "percentage")} is strong. The SaaS median is ~75%  -  you're at or above the industry standard. Monitor COGS as you scale.`);
  } else if (val >= 60) {
    insights.push(`Gross margin of ${fmt(val, "percentage")} is below the SaaS median of 75%. Review infrastructure, hosting, and support costs to identify margin improvement opportunities.`);
  } else {
    insights.push(`Gross margin of ${fmt(val, "percentage")} is low for SaaS. Low margins make it hard to fund growth  -  explore ways to reduce COGS or increase pricing.`);
  }

  return insights;
}

function mrrGrowthInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val >= 15) {
    insights.push(`Monthly growth of ${fmt(val, "percentage")} is exceptional. At this rate, you'll 10x ARR in under 18 months  -  prioritize capacity and infrastructure to sustain this trajectory.`);
  } else if (val >= 10) {
    insights.push(`Monthly growth of ${fmt(val, "percentage")} is very strong. Most high-growth SaaS companies target 10-15% MoM in early stages. Keep investing in what's working.`);
  } else if (val >= 5) {
    insights.push(`Monthly growth of ${fmt(val, "percentage")} is healthy. Growing 5-10% MoM compounds to 80-210% annually. Focus on repeatable acquisition channels.`);
  } else if (val >= 2) {
    insights.push(`Monthly growth of ${fmt(val, "percentage")} is modest but steady. 2-5% MoM compounds to 27-80% annually. Look for one channel to double down on.`);
  } else {
    insights.push(`Monthly growth of ${fmt(val, "percentage")} is below the healthy range for growth-stage SaaS. Reassess your go-to-market strategy and product-market fit.`);
  }

  return insights;
}

function trialConversionInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val >= 25) {
    insights.push(`Trial conversion of ${fmt(val, "percentage")} is excellent. Top-quartile SaaS companies convert 25%+ of trials. Your onboarding and product experience are driving results.`);
  } else if (val >= 15) {
    insights.push(`Trial conversion of ${fmt(val, "percentage")} is above average (median is ~15%). Improving time-to-value and in-app guidance can push this higher.`);
  } else if (val >= 5) {
    insights.push(`Trial conversion of ${fmt(val, "percentage")} is in the typical range (5-15%). Review your activation funnel  -  the biggest drop-off point is the highest leverage place to start.`);
  } else {
    insights.push(`Trial conversion of ${fmt(val, "percentage")} is below average. Consider shortening your trial period, adding personalized onboarding, or implementing a demo request flow.`);
  }

  return insights;
}

function expansionRevenueInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val >= 20) {
    insights.push(`Expansion revenue of ${fmt(val, "percentage")} is outstanding. Expansion from existing customers is the highest-margin growth lever  -  your land-and-expand strategy is working.`);
  } else if (val >= 10) {
    insights.push(`Expansion revenue of ${fmt(val, "percentage")} is healthy. Most SaaS companies see 10-20% expansion annually. Identify your best upsell triggers and automate them.`);
  } else if (val >= 5) {
    insights.push(`Expansion revenue of ${fmt(val, "percentage")} is modest. Consider introducing usage-based pricing or add-on features to create natural expansion opportunities.`);
  } else {
    insights.push(`Expansion revenue of ${fmt(val, "percentage")} is low (<5%). Without expansion, growth depends entirely on new customer acquisition  -  review your upsell and cross-sell motions.`);
  }

  return insights;
}

function revenueCategoryHandler(ctx: InsightContext): string[] {
  const title = ctx.title.toLowerCase();
  if (title.includes("net revenue retention") || title.includes("nrr")) return nrrInsights(ctx);
  if (title.includes("gross margin")) return grossMarginInsights(ctx);
  if (title.includes("mrr growth")) return mrrGrowthInsights(ctx);
  if (title.includes("trial") && title.includes("conversion")) return trialConversionInsights(ctx);
  if (title.includes("expansion revenue")) return expansionRevenueInsights(ctx);
  if (title.includes("arpu")) {
    const val = primaryNum(ctx.outputs);
    if (val !== null && val > 0) {
      return [`Your ARPU of ${fmt(val, "currency")} is the foundation of your unit economics. Track this alongside CAC to ensure your payback period is under 12 months.`];
    }
  }
  if (title.includes("acv")) {
    const val = primaryNum(ctx.outputs);
    if (val !== null && val > 0) {
      return [`Your ACV of ${fmt(val, "currency")} determines how much revenue each customer contributes annually. Higher ACV customers typically have lower churn but longer sales cycles.`];
    }
  }
  if (title.includes("ltv")) {
    const val = primaryNum(ctx.outputs);
    if (val !== null && val > 0) {
      return [`Your LTV of ${fmt(val, "currency")} represents the total value of a customer over their lifetime. A healthy LTV:CAC ratio is 3:1 or higher.`];
    }
  }
  return categoryFallback(ctx);
}

/* ─── Dedicated: Growth & Efficiency ──────────────────────────────── */

function cacInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val < 500) {
    insights.push(`CAC of ${fmt(val, "currency")} is exceptional for SaaS. PLG companies often have sub-$500 CAC  -  maintain your self-serve and viral loops to keep costs low.`);
  } else if (val < 2000) {
    insights.push(`CAC of ${fmt(val, "currency")} is healthy for SMB-focused SaaS. The key is ensuring your LTV:CAC ratio stays above 3:1 to sustain profitable growth.`);
  } else if (val < 5000) {
    insights.push(`CAC of ${fmt(val, "currency")} is typical for mid-market SaaS. Ensure your sales cycle efficiency is optimized  -  longer cycles increase CAC.`);
  } else if (val < 15000) {
    insights.push(`CAC of ${fmt(val, "currency")} is in the enterprise range. High-touch sales requires strong lead qualification to avoid wasting resources on unfit prospects.`);
  } else {
    insights.push(`CAC of ${fmt(val, "currency")} is significant. At this level, each customer must generate sufficient LTV to justify the acquisition cost. Review your sales efficiency metrics.`);
  }

  return insights;
}

function magicNumberInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val >= 1.0) {
    insights.push(`Magic Number of ${fmt(val, "ratio")} is excellent (>1.0x). For every dollar spent on sales & marketing, you're generating over a dollar in new ARR  -  highly efficient.`);
  } else if (val >= 0.75) {
    insights.push(`Magic Number of ${fmt(val, "ratio")} is strong (0.75-1.0x). Your GTM engine is running efficiently  -  this is above the SaaS median of ~0.5-0.7x.`);
  } else if (val >= 0.5) {
    insights.push(`Magic Number of ${fmt(val, "ratio")} is around the SaaS median. A magic number above 0.5x is considered healthy  -  look for ways to optimize sales productivity.`);
  } else {
    insights.push(`Magic Number of ${fmt(val, "ratio")} needs improvement (<0.5x). Your sales and marketing spend isn't generating enough new ARR. Review channel performance and reallocate budget.`);
  }

  return insights;
}

function leadConversionInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];
  const label = primaryOutput(ctx.outputs)?.label?.toLowerCase() || "conversion";

  if (val >= 20) {
    insights.push(`Your ${label} of ${fmt(val, "percentage")} is exceptional. Top-quartile B2B SaaS companies convert at 20%+. Your qualification and sales process are driving results.`);
  } else if (val >= 10) {
    insights.push(`Your ${label} of ${fmt(val, "percentage")} is strong (10-20%). Typical B2B SaaS conversion rates range from 3-15% depending on segment.`);
  } else if (val >= 5) {
    insights.push(`Your ${label} of ${fmt(val, "percentage")} is in the typical B2B range. Improving lead qualification at the top of funnel can increase conversion rates significantly.`);
  } else if (val >= 2) {
    insights.push(`Your ${label} of ${fmt(val, "percentage")} is below average. Review your lead scoring criteria and ensure sales follows up within 5 minutes of lead capture.`);
  } else {
    insights.push(`Your ${label} of ${fmt(val, "percentage")} needs attention. Consider implementing lead nurturing sequences, improving targeting, or refining your ICP.`);
  }

  return insights;
}

function activationRateInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val >= 80) {
    insights.push(`Activation rate of ${fmt(val, "percentage")} is world-class. Over 80% of signups reach the "aha moment"  -  your onboarding experience is a competitive advantage.`);
  } else if (val >= 60) {
    insights.push(`Activation rate of ${fmt(val, "percentage")} is strong. Best-in-class SaaS companies target 60%+. Identify the users who didn't activate and understand where they dropped off.`);
  } else if (val >= 40) {
    insights.push(`Activation rate of ${fmt(val, "percentage")} is average for SaaS. The gap between signup and activation is the highest-leverage place to improve  -  simplify your onboarding flow.`);
  } else {
    insights.push(`Activation rate of ${fmt(val, "percentage")} is below target. Most users sign up but don't reach value  -  implement a structured onboarding sequence with clear next steps.`);
  }

  return insights;
}

function revPerEmployeeInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val >= 500_000) {
    insights.push(`Revenue per employee of ${fmt(val, "currency")} is elite. Top SaaS companies exceed $500K/employee  -  your team is highly leveraged with technology and processes.`);
  } else if (val >= 200_000) {
    insights.push(`Revenue per employee of ${fmt(val, "currency")} is strong. The SaaS median is ~$200-300K. AI-augmented teams are pushing this higher  -  look for automation opportunities.`);
  } else if (val >= 100_000) {
    insights.push(`Revenue per employee of ${fmt(val, "currency")} is below the SaaS median. Review headcount allocation and identify areas where automation or outsourcing could improve efficiency.`);
  } else {
    insights.push(`Revenue per employee of ${fmt(val, "currency")} is low for SaaS. In the AI era, efficient teams are achieving more with fewer people  -  consider restructuring for leverage.`);
  }

  return insights;
}

function growthEfficiencyCategoryHandler(ctx: InsightContext): string[] {
  const title = ctx.title.toLowerCase();
  if (title.includes("burn")) return burnRateInsights(ctx);
  if (title.includes("rule of 40") || title.includes("rule of forty")) return ruleOf40Insights(ctx);
  if (title.includes("quick ratio")) return quickRatioInsights(ctx);
  if (title.includes("cac") && !title.includes("payback")) return cacInsights(ctx);
  if (title.includes("magic number")) return magicNumberInsights(ctx);
  if (title.includes("lead") && title.includes("conversion")) return leadConversionInsights(ctx);
  if (title.includes("activation")) return activationRateInsights(ctx);
  if (title.includes("revenue per employee")) return revPerEmployeeInsights(ctx);
  if (title.includes("nps")) return npsInsights(ctx);
  return categoryFallback(ctx);
}

/* ─── Dedicated: Growth-Efficiency sub-handlers ───────────────────── */

function burnRateInsights(ctx: InsightContext): string[] {
  const netBurn = findOutput(ctx.outputs, "netBurnRate");
  const burnMult = findOutput(ctx.outputs, "burnMultiple");
  const runway = findOutput(ctx.outputs, "runwayMonths");
  const netBurnVal = netBurn && typeof netBurn.value === "number" ? netBurn.value : null;
  const burnMultVal = burnMult && typeof burnMult.value === "number" ? burnMult.value : null;
  const runwayVal = runway && typeof runway.value === "number" ? runway.value : null;
  const insights: string[] = [];

  if (burnMultVal !== null) {
    if (burnMultVal < 1.0) {
      insights.push(`Burn multiple of ${fmt(burnMultVal, "ratio")} is elite  -  you're generating more than $1 of new ARR for every $1 burned. Top performance by KeyBanc 2025 standards.`);
    } else if (burnMultVal < 1.5) {
      insights.push(`Burn multiple of ${fmt(burnMultVal, "ratio")} is top-quartile. You're capital-efficient while still investing in growth  -  maintain this discipline.`);
    } else if (burnMultVal < 2.5) {
      insights.push(`Burn multiple of ${fmt(burnMultVal, "ratio")} is around the median for public SaaS. Look for opportunities to improve growth efficiency.`);
    } else if (burnMultVal < 3.5) {
      insights.push(`Burn multiple of ${fmt(burnMultVal, "ratio")} needs attention. Review your largest cost drivers and growth channels to identify inefficiencies.`);
    } else {
      insights.push(`Burn multiple of ${fmt(burnMultVal, "ratio")} is concerning. Prioritize reducing spend or accelerating growth  -  this level is hard to sustain.`);
    }
  }

  if (netBurnVal !== null) {
    insights.push(`Net burn of ${fmt(netBurnVal, "currency")}/month determines how long your capital lasts. Every dollar of revenue directly reduces this number.`);
  }

  if (runwayVal !== null) {
    if (runwayVal < 6) insights.push(`Only ${runwayVal} months of runway  -  critical. Raise capital, cut costs, or reach profitability within 6 months.`);
    else if (runwayVal < 12) insights.push(`${runwayVal} months of runway gives you some buffer but less than the recommended 12-18 months. Start planning now.`);
    else insights.push(`${runwayVal} months of runway is healthy. Use this breathing room to invest in growth drivers.`);
  }

  return insights;
}

function ruleOf40Insights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];

  if (val >= 40) {
    return [
      `Your Rule of 40 score of ${val}% meets the threshold. Public market investors consider this a sign of healthy, sustainable growth.`,
      `Top-quartile public SaaS companies score 50%+. Use this as your north star for balancing growth and profitability.`,
      `Maintaining 40%+ requires discipline  -  as growth decelerates, profitability must increase to keep the score healthy.`,
    ];
  }

  return [
    `Your Rule of 40 score of ${val}% is below the 40% threshold. Focus on improving either growth rate (top line) or profit margin (bottom line).`,
    `A low Rule of 40 doesn't mean failure  -  many great companies start below 40 and improve over time. Identify which side of the equation is the bigger lever.`,
  ];
}

function quickRatioInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];

  if (val >= 4) {
    return [`Quick Ratio of ${fmt(val, "ratio")} is excellent (>4x). Your growth engine is healthy  -  new and expansion revenue far outweigh churn and contraction.`];
  } else if (val >= 2) {
    return [`Quick Ratio of ${fmt(val, "ratio")} is healthy (2-4x). Growth is outpacing losses. Keep monitoring both sides of the equation.`];
  } else if (val >= 1) {
    return [`Quick Ratio of ${fmt(val, "ratio")} is neutral (1-2x). You're growing, but barely outpacing churn  -  reducing churn will have outsized impact.`];
  } else {
    return [`Quick Ratio of ${fmt(val, "ratio")} means you're shrinking. Revenue losses exceed new gains  -  this needs immediate strategic attention.`];
  }
}

/* ─── Dedicated: Churn & Retention ────────────────────────────────── */

function churnInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val < 2) insights.push(`Monthly churn of ${fmt(val, "percentage")} is excellent  -  well below the typical 3-5%. Your retention is a competitive advantage.`);
  else if (val < 5) insights.push(`Monthly churn of ${fmt(val, "percentage")} is average. Reducing churn by even 1% can dramatically improve LTV.`);
  else if (val < 8) insights.push(`Monthly churn of ${fmt(val, "percentage")} is above healthy range. Implement customer health scoring to identify at-risk accounts.`);
  else insights.push(`Monthly churn of ${fmt(val, "percentage")} is critical. Prioritize retention before acquisition  -  you're losing customers faster than you can grow.`);

  insights.push(`In SaaS, a 5% reduction in churn typically increases profits by 25-95%. Even small retention improvements compound significantly.`);

  return insights;
}

function npsInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];

  if (val > 50) return [`NPS of ${val} is excellent. You have more promoters than passives and detractors combined  -  a strong sign of product-market fit.`];
  if (val > 30) return [`NPS of ${val} is above average (typical SaaS NPS is ~30-40). Convert more passives into promoters to drive organic growth.`];
  if (val > 0) return [`NPS of ${val} is in the typical range. Focus on closing the feedback loop with detractors  -  their reasons often reveal product opportunities.`];
  return [`NPS of ${val} means you have more detractors than promoters. A red flag  -  conduct exit interviews to understand core issues.`];
}

function churnCategoryHandler(ctx: InsightContext): string[] {
  const title = ctx.title.toLowerCase();
  if (title.includes("nps")) return npsInsights(ctx);
  if (title.includes("health") || title.includes("engagement")) {
    const val = primaryNum(ctx.outputs);
    if (val !== null) {
      return [`Your health score of ${val}/100 indicates the overall state of your customer relationships. Scores above 70 are healthy  -  below 40 requires intervention.`];
    }
  }
  return churnInsights(ctx);
}

/* ─── Dedicated: Unit Economics ───────────────────────────────────── */

function cacPaybackInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val <= 6) insights.push(`Payback period of ${val} months is excellent. You recover customer acquisition costs in under 6 months  -  highly capital efficient.`);
  else if (val <= 12) insights.push(`Payback period of ${val} months is healthy. 12 months is the standard target for SaaS  -  reinvest recovered capital into growth.`);
  else if (val <= 24) insights.push(`Payback period of ${val} months is average but above the 12-month target. Improve margins or reduce CAC to shorten payback.`);
  else insights.push(`Payback period of ${val} months is concerning. Long payback strains cash flow  -  prioritize improving gross margin or reducing CAC.`);

  return insights;
}

function operatingMarginInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val >= 20) insights.push(`Operating margin of ${fmt(val, "percentage")} is excellent. Profitable growth at this level is sustainable and attractive to investors.`);
  else if (val >= 10) insights.push(`Operating margin of ${fmt(val, "percentage")} is healthy. You're generating meaningful profit while still investing in growth.`);
  else if (val >= 0) insights.push(`Operating margin of ${fmt(val, "percentage")} means you're breaking even. Focus on reaching 10%+ margin while maintaining growth rates.`);
  else insights.push(`Operating margin of ${fmt(val, "percentage")} means you're operating at a loss. Track this trend closely  -  negative margins are common in growth stages but need a path to profitability.`);

  return insights;
}

function contributionMarginInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val >= 80) insights.push(`Contribution margin of ${fmt(val, "percentage")} is excellent. High contribution margin gives you room to invest in growth while maintaining healthy unit economics.`);
  else if (val >= 60) insights.push(`Contribution margin of ${fmt(val, "percentage")} is healthy. SaaS companies typically target 60-80% contribution margin  -  review variable costs for optimization opportunities.`);
  else if (val >= 40) insights.push(`Contribution margin of ${fmt(val, "percentage")} is below the SaaS standard. High variable costs eat into your ability to fund growth  -  explore ways to reduce delivery costs.`);
  else insights.push(`Contribution margin of ${fmt(val, "percentage")} is low. At this level, scaling revenue may not improve profitability  -  focus on reducing variable costs first.`);

  return insights;
}

function netCashFlowInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val > 0) insights.push(`Net cash flow of ${fmt(val, "currency")}/month is positive  -  you're generating more cash than you spend. This is the goal for any sustainable business.`);
  else insights.push(`Net cash flow of ${fmt(val, "currency")}/month means you're burning cash. Track runway closely and ensure you have a clear path to positive cash flow.`);

  return insights;
}

function unitEconomicsCategoryHandler(ctx: InsightContext): string[] {
  const title = ctx.title.toLowerCase();
  if (title.includes("payback")) return cacPaybackInsights(ctx);
  if (title.includes("operating margin")) return operatingMarginInsights(ctx);
  if (title.includes("contribution margin")) return contributionMarginInsights(ctx);
  if (title.includes("net cash flow")) return netCashFlowInsights(ctx);
  return categoryFallback(ctx);
}

/* ─── Dedicated: General Business ─────────────────────────────────── */

function roiInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val >= 500) insights.push(`ROI of ${fmt(val, "percentage")} is excellent. Your investment is generating 5x+ returns  -  this is top-tier performance for most investment categories.`);
  else if (val >= 100) insights.push(`ROI of ${fmt(val, "percentage")} is good. A 2x return doubles your money  -  any positive ROI above 100% is considered strong.`);
  else if (val >= 0) insights.push(`ROI of ${fmt(val, "percentage")} is marginal. You're breaking even or slightly positive  -  review assumptions and consider whether the investment is worth the risk.`);
  else insights.push(`ROI of ${fmt(val, "percentage")} is negative. The investment is losing money  -  evaluate whether to cut losses or pivot strategy.`);

  return insights;
}

function breakEvenInsights(ctx: InsightContext): string[] {
  const units = findOutput(ctx.outputs, "breakEvenUnits");
  const revenue = findOutput(ctx.outputs, "breakEvenRevenue");
  const unitsVal = units && typeof units.value === "number" ? units.value : null;
  const revenueVal = revenue && typeof revenue.value === "number" ? revenue.value : null;
  const insights: string[] = [];

  if (unitsVal !== null && unitsVal > 0) {
    insights.push(`You need to sell ${unitsVal} units to break even. This is the minimum volume required to cover all fixed and variable costs  -  every unit beyond this is profit.`);
  }

  if (revenueVal !== null && revenueVal > 0) {
    insights.push(`Your break-even revenue is ${fmt(revenueVal, "currency")}. Track progress toward this target monthly  -  being below it means you're operating at a loss.`);
  }

  if (unitsVal === null && revenueVal === null) {
    const val = primaryNum(ctx.outputs);
    if (val !== null) {
      insights.push(`Your break-even point is ${fmt(val, "currency")}. Compare this against your actual or projected sales to understand how close you are to profitability.`);
    }
  }

  return insights;
}

function cashRunwayInsights(ctx: InsightContext): string[] {
  const runway = findOutput(ctx.outputs, "runwayMonths");
  const runwayVal = runway && typeof runway.value === "number" ? runway.value : primaryNum(ctx.outputs);
  if (runwayVal === null) return [];

  if (runwayVal < 6) {
    return [
      `Cash runway of ${runwayVal} months is critical. You have less than 6 months  -  prioritize extending runway through cost reduction, revenue acceleration, or fundraising.`,
      `In the current market, fundraising takes 3-6 months. Start the process immediately if runway is under 9 months.`,
    ];
  } else if (runwayVal < 12) {
    return [
      `Cash runway of ${runwayVal} months provides some buffer but is below the recommended 12-18 months. Begin planning your next funding round or path to profitability.`,
      `Review your burn rate components  -  even small reductions in spend can significantly extend runway at this stage.`,
    ];
  } else if (runwayVal < 18) {
    return [
      `Cash runway of ${runwayVal} months is within the 12-18 month recommendation. This is healthy  -  focus on deploying capital efficiently to reach key milestones.`,
    ];
  } else {
    return [
      `Cash runway of ${runwayVal} months gives you significant operating room. You have the luxury of investing in growth while maintaining a safety buffer.`,
      `Use this runway to invest in initiatives with the highest ROI  -  you have time to experiment and iterate.`,
    ];
  }
}

function businessValuationInsights(ctx: InsightContext): string[] {
  const blended = findOutput(ctx.outputs, "blendedValue");
  const revenueVal = findOutput(ctx.outputs, "revenueBasedValue");
  const val = blended && typeof blended.value === "number" ? blended.value :
    (revenueVal && typeof revenueVal.value === "number" ? revenueVal.value : null);
  if (val === null) return [];

  return [
    `Your estimated valuation is ${fmt(val, "currency")}. This is a rough benchmark  -  actual valuations depend on growth rate, market size, team, and market conditions.`,
    `Current SaaS valuation multiples range from 5-15x ARR for high-growth companies to 2-5x ARR for slower-growth businesses.`,
  ];
}

function employeeCostInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];

  return [
    `Total employee cost of ${fmt(val, "currency")}/year is the fully-loaded cost including salary, benefits, taxes, and overhead. This is typically 1.25-1.4x base salary.`,
    `Employee costs are your largest expense line item in most SaaS companies  -  review headcount ROI regularly to ensure every role is driving toward business goals.`,
  ];
}

function pricingStrategyInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];

  return [
    `Your optimal price point of ${fmt(val, "currency")} is a model output based on your inputs. Test this against actual customer willingness to pay through A/B testing.`,
    `Price is the highest-leverage growth lever  -  a 1% price increase typically yields 8-11% profit improvement without additional cost.`,
  ];
}

function generalBusinessCategoryHandler(ctx: InsightContext): string[] {
  const title = ctx.title.toLowerCase();
  if (title.includes("roi") && !title.includes("social")) return roiInsights(ctx);
  if (title.includes("break-even") || title.includes("break even")) return breakEvenInsights(ctx);
  if (title.includes("cash runway") || title.includes("runway")) return cashRunwayInsights(ctx);
  if (title.includes("valuation")) return businessValuationInsights(ctx);
  if (title.includes("employee cost")) return employeeCostInsights(ctx);
  if (title.includes("pricing")) return pricingStrategyInsights(ctx);
  if (title.includes("contractor") || title.includes("employee")) {
    const val = primaryNum(ctx.outputs);
    if (val !== null) {
      return [`The cost difference is ${fmt(val, "currency")}. Consider not just cost but also flexibility, expertise, and long-term commitment when choosing between contractors and employees.`];
    }
  }
  return categoryFallback(ctx);
}

/* ─── Dedicated: SaaS Deepen ──────────────────────────────────────── */

function saasDeepenCategoryHandler(ctx: InsightContext): string[] {
  const title = ctx.title.toLowerCase();
  if (title.includes("time to value")) {
    const val = primaryNum(ctx.outputs);
    if (val !== null) return [`Time to value of ${fmt(val, "percentage")} indicates how quickly users reach the "aha moment." Shorter time-to-value correlates strongly with higher activation and retention rates.`];
  }
  if (title.includes("feature adoption")) {
    const val = primaryNum(ctx.outputs);
    if (val !== null) return [`Feature adoption rate of ${fmt(val, "percentage")} measures how many users engage with key features. Best-in-class SaaS products achieve 60%+ adoption on core features.`];
  }
  if (title.includes("cohort")) {
    const val = primaryNum(ctx.outputs);
    if (val !== null) return [`Your cohort retention of ${fmt(val, "percentage")} shows how well you retain customers over time. Improving retention by 5% can increase customer lifetime value by 25-95%.`];
  }
  if (title.includes("engagement")) {
    const val = primaryNum(ctx.outputs);
    if (val !== null) return [`Engagement score of ${val} indicates how actively users interact with your product. Higher engagement correlates with lower churn and higher expansion revenue.`];
  }
  if (title.includes("unit economics dashboard")) {
    const insights: string[] = [];
    const ltvCac = findOutput(ctx.outputs, "ltvCacRatio") || findOutput(ctx.outputs, "ratio");
    const val = ltvCac && typeof ltvCac.value === "number" ? ltvCac.value : null;
    if (val !== null) {
      if (val >= 3) insights.push(`LTV:CAC ratio of ${fmt(val, "ratio")} is healthy (above 3:1). Your unit economics support sustainable growth.`);
      else insights.push(`LTV:CAC ratio of ${fmt(val, "ratio")} is below the 3:1 target. Improve retention or reduce CAC to strengthen unit economics.`);
    }
    return insights;
  }
  return categoryFallback(ctx);
}

/* ─── Dedicated: AI Cost ──────────────────────────────────────────── */

function aiCostInsights(ctx: InsightContext): string[] {
  const monthly = findOutput(ctx.outputs, "monthly") || findOutput(ctx.outputs, "costPerMonth");
  const monthlyVal = monthly && typeof monthly.value === "number" ? monthly.value : null;
  const insights: string[] = [];

  if (monthlyVal !== null) {
    if (monthlyVal > 10_000) insights.push(`Monthly AI cost of ${fmt(monthlyVal, "currency")} is significant. Consider consolidating models or implementing caching to reduce spend.`);
    else if (monthlyVal > 1_000) insights.push(`Monthly AI cost of ${fmt(monthlyVal, "currency")} is meaningful. Monitor usage patterns  -  use cheaper models for simpler tasks.`);
    else insights.push(`Monthly AI cost of ${fmt(monthlyVal, "currency")} is modest. As usage scales, negotiate volume pricing and batch requests to stay efficient.`);
  }

  insights.push(`AI costs scale with usage, not users. Implement rate limiting before deploying to production to avoid unexpected bills.`);

  return insights;
}

/* ─── Dedicated: Side Hustle ──────────────────────────────────────── */

function sideHustleInsights(ctx: InsightContext): string[] {
  const revenue = findOutput(ctx.outputs, "revenue") || findOutput(ctx.outputs, "monthlyTotal");
  const income = findOutput(ctx.outputs, "netMonthly") || findOutput(ctx.outputs, "afterTax") || findOutput(ctx.outputs, "netIncome");
  const revVal = revenue && typeof revenue.value === "number" ? revenue.value :
    (income && typeof income.value === "number" ? income.value : null);
  const insights: string[] = [];

  if (revVal !== null) {
    if (revVal > 10_000) insights.push(`Monthly revenue of ${fmt(revVal, "currency")} is substantial for a side hustle. Consider whether this could become a full-time business.`);
    else if (revVal > 1_000) insights.push(`Monthly revenue of ${fmt(revVal, "currency")} shows real traction. Double down on the channel driving the most returns.`);
    else if (revVal > 100) insights.push(`Monthly revenue of ${fmt(revVal, "currency")} proves the concept works. Experiment with new channels to grow.`);
    else insights.push(`Early stages require patience. Most side hustles take 6-12 months to gain traction. Focus on consistency and audience building.`);
  } else {
    const pv = primaryNum(ctx.outputs);
    if (pv !== null) {
      insights.push(`Your primary result of ${fmt(pv, typeOfPrimary(ctx.outputs))} is a starting point. Track this metric monthly to measure your progress.`);
    }
    insights.push(`Time is your scarcest resource as a side hustler. Prioritize activities that directly drive revenue or audience growth.`);
  }

  return insights;
}

/* ─── Dedicated: Personal Finance ─────────────────────────────────── */

function fireInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];

  if (val >= 1_000_000) {
    return [
      `Your FIRE number of ${fmt(val, "currency")} is achievable. At a 4% withdrawal rate, this provides $${(val * 0.04).toLocaleString()}/year in retirement income.`,
      `The 4% rule assumes a 30-year retirement with a portfolio of 60% stocks and 40% bonds. Adjust for your risk tolerance and retirement timeline.`,
    ];
  }
  return [
    `Your FIRE target of ${fmt(val, "currency")} requires disciplined saving. At a 4% withdrawal rate, every $25K saved generates $1,000/year in passive income.`,
    `To accelerate progress, focus on increasing your savings rate  -  the single biggest factor in how fast you reach FIRE is how much you save, not how much you earn.`,
  ];
}

function savingsInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  if (val >= 50) insights.push(`Savings rate of ${fmt(val, "percentage")} is exceptional. At this rate, you could reach FIRE in under 17 years. You're maximizing financial independence speed.`);
  else if (val >= 30) insights.push(`Savings rate of ${fmt(val, "percentage")} is above the recommended 20%. The popular 50/30/20 budget allocates 20% to savings  -  you're exceeding this.`);
  else if (val >= 20) insights.push(`Savings rate of ${fmt(val, "percentage")} meets the 50/30/20 rule recommendation. This is the standard target for building long-term wealth.`);
  else if (val >= 10) insights.push(`Savings rate of ${fmt(val, "percentage")} is below the recommended 20%. Gradually increase by 1-2% each quarter  -  small adjustments add up.`);
  else insights.push(`Savings rate of ${fmt(val, "percentage")} needs improvement. Even saving 5-10% makes a significant difference over time due to compound interest.`);

  return insights;
}

function investmentInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  const totalInvested = findOutput(ctx.outputs, "totalInvested") || findOutput(ctx.outputs, "totalPrincipal");
  const totalInvestedVal = totalInvested && typeof totalInvested.value === "number" ? totalInvested.value : null;

  if (totalInvestedVal !== null && totalInvestedVal > 0 && isFinite(totalInvestedVal)) {
    const gain = val - totalInvestedVal;
    const pct = (gain / totalInvestedVal) * 100;
    if (isFinite(pct) && !isNaN(pct)) {
      if (pct > 0) {
        insights.push(`Your portfolio grew by ${fmt(Math.abs(gain), "currency")} (${pct.toFixed(1)}% return). The S&P 500 has historically returned ~10% annually before inflation.`);
        if (pct > 10) insights.push(`Returns above 10% are excellent. Review whether these gains are sustainable or driven by market conditions that could reverse.`);
        else if (pct > 0) insights.push(`Returns of ${pct.toFixed(1)}% are positive. Consistent investing over time, not timing the market, is the key to long-term wealth building.`);
      } else {
        insights.push(`Your portfolio declined by ${fmt(Math.abs(gain), "currency")} (${Math.abs(pct).toFixed(1)}%). Market downturns are normal  -  stay the course and continue investing regularly to buy at lower prices.`);
      }
    }
  }

  if (insights.length === 0) {
    insights.push(`Your investment value of ${fmt(val, "currency")} is a snapshot in time. The most important factor is time in the market, not timing the market.`);
  }

  return insights;
}

function debtPayoffInsights(ctx: InsightContext): string[] {
  const months = findOutput(ctx.outputs, "monthsToPayoff") || findOutput(ctx.outputs, "months");
  const totalInterest = findOutput(ctx.outputs, "totalInterest");
  const monthsVal = months && typeof months.value === "number" ? months.value : null;
  const totalInterestVal = totalInterest && typeof totalInterest.value === "number" ? totalInterest.value : null;
  const insights: string[] = [];

  if (monthsVal !== null) {
    const years = (monthsVal / 12).toFixed(1);
    insights.push(`It will take ${monthsVal} months (${years} years) to become debt-free at your current payment rate.`);
    if (monthsVal <= 12) insights.push(`Less than a year to payoff  -  stay consistent. Consider increasing payments slightly to accelerate the timeline.`);
    else if (monthsVal <= 36) insights.push(`A 1-3 year payoff timeline is manageable. Review your budget for opportunities to make extra payments.`);
    else insights.push(`A ${years}-year timeline is significant. Even small additional payments can substantially reduce the total interest paid and accelerate payoff.`);
  }

  if (totalInterestVal !== null) {
    insights.push(`You'll pay ${fmt(totalInterestVal, "currency")} in total interest. Making extra payments early has an outsized impact on reducing total interest cost.`);
  }

  if (insights.length === 0) {
    const val = primaryNum(ctx.outputs);
    if (val !== null) insights.push(`Your debt situation requires ${fmt(val, "currency")} to resolve. Prioritize high-interest debt first (avalanche method) to minimize total interest paid.`);
  }

  return insights;
}

function retirementInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  const totalContributions = findOutput(ctx.outputs, "totalContributions") || findOutput(ctx.outputs, "totalInvested");
  const contributionsVal = totalContributions && typeof totalContributions.value === "number" ? totalContributions.value : null;

  if (val >= 1_000_000) {
    insights.push(`Your 401(k) balance of ${fmt(val, "currency")} is on track for a comfortable retirement. Fidelity recommends having 10x your salary saved by age 67.`);
  } else if (val >= 500_000) {
    insights.push(`Your 401(k) balance of ${fmt(val, "currency")} is solid. Fidelity recommends 6x salary by age 50 and 10x by age 67. Check how you compare.`);
  } else if (val >= 100_000) {
    insights.push(`Your 401(k) balance of ${fmt(val, "currency")} is a great start. The power of compound interest means your early contributions will grow significantly over time.`);
  } else {
    insights.push(`Your 401(k) balance of ${fmt(val, "currency")} is in the early growth phase. Increasing your contribution rate by even 1-2% can make a meaningful difference over 20+ years.`);
  }

  if (contributionsVal !== null && contributionsVal > 0 && isFinite(contributionsVal)) {
    const gains = val - contributionsVal;
    const pct = ((val - contributionsVal) / contributionsVal) * 100;
    if (isFinite(pct) && !isNaN(pct)) {
      insights.push(`Your contributions of ${fmt(contributionsVal, "currency")} have grown by ${fmt(gains, "currency")} (${pct.toFixed(0)}%) from investment returns. This is the power of compound growth.`);
    }
  }

  return insights;
}

function emergencyFundInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const insights: string[] = [];

  const monthlyExpenses = findInput(ctx.inputs, ["monthly expense", "monthly spend", "monthly cost"]);
  if (monthlyExpenses !== null && monthlyExpenses > 0 && isFinite(monthlyExpenses)) {
    const months = val / monthlyExpenses;
    if (!isFinite(months)) {
      insights.push(`Your emergency fund of ${fmt(val, "currency")} is a key financial safety net. Most financial advisors recommend 3-6 months of essential expenses.`);
    } else if (months >= 12) insights.push(`Your emergency fund of ${fmt(val, "currency")} covers ${months.toFixed(0)} months of expenses  -  a conservative and secure position.`);
    else if (months >= 6) insights.push(`Your emergency fund of ${fmt(val, "currency")} covers ${months.toFixed(0)} months of expenses. The standard recommendation is 3-6 months.`);
    else if (months >= 3) insights.push(`Your emergency fund of ${fmt(val, "currency")} covers ${months.toFixed(0)} months of expenses  -  within the 3-6 month recommendation.`);
    else insights.push(`Your emergency fund of ${fmt(val, "currency")} covers only ${months.toFixed(0)} months of expenses. Build toward 3-6 months of essential costs.`);
  } else {
    if (val >= 50_000) insights.push(`Emergency fund of ${fmt(val, "currency")} provides a strong safety net. Most financial advisors recommend 3-6 months of essential expenses.`);
    else if (val >= 10_000) insights.push(`Emergency fund of ${fmt(val, "currency")} is a good foundation. Aim for 3-6 months of essential expenses as your target.`);
    else insights.push(`Emergency fund of ${fmt(val, "currency")} is a start. Even $1,000 can cover unexpected expenses and prevent high-interest debt from emergencies.`);
  }

  return insights;
}

function dividendInsights(ctx: InsightContext): string[] {
  const annualIncome = findOutput(ctx.outputs, "annualDividend") || findOutput(ctx.outputs, "annualDividendIncome");
  const monthlyIncome = findOutput(ctx.outputs, "monthlyDividend") || findOutput(ctx.outputs, "monthlyDividendIncome");
  const annualVal = annualIncome && typeof annualIncome.value === "number" ? annualIncome.value : null;
  const monthlyVal = monthlyIncome && typeof monthlyIncome.value === "number" ? monthlyIncome.value : null;
  const insights: string[] = [];

  const displayVal = monthlyVal !== null ? monthlyVal : (annualVal !== null ? annualVal / 12 : null);

  if (displayVal !== null) {
    const monthly = displayVal;
    if (monthly > 5000) {
      insights.push(`Monthly dividend income of ${fmt(monthly, "currency")} is significant. Dividend income at this level can meaningfully supplement your earned income.`);
    } else if (monthly > 1000) {
      insights.push(`Monthly dividend income of ${fmt(monthly, "currency")} is a solid secondary income stream. Focus on companies with sustainable dividend growth, not just high yields.`);
    } else if (monthly > 100) {
      insights.push(`Monthly dividend income of ${fmt(monthly, "currency")} is a good start. Building dividend income takes time  -  focus on consistent investing and reinvesting dividends.`);
    } else {
      insights.push(`Monthly dividend income of ${fmt(monthly, "currency")} is in the early stages. Dividend investing compounds over decades  -  consistency matters more than yield.`);
    }
  } else {
    const val = primaryNum(ctx.outputs);
    if (val !== null) insights.push(`Your dividend income of ${fmt(val, "currency")} is a starting point. Reinvesting dividends accelerates portfolio growth through compounding.`);
  }

  insights.push(`The S&P 500 average dividend yield is ~1.3%. Yields above 4% may signal higher risk  -  research the company's payout ratio and dividend history.`);

  return insights;
}

function mortgageInsights(ctx: InsightContext): string[] {
  const val = primaryNum(ctx.outputs);
  if (val === null) return [];
  const income = findInput(ctx.inputs, ["income", "salary", "monthly pay"]);
  if (income && income > 0 && isFinite(income)) {
    const ratio = (val / income) * 100;
    if (!isFinite(ratio)) return [`Your housing cost of ${fmt(val, "currency")} is a key budget item. Compare this against your income to assess affordability.`];
    if (ratio > 50) return [`Your housing cost of ${fmt(val, "currency")} is ${ratio.toFixed(0)}% of income  -  above the 30% recommended threshold. Consider reducing housing costs or increasing income.`];
    if (ratio > 30) return [`Your housing cost of ${fmt(val, "currency")} is ${ratio.toFixed(0)}% of income  -  slightly above the 30% threshold. Keep this in mind for other financial goals.`];
    return [`Your housing cost of ${fmt(val, "currency")} is ${ratio.toFixed(0)}% of income  -  within the 30% recommendation. This leaves room for saving and investing.`];
  }
  return [`Your housing cost of ${fmt(val, "currency")} is within a manageable range for most budgets. The general guideline is to keep housing under 30% of gross income.`];
}

function personalFinanceCategoryHandler(ctx: InsightContext): string[] {
  const title = ctx.title.toLowerCase();
  if (title.includes("fire") || title.includes("financial independence")) return fireInsights(ctx);
  if (title.includes("savings rate")) return savingsInsights(ctx);
  if (title.includes("investment return")) return investmentInsights(ctx);
  if (title.includes("debt payoff")) return debtPayoffInsights(ctx);
  if (title.includes("student loan")) return debtPayoffInsights(ctx);
  if (title.includes("credit card") && title.includes("payoff")) return debtPayoffInsights(ctx);
  if (title.includes("mortgage")) return mortgageInsights(ctx);
  if (title.includes("rent vs buy")) return mortgageInsights(ctx);
  if (title.includes("401k") || title.includes("retire")) return retirementInsights(ctx);
  if (title.includes("emergency fund")) return emergencyFundInsights(ctx);
  if (title.includes("dividend")) return dividendInsights(ctx);
  return categoryFallback(ctx);
}

/* ─── Category dispatch ───────────────────────────────────────────── */

const CATEGORY_HANDLERS: Record<string, (ctx: InsightContext) => string[]> = {
  "revenue": revenueCategoryHandler,
  "growth-efficiency": growthEfficiencyCategoryHandler,
  "churn-retention": churnCategoryHandler,
  "unit-economics": unitEconomicsCategoryHandler,
  "general-business": generalBusinessCategoryHandler,
  "saas-deepen": saasDeepenCategoryHandler,
  "ai-cost": (ctx) => aiCostInsights(ctx),
  "side-hustle": (ctx) => sideHustleInsights(ctx),
  "personal-finance": personalFinanceCategoryHandler,
};

/* ─── Public API ──────────────────────────────────────────────────── */

function insightSummary(ctx: InsightContext): string[] {
  try {
    const category = ctx.category || "";
    const title = ctx.title || "";
    const inputs = ctx.inputs || [];
    const outputs = ctx.outputs || [];

    const handler = CATEGORY_HANDLERS[category];
    const primary: string[] = handler ? handler({ title, description: ctx.description || "", category, inputs, outputs }) : [];

    const fallback = primary.length < 2 ? categoryFallback({ title, description: ctx.description || "", category, inputs, outputs }) : [];

    const combined = [...primary, ...fallback];

    const val = primaryNum(outputs);
    if (combined.length < 2 && val !== null) {
      combined.push(`Your result of ${fmt(val, typeOfPrimary(outputs))} is a starting point. Track this number over time  -  the trend matters more than any single data point.`);
    }

    if (combined.length < 3) {
      combined.push(`Bookmark this page and re-run as your numbers change. Tracking the trend over consecutive periods is more informative than any single result.`);
    }

    return combined.slice(0, 5);
  } catch {
    return [
      "Review your inputs and results to understand what they mean for your specific situation.",
      "Every metric tells a story  -  compare against your historical data to spot trends over time.",
    ];
  }
}

export function generateInsights(ctx: InsightContext): string {
  try {
    if (!ctx) {
      return "No data available. Enter your information and try again.";
    }
    const list = insightSummary(ctx);
    if (!list || list.length === 0) {
      return "Your results provide a snapshot of your current metrics. Track them over time to identify trends and make informed decisions.";
    }
    return list.map((t, i) => `${i + 1}. ${t}`).join("\n\n");
  } catch {
    return "Unable to generate insights right now. Review your calculated results and compare against industry benchmarks to assess performance.";
  }
}
