import { X } from "lucide-react";
import { useId, type ReactNode } from "react";
import { ModalLayer } from "./ModalLayer";

export function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const titleId = useId();

  return (
    <ModalLayer titleId={titleId} onClose={onClose}>
    <div className="max-h-[85%] w-full max-w-[350px] overflow-y-auto rounded-2xl bg-neutral-white p-5 shadow-xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-heading-lg font-bold">{title}</h2>
        <button type="button" onClick={onClose} aria-label="닫기" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-surface"><X size={20} aria-hidden="true" /></button>
      </div>
      {children}
    </div>
    </ModalLayer>
  );
}
