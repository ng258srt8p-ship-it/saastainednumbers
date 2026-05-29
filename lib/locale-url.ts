export const LOCALES = ["en", "es", "de", "pt", "fr", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export function localeHref(path: string, locale: Locale = "en"): string {
  if (locale === "en") return path;
  return `/${locale}${path}`;
}

export function localeUrl(path: string, locale: Locale = "en"): string {
  const base = "https://saastainednumbers.com";
  const href = localeHref(path, locale);
  return `${base}${href}`;
}

export function alternateLanguages(path: string): Record<string, string> {
  return Object.fromEntries(LOCALES.map((l) => [l, localeUrl(path, l)]));
}
