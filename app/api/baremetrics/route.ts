import { NextResponse } from "next/server";
import { getAllMetrics, getSources } from "@/lib/baremetrics";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint") || "all";

  try {
    if (endpoint === "sources") {
      const sources = await getSources();
      return NextResponse.json({ sources });
    }

    const data = await getAllMetrics();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
