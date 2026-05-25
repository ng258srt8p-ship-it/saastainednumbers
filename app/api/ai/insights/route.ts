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

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    if (!body.title || !body.inputs || !body.outputs) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const insights = generateInsights(body);
    return NextResponse.json({ insights, provider: "engine" });
  } catch (err) {
    console.error("[AI Insights] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
