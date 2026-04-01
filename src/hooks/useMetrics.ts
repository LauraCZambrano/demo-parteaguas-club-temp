import { useState, useCallback } from "react";

/** Format 1200 → "1.2k", 850 → "850" */
export const formatCount = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
};

/**
 * Session-local counter map.
 * Initialise with base values; increment returns the new value.
 */
export const useMetrics = (initial: Record<string, number>) => {
  const [counts, setCounts] = useState<Record<string, number>>(initial);

  const increment = useCallback((id: string) => {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  return { counts, increment };
};
