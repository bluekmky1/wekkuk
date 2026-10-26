import { Component, createRef, type ReactNode } from "react";
import { APP_OVERLAY_ID, APP_SCROLL_ID } from "~/viewport";

type Props = { pathname: string; search: string; entryKey: string; navigationType: "POP" | "PUSH" | "REPLACE"; children: ReactNode };
type ScrollPosition = { top: number; left: number; children: { index: number; top: number; left: number }[] };
type Snapshot = { screen: HTMLElement; scrolls: { element: HTMLElement; top: number; left: number }[]; direction: "forward" | "back" };
const positions = new Map<string, ScrollPosition>();
const storageKey = (key: string) => `wekkuk-app-scroll:${key}`;
const positionKey = ({ pathname, search, entryKey }: Props) => `${pathname}${search}:${entryKey}`;

function capturePosition(scroller: HTMLElement): ScrollPosition {
  const children = Array.from(scroller.querySelectorAll<HTMLElement>("*")).flatMap((element, index) => element.scrollTop || element.scrollLeft ? [{ index, top: element.scrollTop, left: element.scrollLeft }] : []);
  return { top: scroller.scrollTop, left: scroller.scrollLeft, children };
}

function readPosition(key: string): ScrollPosition | undefined {
  const remembered = positions.get(key);
  if (remembered) return remembered;
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey(key)) ?? "null");
    if (saved && typeof saved.top === "number" && typeof saved.left === "number" && Array.isArray(saved.children)) return saved;
  } catch { /* Scroll restoration also works in memory when storage is unavailable. */ }
}

/** Capture the outgoing DOM before React replaces its route. The inert copy has no live route hooks. */
export class AppViewport extends Component<Props, Record<string, never>, Snapshot | null> {
  private screen = createRef<HTMLDivElement>();
  private scroller = createRef<HTMLDivElement>();
  private outgoing = createRef<HTMLDivElement>();
  private animations: Animation[] = [];
  private revision = 0;
  private animationTimeout: ReturnType<typeof setTimeout> | undefined;
  private historyIndex = 0;
  private previousRestoration: ScrollRestoration = "auto";

  componentDidMount() {
    this.historyIndex = window.history.state?.idx ?? 0;
    this.previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    this.restore(positionKey(this.props));
    window.addEventListener("pagehide", this.saveBeforeExit);
  }

  componentWillUnmount() {
    this.saveBeforeExit();
    this.stopAnimation();
    window.removeEventListener("pagehide", this.saveBeforeExit);
    window.history.scrollRestoration = this.previousRestoration;
  }

  private remember(key: string, persist = false) {
    const scroller = this.scroller.current;
    if (!scroller) return;
    const value = capturePosition(scroller);
    positions.set(key, value);
    if (persist) {
      try { sessionStorage.setItem(storageKey(key), JSON.stringify(value)); } catch { /* Optional persistence. */ }
    }
  }

  private saveBeforeExit = () => { this.remember(positionKey(this.props), true); };

  private restore(key?: string) {
    const scroller = this.scroller.current;
    if (!scroller) return;
    const value = key ? readPosition(key) : undefined;
    scroller.scrollTop = value?.top ?? 0;
    scroller.scrollLeft = value?.left ?? 0;
    if (value) {
      const children = scroller.querySelectorAll<HTMLElement>("*");
      value.children.forEach(({ index, top, left }) => {
        const child = children[index];
        if (child) { child.scrollTop = top; child.scrollLeft = left; }
      });
    }
  }

  getSnapshotBeforeUpdate(previous: Props): Snapshot | null {
    if (positionKey(previous) !== positionKey(this.props)) this.remember(positionKey(previous), true);
    const source = this.screen.current;
    if (previous.pathname === this.props.pathname || !source || document.visibilityState === "hidden" || window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof source.animate !== "function") return null;
    const copy = source.cloneNode(true) as HTMLElement;
    const scrolls: Snapshot["scrolls"] = [];
    const originals = [source, ...source.querySelectorAll<HTMLElement>("*")];
    const copies = [copy, ...copy.querySelectorAll<HTMLElement>("*")];
    originals.forEach((element, index) => {
      const clone = copies[index];
      clone.removeAttribute("id");
      clone.removeAttribute("autofocus");
      if (element.scrollTop || element.scrollLeft) scrolls.push({ element: clone, top: element.scrollTop, left: element.scrollLeft });
      if (element instanceof HTMLInputElement && clone instanceof HTMLInputElement) {
        if (element.type !== "file") clone.value = element.value;
        clone.checked = element.checked;
      } else if (element instanceof HTMLTextAreaElement && clone instanceof HTMLTextAreaElement) clone.value = element.value;
      else if (element instanceof HTMLSelectElement && clone instanceof HTMLSelectElement) clone.selectedIndex = element.selectedIndex;
    });
    copy.inert = true;
    copy.setAttribute("aria-hidden", "true");
    const index = window.history.state?.idx ?? this.historyIndex;
    const direction = this.props.navigationType === "POP" ? index > this.historyIndex ? "forward" : "back" : this.props.navigationType === "REPLACE" ? "back" : "forward";
    return { screen: copy, scrolls, direction };
  }

  componentDidUpdate(previous: Props, _state: Record<string, never>, snapshot: Snapshot | null) {
    if (previous.pathname !== this.props.pathname || (previous.entryKey !== this.props.entryKey && this.props.navigationType === "POP")) {
      this.stopAnimation();
      this.restore(this.props.navigationType === "POP" ? positionKey(this.props) : undefined);
      if (document.activeElement === document.body) this.scroller.current?.focus({ preventScroll: true });
      if (snapshot) this.startAnimation(snapshot);
    }
    this.historyIndex = window.history.state?.idx ?? this.historyIndex;
    if (positionKey(previous) !== positionKey(this.props)) this.remember(positionKey(this.props));
  }

  private stopAnimation() {
    this.revision += 1;
    if (this.animationTimeout) clearTimeout(this.animationTimeout);
    this.animationTimeout = undefined;
    this.animations.forEach((animation) => animation.cancel());
    this.animations = [];
    this.outgoing.current?.replaceChildren();
  }

  private startAnimation({ screen, scrolls, direction }: Snapshot) {
    const current = this.screen.current;
    const outgoing = this.outgoing.current;
    if (!current || !outgoing) return;
    const revision = this.revision;
    outgoing.style.zIndex = direction === "back" ? "3" : "1";
    outgoing.append(screen);
    scrolls.forEach(({ element, top, left }) => { element.scrollTop = top; element.scrollLeft = left; });
    const options: KeyframeAnimationOptions = { duration: 280, easing: "cubic-bezier(0.22, 0.68, 0, 1)", fill: "both" };
    this.animations = [
      current.animate([{ transform: `translateX(${direction === "back" ? "-25%" : "100%"})` }, { transform: "translateX(0)" }], options),
      screen.animate([{ transform: "translateX(0)" }, { transform: `translateX(${direction === "back" ? "100%" : "-25%"})` }], options),
    ];
    // Background windows may pause their animation timeline. Never retain a frozen outgoing screen.
    this.animationTimeout = setTimeout(() => {
      if (this.revision === revision) this.stopAnimation();
    }, 360);
    void Promise.allSettled(this.animations.map((animation) => animation.finished)).then(() => {
      if (this.revision === revision) this.stopAnimation();
    });
  }

  render() {
    return <div className="app-viewport">
      <div ref={this.outgoing} className="app-outgoing-screen" />
      <div ref={this.screen} className="app-screen">
        {/* Focusable so keyboard scrolling stays inside the app after navigation. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div ref={this.scroller} id={APP_SCROLL_ID} className="app-scroll" role="region" aria-label="앱 화면" tabIndex={-1}>{this.props.children}</div>
        <div id={APP_OVERLAY_ID} className="app-overlay-host" />
      </div>
    </div>;
  }
}
