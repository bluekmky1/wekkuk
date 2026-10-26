import { useLocation, useNavigate } from "@remix-run/react";
import { useEffect, useRef, type UIEvent } from "react";

export const fromHomeNavigationState = { fromHome: true } as const;

export function useBackNavigation(fallback = "/") {
  const location = useLocation();
  const navigate = useNavigate();

  return () => {
    if (location.state?.fromHome === true || typeof location.state?.returnTo === "string") {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  };
}

export function useBackToHome() {
  return useBackNavigation();
}

// Search/list result panes keep their own scroll position inside the app viewport.
export function useScreenScroll() {
  const { key, pathname } = useLocation();
  const scrollRef = useRef<HTMLElement>(null);
  const storageKey = `wekkuk-scroll:${pathname}:${key}`;

  useEffect(() => {
    try {
      if (scrollRef.current) scrollRef.current.scrollTop = Number(sessionStorage.getItem(storageKey)) || 0;
    } catch { /* Scroll restoration is optional when storage is unavailable. */ }
  }, [storageKey]);

  function onScroll(event: UIEvent<HTMLElement>) {
    try { sessionStorage.setItem(storageKey, String(event.currentTarget.scrollTop)); } catch { /* Storage is optional. */ }
  }

  return { ref: scrollRef, onScroll };
}
