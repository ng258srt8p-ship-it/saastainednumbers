"use client";

import { useState } from "react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("You are subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Try again later.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Try again later.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/40 p-6 text-center">
        <p className="text-brand-700 dark:text-brand-300 font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Get SaaS Insights</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        New calculators, benchmarks, and strategies. No spam.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={status === "loading"}
          className="flex-1 min-w-0 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 transition-colors shrink-0"
        >
          {status === "loading" ? "Sending..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{message}</p>
      )}
    </div>
  );
}
