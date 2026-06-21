"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { CalculatorConfig } from "@/calculators/config/calculator-schema";

interface CalculatorContextType {
  // Calculator state
  inputs: Record<string, number>;
  outputs: Record<string, number | string | undefined>;
  valuesA: Record<string, number>;
  valuesB: Record<string, number>;
  compareMode: boolean;
  stage: "seed" | "series-a" | "series-b" | "series-c" | "growth";
  deltaMode: "absolute" | "percent" | "both";
  
  // Calculator metadata
  config: CalculatorConfig | null;
  slug: string;
  category: string;
  title: string;
  description: string;
  
  // Actions
  setValue: (id: string, value: number) => void;
  setValueB: (id: string, value: number) => void;
  setCompareMode: (mode: boolean) => void;
  setStage: (stage: "seed" | "series-a" | "series-b" | "series-c" | "growth") => void;
  setDeltaMode: (mode: "absolute" | "percent" | "both") => void;
  reset: () => void;
  resetBoth: () => void;
  
  // Chat-related state
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  
  // Educational content (E-E-A-T compliance)
  howToUse: string;
  formulaAndExample: string;
  benchmarks: string | null;
  faqs: Array<{ question: string; answer: string }>;
  
  // Calculated values for chat context
  primaryValue: number;
  hasBenchmarks: boolean;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

function getDefaultValues(inputs: Array<{ id: string; defaultValue: number }>): Record<string, number> {
  const defaults: Record<string, number> = {};
  inputs.forEach(input => {
    defaults[input.id] = input.defaultValue;
  });
  return defaults;
}

export function CalculatorProvider({ 
  children, 
  initialConfig, 
  initialSlug, 
  initialCategory, 
  initialTitle, 
  initialDescription,
  initialHowToUse,
  initialFormulaAndExample,
  initialBenchmarks,
  initialFaqs
}: {
  children: ReactNode;
  initialConfig: CalculatorConfig | null;
  initialSlug: string;
  initialCategory: string;
  initialTitle: string;
  initialDescription: string;
  initialHowToUse: string;
  initialFormulaAndExample: string;
  initialBenchmarks?: string | null;
  initialFaqs: Array<{ question: string; answer: string }>;
}) {
  // State management
  const [valuesA, setValuesA] = useState<Record<string, number>>(
    initialConfig ? getDefaultValues(initialConfig.inputs) : {}
  );
  const [valuesB, setValuesB] = useState<Record<string, number>>(
    initialConfig ? getDefaultValues(initialConfig.inputs) : {}
  );
  const [compareMode, setCompareMode] = useState(false);
  const [stage, setStage] = useState<"seed" | "series-a" | "series-b" | "series-c" | "growth">("series-a");
  const [deltaMode, setDeltaMode] = useState<"absolute" | "percent" | "both">("both");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const outputs: Record<string, number | string | undefined> = {};
  const primaryOutputId = initialConfig?.outputs.find(o => o.isPrimary)?.id;
  const primaryValue = primaryOutputId ? (outputs[primaryOutputId] as number | undefined) || 0 : 0;
  const hasBenchmarks = !!(initialBenchmarks && initialBenchmarks.trim());
  
  // Actions
  const setValue = useCallback((id: string, value: number) => {
    setValuesA(prev => ({ ...prev, [id]: value }));
  }, []);
  
  const setValueB = useCallback((id: string, value: number) => {
    setValuesB(prev => ({ ...prev, [id]: value }));
  }, []);
  
  const reset = useCallback(() => {
    if (initialConfig) {
      setValuesA(getDefaultValues(initialConfig.inputs));
      setValuesB(getDefaultValues(initialConfig.inputs));
      setStage("series-a");
      setCompareMode(false);
      setDeltaMode("both");
    }
  }, [initialConfig]);
  
  const resetBoth = useCallback(() => {
    reset();
  }, [reset]);
  
  const contextValue: CalculatorContextType = {
    // Calculator state
    inputs: initialConfig?.inputs.reduce((acc, input) => ({ ...acc, [input.id]: valuesA[input.id] ?? 0 }), {}) || {},
    outputs,
    valuesA,
    valuesB,
    compareMode,
    stage,
    deltaMode,
    
    // Calculator metadata
    config: initialConfig,
    slug: initialSlug,
    category: initialCategory,
    title: initialTitle,
    description: initialDescription,
    
    // Actions
    setValue,
    setValueB,
    setCompareMode,
    setStage,
    setDeltaMode,
    reset,
    resetBoth,
    
    // Chat-related state
    isChatOpen,
    setChatOpen: setIsChatOpen,
    
    // Educational content (E-E-A-T compliance)
    howToUse: initialHowToUse,
    formulaAndExample: initialFormulaAndExample,
    benchmarks: initialBenchmarks || null,
    faqs: initialFaqs,
    
    // Calculated values for chat context
    primaryValue,
    hasBenchmarks,
  };
  
  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}