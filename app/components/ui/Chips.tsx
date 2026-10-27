import { ChevronDown } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./styles";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean };

export function ChoiceChip({ selected = false, className, type = "button", ...props }: ChipProps) {
  const color = selected ? "border-[#b6d6f7] bg-[#eaf3fd] text-[#005eb8] font-semibold" : "border-[#cbd0d7] bg-neutral-white text-[#596273]";
  return <button {...props} type={type} aria-pressed={selected} className={cx("min-h-8 shrink-0 rounded-full border px-3 py-1.5 text-body disabled:opacity-40", color, className)} />;
}

export function FilterChip({ selected = false, icon, children, className, type = "button", ...props }: ChipProps & { icon?: ReactNode }) {
  return <button {...props} type={type} aria-haspopup="dialog" className={cx("inline-flex min-h-8 shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-body", selected ? "border-[#b6d6f7] bg-[#eaf3fd] text-[#005eb8]" : "border-[#cbd0d7] bg-neutral-white text-[#596273]", className)}>{icon}{children}<ChevronDown size={12} aria-hidden="true" /></button>;
}

export function ChipGroup<T extends string | number>({ items, value, onChange, label, className }: { items: { value: T; label: ReactNode; disabled?: boolean }[]; value: T; onChange: (value: T) => void; label: string; className?: string }) {
  return <div role="group" aria-label={label} className={cx("flex flex-wrap gap-2", className)}>{items.map((item) => <ChoiceChip key={item.value} selected={value === item.value} disabled={item.disabled} onClick={() => onChange(item.value)}>{item.label}</ChoiceChip>)}</div>;
}
