import { useLocation, useSearchParams } from "@remix-run/react";
import { useCallback } from "react";

// Filters and tabs belong to the current screen; keep the entry and its origin when replacing them.
export function useRouteQuery() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();

  const update = useCallback((values: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(values)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    setParams(next, { replace: true, preventScrollReset: true, state: location.state });
  }, [location.state, params, setParams]);

  return { params, update };
}
