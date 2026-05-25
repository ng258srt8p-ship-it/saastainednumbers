"use client";

interface CompareToggleProps {
  compareMode: boolean;
  onToggle: () => void;
}

export function CompareToggle({ compareMode, onToggle }: CompareToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 p-0.5 text-xs">
      <button
        type="button"
        onClick={compareMode ? onToggle : undefined}
        className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
          !compareMode
            ? "bg-brand-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        }`}
      >
        Single
      </button>
      <button
        type="button"
        onClick={!compareMode ? onToggle : undefined}
        className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
          compareMode
            ? "bg-brand-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        }`}
      >
        Compare Scenarios
      </button>
    </div>
  );
}
