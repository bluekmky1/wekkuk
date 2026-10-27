import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { APP_OVERLAY_ID, getAppScrollElement } from "~/viewport";
import { cx } from "./styles";

const layers: HTMLElement[] = [];
const locks = new WeakMap<HTMLElement, { count: number; inert: boolean; overflow: string }>();
const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Modal focus and backdrop belong to the app viewport, including the desktop preview. */
export function ModalLayer({ titleId, onClose, children, bottom = false }: { titleId: string; onClose: () => void; children: ReactNode; bottom?: boolean }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => { setHost(document.getElementById(APP_OVERLAY_ID)); }, []);
  useEffect(() => {
    const layer = ref.current;
    const background = getAppScrollElement();
    if (!host || !layer || !background) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const lock = locks.get(background) ?? { count: 0, inert: background.inert, overflow: background.style.overflow };
    lock.count += 1;
    locks.set(background, lock);
    background.inert = true;
    background.style.overflow = "hidden";
    layers.push(layer);
    const focusables = () => Array.from(layer.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => element.getClientRects().length > 0);
    (focusables()[0] ?? layer).focus({ preventScroll: true });
    function onKeyDown(event: KeyboardEvent) {
      if (layers[layers.length - 1] !== layer) return;
      if (event.key === "Escape") {
        event.preventDefault(); event.stopPropagation(); closeRef.current();
      } else if (event.key === "Tab") {
        const elements = focusables();
        const first = elements[0] ?? layer;
        const last = elements[elements.length - 1] ?? layer;
        if (event.shiftKey && (document.activeElement === first || !layer.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !layer.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      const index = layers.indexOf(layer);
      if (index >= 0) layers.splice(index, 1);
      lock.count -= 1;
      if (lock.count === 0) {
        background.inert = lock.inert;
        background.style.overflow = lock.overflow;
        locks.delete(background);
      }
      const nextLayer = layers[layers.length - 1];
      if (opener?.isConnected && (!nextLayer || nextLayer.contains(opener))) opener.focus({ preventScroll: true });
      else if (!nextLayer) background.focus({ preventScroll: true });
    };
  }, [host]);

  return host ? createPortal(<div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={cx("absolute inset-0 flex justify-center bg-black/40 text-neutral-text outline-none", bottom ? "items-end" : "items-center p-4")} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => {
    // Keep the backdrop and inert lock until the full click has been consumed.
    // Closing on pointerdown lets the remainder of a touch reach the list below.
    event.stopPropagation();
    if (event.target === event.currentTarget) {
      event.preventDefault();
      closeRef.current();
    }
  }}>{children}</div>, host) : null;
}
