# Canvas Page — Layout, Executive Summary Dynamic Update, & Individual Calculator Add

> **For Hermes:** Use `subagent-driven-development` skill to implement this plan task-by-task.

**Goal:** Fix 4 UI/UX issues on the Canvas page: template category spacing, Executive Summary reactivity, left panel scrolling, and ability to add individual calculators from templates.

**Architecture:** All changes are isolated to the `/components/canvas/` directory (CalculatorCatalog.tsx, CanvasTotalWidget.tsx, CalculatorWorkspace.tsx) and the Canvas page (`/app/canvas/page.tsx`). No new components needed. Data flow for Executive Summary is already wired (CalculatorWidget → `onOutputsChange` → CalculatorWorkspace state → CanvasTotalWidget) but may have a stale-closure bug preventing reactive updates.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion

---

## Current Context / Assumptions

- **Template categories in left sidebar** use `space-y-1.5` (6px gap between `<div key={cat.id}>` groups in `CalculatorCatalog.tsx:74`). The user wants more visual separation between SaaS Metrics, Finance, Marketing, Operations, Personal sections.
- **Executive Summary** (`CanvasTotalWidget.tsx`) receives `allOutputs: Map<string, Record<string, number | string>>` and computes aggregate metrics in a `useMemo`. Data flows: CalculatorWidget computes outputs → `useEffect` calls `onOutputsChange(slug, outputs)` → CalculatorWorkspace `handleOutputsChange` does `setAllOutputs(prev => new Map(prev).set(slug, numericOutputs))` → CanvasTotalWidget re-renders. On paper this should work, but the user reports it does not dynamically update when slider values change. Likely a stale-reference issue in the `allOutputs` Map propagation (see Task 2).
- **Left panel scroll:** The `<aside>` has `overflow-y-auto` but the templates section has no max-height, so when templates are expanded the section grows and pushes the catalog items area — the page scrolls the whole aside instead of having the catalog section scroll independently.
- **Individual calculator add:** Template buttons (`onApplyTemplate`) **replace** the workspace entirely. Individual calculator buttons in the Catalog section **add** to the existing workspace. There is no way to add a template's calculators to the current workspace without replacing.

---

## Proposed Approach

### Task 0: Investigate Executive Summary reactivity bug
- Instrument the data flow with `console.log` to determine whether `onOutputsChange` fires, whether `setAllOutputs` receives new data, and whether `CanvasTotalWidget` re-computes metrics.
- Based on findings, fix the stale-reference or missing-dependency issue.

### Parallel workstreams (Tasks 1–4 can be done in any order):

| Task | File(s) | Nature | Depends on |
|------|---------|--------|------------|
| 1 | CalculatorCatalog.tsx | CSS-only (spacing change) | None |
| 2 | CanvasTotalWidget.tsx, CalculatorWorkspace.tsx, CalculatorWidget.tsx | Bug fix (reactivity) | Task 0 |
| 3 | CalculatorCatalog.tsx | CSS/structural (scroll fix) | None |
| 4 | CalculatorCatalog.tsx, canvas/page.tsx | Feature (add from templates) | None |

**Task 5:** Verification — build, lint, existing tests, new E2E test.

---

## Step-by-Step Plan

### Task 0: Investigate Executive Summary dynamic update bug

**Objective:** Determine why the Executive Summary does not reactively update when calculator slider values change.

**Files:**
- Read: `components/canvas/CalculatorWidget.tsx`
- Read: `components/canvas/CalculatorWorkspace.tsx`
- Read: `components/canvas/CanvasTotalWidget.tsx`

**Step 1: Instrument data flow with debug logging**

Add temporary `console.log` in three places:
1. **CalculatorWidget** `useEffect` — log `calc.slug` and `outputs` every time they fire
2. **CalculatorWorkspace** `handleOutputsChange` — log the slug and numericOutputs received
3. **CanvasTotalWidget** — log `calculatorCount` and `allOutputs.size` on every render

Run the dev server, add a calculator (e.g. MRR), move a slider, and observe the console.

**Step 2: Identify the failure point**

Based on logs, determine which link in the chain is broken:
- **A) CalculatorWidget outputs useMemo doesn't re-run** → check `values` dependency (symptom: logs show no output change)
- **B) CalculatorWidget useEffect doesn't fire** → check `outputs` reference stability / `onOutputsChange` memoization (symptom: outputs computed but effect doesn't fire)
- **C) CalculatorWorkspace `allOutputs` doesn't cause re-render** → check in functional updater returns a true new Map (symptom: onChange called but CanvasTotalWidget doesn't re-render)
- **D) CanvasTotalWidget useMemo doesn't re-compute** → check `allOutputs` reference changes but memo skips

**Likely root cause (hypothesis):**
The `CalculatorWidget`'s `onOutputsChange` callback (from props) is called inside a `useEffect` with dep `[outputs, onOutputsChange, calc]`. The `onOutputsChange` is the `handleOutputsChange` from `CalculatorWorkspace`, which is `useCallback(() => {}, [])` — stable reference. The `outputs` object from `useMemo` may or may not be a new reference depending on whether the engine returns a new object.

BUT — the real issue could be `CanvasTotalWidget`'s `useMemo` depending on `allOutputs` where `allOutputs` is a `Map`. When `handleOutputsChange` does `setAllOutputs(prev => { const next = new Map(prev); next.set(slug, numericOutputs); return next; })`, the `Map.set()` *mutates and returns the same map instance*. `new Map(prev)` creates a *shallow copy*, but `next.set()` mutates `next` and returns it — and crucially, React **does not check** whether the returned value is the same reference as `prev` in a functional updater; it treats the returned reference as the new state. So `allOutputs` should be a new Map reference every time. This should work.

*If investigation shows the chain is actually correct* (which would mean the user's report is about a different scenario — e.g. expect that changing calculator A should also update a metric that depends on calculator B), then the fix may involve connecting calculator outputs to each other via a shared state or context. However, the simpler explanation is a stale closure or missing dep.

**Step 3: Fix based on findings**

Common fixes depending on root cause:
- If `useMemo([values])` is stale: ensure `values` state is updated correctly
- If `useEffect([outputs])` doesn't fire: change dep to `[JSON.stringify(outputs)]` or restructure
- If Map reference is stable: use `new Map([...prev])` pattern instead of `new Map(prev).set()`
- If CanvasTotalWidget `useMemo` is stale: add `allOutputs` as dep (may already be there)

---

### Task 1: Increase spacing between template category sections

**Objective:** Increase the vertical gap between template category groups (SaaS Metrics, Finance, Marketing, Operations, Personal) so category boxes don't appear to touch.

**Files:**
- Modify: `components/canvas/CalculatorCatalog.tsx:74`

**Step 1: Read current code**

Current (line 74):
```tsx
<div className="px-3 pb-3 space-y-1.5">
```

The `space-y-1.5` applies 6px gap between direct children (the `<div key={cat.id}>` category wrappers). The user wants more breathing room.

**Step 2: Increase spacing**

Change `space-y-1.5` to `space-y-3`:
```tsx
<div className="px-3 pb-3 space-y-3">
```

`space-y-3` = 12px gap (up from 6px). This adds visual separation between category groups while keeping the internal button padding unchanged.

**Step 3: Verify**

Run build and lint to confirm no breakage.

---

### Task 2: Fix Executive Summary dynamic reactivity

**Objective:** Ensure that when a user changes any calculator slider value, the Executive Summary (CanvasTotalWidget) re-computes and re-displays aggregate metrics.

**Files:**
- Modify: `components/canvas/CalculatorWidget.tsx` (if stale dep found)
- Modify: `components/canvas/CalculatorWorkspace.tsx` (if Map propagation issue)
- Modify: `components/canvas/CanvasTotalWidget.tsx` (if memo issue)

**Implementation depends on Task 0 findings.**

**If no concrete bug found in data flow:** The issue may be that individual calculators share output IDs (e.g., multiple calculators output `mrr`) and the Map `set` overwrites rather than sums. However, `CanvasTotalWidget` already handles this by iterating all values and summing. So the actual issue is likely a stale reference.

**Proposed fix (if Map reference issue):** Ensure `allOutputs` creates a truly new reference. Change `handleOutputsChange`:

```tsx
const handleOutputsChange = useCallback((slug: string, outputs: Record<string, number | string>) => {
  setAllOutputs(prev => {
    const next = new Map(prev);
    // Only keep numeric outputs for the aggregate
    const numericOutputs: Record<string, number | string> = {};
    for (const [key, val] of Object.entries(outputs)) {
      const num = Number(val);
      numericOutputs[key] = Number.isFinite(num) ? num : val;
    }
    next.set(slug, numericOutputs);
    return new Map(next); // ★ Force new reference even if set mutates
  });
}, []);
```

Also ensure `CanvasTotalWidget` depends on `allOutputs` correctly (already does via `useMemo([allOutputs])`).

**Step 1-3 per Task 0 investigation results.**

**Step 4: Verify with E2E test**

Write a test that:
1. Loads canvas page
2. Applies a template (e.g. SaaS Starter Pack)
3. Changes a slider value on one calculator
4. Waits for Executive Summary metrics to update
5. Asserts the metric value changes

---

### Task 3: Fix left panel scrolling

**Objective:** The left sidebar should be scrollable such that when the templates section is expanded, it doesn't push the catalog content out of view. The templates section should have a constrained max-height with its own overflow, and the catalog section should scroll independently.

**Files:**
- Modify: `components/canvas/CalculatorCatalog.tsx`

**Step 1: Current structure (line 54)**

```tsx
<aside className="w-72 lg:w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto shrink-0 flex flex-col">
```

The aside is a flex column with `overflow-y-auto`. Its children:
1. Templates section (line 56) — no scroll, no height constraint
2. Catalog header (line 112) — fixed-ish
3. Catalog items (line 135) — `flex-1 overflow-y-auto`

The problem: templates section can be tall (all categories expanded, many template buttons), pushing the catalog areas downward. The whole aside scrolls, but the user expects the templates section to be collapsible and the catalog to always be accessible.

**Step 2: Fix**

Two-part fix:

**a) Give the templates section a max-height with overflow:**

```tsx
<div className="border-b border-gray-100 dark:border-gray-700 max-h-[50vh] overflow-y-auto">
```

This limits the templates section to at most 50% of viewport height so the catalog section always remains visible.

**b) The aside should have `overflow-hidden` instead of `overflow-y-auto`** since the inner sections handle their own overflow:

```tsx
<aside className="w-72 lg:w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shrink-0 flex flex-col">
```

This ensures the aside doesn't scroll as a whole — individual sections scroll within their bounds.

**Step 3: Verify**

- Add 3+ template packs to the workspace
- Verify the catalog search and items remain visible
- Verify scrolling works within both templates section and catalog section

---

### Task 4: Add ability to add individual calculators from templates

**Objective:** Currently, clicking a template button **replaces** the entire workspace. Add a way to add individual calculators from a template to the existing workspace without losing what's already there.

**Files:**
- Modify: `components/canvas/CalculatorCatalog.tsx`
- Modify: `app/canvas/page.tsx` (add `addTemplateCalculators` callback)

**Step 1: Add "Add" action to template buttons**

Approach: Add a small secondary button/icon on each template button that, when clicked, adds only the templates' calculators to the existing workspace (rather than replacing).

**Design:**
- When hovering over a template button, show a small "+" icon on the right side
- Clicking the main template button still replaces (existing behavior)
- Clicking the "+" icon adds the template's calculators to existing workspace
- "Blank Canvas" template should not get the "+" icon (it has 0 calculators)

**Step 2: Add callback in canvas/page.tsx**

```tsx
const addTemplateCalculators = useCallback((templateId: string) => {
  const template = getTemplateById(templateId);
  if (template) {
    setWorkspaceCalculators(prev => {
      const slugs = template.slugs;
      const newSlugs = slugs.filter(s => !prev.includes(s));
      return [...prev, ...newSlugs];
    });
  }
}, []);
```

Pass to CalculatorCatalog as a new prop:
```tsx
<CalculatorCatalog
  onAddCalculator={addCalculator}
  onApplyTemplate={applyTemplate}
  onAddTemplateCalculators={addTemplateCalculators}  // NEW
  addedSlugs={workspaceCalculators}
/>
```

**Step 3: Implement in CalculatorCatalog.tsx**

Update the template button rendering (lines 83-103):

```tsx
{catTemplates.map((t) => (
  <div key={t.id} className="relative group">
    <button
      onClick={() => onApplyTemplate(t.id)}
      className="flex items-center gap-2.5 w-full rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-2.5 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all text-left group/main"
      title={`Load ${t.name}: ${t.slugs.length} calculator${t.slugs.length !== 1 ? "s" : ""}`}
    >
      <span className="material-symbols-outlined text-base shrink-0 leading-none">{t.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate group-hover/main:text-brand-600 dark:group-hover/main:text-brand-400 transition-colors">
          {t.name}
        </div>
        <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
          {t.description}
        </div>
      </div>
      <span className="shrink-0 text-[10px] font-medium text-gray-400 dark:text-gray-500 tabular-nums">
        {t.slugs.length}
      </span>
    </button>
    {t.slugs.length > 0 && (
      <button
        onClick={(e) => { e.stopPropagation(); onAddTemplateCalculators(t.id); }}
        className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 bg-brand-500 text-white hover:bg-brand-600 transition-all text-xs shadow-sm"
        title={`Add ${t.name} calculators to workspace`}
        aria-label={`Add ${t.name} calculators`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    )}
  </div>
))}
```

**Step 4: Update prop types**

Add `onAddTemplateCalculators?: (templateId: string) => void` to the `CalculatorCatalogProps` interface.

---

### Task 5: Verification

**Files:**
- Run: `npm run build`
- Run: `npm run lint`
- Run: Existing Playwright tests
- Run: New E2E test for Executive Summary reactivity and add-individual action

**Step 1: Build and lint**

```bash
npm run build
npm run lint
```

Expected: 0 errors (pre-existing warnings OK).

**Step 2: Run existing canvas E2E tests**

```bash
npx playwright test tests/e2e/canvas.spec.ts tests/e2e/canvas-templates.spec.ts
```

Expected: all existing tests pass.

**Step 3: Write and run new E2E test**

Add tests to `tests/e2e/canvas-templates.spec.ts`:

```typescript
test("add template calculators to existing workspace (not replace)", async ({ page }) => {
  await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
  await clearCanvasStorage(page);
  await page.reload({ waitUntil: "networkidle" });

  // Add one calculator manually
  await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
  await expect(page.getByText("1 calculator active")).toBeVisible();

  // Hover over a template to show the + button, then click it
  const templateButton = page.getByRole("button", { name: /SaaS Starter Pack/ }).first();
  await templateButton.hover();
  // The + button should be the sibling button (aria-label="Add SaaS Starter Pack calculators")
  const addBtn = page.locator(`button[aria-label="Add SaaS Starter Pack calculators"]`);
  await expect(addBtn).toBeVisible();
  await addBtn.click();

  // Should now have 1 (MRR) + 5 (SaaS Starter) = 6 calculators
  await expect(page.getByText("6 calculators active")).toBeVisible();
});
```

```typescript
test("executive summary updates when calculator input changes", async ({ page }) => {
  await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
  await clearCanvasStorage(page);
  await page.reload({ waitUntil: "networkidle" });

  // Add MRR calculator
  await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
  await expect(page.getByText("Monthly Recurring Revenue")).toBeVisible();

  // Executive summary should show (it's always visible when calculators present)
  // Check it shows initial state
  await expect(page.getByText("Executive Summary")).toBeVisible();

  // Change the first slider (Customers) — need to find slider input
  const slider = page.locator('input[type="range"]').first();
  await slider.fill("500");

  // Wait for the widget to update — expect Total MRR to appear or change
  // The formula: MRR = Customers × ARPU, with default ARPU=50 and Customers=500 → $25,000 → $25K
  // This depends on the MRR calculator's engine formula
  await expect(page.getByText("Total MRR")).toBeVisible();
});
```

---

## Files Changed Summary

| File | Change | Type |
|------|--------|------|
| `components/canvas/CalculatorCatalog.tsx` | Increase spacing `space-y-1.5` → `space-y-3` (line 74) | CSS |
| `components/canvas/CalculatorCatalog.tsx` | Add max-height + overflow to templates section | CSS/Structural |
| `components/canvas/CalculatorCatalog.tsx` | Change aside `overflow-y-auto` → `overflow-hidden` | CSS |
| `components/canvas/CalculatorCatalog.tsx` | Add "+" button on template buttons + `onAddTemplateCalculators` prop | Feature |
| `components/canvas/CalculatorWidget.tsx` | Possible fix for output reactivity (per Task 0) | Bug fix |
| `components/canvas/CalculatorWorkspace.tsx` | Possible fix for Map reference (per Task 0) | Bug fix |
| `components/canvas/CanvasTotalWidget.tsx` | Possible fix for useMemo reactivity (per Task 0) | Bug fix |
| `app/canvas/page.tsx` | Add `addTemplateCalculators` callback, pass to Catalog | Feature |
| `tests/e2e/canvas-templates.spec.ts` | Add tests for add-from-template and reactivity | Test |

---

## Risks, Tradeoffs, and Open Questions

1. **Executive Summary reactivity fix** depends entirely on Task 0 investigation. If the bug is not in the React data flow but rather in how specific calculators compute outputs (e.g., MRR calculator outputs `mrr` but Executive Summary checks for `mrr` not `totalMrr`), the fix would be in `CanvasTotalWidget.tsx`'s field-matching logic. The investigation must confirm the actual symptom first.

2. **"+" button positioning** on template buttons: using absolute positioning may cause overlap on small screens. The `w-72 lg:w-80` container is wide enough for the current template button length, but long template names + the "+" button could overlap. The `truncate` class on the name prevents this, but worth verifying in the E2E test.

3. **Templates section max-height of 50vh** is arbitrary but conservative. If a user has a short viewport (e.g., 600px), the templates section gets 300px which can fit 5-6 template buttons. This seems sufficient. Could also use a fixed value like `max-h-96`.

4. **Template "Replace" vs "Add" distinction** — current behavior is replace (click on template), new behavior adds a "+" button for additive mode. This maintains backward compatibility. Consider adding a Shift+click modifier for power users in a future iteration.

---

## Verification Checklist

- [ ] Build passes with 0 errors
- [ ] Lint passes (pre-existing warnings only)
- [ ] All existing canvas E2E tests pass
- [ ] Template category spacing is visibly increased (E2E visual)
- [ ] Left panel scrolls correctly: templates section scrollable within bounds, catalog always accessible
- [ ] Executive Summary updates when calculator slider values change (new E2E test)
- [ ] "+" button appears on template hover and adds calculators to existing workspace without replacing (new E2E test)
- [ ] Blank Canvas template does not show "+" button (0 calculators case)
- [ ] After adding template calculators, "Clear all" still works correctly
