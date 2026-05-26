import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();
  const siteUrl = "https://saastainednumbers.com";

  const items = posts.map((post) => `
    <entry>
      <id>${siteUrl}/blog/${post.slug}</id>
      <title>${escapeXml(post.title)}</title>
      <link href="${siteUrl}/blog/${post.slug}"/>
      <summary>${escapeXml(post.description)}</summary>
      <published>${new Date(post.date).toISOString()}</published>
      <updated>${new Date(post.date).toISOString()}</updated>
    </entry>`).join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>SaaStainedNumbers Blog</title>
  <subtitle>Free SaaS calculators for builders, operators, and creators.</subtitle>
  <link href="${siteUrl}/feed.xml" rel="self"/>
  <link href="${siteUrl}/blog" rel="alternate"/>
  <id>${siteUrl}/blog</id>
  <updated>${new Date(posts[0]?.date ?? Date.now()).toISOString()}</updated>
  ${items}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
