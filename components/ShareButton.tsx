"use client";

import { useState, useCallback } from "react";
import { analytics } from "@/lib/analytics";

interface ShareButtonProps {
  inputs: Record<string, number>;
  category: string;
  slug: string;
}

export function ShareButton({ inputs, category, slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(inputs)) {
      params.set(key, String(value));
    }
    const url = `${window.location.origin}/${category}/${slug}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      analytics.share(slug);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      analytics.share(slug);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [inputs, category, slug]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
      aria-label={copied ? "Copied!" : "Share"}
    >
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
