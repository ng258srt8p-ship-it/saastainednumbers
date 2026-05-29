export const LOCALES = ["en", "es", "de", "pt", "fr", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

function stripLocalePrefix(path: string): string {
  for (const l of LOCALES) {
    if (path === `/${l}` || path.startsWith(`/${l}/`)) {
      return path.slice(l.length + 1) || "/";
    }
  }
  return path;
}

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

export function switchLocalePath(currentPath: string, targetLocale: Locale): string {
  const bare = stripLocalePrefix(currentPath);
  return localeHref(bare, targetLocale);
}

export function detectLocaleFromPath(path: string): Locale {
  const first = path.split("/").filter(Boolean)[0];
  if (first && LOCALES.includes(first as Locale)) return first as Locale;
  return "en";
}
