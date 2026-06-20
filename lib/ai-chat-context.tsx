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
