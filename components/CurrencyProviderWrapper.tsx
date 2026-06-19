"use client";

import { CurrencyProvider } from "@/components/CurrencyProvider";
import type { Locale } from "@/lib/useLocale";

export default function ClientCurrencyProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <CurrencyProvider locale={locale}>
      {children}
    </CurrencyProvider>
  );
}
