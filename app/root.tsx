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
    const viewport = window.visualViewport;
    if (!viewport) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (viewport.scale !== 1) return;
        stageRef.current?.style.setProperty("--app-visual-height", `${viewport.height}px`);
        stageRef.current?.style.setProperty("--app-visual-top", `${viewport.offsetTop}px`);
      });
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
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
