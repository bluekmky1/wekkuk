import { useConfirmDelete } from "~/components/ui/ConfirmDeleteDialog";
import { MapPin, Search, Trophy, UserRound, X } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "~/components/ui";

type Props = { label: string; kind: "region" | "tournament" | "query" | "player"; onSelect: () => void; onDelete: () => void; children?: ReactNode; interactiveContent?: ReactNode };
export function RecentSearchItem({ label, kind, onSelect, onDelete, children, interactiveContent }: Props) {
  const { requestDelete, dialog } = useConfirmDelete();
  const Icon = kind === "region" ? MapPin : kind === "tournament" ? Trophy : kind === "player" ? UserRound : Search;
  return <><div className={`flex items-center gap-3 ${kind === "tournament" ? "min-h-[84px] py-3" : "min-h-11"}`}>
    <Icon className={kind === "tournament" ? "mt-3 shrink-0 self-start" : "shrink-0"} size={20} strokeWidth={2.2} aria-hidden="true" />
    {interactiveContent ?? <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left">{children ?? <span className="text-heading-lg font-semibold">{label}</span>}</button>}
    <IconButton type="button" label={`${label} 최근 검색 삭제`} onClick={() => requestDelete(onDelete)} size="sm"><X size={20} strokeWidth={1.8} aria-hidden="true" /></IconButton>
  </div>{dialog}</>;
}
