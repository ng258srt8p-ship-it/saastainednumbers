export function generateEmbedSnippet(slug: string): string {
  return `<iframe
  src="https://saasifactory.io/embed/${slug}"
  width="100%"
  height="480"
  frameborder="0"
  style="border:none;max-width:600px;margin:0 auto;display:block"
  title="Saasifactory - ${slug}"
></iframe>`;
}

export function generateEmbedUrl(slug: string): string {
  return `https://saasifactory.io/embed/${slug}`;
}
