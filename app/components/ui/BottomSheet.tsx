import { X } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";
import { ModalLayer } from "./ModalLayer";

export function BottomSheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const titleId = useId();
  const [entering, setEntering] = useState(true);
  useEffect(() => {
    const timeout = window.setTimeout(() => setEntering(false), 260);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <ModalLayer titleId={titleId} onClose={onClose} bottom>
        <div onAnimationEnd={() => setEntering(false)} className={`${entering ? "bottom-sheet " : ""}max-h-[85%] w-full overflow-y-auto rounded-t-3xl bg-neutral-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-3 shadow-xl`}>
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-border" aria-hidden="true" />
      <div className="mb-3 flex items-center justify-between gap-3"><h2 id={titleId} className="text-heading-lg font-bold">{title}</h2><button type="button" onClick={onClose} aria-label={`${title} 닫기`} className="flex h-10 w-10 items-center justify-center"><X size={23} aria-hidden="true" /></button></div>
      {children}
        </div>
    </ModalLayer>
  );
}
