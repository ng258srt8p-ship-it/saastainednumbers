"use client";

import { useCallback } from "react";

export type Locale = "en" | "es" | "de" | "pt" | "fr" | "ja";

type NestedKeyValue = {
  [key: string]: string | NestedKeyValue;
};

const messages: Record<Locale, () => Promise<NestedKeyValue>> = {
  en: () => import("@/i18n/en/common.json").then((m) => m.default),
  es: () => import("@/i18n/es/common.json").then((m) => m.default),
  de: () => import("@/i18n/de/common.json").then((m) => m.default),
  pt: () => import("@/i18n/pt/common.json").then((m) => m.default),
  fr: () => import("@/i18n/fr/common.json").then((m) => m.default),
  ja: () => import("@/i18n/ja/common.json").then((m) => m.default),
};

export function getLocale(): Locale {
  const buildLocale = process.env.NEXT_PUBLIC_LOCALE as string | undefined;
  if (buildLocale && ["en", "es", "de", "pt", "fr", "ja"].includes(buildLocale)) {
    return buildLocale as Locale;
  }
  if (typeof document === "undefined") return "en";
  const cookie = document.cookie
    .split("; ")
    .find((r) => r.startsWith("locale="));
  if (cookie) {
    const val = cookie.split("=")[1] as Locale;
    if (["en", "es", "de", "pt", "fr", "ja"].includes(val)) return val;
  }
  return "en";
}

export function setLocaleCookie(locale: Locale) {
  document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

export function getCurrencyCookie(): string {
  if (typeof document === "undefined") return "";
  const cookie = document.cookie
    .split("; ")
    .find((r) => r.startsWith("currency="));
  return cookie ? cookie.split("=")[1] : "";
}

export function setCurrencyCookie(currency: string) {
  document.cookie = `currency=${currency};path=/;max-age=31536000;SameSite=Lax`;
}

function getNestedValue(obj: NestedKeyValue, path: string): string {
  const keys = path.split(".");
  let current: string | NestedKeyValue = obj;
  for (const key of keys) {
    if (typeof current === "string") return current;
    current = current[key];
    if (current === undefined) return path;
  }
  return typeof current === "string" ? current : path;
}

const cachedMessages: Record<string, NestedKeyValue> = {};

export async function loadMessages(locale: Locale): Promise<NestedKeyValue> {
  if (cachedMessages[locale]) return cachedMessages[locale];
  const msgs = await messages[locale]();
  cachedMessages[locale] = msgs;
  return msgs;
}

export function useT(locale: Locale) {
  const t = useCallback(
    (key: string): string => {
      const msgs = cachedMessages[locale];
      if (!msgs) return key;
      return getNestedValue(msgs, key);
    },
    [locale],
  );
  return { t, locale };
}
