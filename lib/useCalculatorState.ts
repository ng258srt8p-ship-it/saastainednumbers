"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useCalculatorState(inputIds: string[]) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const values = useMemo(() => {
    const result: Record<string, number> = {};
    for (const id of inputIds) {
      const raw = searchParams.get(id);
      const parsed = raw !== null ? Number.parseFloat(raw) : NaN;
      result[id] = Number.isFinite(parsed) ? parsed : 0;
    }
    return result;
  }, [searchParams, inputIds]);

  const setValue = useCallback(
    (id: string, value: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (Number.isFinite(value)) {
        params.set(id, value.toString());
      } else {
        params.delete(id);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return { values, setValue, reset };
}
