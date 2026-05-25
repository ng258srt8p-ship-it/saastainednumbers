import { NextResponse } from "next/server";
import { generateInsights } from "@/lib/insights-engine";

interface InputValue {
  id: string;
  label: string;
  value: number;
  type: string;
}

interface OutputValue {
  id: string;
  label: string;
  value: string | number;
  type: string;
  isPrimary?: boolean;
}

interface RequestBody {
  title: string;
  description: string;
  category: string;
  inputs: InputValue[];
  outputs: OutputValue[];
}

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma4:e2b";

function buildPrompt(body: RequestBody): string {
  const inputLines = body.inputs.map((i) => `- ${i.label}: ${i.value}`).join("\n");
  const outputLines = body.outputs
    .filter((o) => o.type !== "text")
    .map((o) => `- ${o.label}: ${o.value}${o.isPrimary ? " (primary)" : ""}`)
    .join("\n");

  return `You are an expert SaaS analyst and business advisor. Given the following calculator results, provide 3-5 specific, actionable insights.

Calculator: ${body.title}
Category: ${body.category}
Description: ${body.description}

Input Values:
${inputLines}

Calculated Results:
${outputLines}

Instructions:
- Be specific and reference the actual numbers
- Reference relevant industry benchmarks where applicable
- Suggest concrete next steps or decisions
- Keep each insight to 2-3 sentences
- Format as markdown with "## Insights" header and numbered insights

Response:`;
}

async function checkOllama(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function callOllama(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: { temperature: 0.7, num_predict: 600 },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.message?.content || "No insights available.";
}

async function callOpenAI(apiKey: string, messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 600,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "No insights available.";
}

async function callHuggingFace(prompt: string): Promise<string | null> {
  try {
    const model = "HuggingFaceH4/zephyr-7b-beta";
    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 600, temperature: 0.7 },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = Array.isArray(data) ? data[0]?.generated_text || "" : data.generated_text || "";
    const response = text.replace(prompt, "").trim();
    return response || null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    if (!body.title || !body.inputs || !body.outputs) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Always-works rule-based engine (zero config, instant)
    const insights = generateInsights(body);
    return NextResponse.json({ insights, provider: "engine" });

    // 2. Try Ollama (local dev, premium quality)
    // const ollamaAvailable = await checkOllama();
    // if (ollamaAvailable) {
    //   try {
    //     const messages = [
    //       { role: "system" as const, content: "You are an expert SaaS analyst. Provide concise, data-driven insights." },
    //       { role: "user" as const, content: buildPrompt(body) },
    //     ];
    //     const aiInsights = await callOllama(messages);
    //     return NextResponse.json({ insights: aiInsights, provider: "ollama" });
    //   } catch (err) {
    //     console.error("[AI Insights] Ollama failed:", err);
    //   }
    // }

    // // 3. Try Hugging Face free inference (production, no key needed)
    // const hfInsights = await callHuggingFace(buildPrompt(body));
    // if (hfInsights) {
    //   return NextResponse.json({ insights: hfInsights, provider: "huggingface" });
    // }

    // // 4. Try OpenAI (if key configured)
    // const openAIKey = process.env.OPENAI_API_KEY;
    // if (openAIKey) {
    //   try {
    //     const messages = [
    //       { role: "system" as const, content: "You are an expert SaaS analyst. Provide concise, data-driven insights." },
    //       { role: "user" as const, content: buildPrompt(body) },
    //     ];
    //     const aiInsights = await callOpenAI(openAIKey, messages);
    //     return NextResponse.json({ insights: aiInsights, provider: "openai" });
    //   } catch (err) {
    //     console.error("[AI Insights] OpenAI failed:", err);
    //   }
    // }

    // // 5. Fall back to rule-based engine
    // const insights = generateInsights(body);
    // return NextResponse.json({ insights, provider: "engine" });
  } catch (err) {
    console.error("[AI Insights] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
