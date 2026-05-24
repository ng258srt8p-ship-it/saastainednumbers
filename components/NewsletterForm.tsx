"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <p className="text-xs text-green-600 font-medium mt-3">Thanks for subscribing!</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        if (email) {
          fetch("/api/analytics/capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "newsletter_signup", properties: { email } }),
          });
          setSubmitted(true);
        }
      }}
    >
      <div className="mt-3 flex gap-2">
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white hover:bg-brand-700 transition-colors"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}
