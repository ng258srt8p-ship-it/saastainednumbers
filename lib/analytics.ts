"use client";

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

export const analytics = {
  calculate: (slug: string, inputs: Record<string, number>) => {
    gtag("event", "calculate_tool", { slug, ...inputs });
  },
  compare: (slug: string, inputsA: Record<string, number>, inputsB: Record<string, number>) => {
    gtag("event", "compare_scenario", { slug, inputs_a: JSON.stringify(inputsA), inputs_b: JSON.stringify(inputsB) });
  },
  feedback: (slug: string, helpful: boolean) => {
    gtag("event", "feedback", { slug, helpful });
  },
  share: (slug: string) => {
    gtag("event", "share_tool", { slug });
  },
  embed: (slug: string, theme: string, height: number) => {
    gtag("event", "embed_generate", { slug, theme, height });
  },
  search: (query: string, resultsCount: number) => {
    gtag("event", "search", { search_term: query, results_count: resultsCount });
  },
  affiliate_click: (slug: string, url: string) => {
    gtag("event", "affiliate_click", { slug, url });
  },
};
