# Agent B Report: Calculator Domain Audit

## Critical Bug: `useCalculatorState` defaults to 0 (ALL 25 calculators)

**File:** `lib/useCalculatorState.ts:16`
**Issue:** When no URL search params exist (fresh page load), all input values fall back to `0` instead of the calculator's configured `defaultValue`.
```typescript
result[id] = Number.isFinite(parsed) ? parsed : 0;  // line 16  -  should use defaultValue
```
**Impact:** Every calculator shows zero-derived results on initial page load. The slider UI renders the correct defaultValue initially, but the actual computation still sees 0 until the user moves a slider (triggering URL update → re-render).

## Stage Selector Analysis

### How stage flows through the system
1. `CalculatorClient` → `const [stage, setStage] = useState<Stage>("series-a")`
2. Buttons call `onClick={() => setStage(s)}`
3. `ResultCard` receives `stage={stage}` and `metricKey={metricKey ?? undefined}` and `rawValue={r.value}`
4. `ResultCard` calls `getHealthStatus(metricKey, rawValue, stage)` for badge text/color
5. `ResultCard` calls `getGradientPercent(metricKey, rawValue)` for progress bar width (STAGE IGNORED  -  hardcoded `"series-a"`)

### Bug: `getGradientPercent` ignores stage (`lib/benchmarks.ts:207`)
```typescript
export function getGradientPercent(metricKey: string, value: number): number {
  const stage: Stage = "series-a";  // BUG: hardcoded
```
Progress bar width never changes when stage is switched.

### Calculators with metricKey (13 of 25)

| # | Calculator | metricKey | Thresholds vary by stage? | Default value | Badge changes by stage? |
|---|-----------|-----------|--------------------------|--------------|------------------------|
| 1 | activation-rate | activation-rate | Yes (seed:40→growth:60) | 400/1000=40% | Seed=Healthy, Growth=Watch (with bug; Seed=Healthy, Growth=Healthy without) |
| 2 | cac-ltv-ratio | ltv-cac | Minimal (seed:5→growth:3) | 3000/1000=3.0 | All stages=Watch (3<3? Growth: healthy≤3? Let me check; 3≥3=Healthy actually) |
| 3 | churn-calculator | churn-rate | Yes (seed:5→growth:2) | 50/1000=5% | Would vary with correct defaultValue |
| 4 | customer-health-score | customer-health | **None** (all stages: 70/50) | ? | No change possible |
| 5 | gross-margin | gross-margin | **None** (all stages: 75/60) | 75% | No change possible |
| 6 | magic-number | magic-number | Yes (seed:0.75→growth:0.5) | 300K/200K=1.5 | Healthy for all stages |
| 7 | mrr-growth-rate | revenue-growth | Yes (seed:20→growth:5) | (100K-80K)/80K=25% | Seed=Healthy, Growth=Healthy (25≥5) |
| 8 | nps-calculator | nps | Yes (seed:40→growth:50) | 200-50/400×100=37.5 | All stages=Watch (37.5<40) |
| 9 | nrr-calculator | nrr | Yes (seed:110→growth:120) | (100K+15K-8K-3K)/100K×100=104% | All=Critical (104<110) |
| 10 | payback-period | cac-payback | Yes (seed:12→growth:18) | 300/(50×0.8)=7.5 months | All=Healthy (<12) |
| 11 | quick-ratio | quick-ratio | Yes (seed:4→growth:2) | (20K+10K)/(5K+2K)=4.29 | All=Healthy (>4) |
| 12 | rule-of-40 | rule-of-40 | Minimal (watch only varies) | 30+10=40 | Healthy for all |
| 13 | trial-to-paid | trial-to-paid | Yes (seed:10→growth:25) | 75/500=15% | seed/series-a=Healthy, series-b=Watch, series-c/growth=Critical |

### Calculators WITHOUT metricKey (12 of 25)
Stage selector renders but does nothing  -  no health badges exist.

| Calculator | Suggested metricKey | Rationale |
|-----------|-------------------|-----------|
| mrr-calculator | **none** (hide selector) | MRR is absolute value; no universal benchmark |
| arpu-calculator | **none** (hide selector) | Varies too much by business model |
| acv-calculator | **none** (hide selector) | Same as ARPU |
| ltv-calculator | **none** (hide selector) | Already covered by ltv-cac ratio badge |
| cac-calculator | **none** (hide selector) | Already covered by ltv-cac ratio badge |
| burn-rate-calculator | **burn-multiple** | burn-multiple thresholds exist but unused |
| contribution-margin-calculator | **none** (hide selector) | Similar to gross-margin, covered by that badge |
| operating-margin-calculator | **operating-margin** | Valid benchmark (e.g., healthy >15%) |
| revenue-per-employee | **revenue-per-employee** | Valid benchmark (varies by stage) |
| net-cash-flow-calculator | **none** (hide selector) | Already covered by burn rate |
| lead-conversion-rate-calculator | **lead-conversion** | Valid benchmark (similar to trial-to-paid) |
| expansion-revenue-rate | **none** (hide selector) | Already covered by NRR badge |

## Summary of Action Items

### Agent C (Implementer) must fix:
1. **`lib/useCalculatorState.ts:16`**  -  Use config's defaultValue instead of 0
2. **`lib/benchmarks.ts:207`**  -  Add `stage` param to `getGradientPercent`
3. **`calculators/ui/ResultCard.tsx:77`**  -  Pass `stage` to `getGradientPercent`
4. **Add `burn-multiple`** threshold mapping for burn-rate-calculator
5. **Add `operating-margin`** threshold block for operating-margin-calculator
6. **Add `lead-conversion`** threshold block for lead-conversion-rate-calculator
7. **Add `revenue-per-employee`** threshold block for revenue-per-employee-calculator
8. **Hide stage selector** on calculators with no meaningful benchmark (list above)

### Agent A (Tester) must verify:
- All 13 metricKey calculators show badge changes across stages
- Progress bar width changes when stage switches
- All calculators compute correct results with default values (post-fix)
- URL search params sync correctly on page load
- Calculators without metricKey do NOT show stage selector
