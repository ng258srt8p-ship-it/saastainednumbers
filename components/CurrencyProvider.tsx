"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";
import { SUPPORTED_CURRENCIES, getDefaultCurrency } from "@/lib/currencies";

type CurrencyContextType = {
  currency: string;
  setCurrency: (code: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

function getCurrencySnapshot(locale: string): string {
  if (typeof document === "undefined") return getDefaultCurrency(locale);
  const cookie = document.cookie
    .split("; ")
    .find((r) => r.startsWith("currency="));
  if (cookie) {
    const val = cookie.split("=")[1];
    if (SUPPORTED_CURRENCIES.some((c) => c.code === val)) return val;
  }
  return getDefaultCurrency(locale);
}

function subscribeToCurrency(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener("currency-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("currency-changed", callback);
  };
}

export function CurrencyProvider({ locale, children }: { locale: string; children: React.ReactNode }) {
  const currency = useSyncExternalStore(
    subscribeToCurrency,
    () => getCurrencySnapshot(locale),
    () => getDefaultCurrency(locale),
  );

  const setCurrency = useCallback((code: string) => {
    document.cookie = `currency=${code};path=/;max-age=31536000;SameSite=Lax`;
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("currency-changed"));
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}
