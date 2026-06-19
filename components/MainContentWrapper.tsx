"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [embed, setEmbed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        setEmbed(new URLSearchParams(window.location.search).has("embed"));
      }, 0);
    }
  }, []);

  // No padding on embed pages and routes
  const isEmbed = pathname?.startsWith("/embed") || embed;

  return (
    <div className={isEmbed ? "" : "pt-16"}>
      {children}
    </div>
  );
}
