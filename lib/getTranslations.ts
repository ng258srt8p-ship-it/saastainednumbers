import { cookies } from "next/headers";
import type { Locale } from "./useLocale";

type Messages = Record<string, string | Record<string, unknown>>;

const cache = new Map<string, Messages>();

async function loadMessages(locale: string): Promise<Messages> {
  if (cache.has(locale)) return cache.get(locale)!;
  try {
    const msgs = (await import(`@/i18n/${locale}/common.json`)).default as Messages;
    cache.set(locale, msgs);
    return msgs;
  } catch {
    const en = (await import(`@/i18n/en/common.json`)).default as Messages;
    return en;
  }
}

function getNestedValue(obj: Messages, path: string): string {
  const keys = path.split(".");
  let current: string | Record<string, unknown> | Messages = obj;
  for (const key of keys) {
    if (typeof current === "string") return path;
    current = (current as Record<string, unknown>)[key] as string | Messages;
    if (current === undefined) return path;
  }
  return typeof current === "string" ? current : path;
}

export async function getTranslations() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value ?? "en") as Locale;
  const messages = await loadMessages(locale);

  return {
    locale,
    t: (key: string): string => getNestedValue(messages, key),
  };
}
