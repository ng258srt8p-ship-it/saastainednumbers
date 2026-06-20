import type { ScreenData } from "./ai-chat-context";
import chatConfig from "./chat-key.json";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Ordered fallback chain: try each model in sequence until one responds
const MODEL_CHAIN: string[] = [
  "meta-llama/llama-3.2-3b-instruct:free",
  "liquid/lfm-2.5-1.2b-instruct:free",
  "google/gemini-2.0-flash-exp:free",
  "openrouter/free",
];

// Load API key from chat-key.json (base64-encoded)
const _b64 = chatConfig.k;
const OPENROUTER_API_KEY = atob(_b64);

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatResponse {
  id: string;
  choices: Array<{
    message: { role: string; content: string };
    finish_reason: string;
  }>;
}

/**
 * Build a system prompt that includes the current screen context.
 */
function buildSystemPrompt(screenData: ScreenData | null): string {
  const base = `You are a helpful AI assistant for SaaStainedNumbers.com, a free SaaS calculator website. You help users understand SaaS metrics (MRR, ARR, CAC, LTV, churn, NRR, gross margin, etc.), interpret calculator results, and learn about business financial concepts.

Guidelines:
- Keep answers concise and practical (2-4 paragraphs max).
- When appropriate, explain what a metric means, what a healthy range looks like, and how to improve it.
- If the user asks something off-topic, politely redirect to SaaS/business topics.
- Respond in the user's language.`;

  if (!screenData) return base;

  if (screenData.type === "calculator") {
    const inputsSummary = screenData.inputs
      .map((i) => `  - ${i.label}: ${i.value}${i.type === "currency" ? " (currency)" : i.type === "percentage" ? "%" : ""}`)
      .join("\n");
    const outputsSummary = screenData.outputs
      .map((o) => `  - ${o.label}: ${o.value}${o.type === "currency" ? " (currency)" : o.type === "percentage" ? "%" : ""}`)
      .join("\n");
    const benchmarksSummary = screenData.benchmarks?.length
      ? "\nIndustry benchmarks:\n" + screenData.benchmarks.map((b) => `  - ${b.metric}: ${b.value}`).join("\n")
      : "";

    return `${base}

The user is currently viewing the "${screenData.title}" calculator.

Description: ${screenData.description}

Current inputs:
${inputsSummary}

Current results:
${outputsSummary}${benchmarksSummary}

Use this context to help them interpret their results.`;
  }

  if (screenData.type === "canvas") {
    const calcsSummary = screenData.calculators
      .map((c) => `  - ${c.title} (${c.slug}):\n` + c.outputs.map((o) => `    - ${o.label}: ${o.value}`).join("\n"))
      .join("\n");
    return `${base}

The user is on the Canvas page. Workspace:

${calcsSummary}

Help them compare these metrics.`;
  }

  return base;
}

/**
 * Attempt to send a chat completion request with a given model.
 * Returns the response content on success, or null on failure.
 */
async function tryModel(
  model: string,
  messages: ChatMessage[],
  screenData: ScreenData | null,
  signal: AbortSignal
): Promise<string | null> {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://saastainednumbers.com",
        "X-Title": "SaaStainedNumbers",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: buildSystemPrompt(screenData) }, ...messages],
        max_tokens: 1024,
        temperature: 0.7,
      }),
      signal,
    });

    if (!response.ok) {
      // 429 is rate-limited; don't retry on 4xx
      if (response.status === 429) return null;
      if (response.status >= 400 && response.status < 500) return null;
      // 5xx — transient server error, could retry
      return null;
    }

    const data: ChatResponse = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return content || null;
  } catch {
    // Network error, timeout, etc.
    return null;
  }
}

export async function sendChatMessage(
  messages: ChatMessage[],
  screenData: ScreenData | null
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
      // Try models in order until one responds
      let content: string | null = null;
      for (const model of MODEL_CHAIN) {
        content = await tryModel(model, messages, screenData, controller.signal);
        if (content) break;
      }

    if (!content) {
      throw new Error("Sorry, I couldn't get a response from the AI. Please try again.");
    }

    return content;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
