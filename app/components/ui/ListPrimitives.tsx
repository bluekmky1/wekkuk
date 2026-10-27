import { ArrowDownUp, Check } from "lucide-react";
import { useId, type ReactNode } from "react";
import { compactBadge, cx } from "./styles";

export function Badge({ children, tone = "default", className }: { children: ReactNode; tone?: "default" | "muted" | "danger" | "primary" | "outline"; className?: string }) {
  return <span className={cx(tone === "danger" ? compactBadge : "inline-block whitespace-nowrap rounded-full px-2 py-1 text-[10px] leading-[14px]", tone === "outline" ? "border border-[#cbd0d7] bg-neutral-white text-[#596273]" : tone === "default" ? "bg-[#e5e7eb] font-medium text-[#374151]" : tone === "primary" ? "bg-[#eaf3fd] text-[#005eb8]" : tone === "danger" ? "border-[#dc2626] bg-neutral-white font-normal text-[#dc2626]" : "bg-neutral-surface font-medium text-[#374151]", className)}>{children}</span>;
}

export function SectionHeader({ title, id, count, action, size = "md", className }: { title: ReactNode; id?: string; count?: number; action?: ReactNode; size?: "sm" | "md"; className?: string }) {
  return <div className={cx("flex items-center justify-between gap-3", className)}><h2 id={id} className={cx("font-bold", size === "sm" ? "text-heading" : "text-heading-lg")}>{title}</h2><div className="flex items-center gap-3 text-caption">{count !== undefined && <span>{count}개</span>}{action}</div></div>;
}

export function ListToolbar({ count, sortLabel, onSort, sortAriaLabel, className }: { count: number; sortLabel: string; onSort: () => void; sortAriaLabel?: string; className?: string }) {
  return <div className={cx("flex items-center justify-between py-5 text-body", className)}><p>결과 {count}개</p><button type="button" onClick={onSort} aria-label={sortAriaLabel} className="flex items-center gap-1.5"><ArrowDownUp size={16} aria-hidden="true" />{sortLabel}</button></div>;
}

export function SelectOptionList<T extends string>({ options, value, onChange, label }: { options: { value: T; label: ReactNode }[]; value: T; onChange: (value: T) => void; label: string }) {
  const name = useId();
  return <div role="radiogroup" aria-label={label}>{options.map((option) => <label key={option.value} className="flex min-h-12 cursor-pointer items-center gap-3 border-b border-neutral-surface text-body last:border-0"><input type="radio" name={name} checked={value === option.value} onChange={() => onChange(option.value)} className="h-4 w-4 accent-primary" /><span className="flex-1">{option.label}</span>{value === option.value && <Check size={16} aria-hidden="true" />}</label>)}</div>;
}

export function AdBanner({ className }: { className?: string }) {
  return <div aria-label="광고 배너 자리" className={cx("flex aspect-[4/1] w-full shrink-0 items-center justify-center rounded-xl bg-neutral-border text-body font-semibold", className)}>광고 배너</div>;
}
