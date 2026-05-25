export interface EmbedOptions {
  slug: string;
  theme?: "light" | "dark";
  height?: number;
  hideHeader?: boolean;
}

export function generateEmbedCode(options: EmbedOptions): string {
  const { slug, theme = "light", height = 600, hideHeader = false } = options;
  const params = new URLSearchParams();
  if (theme !== "light") params.set("theme", theme);
  if (height !== 600) params.set("height", String(height));
  if (hideHeader) params.set("hideHeader", "true");
  const queryString = params.toString();
  const src = `https://saastainednumbers.com/embed/${slug}${queryString ? `?${queryString}` : ""}`;
  return `<iframe
  src="${src}"
  width="100%"
  height="${height}"
  frameborder="0"
  style="border:none;max-width:600px;margin:0 auto;display:block"
  title="SaaStainedNumbers"
></iframe>`;
}

export function generateEmbedUrl(slug: string): string {
  return `https://saastainednumbers.com/embed/${slug}`;
}
