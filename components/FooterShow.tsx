"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Renders children (the footer) on all pages except /embed and ?embed. */
export function FooterShow({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [embed, setEmbed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        setEmbed(new URLSearchParams(window.location.search).has("embed"));
      }, 0);
    }
  }, []);

  if (pathname?.startsWith("/embed")) return null;
  if (embed) return null;
  return <>{children}</>;
}
