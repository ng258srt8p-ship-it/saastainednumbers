"use client";

import { useState, useCallback } from "react";
import { generateEmbedCode } from "@/lib/embed";

interface EmbedModalProps {
  slug: string;
  title: string;
  open: boolean;
  onClose: () => void;
}

export function EmbedModal({ slug, title, open, onClose }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [height, setHeight] = useState(600);
  const [hideHeader, setHideHeader] = useState(false);
  const [tab, setTab] = useState<"code" | "preview">("code");

  const code = generateEmbedCode({ slug, theme, height, hideHeader });
  const previewParams = new URLSearchParams();
  if (theme !== "light") previewParams.set("theme", theme);
  if (height !== 600) previewParams.set("height", String(height));
  if (hideHeader) previewParams.set("hideHeader", "true");

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-4xl flex-col rounded-xl bg-white shadow-xl sm:flex-row">
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Embed &ldquo;{title}&rdquo;
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl leading-none"
            >
              &times;
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Customize and copy the embed code below.
          </p>

          <div className="space-y-3 mb-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Theme</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark")}
                className="rounded-lg border border-gray-200 px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>

            <label className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-700">Height</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={400}
                  max={1000}
                  step={50}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-28 accent-brand-600"
                />
                <span className="text-xs text-gray-500 w-10 text-right">{height}px</span>
              </div>
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Hide header</span>
              <input
                type="checkbox"
                checked={hideHeader}
                onChange={(e) => setHideHeader(e.target.checked)}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
            </label>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setTab("code")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                tab === "code"
                  ? "bg-brand-100 text-brand-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                tab === "preview"
                  ? "bg-brand-100 text-brand-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              Preview
            </button>
          </div>

          {tab === "code" && (
            <div className="relative">
              <textarea
                readOnly
                value={code}
                rows={5}
                className="w-full rounded-lg bg-gray-50 p-3 text-xs font-mono text-gray-700 border border-gray-200 resize-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
            </div>
          )}

          {tab === "preview" && (
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-white" style={{ height: Math.min(height, 400) }}>
              <iframe
                src={`/embed/${slug}?${previewParams.toString()}`}
                width="100%"
                height={Math.min(height, 400)}
                style={{ border: "none" }}
                title="Embed preview"
              />
            </div>
          )}

          <p className="mt-4 text-xs text-gray-400">
            The embedded calculator includes attribution to SaaStainedNumbers. No account required.
          </p>
        </div>
      </div>
    </div>
  );
}
