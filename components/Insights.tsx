"use client";

import { useState, useRef, useEffect } from "react";
import { generateInsights } from "@/lib/insights-engine";

interface InputValue {
  id: string;
  label: string;
  value: number;
  type: string;
}

interface OutputValue {
  id: string;
  label: string;
  value: string | number;
  type: string;
  isPrimary?: boolean;
}

interface InsightsProps {
  title: string;
  description: string;
  category: string;
  inputs: InputValue[];
  outputs: OutputValue[];
}

function ThinkingAnimation() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce [animation-delay:300ms]" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Thinking</span>
          <span className="flex overflow-hidden">
            <span className="animate-[thinking-dot_1.4s_infinite] text-brand-500 font-bold">.</span>
            <span className="animate-[thinking-dot_1.4s_infinite_0.2s] text-brand-500 font-bold">.</span>
            <span className="animate-[thinking-dot_1.4s_infinite_0.4s] text-brand-500 font-bold">.</span>
          </span>
        </div>
        <span className="text-[11px] text-gray-400 dark:text-gray-500">Analyzing your inputs...</span>
      </div>
    </div>
  );
}

export function Insights({ title, description, category, inputs, outputs }: InsightsProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const dismissRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setInsights(null);
    setVisible(false);

    try {
      const insights = generateInsights({ title, description, category, inputs, outputs });

      await new Promise((r) => setTimeout(r, 300));

      setInsights(insights);
      setTimeout(() => setVisible(true), 10);
    } catch {
      setError("Unable to generate insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    dismissRef.current = setTimeout(() => {
      setInsights(null);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, []);

  return (
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700/50 pt-6">
      {!insights && !loading && !error && (
        <button
          type="button"
          onClick={handleGenerate}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-500/50 px-4 py-3 text-sm font-medium text-brand-600 dark:text-brand-400 transition-all hover:border-brand-500 hover:bg-brand-500/5 hover:text-brand-700 dark:hover:text-brand-300"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM8 4v4M8 10v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Get Insights
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center rounded-xl border border-brand-200 dark:border-brand-800/30 bg-brand-50/50 dark:bg-brand-950/20 px-4 py-8 transition-all duration-300">
          <ThinkingAnimation />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30 px-4 py-3">
          <div className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5v3a1 1 0 002 0V5a1 1 0 00-2 0zm0 5a1 1 0 102 0 1 1 0 00-2 0z" />
            </svg>
            <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="mt-2 text-xs font-medium text-red-600 dark:text-red-400 underline hover:text-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {insights && (
        <div
          className={`rounded-xl border border-brand-200 dark:border-brand-800/50 bg-brand-50/50 dark:bg-brand-950/20 px-5 py-4 transition-all duration-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Insights
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 underline"
              >
                Regenerate
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
          <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
            {insights.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return (
                  <h3 key={i} className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-3 mb-1">
                    {line.replace("## ", "")}
                  </h3>
                );
              }
              if (line.match(/^\d+\.\s/)) {
                const num = line.match(/^\d+/);
                const rest = line.replace(/^\d+/, "");
                return (
                  <p key={i} className="text-sm text-gray-700 dark:text-gray-300 ml-4 mb-2">
                    <span className="font-numbers">{num?.[0]}</span>{rest}
                  </p>
                );
              }
              if (line.trim() === "") return null;
              return (
                <p key={i} className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {line}
                </p>
              );
            })}
          </div>
          <p className="mt-4 text-[10px] text-gray-400 dark:text-gray-500 text-center border-t border-brand-200/50 dark:border-brand-800/30 pt-3">
            SaaStainedNumbers Insight Engine  —  proprietary analysis
          </p>
        </div>
      )}
    </div>
  );
}
