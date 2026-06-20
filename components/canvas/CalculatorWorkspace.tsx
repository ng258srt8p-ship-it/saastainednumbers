"use client";

import { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalculatorWidget } from "./CalculatorWidget";
import { CanvasTotalWidget } from "./CanvasTotalWidget";

interface CalculatorWorkspaceProps {
  slugs: string[];
  onAddCalculator: (slug: string) => void;
  onRemoveCalculator: (slug: string) => void;
  onClearWorkspace: () => void;
}

export function CalculatorWorkspace({
  slugs,
  onAddCalculator,
  onRemoveCalculator,
  onClearWorkspace,
}: CalculatorWorkspaceProps) {
  const [allOutputs, setAllOutputs] = useState<Record<string, Record<string, number | string>>>({});

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const slug = e.dataTransfer.getData("text/plain");
    if (slug) {
      onAddCalculator(slug);
    }
  }, [onAddCalculator]);

  const handleOutputsChange = useCallback((slug: string, outputs: Record<string, number | string>) => {
    setAllOutputs(prev => {
      const numericOutputs: Record<string, number | string> = {};
      for (const [key, val] of Object.entries(outputs)) {
        const num = Number(val);
        numericOutputs[key] = Number.isFinite(num) ? num : val;
      }
      return { ...prev, [slug]: numericOutputs };
    });
  }, []);

  // Initialize allOutputs when calculators are added
  useEffect(() => {
    if (slugs.length === 0) {
      // Clear all outputs when workspace is empty
      setAllOutputs({});
      return;
    }

    // Use a flag to prevent multiple initializations
    let isCancelled = false;

    // Function to compute initial outputs for each calculator
    const initializeOutputs = async () => {
      const initialOutputs: Record<string, Record<string, number | string>> = {};

      for (const slug of slugs) {
        if (isCancelled) return;

        try {
          // Get calculator config
          const { getCalculator } = await import('@/lib/registry');
          const calc = getCalculator(slug);
          if (!calc) continue;

          // Get default values from calculator config
          const defaultValues: Record<string, number> = {};
          for (const input of calc.inputs) {
            defaultValues[input.id] = input.defaultValue ?? 0;
          }

          // Get the engine for this calculator
          const { engines } = await import('@/lib/engine-registry');
          const engine = engines[slug as keyof typeof engines];

          if (engine) {
            // Compute outputs using engine
            const outputs = engine(defaultValues);
            if (outputs && Object.keys(outputs).length > 0) {
              const numericOutputs: Record<string, number | string> = {};
              for (const [key, val] of Object.entries(outputs)) {
                const num = Number(val);
                numericOutputs[key] = Number.isFinite(num) ? num : val;
              }
              initialOutputs[slug] = numericOutputs;
            }
          }
        } catch (error) {
          console.error(`Failed to initialize outputs for calculator ${slug}:`, error);
        }
      }

      if (!isCancelled && Object.keys(initialOutputs).length > 0) {
        setAllOutputs(initialOutputs);
      }
    };

    initializeOutputs();

    return () => {
      isCancelled = true;
    };
  }, [slugs]);

  return (
    <main
      className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 p-6"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Master/Aggregate Widget — always visible */}
      <div className="mb-4">
        <CanvasTotalWidget allOutputs={allOutputs} calculatorCount={slugs.length} />
      </div>

      {slugs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center mt-12">
          <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-gray-100">
            Your Workspace is Empty
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
            Drag calculators from the catalog on the left, click a calculator to add it, or choose a template above to get started quickly.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-numbers font-semibold text-gray-900 dark:text-gray-100">{slugs.length}</span> calculator{slugs.length !== 1 ? "s" : ""} active
            </div>
            <button
              onClick={onClearWorkspace}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min">
            <AnimatePresence>
              {slugs.map((slug, index) => (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  layout
                >
                  <CalculatorWidget
                    slug={slug}
                    onRemove={() => onRemoveCalculator(slug)}
                    onOutputsChange={handleOutputsChange}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </main>
  );
}
