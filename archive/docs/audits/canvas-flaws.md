# Canvas Feature — Flaw & Improvement Analysis

**Updated:** 2026-06-17 — Build green (0 TS errors), 9/9 E2E tests passing. See [Fixed Items](#fixed-items-jun-17) at bottom.

## 🔴 Critical Bugs

### 1. Cable Value Propagation Is Broken (`graphEngine.ts:115`)

```ts
const cable = edges.find((e) => e.target === input.id);
```

**Flaw:** `e.target` is a **node ID** (e.g. `"node-mrr"`) but `input.id` is a **handle ID** (e.g. `"input-mrr"`). These are fundamentally different values — the comparison is always `false`. Cable values never flow through the graph.

The master node handler (`graphEngine.ts:128`) has the same bug:

```ts
edges.filter((e) => e.source === outputId)
```

Here `e.source` is a node ID and `outputId` is `"output-master-total"` — never matches.

**Fix:** Match on `e.targetHandle === input.id` (and `e.sourceHandle === outputId` for the master node).

**Impact:** Any multi-node connection (calculator A → calculator B) silently produces 0 for the downstream input. The entire "connect calculators together" value proposition is non-functional.

---

### 2. Missing SEO Metadata (`app/canvas/meta.ts` — Never Imported)

**Flaw:** `app/canvas/meta.ts` exports a `metadata` object, but neither `layout.tsx` nor `page.tsx` imports it. The canvas page has no title, no description, no Open Graph tags.

**Fix:** Import and re-export `metadata` from `page.tsx`, or merge it into the page file directly.

**Impact:** `/canvas` page renders with `"SaaStainedNumbers"` as title (the root layout default) and zero social preview — invisible to search engines.

---

### 3. Self-Recursive Close Event Loop (`FullscreenCanvasPanel.tsx:62-78`)

```ts
const handleClose = useCallback(() => {
  window.dispatchEvent(new CustomEvent("canvas:closeFullscreen", {}));
}, []);

useEffect(() => {
  const handler = () => handleClose();
  window.addEventListener("canvas:closeFullscreen", handler);
  return () => window.removeEventListener("canvas:closeFullscreen", handler);
}, [handleClose]);
```

**Flaw:** `handleClose` dispatches `"canvas:closeFullscreen"`, and the effect listens for the same event and calls `handleClose` again. Synchronous `dispatchEvent` means each close triggers re-dispatch. The loop terminates only when the parent unmounts the component (due to `showFullscreen` becoming false), but it does so via repeated redundant event dispatches.

**Fix:** Either use a direct callback prop, or dispatch to a *different* event name than what the listener subscribes to.

---

## 🟠 Architectural / Design Flaws

### 4. Two Graph Engines — One Unused (`canvas/engine/graph.ts`)

**Flaw:** A second, independent graph engine lives at `canvas/engine/graph.ts` with its own type system (`GraphNode`, `GraphEdge`), cycle detection, topological sort, and change propagation. It is **never imported** anywhere — 270 lines of dead code.

Worse, the unused engine has a *cleaner architecture* (proper type separation, adjacency list pre-computation, BFS propagation) than the active one.

**Fix:** Remove dead code, or better, migrate the active engine to use the clean architecture from the unused one.

---

### 5. No Topological Order Guarantee in Graph Execution (`graphEngine.ts:88-168`)

**Flaw:** `executeGraph` uses a while-queue but does not sort nodes topologically before execution. It iterates through edges to find downstream nodes, which means a node may be executed before all its upstream dependencies have produced their final values.

The existing `topologicalSort` function (Kahn's algorithm, proven correct) is defined but **never called** anywhere in the execution path.

**Fix:** Call `topologicalSort` first, then iterate nodes in that order.

---

### 6. O(n²) Lookups in Hot Path (`graphEngine.ts:103,111,115,146,151,156`)

**Flaw:** Every iteration calls `nodes.find((n) => n.id === nodeId)` (O(n) per node), and `edges.filter` (O(m) per output). For a graph of 75 nodes each with multiple inputs/outputs, this is O(n × (n + m × k)) per execution.

**Fix:** Build `Map<string, Node>` and `Map<string, CableEdge[]>` once at the start.

---

### 7. Full Re-Execution on Every Slider Change

**Flaw:** `dirtyNodeIds` parameter is defined in `executeGraph` but never passed — every input change triggers a full re-execution of *all* nodes. The `findDownstreamDependencies` function exists to compute the affected subgraph but is never called.

**Fix:** On input change, call `findDownstreamDependencies` to get the affected set, pass it as `dirtyNodeIds`.

---

### 8. Event Bus Pattern — No Type Safety

**Flaw:** All inter-component communication goes through `window.dispatchEvent` / `window.addEventListener` with string event names and untyped `CustomEvent.detail` payloads. Every file casts to `(window as any)` and to `event as CustomEvent<...>`. There is zero compile-time verification that:
- Event names aren't misspelled
- Payload shapes match between dispatch and listener
- Listeners are cleaned up on unmount

**Impact:** A typo like `"canvas:nodeInputhange"` silently does nothing. Cross-file refactoring of event payloads requires manual audit.

**Fix:** Create a typed event bus module with `emit<T>(name, detail)` / `on<T>(name, handler)` that enforces payload types per event name.

---

### 9. `eslint-disable @typescript-eslint/no-explicit-any` Used Extensively (16+ Occurrences)

**Flaw:** Rather than proper typing, the codebase uses `as any` casts with eslint suppression across SaaSCanvas, FullscreenCanvasPanel, SkeuomorphicCalculatorNode, MasterAggregatorNode, Canvas page, and graphEngine. The `nodeTypes` and `edgeTypes` props are passed with `as any`.

**Fix:** Properly type `nodeTypes` as `Record<string, ComponentType<NodeProps>>` and `edgeTypes` as `Record<string, ComponentType<EdgeProps>>`. Create proper union types for node data.

---

### 10. Hardcoded Slider Ranges (`min={0} max={100000}`)

**Flaw:** In both `SkeuomorphicCalculatorNode.tsx:132` and `FullscreenCanvasPanel.tsx:150`, all sliders use `min={0} max={100000}`. Many calculators need values outside this range:
- Revenue metrics: millions/billions
- Burn rate: monthly, ranges widely
- AI Cost: per-token costs in fractions of cents
- FIRE: net worth in millions

The calculator configs have `input.min`/`input.max` fields but these are ignored.

**Fix:** Read `min` and `max` from the calculator's input config.

---

### 11. i18n Keys for Canvas Exist But Are Not Used

**Flaw:** The `i18n/en/common.json` file defines 7 canvas translation keys (`"nodes"`, `"cables"`, `"closeRack"`, `"openAllRacks"`, `"closePanel"`, `"inputs"`, `"outputs"`, `"canvasReady"`), but the canvas UI components never call `getTranslations()` or `useLocale()`. All text in the workspace, nodes, tour, help, and welcome modal is hardcoded English.

The reference to "CLOSE RACK"/"OPEN ALL RACKS" in i18n describes a feature that doesn't exist in the code.

**Fix:** Wire up i18n throughout all canvas components, or remove the unused keys.

---

### 12. Dead Code in `canvasNodes.ts` (4 Functions, ~130 Lines)

**Flaw:** The following functions are exported but never imported anywhere:

| Function | Lines | Purpose |
|---|---|---|
| `buildAllNodes()` | 122-154 | Builds all 75 calculators into a grid |
| `generateRackNodes(category)` | 271-305 | Builds nodes for one category |
| `buildDefaultCables(nodes)` | 337-377 | Auto-connects nodes by name matching |
| `handleNodeConnect(connection)` | 379-396 | Adds edge with data (mirrors React Flow's `addEdge`) |
| `executeNode(node)` | 307-335 | Runs a single node's engine (unused) |

Additionally, `buildInitialNodes()` (line 58-60) always returns `[]` — a no-op wrapper.

**Fix:** Remove dead code (recoverable from git history if needed later).

---

### 13. Persistence Has No Versioning or Migration

**Flaw:** `saveCanvasState` / `loadCanvasState` stores raw JSON with no version field. If the serialization format changes (e.g., input ID scheme, calculator config structure), all previously saved workspaces will silently fail to load, produce broken nodes, or throw `JSON.parse` errors.

**Fix:** Add a `version: number` field to `SavedState`. On load, check version and migrate if needed, or clear incompatible state.

---

## 🟡 UX / Design Issues

### 14. Fullscreen Panel Display Can Desync from Node State

**Flaw:** `FullscreenCanvasPanel` maintains its own `inputValues` state (line 27-33), initialized from the node's data. It dispatches `canvas:nodeInputChange` to sync back to the canvas, but **never listens** for external output updates. If another mechanism changes the node's outputs (e.g., another connected node changes upstream), the fullscreen panel's displayed results won't reflect the change.

**Fix:** Subscribe to node state updates (via event or context) and update `outputValues` reactively.

---

### 15. Node Output Display Can't Distinguish 0 from "No Value"

**Flaw:** In `SkeuomorphicCalculatorNode.tsx:151` and `FullscreenCanvasPanel.tsx:178`, outputs display `output.value ?? 0` and `output.value ?? "—"` respectively. When a genuine calculation result is `0`, the node shows `0` (ambiguous) and the fullscreen panel shows `0` (formatted). When there's genuinely no value (undefined), the node shows `0` (misleading).

**Fix:** Use a sentinel value (e.g., `null`, `NaN`, `undefined`) and display `"—"` consistently.

---

### 16. No Keyboard Navigation for Add Dropdown

**Flaw:** The "Add" dropdown in `CanvasWorkspace.tsx` renders a flat list of buttons organized by category. There is no keyboard navigation — no arrow keys, no type-ahead search, no Enter-to-select. After clicking "Add", the user must reach for the mouse.

**Fix:** Use a `combobox` pattern with `role="listbox"`, arrow key handlers, and a search input.

---

### 17. Welcome Modal Uses Fragile Bot Detection

**Flaw:** (`app/canvas/page.tsx:148`):
```ts
if (navigator.webdriver) return false;
```

This check skips the welcome modal during Playwright tests. `navigator.webdriver` is a property set by browser automation tools, but it is unreliable — not all tools set it, and it can be overridden. It also prevents legitimate users from seeing the welcome if they have automation tools installed.

**Fix:** Pass a query parameter (`?welcome=skip`) in E2E tests instead of relying on `navigator.webdriver`.

---

### 18. No Undo/Redo for Any Canvas Action

**Flaw:** Adding a node, deleting a node, connecting cables, moving nodes, or changing slider values are all irreversible (except via manual reconfiguration). Node deletion in particular has no confirmation, even when deleting a node with many cable connections.

**Fix:** Implement a command/action history stack. At minimum, add a "Clear workspace" confirmation dialog and a "Clear all" action in the workspace.

---

### 19. Canvas Tour Progress Bar Shows 0% on Step 1

**Flaw:** (`CanvasTour.tsx:132`):
```tsx
style={{ width: `${((currentStep) / (tourSteps.length - 1)) * 100}%` }}
```

Step 0 shows 0%, step 1 (the second step) shows ~14.3%. A progress bar starting at 0 is correct behavior for step-based progress, but visually it looks broken on the first step. Additionally, the HTML entity `&#8594;` in JSX strings will render literally rather than as an arrow character.

**Fix:** Offset progress: `(currentStep + 1) / tourSteps.length`. Use actual Unicode characters instead of HTML entities in JSX.

---

### 20. No Snap-to-Grid or Auto-Layout

**Flaw:** Nodes can be freely dragged to any position. There is no snap-to-grid, no alignment guides, and no auto-layout button. Connected graphs quickly become messy. The canvas has no way to auto-arrange nodes in a readable flow (e.g., left-to-right DAG layout).

**Fix:** Implement snap-to-grid (React Flow supports `snapToGrid` prop with `snapGrid`). Add an auto-layout button using `dagre` or a simple layered layout algorithm.

---

### 21. "Open All Racks" / "CLOSE RACK" Referenced But Missing

**Flaw:** The i18n file defines `"openAllRacks"` / `"closeRack"` and the Help section describes an "ALL RACKS" button, but no such button exists in `CanvasWorkspace.tsx` or any other component. This is a reference to a planned feature that was either removed or never implemented.

**Fix:** Either implement the feature (a category-focused grid layout toggle) or remove the references from i18n and CanvasHelp.

---

## 🟢 Minor / Polish

### 22. `fitView` Fires on Every `nodes.length` Change

`SaaSCanvas.tsx:245-250`: `fitView` runs every time `nodes.length` changes, resetting the user's zoom/pan on node add. This is disruptive for users with a panned workspace.

**Fix:** Only fit view on first load or provide an explicit "Fit view" button.

### 23. No Loading Indicator During Hydration

`SaaSCanvas.tsx:48-58`: The canvas renders 0 nodes on the server, then loads persisted state on the client. There is no visual indicator that state is being loaded — the canvas just appears empty for a frame.

**Fix:** Show a brief skeleton or "Loading workspace..." message while `hydrated === false`.

### 24. Local Storage Quota Not Handled Gracefully

`canvasNodes.ts:180-183`: `localStorage.setItem` is wrapped in try/catch but there's no user feedback. If the browser quota is exceeded (common with large workspaces), the user's save silently fails.

**Fix:** Show a toast notification when persistence fails.

### 25. No E2E Coverage for Core Feature — Cable Connections

`tests/e2e/canvas.spec.ts` has 9 tests, all for UI chrome (page loads, buttons exist, dropdown opens, navigation). Zero tests verify:
- Dragging a cable between nodes
- Value propagation through connected nodes
- Fullscreen panel open/close
- localStorage persistence
- Node deletion

The unit tests for `graphEngine.ts` only test with mock nodes (no real calculator engines), so they don't catch the cable matching bug (#1).

**Fix:** Add Playwright tests that add two calculators, connect them, change a slider, and verify the output updates.

---

## Fixed Items (Jun 17)

### Build (0 TS Errors)
~15 TypeScript errors fixed across 6 files — build now passes with 233 pages.

| File | Fix |
|------|-----|
| `SaaSCanvas.tsx` | Default export, imports, `useRef` init, `setNodes`/`setEdges` 2nd arg, `NodeChange`/`EdgeChange` generics, circular `CanvasWorkspace` render, wrong config schema paths, `loadCanvasState` type mismatch |
| `CanvasWorkspace.tsx` | `setShowAddDropdown` → `openDropdown()`/`closeDropdown()`, `openTour()` → `startTour()` |
| `FullscreenCanvasPanel.tsx` | Missing type annotations, `KeyboardEvent` → `globalThis.KeyboardEvent` |
| `graphEngine.ts` | `node.type === "master"` unreachable type guard |
| `canvasNodes.ts` | `CanvasCalculationNode.type` widened to `"calculator" \| "master"` |
| `SkeuomorphicCalculatorNode.tsx` | Import path fix (earlier session) |

### Missing Event Listener Added
`canvas:addNode` CustomEvent from `CanvasWorkspace` dropdown had no listener — clicking "Add" buttons dispatched events that were silently ignored. Added `useEffect` in `SaaSCanvas.tsx` with `window.addEventListener("canvas:addNode", handler)`.

### E2E Tests (9/9 Passing)
- Added `data-testid="canvas-count-text"` to node/cable count `<span>`
- Guide tour test: added `.first()` for React StrictMode compliance
