"use client";

import { usePathname } from "next/navigation";

export function ShowWhenNotEmbed({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/embed")) return null;
  return <>{children}</>;
}
