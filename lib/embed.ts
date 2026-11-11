export interface EmbedOptions {
  slug: string;
  theme?: "light" | "dark";
  height?: number;
  hideHeader?: boolean;
  /** Calculator title, used as keyword-rich anchor text in the attribution line. */
  title?: string;
  /** Category slug, used to link back to the canonical calculator page. */
  category?: string;
}

export function generateEmbedCode(options: EmbedOptions): string {
  const { slug, theme = "light", height = 600, hideHeader = false, title, category } = options;
  const params = new URLSearchParams();
  if (theme !== "light") params.set("theme", theme);
  if (height !== 600) params.set("height", String(height));
  if (hideHeader) params.set("hideHeader", "true");
  const queryString = params.toString();
  const src = `https://saastainednumbers.com/embed/${slug}${queryString ? `?${queryString}` : ""}`;
  const canonical = category
    ? `https://saastainednumbers.com/${category}/${slug}/`
    : "https://saastainednumbers.com/";
  const anchor = title || "SaaStainedNumbers free calculator";
  return `<iframe
  src="${src}"
  width="100%"
  height="${height}"
  frameborder="0"
  style="border:none;max-width:600px;margin:0 auto;display:block"
  title="SaaStainedNumbers"
></iframe>
<p style="text-align:center;font-size:12px;margin:6px 0 0"><a href="${canonical}" target="_blank" rel="noopener">${anchor}</a> - free tool by <a href="https://saastainednumbers.com/" target="_blank" rel="noopener">SaaStainedNumbers</a></p>`;
}

export function generateEmbedUrl(slug: string): string {
  return `https://saastainednumbers.com/embed/${slug}`;
}
