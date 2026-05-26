"use client";

import { useState, type FormEvent } from "react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Subscription failed");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <div className="mt-6 rounded-xl border border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-950/30 px-4 py-3 text-center">
        <p className="text-sm font-medium text-green-700 dark:text-green-400">
          You&rsquo;re subscribed! Check your inbox for confirmation.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-900/50 px-4 py-4">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
        Get weekly SaaS metrics tips
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          disabled={status === "loading"}
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errorMsg}</p>
      )}
      <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
