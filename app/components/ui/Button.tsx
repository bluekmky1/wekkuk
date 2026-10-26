import type { ButtonHTMLAttributes } from "react";
import { cx } from "./styles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
  fullWidth?: boolean;
};

export function Button({ variant = "primary", size = "md", fullWidth, className, type = "button", ...props }: ButtonProps) {
  return <button {...props} type={type} className={cx("inline-flex items-center justify-center gap-2 rounded-lg px-4 text-body font-semibold disabled:cursor-not-allowed disabled:opacity-40", size === "sm" ? "min-h-8" : "min-h-11", fullWidth && "w-full", variant === "primary" ? "bg-neutral-text text-neutral-white" : variant === "outline" ? "border border-neutral-subtext bg-neutral-white text-neutral-subtext" : "text-neutral-subtext", className)} />;
}

export function IconButton({ label, size = "md", className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; size?: "sm" | "md" }) {
  return <button {...props} type={type} aria-label={label} className={cx("inline-flex shrink-0 items-center justify-center disabled:cursor-not-allowed disabled:opacity-40", size === "sm" ? "h-8 w-8" : "h-10 w-10", className)} />;
}
