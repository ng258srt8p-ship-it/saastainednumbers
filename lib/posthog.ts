"use client";

import { useEffect } from "react";

type PostHogEvent = "pageview" | "calculate" | "feedback" | "signup" | "upgrade";

function capture(event: PostHogEvent, properties?: Record<string, unknown>) {
  try {
    fetch("/api/analytics/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, properties, timestamp: new Date().toISOString() }),
      keepalive: true,
    });
  } catch {
    /* analytics silently fail */
  }
}

export function usePageview() {
  useEffect(() => {
    capture("pageview", { url: window.location.href, referrer: document.referrer });
  }, []);
}

export const analytics = {
  calculate: (slug: string, inputs: Record<string, number>) =>
    capture("calculate", { slug, inputs }),
  feedback: (slug: string, helpful: boolean) =>
    capture("feedback", { slug, helpful }),
  signup: (method: string) => capture("signup", { method }),
  upgrade: () => capture("upgrade"),
};
