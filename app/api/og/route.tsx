import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "SaaStainedNumbers";
    const category = searchParams.get("category") || "calculator";
    const description = searchParams.get("description") || "SaaS & Business Operations Calculator";

    return new ImageResponse(
      (
      <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0a1c33 0%, #143562 50%, #005254 100%)",
            padding: 48,
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 700, color: "white", textAlign: "center" }}>
            {title}
          </div>
          <div style={{ fontSize: 28, color: "#b3d4d9", marginTop: 16, textAlign: "center" }}>
            {category === "home" ? "Free SaaS & Business Operations Calculators" : `Free ${description}  -  No Account Required`}
          </div>
          <div style={{ fontSize: 20, color: "#70bcbe", marginTop: 32 }}>
            saastainednumbers.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
