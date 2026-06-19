# Canvas — Templates & Master Calculator Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task with two-stage review.

**Goal:** Add three capabilities to the Canvas workspace page at `/canvas`: (1) pre-built template/configuration presets for one-click calculator sets, (2) a Master/Aggregate calculator that sums all active calculators, and (3) ensure the add/remove calculator flow is fully functional end-to-end.

**Architecture:**
- **Templates:** Define a `CanvasTemplate` data structure — a named preset with a list of calculator slugs + optional default input values. Store them as a static data file (`lib/canvas-templates.ts`). Render template cards in the catalog sidebar's header area; clicking one replaces the workspace with that template's calculator set.
- **Master Calculator:** A special read-only widget rendered at the top of the workspace grid (always first, before any other calculators). It reads the current output values from every calculator on the canvas and displays aggregate metrics: total MRR, total ARR, total costs, average churn, best LTV:CAC, etc. Reuses the aggregation logic already in `DashboardTotalWidget.tsx`.
- **Add/Remove verification:** Audit the current catalog click-to-add and widget remove flow to ensure there are no regressions, add E2E tests covering the full add/remove cycle.

**Tech Stack:** Next.js 16, Tailwind CSS v4, React, Framer Motion (existing), localStorage persistence (existing).

**Existing code to leverage:**
- `components/DashboardTotalWidget.tsx` — aggregate metric computation + display (copy/adapt)
- `components/canvas/CalculatorCatalog.tsx` — catalog sidebar with category grouping
- `components/canvas/CalculatorWidget.tsx` — individual calculator card
- `components/canvas/CalculatorWorkspace.tsx` — grid workspace
- `app/canvas/page.tsx` — main canvas page

---

### Task 1: Define Canvas Template Data Structure & Create Template Library

**Objective:** Create the type definition and a curated set of template presets.

**Files:**
- Create: `lib/canvas-templates.ts`

**Step 1: Define the type**

```typescript
export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  category: string; // grouping tag
  slugs: string[];
  /** Optional: default input overrides for specific calculators */
  defaults?: Record<string, Record<string, number>>;
}
```

**Step 2: Create curated templates**

Define these initial templates:

| Template ID | Name | Slugs |
|---|---|---|
| `saas-starter` | SaaS Starter Pack | `mrr-calculator`, `churn-rate`, `ltv-calculator`, `cac-calculator`, `gross-margin` |
| `unit-economics` | Unit Economics Deep Dive | `ltv-calculator`, `cac-calculator`, `cac-payback`, `gross-margin`, `contribution-margin`, `ltv-cac-ratio` |
| `growth-efficiency` | Growth Efficiency Suite | `quick-ratio`, `magic-number`, `rule-of-40`, `burn-multiple`, `net-revenue-retention` |
| `ai-costs` | AI Cost Analyzer | `claude-cost`, `chatgpt-cost`, `gemini-cost`, `image-gen-cost`, `model-comparison` |
| `personal-finance` | Personal Finance Planner | `fire-calculator`, `savings-rate`, `emergency-fund`, `investment-returns`, `debt-payoff` |
| `side-hustle` | Side Hustle Stack | `youtube-calculator`, `freelance-calculator`, `affiliate-calculator`, `side-income-tax`, `newsletter-calculator` |
| `empty` | Blank Canvas | `[]` |

**Step 3: Export** the array and a helper `getTemplateById(id): CanvasTemplate | undefined`.

**Verification:** Run `npm run build` — 0 errors.

---

### Task 2: Render Template Cards in the Catalog Sidebar

**Objective:** Show template presets at the top of the sidebar so users can one-click load a curated set.

**Files:**
- Modify: `components/canvas/CalculatorCatalog.tsx`
- Modify: `app/canvas/page.tsx` — pass template application handler

**Step 1: Add template section to `CalculatorCatalog.tsx`**

Above the search bar, add a "Quick Start" section with horizontally scrollable template cards:

```tsx
// Inside CalculatorCatalog, before the search input:
{templates.map(t => (
  <button
    key={t.id}
    onClick={() => onApplyTemplate(t.id)}
    className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/30 p-3 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all text-left w-full"
  >
    <span className="text-lg">{t.icon}</span>
    <div className="min-w-0">
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{t.description}</div>
    </div>
    <span className="shrink-0 text-[10px] font-medium text-gray-400 ml-auto">{t.slugs.length} calcs</span>
  </button>
))}
```

Collapse templates into a collapsible section with a "Templates" header and a toggle.

**Step 2: Add `onApplyTemplate` prop**

```typescript
interface CalculatorCatalogProps {
  onAddCalculator: (slug: string) => void;
  onApplyTemplate: (templateId: string) => void;
  addedSlugs: string[];
}
```

**Step 3: Wire up in `app/canvas/page.tsx`**

```typescript
const applyTemplate = useCallback((templateId: string) => {
  const template = getTemplateById(templateId);
  if (template) {
    setWorkspaceCalculators(template.slugs);
  }
}, []);
```

**Verification:** Click a template — workspace updates to show only that template's calculators. Refresh — state persists (localStorage). Build passes.

---

### Task 3: Build Master/Aggregate Calculator Widget

**Objective:** Create a read-only "Executive Summary" widget that computes aggregate metrics from all calculators on the canvas.

**Files:**
- Create: `components/canvas/CanvasTotalWidget.tsx`
- Modify: `components/canvas/CalculatorWorkspace.tsx` — render at top
- Modify: `components/canvas/CalculatorWidget.tsx` — expose output values via a callback prop or context pattern

**Step 1: Design the data flow**

The Master widget needs access to the computed output values of every calculator on the canvas. There are two approaches:

**Approach A (simpler — selected for this plan):** Have `CalculatorWorkspace` collect output values from all child `CalculatorWidget` instances and pass them to `CanvasTotalWidget`.

Implementation:
- `CalculatorWidget` accepts an optional `onOutputsChange` callback that fires whenever its outputs recompute
- `CalculatorWorkspace` maintains a `Map<slug, Record<string, number>>` of all calculator outputs, updated by these callbacks
- `CanvasTotalWidget` receives this map and computes aggregates

**Approach B (using context — more scalable but overkill for now):** Create a `CanvasOutputsContext` that each widget pushes outputs into and the master reads from.

Use Approach A for simplicity. Can be upgraded to context if needed later.

**Step 2: Create `components/canvas/CanvasTotalWidget.tsx`**

Copy the aggregation logic from `components/DashboardTotalWidget.tsx` but adapt it for the canvas UI:

```typescript
interface CanvasTotalWidgetProps {
  allOutputs: Map<string, Record<string, number>>;
  calculatorCount: number;
}
```

Display in the workspace grid — same card style as `CalculatorWidget` but with:
- **Header:** "Executive Summary" with a bar-chart icon + enhanced styling (brand gradient border)
- **Body:** Grid of aggregate metrics (Total MRR, Total ARR, Avg Churn, Best LTV:CAC, Total Costs)
- **Footer:** Count of calculators contributing

When no calculators are added, show a subtle empty state: "Add calculators to see aggregate metrics."

**Step 3: Add `onOutputsChange` callback to `CalculatorWidget`**

```typescript
interface CalculatorWidgetProps {
  slug: string;
  onRemove: () => void;
  onOutputsChange?: (slug: string, outputs: Record<string, number | string>) => void;
}
```

Call `onOutputsChange` inside the `useMemo`/`useEffect` that computes outputs, whenever outputs change.

**Step 4: Wire up in `CalculatorWorkspace.tsx`**

- Add state: `const [allOutputs, setAllOutputs] = useState<Map<string, Record<string, number>>>(new Map())`
- Pass `onOutputsChange` to each `CalculatorWidget`
- Pass `allOutputs` and `slugs.length` to `CanvasTotalWidget`
- Render `CanvasTotalWidget` as the first item in the grid (above the `AnimatePresence` map), always visible

**Step 5: Handle widget state for the master**

The master widget should show active counts and its own loading/empty transitions. Since it reads from outputs that update on every slider change, make it a `motion.div` with layout animation but no exit animation (it's always present).

**Verification:**
- Add 2+ calculators, change inputs — master widget shows real aggregate values
- Remove a calculator — aggregate values update
- Clear all — master shows empty state
- Build passes, 0 TS errors

---

### Task 4: Add/Remove Calculator E2E Tests

**Objective:** Write Playwright tests that verify the full add/remove cycle works end-to-end.

**Files:**
- Create: `tests/e2e/canvas-add-remove.spec.ts`

**Test plan:**

```
Test 1: Add calculator from catalog by click
  - Navigate to /canvas
  - Find a calculator button in the catalog (e.g., "MRR Calculator")
  - Click it
  - Assert the calculator widget appears in the workspace
  - Assert the catalog shows "Added" badge for that calculator

Test 2: Add multiple calculators
  - Add 3 calculators from different categories
  - Assert all 3 appear in workspace
  - Assert the active count shows "3 calculators"

Test 3: Remove a calculator via X button
  - Add 2 calculators
  - Click remove on the first
  - Assert only the second remains
  - Assert count shows "1 calculator"

Test 4: Clear all calculators
  - Add 2 calculators
  - Click "Clear all"
  - Assert workspace shows empty state
  - Assert count is removed

Test 5: Apply a template
  - Click a template card (e.g., "SaaS Starter Pack")
  - Assert the correct set of calculators appears
  - Assert count matches template slugs.length

Test 6: Master widget shows aggregates
  - Apply "SaaS Starter Pack" template
  - Assert master widget is visible
  - Assert master widget shows metric values (not "—")
  - Adjust an input slider
  - Assert master metric values update
```

**Verification:** Run `npx playwright test tests/e2e/canvas-add-remove.spec.ts` — all 6 tests pass.

---

### Task 5: Verify Build & Run Full Test Suite

**Objective:** Confirm no regressions.

**Files:** None — verification step.

**Step 1:** Run `npm run build` — 0 errors, 0 warnings introduced.

**Step 2:** Run `npm test` (vitest) — all existing 355+ unit tests pass.

**Step 3:** Run all canvas E2E tests — existing + new tests all pass.

---

## Risks, Tradeoffs & Open Questions

**Risk: Output collection via callback creates re-render churn.** Every slider change on any calculator fires `onOutputsChange`, which updates the parent state and re-renders ALL widgets + the master. Mitigation: memoize the master widget with `React.memo` and use a stable reference for `allOutputs` (pass as a single prop, not spreading).

**Risk: Template replacement is destructive (replaces workspace, not appends).** The user clicks a template and it *replaces* the current workspace. This is simpler and less confusing than merging. If users want to append, that can be a future enhancement (Shift+click to append). Add a brief confirmation? No — the templates section makes it clear through the "Quick Start" label and immediate visual feedback.

**Open question: Should template application be undoable?** The existing undo/redo system from the audit is for the React Flow canvas, not the grid workspace. Adding undo here is scope creep. Start without it.

**Open question: Should master widget support currency/locale?** The existing `CalculatorWidget` only shows plain dollar formatting and doesn't use the `CurrencyProvider`. The master widget should follow the same format convention for consistency. If locale support is needed, it's a follow-up.

---

## File Change Summary

| Action | File | Purpose |
|--------|------|---------|
| Create | `lib/canvas-templates.ts` | Template data structure + curated presets |
| Modify | `components/canvas/CalculatorCatalog.tsx` | Add template cards, accept `onApplyTemplate` prop |
| Modify | `app/canvas/page.tsx` | Wire template application, pass new props |
| Create | `components/canvas/CanvasTotalWidget.tsx` | Master/aggregate calculator widget |
| Modify | `components/canvas/CalculatorWorkspace.tsx` | Render master widget, collect outputs from children |
| Modify | `components/canvas/CalculatorWidget.tsx` | Expose `onOutputsChange` callback |
| Create | `tests/e2e/canvas-add-remove.spec.ts` | E2E tests for add/remove, templates, master |

**Total: 3 create + 4 modify = 7 files**
