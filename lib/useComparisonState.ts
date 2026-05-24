"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useComparisonState(inputIds: string[], defaults?: Record<string, number>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const valuesA = useMemo(() => {
    const result: Record<string, number> = {};
    for (const id of inputIds) {
      const raw = searchParams.get(id);
      const parsed = raw !== null ? Number.parseFloat(raw) : NaN;
      result[id] = Number.isFinite(parsed) ? parsed : (defaults?.[id] ?? 0);
    }
    return result;
  }, [searchParams, inputIds, defaults]);

  const valuesB = useMemo(() => {
    const result: Record<string, number> = {};
    for (const id of inputIds) {
      const raw = searchParams.get(`${id}_b`);
      const parsed = raw !== null ? Number.parseFloat(raw) : NaN;
      result[id] = Number.isFinite(parsed) ? parsed : (defaults?.[id] ?? 0);
    }
    return result;
  }, [searchParams, inputIds, defaults]);

  const setValue = useCallback(
    (scenario: "a" | "b", id: string, value: number) => {
      const params = new URLSearchParams(searchParams.toString());
      const key = scenario === "b" ? `${id}_b` : id;
      if (Number.isFinite(value)) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return { valuesA, valuesB, setValue, reset };
}
