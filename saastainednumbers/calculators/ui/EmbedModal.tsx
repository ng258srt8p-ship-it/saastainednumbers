"use client";

import { useState, useCallback } from "react";

interface EmbedModalProps {
  slug: string;
  title: string;
  open: boolean;
  onClose: () => void;
}

export function EmbedModal({ slug, title, open, onClose }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);

  const snippet = `<iframe
  src="https://saastainednumbers.com/embed/${slug}"
  width="100%"
  height="480"
  frameborder="0"
  style="border:none;max-width:600px;margin:0 auto;display:block"
  title="SaaStainedNumbers - ${title}"
></iframe>`;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [snippet]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Embed Calculator</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Copy the iframe snippet below to embed the {title} on your website.
        </p>

        <div className="relative">
          <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-xs text-gray-700 border border-gray-200">
            {snippet}
          </pre>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          The embedded calculator includes attribution to SaaStainedNumbers. No account required.
        </p>
      </div>
    </div>
  );
}
