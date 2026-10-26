import { X } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "./Button";
import { cx } from "./styles";

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null;
  return <div role="status" className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-40px)] max-w-[350px] -translate-x-1/2 items-center gap-3 rounded-xl bg-neutral-text px-4 py-3 text-caption text-neutral-white"><span className="flex-1">{message}</span><IconButton label="알림 닫기" size="sm" onClick={onClose}><X size={16} aria-hidden="true" /></IconButton></div>;
}

export function EmptyState({ title, description, illustration, action, className }: { title: string; description?: string; illustration?: ReactNode; action?: ReactNode; className?: string }) {
  return <div className={cx("flex flex-col items-center justify-center px-5 py-16 text-center", className)}>{illustration}<h2 className={cx("text-heading-lg font-semibold", Boolean(illustration) && "mt-8")}>{title}</h2>{description && <p className="mt-2 text-body text-neutral-muted">{description}</p>}{action && <div className="mt-5">{action}</div>}</div>;
}
