"use client";

import { useState, useCallback } from "react";
import { generateEmbedCode } from "@/lib/embed";
import { analytics } from "@/lib/analytics";

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
    analytics.embed(slug, theme, height);
    setTimeout(() => setCopied(false), 2000);
  }, [code, slug, theme, height]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-4xl flex-col rounded-xl bg-white dark:bg-gray-800 shadow-xl sm:flex-row">
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Embed &ldquo;{title}&rdquo;
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xl leading-none"
            >
              &times;
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Customize and copy the embed code below.
          </p>

          <div className="space-y-3 mb-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                    theme === "light"
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  Dark
                </button>
              </div>
            </label>

            <label className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">Height</span>
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
                <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">{height}px</span>
              </div>
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Hide header</span>
              <input
                type="checkbox"
                checked={hideHeader}
                onChange={(e) => setHideHeader(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500"
              />
            </label>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setTab("code")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                tab === "code"
                  ? "bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/30"
              }`}
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                tab === "preview"
                  ? "bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/30"
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
                className="w-full rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-xs font-mono text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 resize-none"
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
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900" style={{ height: Math.min(height, 400) }}>
              <iframe
                key={`${slug}-${previewParams.toString()}`}
                src={`/embed/${slug}?${previewParams.toString()}`}
                width="100%"
                height={Math.min(height, 400)}
                style={{ border: "none" }}
                title="Embed preview"
              />
            </div>
          )}

          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            The embedded calculator includes attribution to SaaStainedNumbers. No account required.
          </p>
        </div>
      </div>
    </div>
  );
}
