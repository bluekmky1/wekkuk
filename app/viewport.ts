export const APP_SCROLL_ID = "app-scroll";
export const APP_OVERLAY_ID = "app-overlays";

export function getAppScrollElement(): HTMLElement | null {
  return typeof document === "undefined" ? null : document.getElementById(APP_SCROLL_ID);
}

export function scrollAppTo({ top, behavior = "instant" }: { top: number; behavior?: ScrollBehavior }) {
  getAppScrollElement()?.scrollTo({ top, behavior });
}

export function scrollAppToElement(element: HTMLElement | null | undefined, { behavior = "instant" }: { behavior?: ScrollBehavior } = {}) {
  const scroller = getAppScrollElement();
  if (!element || !scroller) return;
  const margin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  scrollAppTo({ top: element.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - margin, behavior });
}
