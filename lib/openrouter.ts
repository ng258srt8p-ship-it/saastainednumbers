import type { ScreenData } from "./ai-chat-context";

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

/**
 * Build a system prompt that includes the current screen context.
 * This lets the AI "see" what the user is looking at.
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

Use this context to help them interpret their results. If they ask about a specific value, point to the relevant input or output.`;
  }

  if (screenData.type === "canvas") {
    const calcsSummary = screenData.calculators
      .map(
        (c) =>
          `  - ${c.title} (${c.slug}):\n` +
          c.outputs.map((o) => `    - ${o.label}: ${o.value}`).join("\n")
      )
      .join("\n");

    return `${base}

The user is on the Canvas page, comparing multiple calculators side-by-side. The workspace contains:

${calcsSummary}

Help them compare and interpret these metrics together.`;
  }

  return base;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  screenData: ScreenData | null
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("AI chat is not configured. Please set NEXT_PUBLIC_OPENROUTER_API_KEY.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://saastainednumbers.com",
      "X-Title": "SaaStainedNumbers",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt(screenData) },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Daily AI chat limit reached. Please try again tomorrow.");
    }
    const errorBody = await response.text().catch(() => "unknown error");
    throw new Error(`AI chat error (${response.status}). Please try again.`);
  }

  const data: ChatResponse = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Sorry, I didn't get a response. Please try again.");
  }
  return content;
}
