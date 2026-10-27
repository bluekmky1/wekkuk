import { ChevronRight } from "lucide-react";
import { PushLink } from "~/components/PushLink";
export function MyMenuItem({ label, to, onClick }: { label: string; to?: string; onClick?: () => void }) {
  const content = <><span>{label}</span><ChevronRight size={16} className="text-neutral-subtext" aria-hidden="true" /></>;
  const className = "flex min-h-14 w-full items-center justify-between gap-3 py-3 text-left text-body focus-visible:outline-primary";
  return to ? <PushLink to={to} className={className}>{content}</PushLink> : <button type="button" onClick={onClick} className={className}>{content}</button>;
}
