"use client";

import { useState, useEffect, useCallback } from "react";
import { CalculatorCatalog } from "@/components/canvas/CalculatorCatalog";
import { CalculatorWorkspace } from "@/components/canvas/CalculatorWorkspace";
import { getTemplateById } from "@/lib/canvas-templates";
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

export default function CanvasPage() {
  // Initialize from localStorage synchronously via lazy initializer
  const [workspaceCalculators, setWorkspaceCalculators] = useState<string[]>(() => loadSlugs());

  // Persist to localStorage whenever workspace changes
  useEffect(() => {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspaceCalculators));
  }, [workspaceCalculators]);

  const addCalculator = useCallback((slug: string) => {
    setWorkspaceCalculators(prev => prev.includes(slug) ? prev : [...prev, slug]);
  }, []);

  const removeCalculator = useCallback((slug: string) => {
    setWorkspaceCalculators(prev => prev.filter(s => s !== slug));
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
    <div className="flex h-[calc(100vh-64px)]" style={{ height: "calc(100vh - 64px)" }}>
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
    </div>
  );
}
