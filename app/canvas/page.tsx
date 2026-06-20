"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CalculatorCatalog } from "@/components/canvas/CalculatorCatalog";
import { CalculatorWorkspace } from "@/components/canvas/CalculatorWorkspace";
import { getTemplateById } from "@/lib/canvas-templates";
import { getCalculator } from "@/lib/registry";
import { AiChatWidget } from "@/components/AiChatWidget";
import { AiChatProvider, useAiChatContext } from "@/lib/ai-chat-context";
import "@/calculators/config/_all";

const WORKSPACE_STORAGE_KEY = "canvas-workspace-calculators";

function loadSlugs(): string[] {
  try {
    const stored = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore parse errors
  }
  return [];
}

function CanvasPageInner() {
  const [workspaceCalculators, setWorkspaceCalculators] = useState<string[]>([]);
  const { setScreenData } = useAiChatContext();
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    const slugs = loadSlugs();
    setWorkspaceCalculators(slugs);
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever workspace changes (skip initial SSR hydrate)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspaceCalculators));
    }
  }, [workspaceCalculators, hydrated]);

  // Build workspace context for the AI chat
  const workspaceContext = useMemo(() => {
    return {
      type: "canvas" as const,
      calculators: workspaceCalculators.map((slug) => {
        const calc = getCalculator(slug);
        return {
          slug,
          title: calc?.meta?.title ?? slug,
          outputs: [], // Can be enriched with calculator output data later
        };
      }),
    };
  }, [workspaceCalculators]);

  // Keep AI chat in sync with the canvas workspace
  useEffect(() => {
    setScreenData(workspaceContext);
  }, [workspaceContext, setScreenData]);

  const addCalculator = useCallback((slug: string) => {
    setWorkspaceCalculators((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);

  const removeCalculator = useCallback((slug: string) => {
    setWorkspaceCalculators((prev) => prev.filter((s) => s !== slug));
  }, []);

  const clearWorkspace = useCallback(() => {
    setWorkspaceCalculators([]);
  }, []);

  const applyTemplate = useCallback((templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setWorkspaceCalculators(template.slugs);
    }
  }, []);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 overflow-hidden" style={{ height: "100vh", paddingTop: "66px", boxSizing: "border-box" }}>
      {/* Catalog sidebar */}
      <CalculatorCatalog
        onAddCalculator={addCalculator}
        onApplyTemplate={applyTemplate}
        addedSlugs={workspaceCalculators}
      />
      {/* Drop workspace */}
      <CalculatorWorkspace
        slugs={workspaceCalculators}
        onAddCalculator={addCalculator}
        onRemoveCalculator={removeCalculator}
        onClearWorkspace={clearWorkspace}
      />
      <AiChatWidget />
    </div>
  );
}

export default function CanvasPage() {
  return (
    <AiChatProvider>
      <CanvasPageInner />
    </AiChatProvider>
  );
}
