"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useCalculatorState(inputIds: string[], defaults?: Record<string, number>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Guard against null searchParams (Next.js 16+)
  const sp = useMemo(() => searchParams ?? new URLSearchParams(), [searchParams]);
  const resolvedPathname = useMemo(() => pathname ?? "/", [pathname]);

  const values = useMemo(() => {
    const result: Record<string, number> = {};
    for (const id of inputIds) {
      const raw = sp.get(id);
      const parsed = raw !== null ? Number.parseFloat(raw) : NaN;
      result[id] = Number.isFinite(parsed) ? parsed : (defaults?.[id] ?? 0);
    }
    return result;
  }, [sp, inputIds, defaults]);

  const setValue = useCallback(
    (id: string, value: number) => {
      const params = new URLSearchParams(sp.toString());
      if (Number.isFinite(value)) {
        params.set(id, value.toString());
      } else {
        params.delete(id);
      }
      router.replace(`${resolvedPathname}?${params.toString()}`, { scroll: false });
    },
    [sp, router, resolvedPathname],
  );

  const reset = useCallback(() => {
    router.replace(resolvedPathname, { scroll: false });
  }, [router, resolvedPathname]);

  return { values, setValue, reset };
}
