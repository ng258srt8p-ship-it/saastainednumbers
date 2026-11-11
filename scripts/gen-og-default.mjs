// Regenerates public/og-default.png — the static social-share image used by all
// pages while the site is served as static assets (the dynamic /api/og route is
// not served by the Workers static-assets deploy). Keep in sync with
// app/api/og/route.tsx design. Run: node scripts/gen-og-default.mjs
import React from "react";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
const { ImageResponse } = await import(
  pathToFileURL(join(dirname(fileURLToPath(import.meta.url)), "..", "node_modules/next/dist/compiled/@vercel/og/index.node.js")).href
);

const div = React.createElement;
const el = new ImageResponse(
  div(
    "div",
    {
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a1c33 0%, #143562 50%, #005254 100%)",
        padding: 48,
      },
    },
    [
      div(
        "div",
        { style: { fontSize: 64, fontWeight: 700, color: "white", textAlign: "center" } },
        "SaaStainedNumbers"
      ),
      div(
        "div",
        { style: { fontSize: 28, color: "#b3d4d9", marginTop: 16, textAlign: "center" } },
        "Free SaaS & Business Operations Calculators"
      ),
      div(
        "div",
        { style: { fontSize: 20, color: "#70bcbe", marginTop: 32 } },
        "saastainednumbers.com"
      ),
    ]
  ),
  { width: 1200, height: 630 }
);

const buf = Buffer.from(await el.arrayBuffer());
const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "og-default.png");
writeFileSync(out, buf);
console.log("wrote", out, buf.byteLength, "bytes");
