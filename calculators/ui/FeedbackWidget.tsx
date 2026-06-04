"use client";

import { analytics } from "@/lib/analytics";
import { useState } from "react";

interface FeedbackWidgetProps {
  slug: string;
  strings?: {
    wasThisHelpful: string;
    yes: string;
    no: string;
    thanks: string;
  };
}

export function FeedbackWidget({ slug, strings }: FeedbackWidgetProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="text-xs text-gray-600 dark:text-gray-500" aria-live="polite">{strings?.thanks ?? "Thanks for your feedback!"}</p>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <span>{strings?.wasThisHelpful ?? "Was this helpful?"}</span>
      <button
        type="button"
        onClick={() => {
          analytics.feedback(slug, true);
          setSubmitted(true);
        }}
        className="rounded px-2 py-0.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/30"
        aria-label={strings?.yes ?? "Yes, helpful"}
      >
        {strings?.yes ?? "Yes"}
      </button>
      <button
        type="button"
        onClick={() => {
          analytics.feedback(slug, false);
          setSubmitted(true);
        }}
        className="rounded px-2 py-0.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/30"
        aria-label={strings?.no ?? "No, not helpful"}
      >
        {strings?.no ?? "No"}
      </button>
    </div>
  );
}
