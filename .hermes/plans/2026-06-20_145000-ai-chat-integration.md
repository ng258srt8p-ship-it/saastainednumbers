# AI Chat Integration — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Add an AI chat assistant to calculator pages and the Canvas page that can analyze what's currently on screen — the calculator's inputs, outputs, benchmarks, and FAQ — using OpenRouter's free models.

**Architecture:** A floating chat widget (bottom-right, slide-over panel) rendered inside `CalculatorClient` and `CanvasPage`. It receives page context via a React context provider and includes that context in the system prompt so the AI knows exactly what the user is looking at. Calls OpenRouter directly from the browser (CORS-enabled). Only free models used via `openrouter/free` — zero operational cost.

**Tech Stack:** Next.js 16.2 (client component), OpenRouter API (`openrouter/free`), Tailwind CSS v4, framer-motion (already installed), React Context for page context

**Key Constraint:** Static export — no runtime API routes. Chat calls OpenRouter directly from browser.

---

## Definition of Done

### Scope Gates
- [ ] Chat appears ONLY on `/[category]/[slug]` (calculator pages) and `/canvas`
- [ ] Chat does NOT appear on home, blog, pricing, about, embed, or any other page
- [ ] Chat does NOT appear on `/embed/*` at all (it's rendered inside CalculatorClient, not embed's version)

### Technical Gates
- [ ] `STATIC_EXPORT=true npx next build` passes with zero errors
- [ ] `npm run lint` passes (zero new errors)
- [ ] TypeScript compiles (zero new errors)
- [ ] API key loaded from `NEXT_PUBLIC_OPENROUTER_API_KEY` env var — not hardcoded

### Functional Gates
- [ ] On a calculator page, AI can see: calculator title, description, current input values, computed outputs, benchmark data, and FAQ
- [ ] On the Canvas page, AI can see: list of workspace calculators and their output values
- [ ] Messages sent → OpenRouter responds → response displayed
- [ ] Chat state shows loading indicator during API call
- [ ] Error state gracefully handled (network error, rate limit)
- [ ] Chat button slides open/closed with animation

### UX Gates
- [ ] Floating button at bottom-right (z-50, fixed position)
- [ ] Panel slides in/out smoothly
- [ ] Messages scrollable with auto-scroll to latest
- [ ] Input at bottom, Send button + Enter to send
- [ ] Shift+Enter for newline
- [ ] Mobile-responsive at 375px+
- [ ] Dark mode compatible (uses existing CSS variables)

---

## Architecture

```
┌────────────────────────────────────────────────┐
│  AiChatContext (React Context)                  │
│  - setPageContext({ type, title, data, ... })   │
│  - getPageContext()                              │
└──────┬─────────────────────────────────────────┘
       │
┌──────▼─────────────────────────────────────────┐
│  CalculatorClient / CanvasPage                  │
│  - Sets context with current screen data       │
│  - Renders <AiChatWidget />                     │
└──────┬─────────────────────────────────────────┘
       │
┌──────▼─────────────────────────────────────────┐
│  AiChatWidget                                    │
│  - Floating button (fixed bottom-right)         │
│  - Slide-over panel with messages               │
│  - Reads context from AiChatContext              │
│  - Calls OpenRouter with context-enhanced prompt │
│  - Renders markdown responses                   │
└────────────────────────────────────────────────┘
```

### Data Flow

1. `CalculatorClient` computes `aiInputs` and `aiOutputs` (already done — lines 113-120)
2. `CalculatorClient` calls `setPageContext()` with the calculator info + current results
3. When user opens chat and asks a question, `AiChatWidget` reads the context
4. The context is injected into the system prompt so the AI sees the current screen state
5. The API call goes directly to `openrouter.ai/api/v1/chat/completions`

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `lib/ai-chat-context.ts` | **Create** | React context + provider for page screen context |
| `lib/openrouter.ts` | **Create** | OpenRouter API client (fetch wrapper) |
| `components/AiChatWidget.tsx` | **Create** | Floating chat button + slide-over panel with messages |
| `app/[category]/[slug]/CalculatorClient.tsx` | **Modify** | Import AiChatWidget + set page context |
| `app/canvas/page.tsx` | **Modify** | Import AiChatWidget + set page context |
| `.env.example` | **Create** | Document `NEXT_PUBLIC_OPENROUTER_API_KEY` |
| `app/api/og/route.tsx` | **No change** | Not affected |

---

## Model Configuration

The API key provided:
```
sk-or-v1-...
```

The model is hardcoded to `openrouter/free` — this is OpenRouter's auto-router that **only routes to free models**. It will never use a paid model. No model selection UI is needed.

System prompt instructs the AI to:
- Analyze the current calculator data visible on screen
- Answer questions about SaaS metrics, interpreting results
- Guide users to relevant calculators when appropriate
- Respond in the user's language

---

## Implementation Tasks

### Task 1: Create AI Chat Context

**Objective:** Create a React context that calculator/canvas pages use to tell the chat widget what's on screen.

**Files:**
- Create: `lib/ai-chat-context.ts`

**Step 1: Write the context**

```typescript
// lib/ai-chat-context.ts
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface CalculatorScreenData {
  type: "calculator";
  slug: string;
  title: string;
  description: string;
  category: string;
  inputs: Array<{ id: string; label: string; value: number; type: string }>;
  outputs: Array<{ id: string; label: string; value: number | string; type: string }>;
  benchmarks?: Array<{ metric: string; value: string; source: string }>;
  faq?: Array<{ question: string; answer: string }>;
}

export interface CanvasScreenData {
  type: "canvas";
  calculators: Array<{
    slug: string;
    title: string;
    outputs: Array<{ id: string; label: string; value: number | string; type: string }>;
  }>;
}

export type ScreenData = CalculatorScreenData | CanvasScreenData;

interface AiChatContextValue {
  screenData: ScreenData | null;
  setScreenData: (data: ScreenData | null) => void;
}

const AiChatContext = createContext<AiChatContextValue>({
  screenData: null,
  setScreenData: () => {},
});

export function AiChatProvider({ children }: { children: ReactNode }) {
  const [screenData, setScreenData] = useState<ScreenData | null>(null);
  return (
    <AiChatContext.Provider value={{ screenData, setScreenData }}>
      {children}
    </AiChatContext.Provider>
  );
}

export function useAiChatContext() {
  return useContext(AiChatContext);
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add lib/ai-chat-context.ts
git commit -m "feat: create AiChatContext for page screen context"
```

---

### Task 2: Create OpenRouter API client

**Objective:** Create a thin fetch wrapper for OpenRouter's chat completions API.

**Files:**
- Create: `lib/openrouter.ts`

**Step 1: Write the client**

```typescript
// lib/openrouter.ts
import type { ScreenData } from "./ai-chat-context";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openrouter/free";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatResponse {
  id: string;
  choices: Array<{
    message: { role: string; content: string };
    finish_reason: string;
  }>;
}

/**
 * Build a system prompt that includes the current screen context.
 * This lets the AI "see" what the user is looking at.
 */
function buildSystemPrompt(screenData: ScreenData | null): string {
  const base = `You are a helpful AI assistant for SaaStainedNumbers.com, a free SaaS calculator website. You help users understand SaaS metrics (MRR, ARR, CAC, LTV, churn, NRR, gross margin, etc.), interpret calculator results, and learn about business financial concepts.

Guidelines:
- Keep answers concise and practical (2-4 paragraphs max).
- When appropriate, explain what a metric means, what a healthy range looks like, and how to improve it.
- If the user asks something off-topic, politely redirect to SaaS/business topics.
- Respond in the user's language.`;

  if (!screenData) return base;

  if (screenData.type === "calculator") {
    const inputsSummary = screenData.inputs
      .map((i) => `  - ${i.label}: ${i.value}${i.type === "currency" ? " (currency)" : i.type === "percentage" ? "%" : ""}`)
      .join("\n");
    const outputsSummary = screenData.outputs
      .map((o) => `  - ${o.label}: ${o.value}${o.type === "currency" ? " (currency)" : o.type === "percentage" ? "%" : ""}`)
      .join("\n");
    const benchmarksSummary = screenData.benchmarks?.length
      ? "\nIndustry benchmarks:\n" + screenData.benchmarks.map((b) => `  - ${b.metric}: ${b.value}`).join("\n")
      : "";

    return `${base}

The user is currently viewing the "${screenData.title}" calculator.

Description: ${screenData.description}

Current inputs:
${inputsSummary}

Current results:
${outputsSummary}${benchmarksSummary}

Use this context to help them interpret their results. If they ask about a specific value, point to the relevant input or output.`;
  }

  if (screenData.type === "canvas") {
    const calcsSummary = screenData.calculators
      .map(
        (c) =>
          `  - ${c.title} (${c.slug}):\n` +
          c.outputs.map((o) => `    - ${o.label}: ${o.value}`).join("\n")
      )
      .join("\n");

    return `${base}

The user is on the Canvas page, comparing multiple calculators side-by-side. The workspace contains:

${calcsSummary}

Help them compare and interpret these metrics together.`;
  }

  return base;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  screenData: ScreenData | null
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("AI chat is not configured. Please set NEXT_PUBLIC_OPENROUTER_API_KEY.");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://saastainednumbers.com",
      "X-Title": "SaaStainedNumbers",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt(screenData) },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Daily AI chat limit reached. Please try again tomorrow.");
    }
    const errorBody = await response.text().catch(() => "unknown error");
    throw new Error(`AI chat error (${response.status}). Please try again.`);
  }

  const data: ChatResponse = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Sorry, I didn't get a response. Please try again.");
  }
  return content;
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add lib/openrouter.ts
git commit -m "feat: create OpenRouter API client with screen context"
```

---

### Task 3: Create AiChatWidget component

**Objective:** Build the floating chat button + slide-over panel with messages, powered by the screen context.

**Files:**
- Create: `components/AiChatWidget.tsx`

**Step 1: Write the component**

```typescript
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage } from "@/lib/openrouter";
import { useAiChatContext } from "@/lib/ai-chat-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { screenData } = useAiChatContext();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Reset messages and error when navigating to a new page
  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [screenData?.type === "calculator" ? screenData.slug : screenData?.type]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    setError(null);

    const userMessage: Message = { id: `u-${Date.now()}`, role: "user", content: text };
    const pendingMessages = [...messages, userMessage];
    setMessages(pendingMessages);
    setIsLoading(true);

    try {
      const apiMessages = pendingMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await sendChatMessage(apiMessages, screenData);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: response },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, screenData]);

  return (
    <>
      {/* Chat button — fixed bottom-right */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700 transition-all hover:scale-105 active:scale-95"
        aria-label="Open AI Chat"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat panel — slide-over */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex w-[380px] max-w-[calc(100vw-32px)] flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
            style={{ height: "min(600px, calc(100vh - 160px))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold">AI</div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Ask AI</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Close chat"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && !error && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-8">
                  Ask me about the {screenData?.type === "calculator" ? screenData.title : "calculators"} on this page.
                </p>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-brand-600 text-white rounded-br-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-gray-100 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
              {error && (
                <div className="rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-xs text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about this calculator..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

**Step 2: Commit**

```bash
git add components/AiChatWidget.tsx
git commit -m "feat: create AiChatWidget with screen-aware chat"
```

---

### Task 4: Wire AiChatWidget into CalculatorClient

**Objective:** Render the chat widget and set page context with the current calculator's data.

**Files:**
- Modify: `app/[category]/[slug]/CalculatorClient.tsx`

**Step 1: Add imports**

```typescript
import { AiChatWidget } from "@/components/AiChatWidget";
import { useAiChatContext } from "@/lib/ai-chat-context";
```

**Step 2: Set page context using existing aiInputs/aiOutputs**

The `CalculatorClient` already computes `aiInputs` (line 113) and `aiOutputs` (line 120) using the current state. Add this just after the existing computations:

```typescript
import { useAiChatContext } from "@/lib/ai-chat-context";

// Inside CalculatorClient function, after aiInputs/aiOutputs are computed:
const { setScreenData } = useAiChatContext();

useEffect(() => {
  setScreenData({
    type: "calculator",
    slug: config.slug,
    title: config.meta.title,
    description: config.meta.description,
    category: config.category,
    inputs: aiInputs,
    outputs: aiOutputs,
    benchmarks: config.content.benchmarkData,
    faq: config.content.faq,
  });
}, [config, aiInputs, aiOutputs, setScreenData]);
```

**Step 3: Render AiChatWidget inside the component**

Add at the end of the return statement, before the closing fragment `</>`:

```typescript
<AiChatWidget />
```

**Step 4: Wrap in AiChatProvider**

The `CalculatorClient` is rendered inside pages that don't have the provider. The provider should wrap the widget at the app level or inside each page. Cleanest: wrap the `AiChatWidget` in its own local provider, or use a provider at the page level.

Actually — the simplest approach is to have the `AiChatWidget` use a lightweight inline provider pattern. But since both `CalculatorClient` and `CanvasPage` need it, the cleanest architecture is:

1. Add `AiChatProvider` to the root layout (wrapping the body content)
2. `AiChatWidget` renders inside `CalculatorClient` and `CanvasPage`
3. `AiChatWidget` reads context from `AiChatProvider`

But wait — the root layout is a server component. `AiChatProvider` is a client component. We can add it as a client component wrapper.

Let's keep it simpler: **Add AiChatProvider to `CalculatorClient` and `CanvasPage` independently** wrapping just the `AiChatWidget`. No context needed.

Hmm, but then they can't share context. Let me rethink.

The simplest approach that works:

**In `CalculatorClient` and `CanvasPage` directly:**
- Import and render `<AiChatWidget />` (which includes its own floating button)
- Pass screen data as a prop to `<AiChatWidget>` rather than using context

Actually, the absolute simplest: just pass the screen data directly as a prop:

```typescript
<AiChatWidget screenData={{
  type: "calculator",
  slug: config.slug,
  title: config.meta.title,
  // ...
}} />
```

This removes the need for context entirely! Why use context when we can just pass a prop?

**Revised approach: prop-based, no context needed.**

**Step 5: Commit**

```bash
git add app/[category]/[slug]/CalculatorClient.tsx
git commit -m "feat: add AiChatWidget to calculator pages with screen context"
```

---

### Task 5: Wire AiChatWidget into CanvasPage

**Objective:** Render the chat widget on the Canvas page and pass workspace context.

**Files:**
- Modify: `app/canvas/page.tsx`

**Step 1: Add imports and render**

```typescript
import { AiChatWidget } from "@/components/AiChatWidget";
import { getCalculator } from "@/lib/registry";

// Inside CanvasPage function, before the return:
const workspaceContext = useMemo(() => ({
  type: "canvas" as const,
  calculators: workspaceCalculators.map((slug) => {
    const calc = getCalculator(slug);
    const engine = engines[slug as keyof typeof engines] as
      | ((params: Record<string, number>) => Record<string, number | string>)
      | undefined;
    // Use default values for engine context since canvas has dynamic inputs
    const config = calc as unknown as { meta: { title: string }; inputs: { id: string; defaultValue: number }[] } | undefined;
    return {
      slug,
      title: config?.meta?.title ?? slug,
      outputs: [],
    };
  }),
}), [workspaceCalculators]);
```

**Step 2: Render AiChatWidget**

```typescript
// At the end of the return:
<AiChatWidget screenData={workspaceContext} />
```

**Step 3: Commit**

```bash
git add app/canvas/page.tsx
git commit -m "feat: add AiChatWidget to Canvas page with workspace context"
```

---

### Task 6: Create .env.example

**Objective:** Document the new environment variable.

**Files:**
- Create: `.env.example`

```
# OpenRouter — used by the AI chat widget (browser-side)
# Used exclusively with openrouter/free (free models only — zero cost)
# Create a key at https://openrouter.ai/keys with a low credit limit
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-...
```

---

### Task 7: Final verification

**Objective:** Build, lint, and verify everything works end-to-end.

**Steps:**
1. Set `NEXT_PUBLIC_OPENROUTER_API_KEY` in the environment
2. Run `STATIC_EXPORT=true npx next build` — verify zero errors
3. Run `npm run lint` — verify zero new errors
4. Run `npx tsc --noEmit` — verify zero errors
5. Start dev server and verify:
   - Chat button appears on `/[category]/[slug]` pages
   - Chat button appears on `/canvas`
   - Chat button does NOT appear on `/`, `/blog`, `/pricing`, `/about`, etc.
   - Chat button does NOT appear on `/embed/[slug]`
   - Opening chat shows context-aware placeholder text
   - Sending a message calls OpenRouter and displays the response
   - Error state renders correctly

---

## Risks and Open Questions

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| API key visible in browser DevTools | Certain | Low | Key is scoped to free models only + set $5 credit cap |
| Free tier rate limit (50 reqs/day) | Medium | Low | Show friendly error; upgrade to paid tier if needed |
| Free models discontinued | Low | Medium | Switch to `openai/gpt-4o-mini` (~$0.15/million tokens) |
| Chat state lost on page navigation | Certain | Low | Acceptable; welcome message re-orients user |
| Canvas context complexity | Medium | Low | Pass simplified context (calculator slug + title); can enrich later |

### Open Questions
1. **Edit input from chat?** — Future: let the AI change calculator inputs directly
2. **Canvas per-calculator context?** — Currently passing workspace list. Could pass individual calculator outputs if the Canvas exposes them through the workspace.

---

## OpenRouter Integration Summary

```typescript
// Direct browser call — no proxy needed
// CORS: Access-Control-Allow-Origin: *
// Free models only via "openrouter/free"

fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
    "HTTP-Referer": "https://saastainednumbers.com",
    "X-Title": "SaaStainedNumbers",
  },
  body: JSON.stringify({
    model: "openrouter/free",  // 🔒 ONLY free models
    messages: [systemPrompt, ...conversation],
    max_tokens: 1024,
    temperature: 0.7,
  }),
});
```

The system prompt is dynamically built from the current screen context — the AI "sees" the calculator title, inputs, outputs, benchmarks, and FAQ so it can have an informed conversation about the data on screen.
