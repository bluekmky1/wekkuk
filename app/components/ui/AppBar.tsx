import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "./Button";
import { cx } from "./styles";

export function AppBar({ title, center, actions, onBack, align = "left", height = 60, className }: {
  title?: ReactNode; center?: ReactNode; actions?: ReactNode; onBack?: () => void;
  align?: "left" | "center"; height?: number; className?: string;
}) {
  return <header className={cx("bg-neutral-white", className)}>
    <div style={{ height }} className="relative flex items-center gap-4 px-5 pb-3">
      {onBack ? <IconButton label="뒤로 가기" onClick={onBack} className="-ml-1 w-8"><ArrowLeft size={25} strokeWidth={2.2} aria-hidden="true" /></IconButton> : <span className="w-8 shrink-0" aria-hidden="true" />}
      {center ? <div className="min-w-0 flex-1">{center}</div> : title ? <h1 className={cx("min-w-0 text-heading-lg font-bold", align === "center" ? "absolute left-1/2 max-w-[calc(100%-120px)] -translate-x-1/2 truncate text-center" : "flex-1")}>{title}</h1> : <span className="flex-1" aria-hidden="true" />}
      <div className="ml-auto flex shrink-0 items-center gap-4">{actions ?? <span className="w-8" aria-hidden="true" />}</div>
    </div>
  </header>;
}

export function StickyHeader({ children, top = 0, layer = 40, className }: { children: ReactNode; top?: number; layer?: number; className?: string }) {
  return <div style={{ top, zIndex: layer }} className={cx("sticky bg-neutral-white", className)}>{children}</div>;
}
