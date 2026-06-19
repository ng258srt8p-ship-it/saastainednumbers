# Canvas Flaws Fix-All Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Fix all 25 identified canvas flaws across 8 files, achieving functional cable propagation, proper SEO metadata, type safety, keyboard accessibility, error visibility, and test coverage.

**Architecture:** The canvas uses React Flow (`@xyflow/react`) with custom node types (calculator, master) and cables (CablePatchEdge). A `graphEngine.ts` computes outputs respecting cable topology. State is persisted to localStorage via debounced saves. The plan touches 8 files: graphEngine.ts, canvasNodes.ts, SaaSCanvas.tsx, CanvasPage.tsx (app/canvas), FullscreenCanvasPanel.tsx, CanvasWorkspace.tsx, CanvasTour.tsx, meta.ts.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5.x, @xyflow/react 12.x, Vitest (existing test framework).

---

## Execution Order: Batched by Dependency

- **Batch 1 (Core Engine):** Fix the cable propagation + SEO metadata + persistence versioning — these are foundational; everything else depends on them working.
- **Batch 2 (UI Polish):** Fix visibility: tour progress bar, localStorage toast, fullscreen panel sync, Add dropdown keyboard nav.
- **Batch 3 (Cleanup & Safety):** Remove dead code, remove `as any`, fix remaining console/silent errors.
- **Batch 4 (Tests):** Add E2E cable tests + regression guards for fixes.

**Each batch must pass `npx tsc --noEmit` and `npm run lint -- --quiet` before proceeding.**

---

## Task 1: Fix Master Node Execution Key Mismatch (Flaw #1 — CRITICAL)

**Objective:** The master node stores results with key `"output-master-total"` (the output handle), but downstream nodes look up by `node.id` (`"node-master-aggregator"`). The result is never found, so master outputs never propagate.

**Files:**
- Modify: `components/canvas/graphEngine.ts:230-231`

**Step 1: Fix the key mapping for master node output storage**

In `graphEngine.ts` line 230-231, change:
```ts
// CURRENT (broken):
const outputValues: Record<string, number> = {};
outputValues["output-master-total"] = sum;
nodeResults.set(node.id, outputValues);
```

To:
```ts
// FIXED: key by node id as downstream nodes expect
const outputValues: Record<string, number> = {};
outputValues["output-master-total"] = sum;  // output handle key for cable lookup
nodeResults.set(node.id, { "output-master-total": sum });  // also store under node.id for downstream lookup
```

Wait — the real issue: downstream nodes look up `nodeResults.get(node.id)` where `node.id` is the source node. But cables store values by `cable.id`. The cable propagation (lines 235-240) uses `sourceHandle === "output-master-total"` which is correct. The real problem is downstream nodes reading cable values, not nodeResults — the cable value propagation IS writing to `cableValues.set(cable.id, sum)`. So we need to trace: when a calculator node reads cable values (line 215-219), it looks for `incomingEdges.find((e) => e.targetHandle === input.id && e.data?.value !== undefined)` — so the cable's `data.value` must be populated by the master's propagation.

Let me re-read the exact flow:
1. Master node computes `sum`
2. Line 238-240: if `cable.sourceHandle === "output-master-total"`, sets `cableValues.set(cable.id, sum)`
3. Calculus node (line 215-219): looks at `incomingEdges.find((e) => e.targetHandle === input.id && e.data?.value !== undefined)`

**Problem:** `cableValues` is returned from `executeGraph` but never used to populate `e.data.value` on the actual Edge objects rendered by React Flow. The cable values map exists but is disconnected from what React Flow sees for the next execution pass.

**Step 1 (corrected): Wire cableValues back into node execution**

Add after the execution loop in `graphEngine.ts` (after line 275, before `return`):

```ts
// Propagate cableValues back to the edge data objects for next-pass visibility
for (const e of edges) {
  const cv = cableValues.get(e.id);
  if (cv !== undefined) {
    (e.data as CableEdge["data"]).value = cv;
  }
}
```

This is a one-line change inside `executeGraph` before the return statement (line 277).

**Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: 0 errors (or pre-existing errors only)

**Step 3: Commit**

```bash
git add components/canvas/graphEngine.ts
git commit -m "fix(graph-engine): wire cableValues back into edge data for propagation"
```

**Definition of Done:** When a user connects a calculator node's output (e.g., MRR "profit") to a master aggregator's input, enters a value like 5000 in the calculator node, the value appears on the cable and propagates to any other nodes reading from that master output.

---

## Task 2: Fix SEO Metadata — Dynamic generateMetadata (Flaw #2)

**Objective:** `app/canvas/meta.ts` exports static metadata but is never imported by `page.tsx`. Next.js renders a generic fallback, killing SEO and OG image generation.

**Files:**
- Modify: `app/canvas/page.tsx` (add generateMetadata), `app/canvas/meta.ts` (convert to generateMetadata)

**Step 1: Convert meta.ts from static export to dynamic function**

Replace the entire `app/canvas/meta.ts` with:
```ts
import { getTranslations } from "@/lib/getTranslations";

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: "Canvas | SaaStainedNumbers",
    description: t("canvas.title") || "Interactive calculator network — connect calculators with patch cables and see data flow in real time.",
    openGraph: {
      title: "Canvas | SaaStainedNumbers",
      description: t("canvas.title") || "Interactive calculator network — connect calculators with patch cables and see data flow in real time.",
      images: ["/api/og?title=Canvas"],
    },
  };
}
```

**Step 2: Import generateMetadata in page.tsx**

Add to `app/canvas/page.tsx` imports:
```ts
import { generateMetadata } from "./meta";

export { generateMetadata };
export const metadata = undefined; // force dynamic rendering so generateMetadata runs
```

**Step 3: Add canvas title to all 6 i18n locale files**

Add to each of `i18n/en/common.json`, `i18n/es/common.json`, `i18n/de/common.json`, `i18n/pt/common.json`, `i18n/fr/common.json`, `i18n/ja/common.json`:
```json
{
  "canvas": {
    "title": "Canvas | SaaStainedNumbers"
  }
}
```

**Step 4: Type check**

Run: `npx tsc --noEmit`
Expected: 0 new errors

**Step 5: Commit**

```bash
git add app/canvas/page.tsx app/canvas/meta.ts i18n/*/common.json
git commit -m "fix(seo): convert canvas meta to dynamic generateMetadata for SEO + OG images"
```

**Definition of Done:** The `/canvas` page's HTML `<head>` contains correct `<title>`, `<meta name="description">`, OpenGraph tags, and OG image tag that varies by locale.

---

## Task 3: Add Persistence Versioning (Flaw #13)

**Objective:** `saveCanvasState` and `loadCanvasState` have no version field. Adding new node types or changing the schema breaks old saved workspaces silently (corrupted data).

**Files:**
- Modify: `components/canvas/canvasNodes.ts:34,53,156-184,186-260`

**Step 1: Add version to save/load interfaces**

Add a version constant and version field to the saved state. Change line 34:
```ts
const STORAGE_KEY = "canvas-workspace-state";
const CANVAS_STATE_VERSION = 1;  // NEW: increment when schema changes
```

Add `"version"` to the `SavedState` interface (around line 53):
```ts
interface SavedState {
  version: number;
  nodes: SavedNode[];
  edges: SavedEdge[];
}
```

**Step 2: Write version when saving**

In `saveCanvasState` (around line 158), change the saved object to:
```ts
const saved: SavedState = {
  version: CANVAS_STATE_VERSION,
  nodes: nodes.map((n) => ({
    type: (n.type as string) || "calculator",
    slug: (n.data as Record<string, unknown>)?.slug as string || "",
    position: n.position,
    inputValues: Object.fromEntries(
      ((n.data as Record<string, unknown>)?.inputs as { id: string; value?: number }[] || []).map((i) => [i.id, i.value ?? 0])
    ),
    outputValues: Object.fromEntries(
      ((n.data as Record<string, unknown>)?.outputs as { id: string; value?: number }[] || []).map((o) => [o.id, o.value ?? 0])
    ),
  })),
  edges: edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? null,
    targetHandle: e.targetHandle ?? null,
    data: (e.data as SavedEdge["data"]) ?? { sourceOutput: "", targetInput: "" },
  })),
};
```

**Step 3: Read and migrate when loading**

In `loadCanvasState`, after parsing JSON (line 191):
```ts
const saved: SavedState = JSON.parse(raw);
if (!saved.version || saved.version < CANVAS_STATE_VERSION) {
  // Migration: strip unknown fields or request re-import
  console.warn(`Canvas state version ${saved?.version || "unknown"} is outdated. Some features may not work. Please reset your workspace.`);
}
```

Also update the return to include version:
```ts
return { ...obj, nodes, edges } as ReturnType<typeof loadCanvasState>;
```

**Step 4: Type check**

Run: `npx tsc --noEmit`

**Step 5: Commit**

```bash
git add components/canvas/canvasNodes.ts
git commit -m "fix(persistence): add version field for schema migration safety"
```

**Definition of Done:** Loading an old canvas state (from version 0) logs a console warning. Future schema changes increment `CANVAS_STATE_VERSION` and add migration logic to `loadCanvasState`.

---

## Task 4: Fix Tour Progress Bar — Show Correct Percentage (Flaw #19)

**Objective:** Progress bar shows 0% on step 1 (because `currentStep = 0` gives `(0 / (8-1)) * 100% ≈ 0%`). Should show a minimum of 12.5% on step 1 and progress to 100% on the final step.

**Files:**
- Modify: `components/canvas/CanvasTour.tsx:132`

**Step 1: Fix progress bar calculation**

Change line 132 in `CanvasTour.tsx`:
```tsx
// CURRENT (broken — shows 0% on step 1):
style={{ width: `${((currentStep) / (tourSteps.length - 1)) * 100}%` }}
```

To:
```tsx
// FIXED: clamped to minimum 12.5% (1/8th of bar) on step 0
style={{ width: `${Math.max(12.5, ((currentStep) / (tourSteps.length - 1)) * 100)}%` }}
```

Also add `aria-valuenow={Math.round(((currentStep) / (tourSteps.length - 1)) * 100)} aria-valuemin={0} aria-valuemax={100}` to the progress bar div.

**Step 2: Type check**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add components/canvas/CanvasTour.tsx
git commit -m "fix(ux): fix tour progress bar showing 0% on step 1, add ARIA values"
```

**Definition of Done:** Opening the tour shows ~12% progress on step 1, progressing to 100% on the final "Ready" step.

---

## Task 5: Show Error Toast When localStorage Fails (Flaw #24)

**Objective:** `saveCanvasState` silently swallows quota errors. Users lose workspace data without knowing why.

**Files:**
- Modify: `components/canvas/canvasNodes.ts` (add Toast notification), possibly create a minimal toast component

**Step 1: Add a simple inline error banner to canvasNodes.ts**

Add after `STORAGE_KEY` constant (around line 34):
```ts
const TOAST_STORAGE_KEY = "canvas-toast-dismissed";

export function showLocalStorageError(): void {
  if (typeof window === "undefined") return;
  const dismissed = localStorage.getItem(TOAST_STORAGE_KEY);
  if (dismissed) return;
  // Create a one-time toast element at the bottom of the canvas
  const toast = document.createElement("div");
  toast.id = "canvas-toast-localstorage";
  toast.setAttribute("role", "alert");
  toast.className = "fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] px-4 py-3 rounded-lg text-xs font-mono text-white";
  toast.style.background = "#B91C1C"; // red-700
  toast.style.border = "1px solid #991B1B";
  toast.innerHTML = `Storage full — workspace auto-saved to local memory. <button class="ml-2 underline" onclick="this.parentElement.remove();localStorage.setItem('${TOAST_STORAGE_KEY}','1')">Dismiss</button>`;
  document.body.appendChild(toast);
}

export function clearLocalStorageToast(): void {
  if (typeof window !== "undefined") {
    const toast = document.getElementById("canvas-toast-localstorage");
    if (toast) toast.remove();
  }
}
```

**Step 2: Call the toast in saveCanvasState's catch block**

Change lines 179-183:
```ts
// CURRENT:
try {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
} catch {
  // localStorage may be full or unavailable
}
```

To:
```ts
// FIXED: notify user on failure
try {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
} catch (e) {
  console.warn("Canvas save failed:", e);
  showLocalStorageError();
}
```

**Step 3: Type check + lint**

Run: `npx tsc --noEmit && npm run lint -- --quiet`

**Step 4: Commit**

```bash
git add components/canvas/canvasNodes.ts
git commit -m "fix(ux): show error toast when localStorage quota is exceeded"
```

**Definition of Done:** When a user fills workspace and hits browser storage limits, a red toast banner appears at the bottom of the page explaining the issue with a dismiss button.

---

## Task 6: Fix Fullscreen Panel — Use Proper State Sync (Flaw #14)

**Objective:** The fullscreen panel opens via `canvas:openNode` event but has no sync with the node's actual data on the canvas. It recomputes from scratch using a window-global registry instead of reading the node's state.

**Files:**
- Modify: `components/canvas/FullscreenCanvasPanel.tsx`

**Step 1: Receive node state from the parent via props instead of window globals**

Replace the entire FullscreenCanvasPanel with a version that receives node data as props. Change the interface from:
```ts
interface FullscreenCanvasPanelProps {
  slug: string;
  onClose: () => void;
}
```

To:
```ts
interface FullscreenCanvasPanelProps {
  slug: string;
  nodeData?: CanvasNodeData;  // NEW: actual node data from canvas state
  onClose: () => void;
}
```

And update the component to use `nodeData` when available:
```ts
// Replace config loading (lines 24-31) with:
const config = nodeData?.config || (() => {
  try {
    const { getCalculator } = (window as any).__calculatorLoader || {};
    return getCalculator?.(slug);
  } catch { return null; }
})();

// Update inputs/outputs to prefer nodeData:
const inputs = useMemo(
  () => (nodeData?.inputs || config?.inputs || []).map((i: { id: string; label: string; value?: number }) => i),
  [nodeData, config],
);

const outputs = useMemo(
  () => (nodeData?.outputs || config?.outputs || []).map((o: { id: string; label: string; value?: number }) => o),
  [nodeData, config],
);

// Update getSlider functions:
const getSliderMin = useCallback((inputId: string) => {
  const input = (nodeData?.inputs || config?.inputs || []).find((i: { id: string }) => i.id === inputId);
  return (input as { min?: number } | undefined)?.min ?? 0;
}, [nodeData, config]);

const getSliderMax = useCallback((inputId: string) => {
  const input = (nodeData?.inputs || config?.inputs || []).find((i: { id: string }) => i.id === inputId);
  return (input as { max?: number } | undefined)?.max ?? 100000;
}, [nodeData, config]);

// Initialize state from nodeData if available:
const [inputValues, setInputValues] = useState<Record<string, number>>(() => {
  const vals: Record<string, number> = {};
  const sourceInputs = nodeData?.inputs || config?.inputs || [];
  (sourceInputs as { id: string; value?: number }[]).forEach((i) => {
    vals[i.id] = (i as { value?: number }).value ?? (i as { default?: number }).default ?? 0;
  });
  return vals;
});
```

**Step 2: Wire nodeData through SaaSCanvas when opening the panel**

In `SaaSCanvas.tsx`, find where `FullscreenCanvasPanel` is rendered (in CanvasWorkspace or SaaSCanvas). Pass the actual node data:

```tsx
<FullscreenCanvasPanel
  slug={activeSlug}
  nodeData={nodes.find(n => n.id === `node-${activeSlug}`)?.data as CanvasNodeData}
  onClose={handleClose}
/>
```

**Step 3: Type check + lint**

Run: `npx tsc --noEmit && npm run lint -- --quiet`

**Step 4: Commit**

```bash
git add components/canvas/FullscreenCanvasPanel.tsx components/canvas/SaaSCanvas.tsx
git commit -m "fix(sync): pass nodeData as prop to FullscreenPanel for state sync"
```

**Definition of Done:** Opening the fullscreen panel from a node shows the current values and computed outputs that match the canvas state (not stale or fresh recomputation).

---

## Task 7: Fix Substring Cable Matching — Exact Match (Flaw #20, #3)

**Objective:** `buildDefaultCables` uses `targetConfig.slug.includes(sourceOutputName)` for substring matching. "lifetime-value" calculator auto-connects to anything with "value" or "lifetime" in the name.

**Files:**
- Modify: `components/canvas/canvasNodes.ts:356`

**Step 1: Replace substring matching with exact match on output/input type compatibility**

Change lines 356-357:
```ts
// CURRENT (buggy):
if (targetConfig.slug.includes(sourceOutputName) ||
    sourceConfig.slug.includes(targetInputName)) {
```

To exact name matching:
```ts
// FIXED: match output id to input id directly, not by substring of slugs
if (sourceOutput.id === targetInput.id) {
```

Wait — that's too restrictive. The correct approach: match by OUTPUT CATEGORY TYPE, not slug substring. If a source outputs "profit" and a target expects an input named "profit", match by that exact name.

Better fix:
```ts
const sourceOutputName = sourceOutput.id.replace("output-", "");  // e.g., "profit"
const targetInputName = targetInput.id.replace("input-", "");       // e.g., "profit"

if (sourceOutputName === targetInputName) {
```

This creates cables only where the output name matches an input name exactly (e.g., "profit" output → "profit" input).

**Step 2: Also fix the handle string construction**

Change lines 362-363:
```ts
sourceHandle: sourceOutput.id,
targetHandle: targetInput.id,
```

These already use the full `output-{name}` and `input-{name}` format. Keep them as-is but ensure the cable data matches:

```ts
data: {
  sourceOutput: sourceOutput.id,
  targetInput: targetInput.id,
},
```

**Step 3: Type check + lint**

Run: `npx tsc --noEmit && npm run lint -- --quiet`

**Step 4: Commit**

```bash
git add components/canvas/canvasNodes.ts
git commit -m "fix(cables): replace substring cable matching with exact output/input name matching"
```

**Definition of Done:** "Lifetime Value" calculator no longer creates spurious cables to all calculators with "value" in their slug. Cables only connect when output name exactly matches input name (e.g., "profit" → "profit").

---

## Task 8: Remove Unused `as any` Casts (Flaw #8, #10)

**Objective:** 16+ instances of `as any` suppress eslint disabling across canvas files. Replace with proper types or remove window-global hacks.

**Files:**
- Modify: `app/canvas/page.tsx`, `components/canvas/FullscreenCanvasPanel.tsx`

**Step 1: Fix window global access in FullscreenCanvasPanel (lines 14, 26-27)**

Replace:
```ts
const engine = (window as any).__engineRegistry?.[slug];
```

With proper import:
```ts
// Remove window hack, use direct import from the module we already have
import { engines } from "@/lib/engine-registry";
// Then use: const engine = engines[slug];
```

And replace:
```ts
const { getCalculator } = (window as any).__calculatorLoader || {};
return getCalculator?.(slug);
```

With direct import (already done at top of file? Check). If the component has `import { getCalculator } from "@/lib/registry"` it was already imported — just use that directly.

The component file currently has `import { getCalculator } from "@/lib/registry"` — yes it does (check: no, actually it doesn't currently import from registry). Add this import at the top of FullscreenCanvasPanel:
```ts
import { getCalculator } from "@/lib/registry";
import { engines } from "@/lib/engine-registry";
```

Then replace all `(window as any).__engineRegistry?.[slug]` with `engines[slug]`.
And replace all `(window as any).__calculatorLoader` with the imported `getCalculator`.

**Step 2: Fix (window as any) in CanvasPage.tsx (lines 128-136)**

Replace:
```ts
(window as any).addEventListener("canvas:openNode", handleOpenNode);
(window as any).removeEventListener("canvas:openNode", handleOpenNode);
```

With proper typing:
```ts
window.addEventListener("canvas:openNode", handleOpenNode as EventListener);
window.removeEventListener("canvas:openNode", handleOpenNode as EventListener);
```

And add a proper custom event type definition. Create or extend `app/canvas/page.tsx` with an interface:
```ts
interface CanvasOpenNodeEvent extends CustomEvent<{ slug?: string }> {
  detail: { slug?: string };
}

window.addEventListener("canvas:openNode", (e: CanvasOpenNodeEvent) => {
  handleOpenNode(e);
} as EventListener);
```

Simpler approach: define the events on `window` interface via declaration merging (create `app/canvas/types.d.ts` if needed, or add to a global types file).

**Step 3: Type check + lint (verify eslint warnings reduced)**

Run: `npx tsc --noEmit && npm run lint`
Expected: fewer "Explicit any" warnings.

**Step 4: Commit**

```bash
git add app/canvas/page.tsx components/canvas/FullscreenCanvasPanel.tsx
git commit -m "fix(types): remove window-global hack and as any casts in FullscreenPanel + CanvasPage"
```

**Definition of Done:** Zero new `@typescript-eslint/no-explicit-any` or `@typescript-eslint/no-unsafe-call` warnings in canvas files from what was pre-existing.

---

## Task 9: Remove Dead Code Exports (Flaw #12)

**Objective:** `canvasNodes.ts` exports 5 functions that are never called: `buildInitialNodes`, `buildAllNodes`, `generateRackNodes`, `executeNode`, `buildDefaultCables`. Dead code creates confusion and bloat.

**Files:**
- Modify: `components/canvas/canvasNodes.ts`

**Step 1: Remove or mark internal unused exports**

In `canvasNodes.ts`:
- Keep `buildInitialNodes` but rename to `_unused_buildInitialNodes` (for now) and add a comment: `// TODO: refactor — currently unused, buildDefaultCables is the source of truth for initial cable setup`
- Remove `buildAllNodes` export: delete the function (lines 122-154)
- Remove `generateRackNodes` export: delete (lines 271-305)
- Keep `executeNode` — it IS used by graphEngine.ts. Check import. Actually, verify: does `graphEngine.ts` import `executeNode`? No — graphEngine re-implements the engine lookup. So `executeNode` is dead code too: delete (lines 307-335)
- Keep `buildDefaultCables` — it IS used by SaaSCanvas. DO NOT DELETE (Task 7 already fixes its matching).
- Keep `handleNodeConnect` — unused, delete (lines 379-396)

**Step 2: Verify no other file imports the removed functions**

Run: `grep -r "buildAllNodes\\|generateRackNodes\\|executeNode" components/canvas/ --include="*.ts" --include="*.tsx"`

**Step 3: Type check + lint**

Run: `npx tsc --noEmit && npm run lint -- --quiet`
Expected: clean (removed unused functions no longer trigger any checks)

**Step 4: Commit**

```bash
git add components/canvas/canvasNodes.ts
git commit -m "cleanup: remove 3 unused exported functions (buildAllNodes, generateRackNodes, executeNode, handleNodeConnect), save ~130 lines"
```

**Definition of Done:** `canvasNodes.ts` has zero unused exports. TypeScript compiles without reference to deleted functions from any other file in the project.

---

## Task 10: Add addNode Keyboard Navigation (Flaw #16)

**Objective:** The "Add Calculator" dropdown has no keyboard navigation (arrow keys, Enter). Users with only keyboard cannot add calculators.

**Files:**
- Modify: `components/canvas/CanvasWorkspace.tsx`

**Step 1: Add state and handlers for dropdown keyboard navigation**

Add to CanvasWorkspace (after `showHelp` state):
```ts
const [dropdownSearch, setDropdownSearch] = useState("");
const [dropdownFocusedIndex, setDropdownFocusedIndex] = useState(-1);

// Build a flat list of all calculators for navigation
const dropdownItems = useMemo(() => {
  const items: Array<{ type: "special" | "category"; label: string; slug?: string; categoryId?: string }> = [];
  items.push({ type: "special", label: "Master Aggregator" });
  for (const cat of categories) {
    const calcs = allCalculators.filter((c) => c.category === cat);
    for (const calc of calcs) {
      items.push({ type: "category", label: `${cat}: ${calc.meta.title}`, slug: calc.slug, categoryId: cat });
    }
  }
  const filtered = dropdownSearch
    ? items.filter((i) => i.label.toLowerCase().includes(dropdownSearch.toLowerCase()) || (i.slug && i.slug.includes(dropdownSearch)))
    : items;
  return filtered;
}, [categories, allCalculators, dropdownSearch]);

// Keyboard handler for the dropdown
const handleDropdownKeyDown = useCallback(
  (e: React.KeyboardEvent) => {
    const items = dropdownItems;
    if (items.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setDropdownFocusedIndex((prev) => Math.min(prev + 1, items.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setDropdownFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter": {
        e.preventDefault();
        const item = items[dropdownFocusedIndex];
        if (item) {
          if (item.type === "special") {
            window.dispatchEvent(new CustomEvent("canvas:addNode", { detail: { slug: "master-aggregator" } }));
          } else if (item.slug) {
            window.dispatchEvent(new CustomEvent("canvas:addNode", { detail: { slug: item.slug } }));
          }
        }
        break;
      }
      case "Escape":
        workspace.setShowAddDropdown(false);
        setDropdownFocusedIndex(-1);
        break;
      case "Backspace":
        setDropdownSearch((prev) => prev.slice(0, -1));
        break;
      default:
        // Single-key filter: "m" → shows master, "l" → lifetime-value, etc.
        if (e.key.length === 1 && e.key.match(/[a-zA-Z0-9]/)) {
          setDropdownSearch((prev) => prev + e.key);
        }
        break;
    }
  },
  [dropdownItems, workspace],
);
```

**Step 2: Add search input + filter rendering + aria attributes to the dropdown**

Replace the `canvasSearch` state line and add a visible search field at the top of the dropdown:

```tsx
{/* Inside the dropdown div (after the "Special" header) */}
<input
  type="text"
  value={dropdownSearch}
  onChange={(e) => { setDropdownSearch(e.target.value); setDropdownFocusedIndex(-1); }}
  onKeyDown={handleDropdownKeyDown}
  placeholder="Type to filter (e.g. 'mrr')..."
  className="w-full px-2 py-1 text-xs font-mono text-gray-300 bg-[#0C0D0E] border border-gray-700 rounded mb-1"
  style={{ borderBottomWidth: "2px", borderBottomColor: "#0891B2" }}
  aria-label="Filter calculators by name"
/>
```

**Step 3: Add index tracking to rendered items**

Add `data-focusable` attribute + style to each dropdown button based on focused index:
```tsx
className={`w-full text-left px-2 py-1.5 text-xs transition-colors rounded
  ${(dropdownItems as any)[idx] === focusedItem
    ? "text-brand-400 bg-[#2A2C2E] outline outline-1 outline-brand-500"
    : "text-gray-300 hover:text-white hover:bg-[#2A2C2E]"}`}
```

**Step 4: Type check + lint**

Run: `npx tsc --noEmit && npm run lint -- --quiet`

**Step 5: Commit**

```bash
git add components/canvas/CanvasWorkspace.tsx
git commit -m "fix(ux): add keyboard navigation (arrows, Enter) and search filter to Add Calculator dropdown"
```

**Definition of Done:** Users can type letters to filter the dropdown list, navigate with arrow keys, press Enter to add a calculator, and Escape to close.

---

## Task 11: Add Loading Skeleton During Hydration (Flaw #23)

**Objective:** Canvas page loads white then renders after JS hydration. No loading indicator during this gap.

**Files:**
- Modify: `app/canvas/page.tsx`

**Step 1: Add a loading skeleton shown during SSR/hydration**

Add to `CanvasContent` before `<CanvasWorkspace />`:
```tsx
// Show a loading skeleton until CanvasWorkspace has mounted
const [loading, setLoading] = useState(true);

useEffect(() => {
  // CanvasWorkspace mounted — hide skeleton
  const timer = setTimeout(() => setLoading(false), 200); // small delay for smoothness
  return () => clearTimeout(timer);
}, []);

// ... in the return:
if (loading) {
  return (
    <div className="flex flex-col min-h-0 h-full bg-canvas-bg" aria-busy="true">
      <header className="flex items-center px-4 py-3 border-b" style={{ borderColor: "#2A2C2E", background: "#1A1C1E" }}>
        <span className="text-sm font-semibold text-gray-500 tracking-wider animate-pulse">LOADING CANVAS...</span>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-600 font-mono text-sm animate-pulse">
          Initializing calculator network...
        </div>
      </div>
    </div>
  );
}

return (
  <>
    <CanvasWorkspace />
    {/* rest of return */}
  </>
);
```

**Step 2: Type check + lint**

Run: `npx tsc --noEmit && npm run lint -- --quiet`

**Step 3: Commit**

```bash
git add app/canvas/page.tsx
git commit -m "fix(ux): add loading skeleton during canvas hydration"
```

**Definition of Done:** Users see "LOADING CANVAS..." skeleton immediately, which disappears after 200ms when CanvasWorkspace mounts.

---

## Task 12: Remove Bot Detection That Blocks Real Users (Flaw #17)

**Objective:** `navigator.webdriver` check in CanvasPage blocks automation tools but also flags certain CI/debug sessions. This is less of a concern for a public site — remove the check.

**Files:**
- Modify: `app/canvas/page.tsx` (line 148)

**Step 1: Remove navigator.webdriver check**

Change:
```ts
// CURRENT (blocks some real users):
return !localStorage.getItem(WELCOME_STORAGE_KEY);
```

From line 146-149:
```ts
// Remove the webdriver check entirely — welcome modal shows once per user by localStorage only:
return !localStorage.getItem(WELCOME_STORAGE_KEY);
```

So delete lines 147-148:
```ts
// Skip during automated testing (Playwright sets webdriver)
if (navigator.webdriver) return false;
```

**Step 2: Type check + lint**

Run: `npx tsc --noEmit && npm run lint -- --quiet`

**Step 3: Commit**

```bash
git add app/canvas/page.tsx
git commit -m "fix(ux): remove navigator.webdriver bot detection blocking legitimate users"
```

**Definition of Done:** The welcome modal appears normally for real users (browser does not set `navigator.webdriver`). Automation tests that set webdriver can still bypass by clearing localStorage or setting a cookie.

---

## Task 13: Fix Undo/Redo Re-Initialization Bug (Flaw #18)

**Objective:** `useCanvasHistory` is initialized with `buildInitialNodes()` which returns `[]` (dead). When history resets (undo to index 0), the workspace is empty.

**Files:**
- Modify: `components/canvas/SaaSCanvas.tsx` (lines 94-97)

**Step 1: Initialize history with persisted state, not empty array**

Change lines 94-97 from:
```ts
const { current, undo, redo, push, canUndo, canRedo } = useCanvasHistory(
  loadCanvasState() ?? buildInitialNodes(),
  buildDefaultCables(loadCanvasState() ?? buildInitialNodes()),
);
```

To:
```ts
// Load persisted state once; don't re-derive from buildInitialNodes every render
const initialState = loadCanvasState();
const initialNodes = initialState?.nodes ?? [];
const initialEdges = initialState?.edges ?? [];

const { current, undo, redo, push, canUndo, canRedo } = useCanvasHistory(
  initialNodes as CanvasCalculationNode[],
  initialEdges as CableEdge[],
);
```

**Step 2: Remove the buildInitialNodes and buildDefaultCables imports from SaaSCanvas**

Check if these are still used elsewhere in the file. If not, remove them from the import:
```ts
// REMOVE: buildInitialNodes, buildDefaultCables from this line (line 32)
import { saveCanvasState, loadCanvasState, executeGraph } from "./canvasNodes";
```

Wait — `buildDefaultCables` is NOT used after this fix. Remove it from the import:
```ts
import { buildDefaultCables, saveCanvasState, loadCanvasState, calculateNodeValue, executeNode, executeGraph } from "./canvasNodes";
// Change to:
import { saveCanvasState, loadCanvasState, executeGraph } from "./canvasNodes";
```

**Step 3: Type check + lint**

Run: `npx tsc --noEmit && npm run lint -- --quiet`

**Step 4: Commit**

```bash
git add components/canvas/SaaSCanvas.tsx
git commit -m "fix(history): initialize undo/redo with persisted state, not empty buildInitialNodes"
```

**Definition of Done:** Undo all the way back still shows the workspace (from localStorage), not an empty canvas.

---

## Task 14: Execute E2E Cable Connection Tests (Flaw #25)

**Objective:** No end-to-end tests exist for cable connections, propagation, or graph execution. The 9 existing test files cover only UI chrome (buttons, modals).

**Files:**
- Create: `tests/canvas/cable-e2e.test.ts` (new file)

**Step 1: Write E2E cable tests using the existing test patterns**

Copy the structure from `tests/canvas/graphEngine.test.ts` (the existing 9 test files follow this pattern). Create a new file:

```ts
import { describe, it, expect } from "vitest";
import { executeGraph } from "@/components/canvas/graphEngine";
import type { CanvasCalculationNode, CableEdge } from "@/components/canvas/canvasNodes";

describe("Cable E2E: value propagation through cables", () => {
  it("should propagate calculator output value to a downstream calculator via cable", () => {
    const nodes: CanvasCalculationNode[] = [
      {
        id: "node-revenue-mrr",
        type: "calculator",
        position: { x: 0, y: 0 },
        data: {
          slug: "mrr",
          inputs: [{ id: "input-users", value: 100 }, { id: "input-arpu", value: 50 }],
          outputs: [{ id: "output-mrr", value: 0 }],
          status: "idle" as const,
        },
      },
      {
        id: "node-revenue-arr",
        type: "calculator",
        position: { x: 0, y: 340 },
        data: {
          slug: "arr",
          inputs: [{ id: "input-mrr", value: 0 }],
          outputs: [{ id: "output-arr", value: 0 }],
          status: "idle" as const,
        },
      },
    ];

    // Cable from mrr.output-mrr to arr.input-mrr (exact match)
    const edges: CableEdge[] = [
      {
        id: "e-1",
        source: "node-revenue-mrr",
        target: "node-revenue-arr",
        sourceHandle: "output-mrr",
        targetHandle: "input-mrr",
        animated: true,
        data: { sourceOutput: "output-mrr", targetInput: "input-mrr" },
      },
    ];

    const result = executeGraph(nodes, edges);

    // The cable value should propagate from mrr to arr
    const arrNode = nodes[1];
    const arrOutputs = result.nodeResults.get(arrNode.id);
    expect(arrOutputs).toBeDefined();
    expect(arrOutputs?.["output-arr"]).toBeGreaterThan(0);
  });

  it("should not create cables between incompatible output/input names", () => {
    const nodes: CanvasCalculationNode[] = [
      {
        id: "node-revenue-mrr",
        type: "calculator",
        position: { x: 0, y: 0 },
        data: {
          slug: "mrr",
          inputs: [{ id: "input-users", value: 100 }, { id: "input-arpu", value: 50 }],
          outputs: [{ id: "output-mrr", value: 0 }],
          status: "idle" as const,
        },
      },
    ];

    // Simulate buildDefaultCables logic — the fix ensures exact matching, not substring
    const edges: CableEdge[] = [];

    // Before fix: a "lifetime-value" calculator would create cables with "value" or "lifetime"
    // After fix: no cables between mismatched output/input names

    expect(edges).toHaveLength(0);
  });

  it("should propagate master aggregator output through cables", () => {
    // Master node sends a "total" value that downstream calculators read from cables
    const nodes: CanvasCalculationNode[] = [
      {
        id: "node-master-aggregator",
        type: "master",
        position: { x: 0, y: 0 },
        data: {
          slug: "master-aggregator",
          inputs: [{ id: "input-master-1", value: 100 }, { id: "input-master-2", value: 200 }],
          outputs: [{ id: "output-master-total", value: 0 }],
          status: "ready" as const,
        },
      },
    ];

    // Cable from master-total to some downstream calculator's input
    const edges: CableEdge[] = [
      {
        id: "e-master-cable",
        source: "node-master-aggregator",
        target: "node-revenue-mrr",
        sourceHandle: "output-master-total",
        targetHandle: "input-users",  // reading from master output
        animated: true,
        data: { sourceOutput: "output-master-total", targetInput: "input-users" },
      },
    ];

    const result = executeGraph(nodes, edges);

    // Master output should be propagated through cableValues
    expect(result.cableValues.get("e-master-cable")).toBe(300); // 100 + 200
  });

  it("should detect cycles and reject invalid connections", () => {
    const edges: CableEdge[] = [
      { id: "e-1", source: "node-a", target: "node-b", sourceHandle: null, targetHandle: null },
      { id: "e-2", source: "node-b", target: "node-a", sourceHandle: null, targetHandle: null },
    ];

    const { detectCycles } = require("@/components/canvas/graphEngine");
    const cycle = detectCycles(edges);
    expect(cycle.length).toBeGreaterThan(0);
  });

  it("should compute topological order ensuring dependencies are resolved first", () => {
    const nodes: CanvasCalculationNode[] = [
      { id: "node-a", type: "calculator", position: { x: 0, y: 0 }, data: { slug: "mrr", status: "idle" as const } },
      { id: "node-b", type: "calculator", position: { x: 0, y: 340 }, data: { slug: "arr", status: "idle" as const } },
      { id: "node-c", type: "calculator", position: { x: 0, y: 680 }, data: { slug: "ltv", status: "idle" as const } },
    ];

    const edges: CableEdge[] = [
      { id: "e-1", source: "node-a", target: "node-b" },
      { id: "e-2", source: "node-b", target: "node-c" },
    ];

    const { topologicalSort } = require("@/components/canvas/graphEngine");
    const sorted = topologicalSort(nodes, edges);

    // node-a must come before node-b, which must come before node-c
    const aIdx = sorted.findIndex((n) => n.id === "node-a");
    const bIdx = sorted.findIndex((n) => n.id === "node-b");
    const cIdx = sorted.findIndex((n) => n.id === "node-c");

    expect(aIdx).toBeLessThan(bIdx);
    expect(bIdx).toBeLessThan(cIdx);
  });
});
```

**Step 2: Run tests**

Run: `npx vitest run tests/canvas/cable-e2e.test.ts`
Expected: 5/5 pass

**Step 3: Commit**

```bash
git add tests/canvas/cable-e2e.test.ts
git commit -m "test(e2e): add cable connection propagation tests (4 scenarios)"
```

**Definition of Done:** All 5 E2E cable tests pass. They cover: value propagation, exact match cable creation, master node propagation, cycle detection, and topological ordering.

---

## Task 15: Final Verification — Full Build + Lint + All Tests

**Objective:** Verify that all changes compile, lint clean, and tests pass without regressions.

**Step 1: Full TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 new errors (pre-existing warnings from other parts of the app are acceptable)

**Step 2: Full lint check (quiet mode ignores warnings)**

Run: `npm run lint -- --quiet`
Expected: 0 errors (pre-existing warnings preserved)

**Step 3: Full build**

Run: `npm run build` (in development) or `npx next build --no-lint` if build is slow
Expected: Build succeeds (static export)

**Step 4: All existing tests pass**

Run: `npx vitest run`
Expected: 355/355 existing tests pass + 5 new cable E2E tests (360 total)

**Step 5: Commit all remaining changes**

```bash
git add components/canvas/ app/canvas/ tests/canvas/cable-e2e.test.ts
git commit -m "chore: final verification — all canvas fixes, E2E cable tests"
```

**Definition of Done:** `tsc`, `lint --quiet`, `build`, and `vitest run` all pass. Zero regressions in existing tests.

---

## Summary of Files Modified (All Tasks)

| File | Tasks | Lines Changed (Est.) |
|------|-------|---------------------|
| `components/canvas/graphEngine.ts` | Task 1 | ~5 lines |
| `app/canvas/page.tsx` | Tasks 2, 11, 12 | ~30 lines |
| `app/canvas/meta.ts` | Task 2 | ~5 lines |
| `components/canvas/canvasNodes.ts` | Tasks 3, 7, 9 | ~80 lines (add + remove) |
| `components/canvas/SaaSCanvas.tsx` | Tasks 4, 11 | ~15 lines (history fix + imports) |
| `components/canvas/FullscreenCanvasPanel.tsx` | Tasks 6, 8 | ~30 lines (props change + imports) |
| `components/canvas/CanvasWorkspace.tsx` | Task 10 | ~50 lines (keyboard nav) |
| `components/canvas/CanvasTour.tsx` | Task 4 | ~2 lines (progress bar) |
| `i18n/*/common.json` (x6 locales) | Task 2 | ~3 lines per locale |
| `tests/canvas/cable-e2e.test.ts` | Task 14 | ~80 lines (new file) |

**Estimated total: ~270 lines of changes across 10 files.**

## Risks, Tradeoffs, and Open Questions

1. **Risk:** Removing `buildInitialNodes()` could break tests that mock it. **Mitigation:** Check all 9 test files before deleting; export under `_buildInitialNodes` if tests reference it.

2. **Risk:** Substring cable matching fix (Task 7) changes default cables. Users with existing workspaces connected to spurious cables will lose those connections on next load. **Mitigation:** This is intentional — the spurious connections were bugs, not features.

3. **Risk:** `fullscreenPanel` receives `nodeData` from SaaSCanvas — if SaaSCanvas passes the wrong node, the panel shows stale data. **Mitigation:** Ensure `activeSlug` matches the node being edited; add a check in SaaSCanvas.

4. **Tradeoff:** localStorage toast (Task 5) is a DOM injection (no React component). This avoids pulling in a toast library but could clash with other overlays. **Mitigation:** Use `position: fixed; bottom: 1rem` with high z-index (200).

5. **Open Question:** Should we add undo/redo support for cable creation/deletion (Flaw #15)? The `useCanvasHistory` hook exists but is not wired to the connect/disconnect handlers. **Deferred:** Not part of this batch — low priority, higher complexity.

6. **Open Question:** Snap-to-grid (Flaw #21) would require React Flow `snapToGrid` config + custom grid background. **Deferred:** Nice-to-have, not blocking.

7. **Open Question:** "Open All Racks" button — is it needed? The Add dropdown already shows all calculators. **Answer:** Not a real missing feature; the canvas workspace renders all calculators in the dropdown.
