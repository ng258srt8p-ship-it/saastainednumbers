import type { ScreenData } from "./ai-chat-context";
import chatConfig from "./chat-key.json";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openrouter/free";

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

const _b64 = chatConfig.k;
const OPENROUTER_API_KEY = atob(_b64);

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

export async function sendChatMessage(
  messages: ChatMessage[],
  screenData: ScreenData | null
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://saastainednumbers.com",
      "X-Title": "SaaStainedNumbers",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: buildSystemPrompt(screenData) }, ...messages],
      max_tokens: 1024,
      temperature: 0.7,
    }),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  if (!response.ok) {
    if (response.status === 429) throw new Error("Daily AI chat limit reached.");
    await response.text().catch(() => {});
    throw new Error(`AI chat error (${response.status}).`);
  }
  const data: ChatResponse = await response.json();
  const c = data.choices?.[0]?.message?.content;
  if (!c) throw new Error("Sorry, I didn't get a response.");
  return c;
}
