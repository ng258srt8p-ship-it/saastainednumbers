"use client";

import { analytics } from "@/lib/posthog";
import { useState } from "react";

interface FeedbackWidgetProps {
  slug: string;
}

export function FeedbackWidget({ slug }: FeedbackWidgetProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="text-xs text-gray-500">Thanks for your feedback!</p>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <span>Was this helpful?</span>
      <button
        type="button"
        onClick={() => {
          analytics.feedback(slug, true);
          setSubmitted(true);
        }}
        className="rounded px-2 py-0.5 text-sm text-gray-400 hover:bg-gray-700/30"
        aria-label="Yes, helpful"
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => {
          analytics.feedback(slug, false);
          setSubmitted(true);
        }}
        className="rounded px-2 py-0.5 text-sm text-gray-400 hover:bg-gray-700/30"
        aria-label="No, not helpful"
      >
        No
      </button>
    </div>
  );
}
