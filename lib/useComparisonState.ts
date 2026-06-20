"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useComparisonState(inputIds: string[], defaults?: Record<string, number>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Guard against null values (Next.js 16+ stricter types)
  const sp = useMemo(() => searchParams ?? new URLSearchParams(), [searchParams]);
  const resolvedPathname = useMemo(() => pathname ?? "/", [pathname]);

  const valuesA = useMemo(() => {
    const result: Record<string, number> = {};
    for (const id of inputIds) {
      const raw = sp.get(id);
      const parsed = raw !== null ? Number.parseFloat(raw) : NaN;
      result[id] = Number.isFinite(parsed) ? parsed : (defaults?.[id] ?? 0);
    }
    return result;
  }, [sp, inputIds, defaults]);

  const valuesB = useMemo(() => {
    const result: Record<string, number> = {};
    for (const id of inputIds) {
      const raw = sp.get(`${id}_b`);
      const parsed = raw !== null ? Number.parseFloat(raw) : NaN;
      result[id] = Number.isFinite(parsed) ? parsed : (defaults?.[id] ?? 0);
    }
    return result;
  }, [sp, inputIds, defaults]);

  const setValue = useCallback(
    (scenario: "a" | "b", id: string, value: number) => {
      const params = new URLSearchParams(sp.toString());
      const key = scenario === "b" ? `${id}_b` : id;
      if (Number.isFinite(value)) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
      router.replace(`${resolvedPathname}?${params.toString()}`, { scroll: false });
    },
    [sp, router, resolvedPathname],
  );

  const reset = useCallback(() => {
    router.replace(resolvedPathname, { scroll: false });
  }, [router, resolvedPathname]);

  return { valuesA, valuesB, setValue, reset };
}
