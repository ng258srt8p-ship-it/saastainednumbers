"use client";

import { benchmarkReferences } from "@/lib/benchmarks";

type Rating = "excellent" | "good" | "average" | "poor";

const ratingColors: Record<Rating, string> = {
  excellent: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  good: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  average: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  poor: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

function getRating(
  metricKey: string,
  value: number,
  isLowerBetter: boolean,
): Rating | null {
  const ref = benchmarkReferences[metricKey];
  if (!ref) return null;

  if (isLowerBetter) {
    if (value <= parseFloat(ref.excellent.replace(/[<>\s,]/g, ""))) return "excellent";
    if (ref.good.includes("<")) {
      if (value < parseFloat(ref.good.replace(/[<>\s]/g, ""))) return "excellent";
    }
    if (ref.poor.includes(">")) {
      if (value > parseFloat(ref.poor.replace(/[<>\s]/g, ""))) return "poor";
      if (value > parseFloat(ref.average.replace(/[<>\s]/g, ""))) return "average";
      return "good";
    }
    return "good";
  }

  const poorNum = parseFloat(ref.poor.replace(/[<>\s,].*/, "").trim());
  if (ref.poor.includes("<")) {
    if (value < poorNum) return "poor";
  }

  if (ref.average.includes("-")) {
    const [low, high] = ref.average.split("-").map((s) => parseFloat(s.trim()));
    if (value >= low && value <= high) return "average";
  }

  if (ref.good.includes("-")) {
    const [low, high] = ref.good.split("-").map((s) => parseFloat(s.trim()));
    if (value >= low && value <= high) return "good";
  }

  const excellentNum = parseFloat(ref.excellent.replace(/[<>\s,]/g, ""));
  if (ref.excellent.includes(">") && value > excellentNum) return "excellent";

  if (ref.excellent.includes("<") && value < excellentNum) return "excellent";

  return "average";
}

interface HealthBadgeProps {
  value: number;
  metric: string;
  label?: string;
  ariaLabel?: string;
}

export function HealthBadge({ value, metric, label, ariaLabel }: HealthBadgeProps) {
  const ref = benchmarkReferences[metric];

  if (!ref) return null;

  const lowerBetter = ["churn-rate", "burn-multiple", "cac-payback"].includes(metric);
  const rating = getRating(metric, value, lowerBetter);

  if (!rating) return null;

  // Construct an aria-label for screen readers
  const constructedAriaLabel = ariaLabel || 
    (label ? `${label}: ${value}` : `Metric: ${metric}, Value: ${value}, Rating: ${rating}`);
  
  return (
    <span
      className={`group relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${ratingColors[rating]}`}
      title={label ? `${label}: ${value}` : String(value)}
      aria-label={constructedAriaLabel}
      role="status"
    >
      <span className="capitalize">{rating}</span>
      <span className="absolute bottom-full left-1/2 z-10 mb-2 hidden w-56 -translate-x-1/2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 shadow-lg group-hover:block whitespace-pre-line text-left">
        <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">Benchmarks</div>
        {Object.entries(ref).map(([key, val]) => {
          if (key === "source" || key === "date" || key === "notes") return null;
          return (
            <div key={key} className="flex justify-between gap-2">
              <span className="capitalize text-gray-500 dark:text-gray-400">{key}:</span>
              <span className="font-medium">{val}</span>
            </div>
          );
        })}
        <div className="mt-1 border-t border-gray-100 dark:border-gray-700 pt-1 text-gray-400 dark:text-gray-500">
          {ref.source} ({ref.date})
        </div>
        {ref.notes && (
          <div className="mt-1 text-gray-500 dark:text-gray-400 italic">{ref.notes}</div>
        )}
      </span>
    </span>
  );
}
