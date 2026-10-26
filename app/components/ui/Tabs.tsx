import { useRef, type ReactNode } from "react";
import { cx } from "./styles";

export type TabItem<T extends string> = { value: T; label: ReactNode; disabled?: boolean };
export type TabBarProps<T extends string> = {
  items: TabItem<T>[]; value: T; onChange: (value: T) => void; label: string;
  fullWidth?: boolean; idPrefix?: string; className?: string;
};

function Tabs<T extends string>({ items, value, onChange, label, fullWidth = true, idPrefix, className, segmented }: TabBarProps<T> & { segmented?: boolean }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return <div role="tablist" aria-label={label} className={cx("flex", segmented ? "h-10 rounded-full bg-neutral-surface p-1" : "h-11 border-b border-neutral-border bg-neutral-white", className)}>
    {items.map((item, index) => <button key={item.value} ref={(element) => { refs.current[index] = element; }} type="button" role="tab" aria-selected={value === item.value} tabIndex={value === item.value ? 0 : -1} disabled={item.disabled} id={idPrefix ? `${idPrefix}-${item.value}-tab` : undefined} aria-controls={idPrefix ? `${idPrefix}-${item.value}-panel` : undefined} onClick={() => onChange(item.value)} onKeyDown={(event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const available = items.map((entry, itemIndex) => entry.disabled ? -1 : itemIndex).filter((itemIndex) => itemIndex >= 0);
      const current = available.indexOf(index);
      const next = event.key === "Home" ? available[0] : event.key === "End" ? available[available.length - 1] : available[(current + (event.key === "ArrowRight" ? 1 : -1) + available.length) % available.length];
      if (next !== undefined) { onChange(items[next].value); refs.current[next]?.focus(); }
    }} className={cx("whitespace-nowrap disabled:cursor-not-allowed disabled:text-neutral-border", fullWidth ? "min-w-0 flex-1" : "min-w-[81px] px-4", segmented ? cx("rounded-full text-caption font-semibold", value === item.value ? "bg-neutral-white text-neutral-text" : "text-neutral-subtext") : cx("border-b-2 text-body", value === item.value ? "border-neutral-text font-bold" : "border-transparent"))}>{item.label}</button>)}
  </div>;
}

export function TabBar<T extends string>(props: TabBarProps<T>) { return <Tabs {...props} />; }
export function SegmentedControl<T extends string>(props: TabBarProps<T>) { return <Tabs {...props} segmented />; }

export function SectionNav<T extends string>({ items, value, onChange, label, fullWidth = false, className }: Omit<TabBarProps<T>, "idPrefix">) {
  return <nav aria-label={label} className={cx("flex h-12 border-b border-neutral-surface bg-neutral-white", className)}>{items.map((item) => <button key={item.value} type="button" disabled={item.disabled} onClick={() => onChange(item.value)} aria-current={value === item.value ? "location" : undefined} className={cx("border-b-2 px-5 text-body", fullWidth && "min-w-0 flex-1", value === item.value ? "border-neutral-text font-bold" : "border-transparent")}>{item.label}</button>)}</nav>;
}
