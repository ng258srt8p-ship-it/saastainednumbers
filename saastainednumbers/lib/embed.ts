export function generateEmbedSnippet(slug: string): string {
  return `<iframe
  src="https://saastainednumbers.com/embed/${slug}"
  width="100%"
  height="480"
  frameborder="0"
  style="border:none;max-width:600px;margin:0 auto;display:block"
  title="SaaStainedNumbers - ${slug}"
></iframe>`;
}

export function generateEmbedUrl(slug: string): string {
  return `https://saastainednumbers.com/embed/${slug}`;
}
