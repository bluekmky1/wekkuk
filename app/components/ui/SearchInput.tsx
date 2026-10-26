import { ArrowLeft, Search, X } from "lucide-react";
import { forwardRef, type ChangeEventHandler, type FormEventHandler, type InputHTMLAttributes, type Ref } from "react";
import { IconButton } from "./Button";
import { cx } from "./styles";

export const SearchInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string; variant?: "plain" | "filled" | "outlined"; showIcon?: boolean; onClear?: () => void }>(function SearchInput({ label, variant = "plain", showIcon = false, onClear, className, ...props }, ref) {
  return <div className={cx("flex min-w-0 flex-1 items-center gap-2", variant === "filled" && "h-9 rounded-md bg-neutral-surface px-3", variant === "outlined" && "h-14 rounded-xl border border-neutral-subtext bg-neutral-white px-3")}>
    {showIcon && <Search size={18} className="shrink-0 text-neutral-muted" aria-hidden="true" />}
    <input {...props} ref={ref} type="search" inputMode="search" aria-label={label} className={cx("min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-neutral-muted [&::-webkit-search-cancel-button]:hidden", className)} />
    {onClear && props.value && <IconButton label="검색어 지우기" size="sm" onClick={onClear}><X size={16} aria-hidden="true" /></IconButton>}
  </div>;
});

export function SearchAppBar({ value, onChange, onSubmit, onBack, placeholder, label, inputRef, className }: { value: string; onChange: ChangeEventHandler<HTMLInputElement>; onSubmit: FormEventHandler<HTMLFormElement>; onBack: () => void; placeholder: string; label: string; inputRef?: Ref<HTMLInputElement>; className?: string }) {
  return <header className={cx("bg-neutral-white", className)}><form role="search" onSubmit={onSubmit} className="flex h-[74px] items-center gap-4 border-b border-neutral-border px-5"><IconButton label="뒤로 가기" onClick={onBack} className="-ml-1 w-8"><ArrowLeft size={25} strokeWidth={2.2} aria-hidden="true" /></IconButton><SearchInput ref={inputRef} label={label} value={value} onChange={onChange} placeholder={placeholder} className="text-heading-lg font-semibold" /><IconButton type="submit" label="검색" className="w-9"><Search size={25} strokeWidth={2.4} aria-hidden="true" /></IconButton></form></header>;
}
