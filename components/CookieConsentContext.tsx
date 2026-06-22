"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

const CONSENT_KEY = "cookie-consent";
type ConsentState = "accepted" | "rejected" | null;

interface CookieConsentContextValue {
  consent: ConsentState;
  setConsent: (state: ConsentState) => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue>({
  consent: null,
  setConsent: () => {},
});

export function useCookieConsent(): ConsentState {
  return useContext(CookieConsentContext).consent;
}

export function useSetCookieConsent() {
  return useContext(CookieConsentContext).setConsent;
}

function getStoredConsent(): ConsentState {
  try {
    return localStorage.getItem(CONSENT_KEY) as ConsentState;
  } catch {
    return null;
  }
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<ConsentState>(getStoredConsent);

  const setConsent = useCallback((state: ConsentState) => {
    setConsentState(state);
    try {
      if (state) localStorage.setItem(CONSENT_KEY, state);
    } catch { /* noop */ }
  }, []);

  return (
    <CookieConsentContext.Provider value={{ consent, setConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
}
