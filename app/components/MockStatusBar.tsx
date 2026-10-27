import { BatteryFull, Signal, Wifi } from "lucide-react";

export function MockStatusBar() {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between px-8 text-[16px] font-semibold" aria-hidden="true">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <Signal size={16} fill="currentColor" />
        <Wifi size={16} strokeWidth={3} />
        <BatteryFull size={24} strokeWidth={2.5} />
      </span>
    </div>
  );
}
