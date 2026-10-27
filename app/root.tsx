import {
  Links,
  Meta,
  Scripts,
  useLocation,
  useNavigationType,
  useOutlet,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { useEffect, useRef } from "react";
import { AppViewport } from "~/components/AppViewport";
import { MockStatusBar } from "~/components/MockStatusBar";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "icon", href: "data:," },
  { rel: "preconnect", href: "https://cdn.jsdelivr.net" },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css",
    crossOrigin: "anonymous",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const outlet = useOutlet();
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Keep Android Kakao in the host window bounds; its visual viewport
    // may remain shorter after the browser toolbar changes.
    const userAgent = navigator.userAgent;
    const isAndroidKakao = /Android/i.test(userAgent) && /KAKAOTALK/i.test(userAgent);
    if (isAndroidKakao) {
      stageRef.current?.style.setProperty("--bottom-nav-padding", "12px");
    }
    const viewport = window.visualViewport;
    if (!viewport) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (viewport.scale !== 1) return;
        const focused = document.activeElement;
        const editing = focused instanceof HTMLElement && (focused.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(focused.tagName));
        const keyboardOpen = editing && window.innerHeight - viewport.height > 120;
        const useWindowBounds = isAndroidKakao && !keyboardOpen;
        const height = useWindowBounds ? window.innerHeight : viewport.height;
        const top = useWindowBounds ? 0 : viewport.offsetTop;
        stageRef.current?.style.setProperty("--app-visual-height", `${height}px`);
        stageRef.current?.style.setProperty("--app-visual-top", `${top}px`);
      });
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("pageshow", update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("pageshow", update);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, []);
  return (
    <div ref={stageRef} className="demo-stage">
      <div className="mobile-shell">
        <div className="device-status-bar"><MockStatusBar /></div>
        <AppViewport pathname={location.pathname} search={location.search} entryKey={location.key} navigationType={navigationType}>{outlet}</AppViewport>
      </div>
    </div>
  );
}
