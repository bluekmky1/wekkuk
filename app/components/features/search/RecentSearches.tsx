import { AdBanner, SectionHeader } from "~/components/ui";
import { RecentSearchItem } from "~/components/domain/RecentSearchItem";
import { TournamentLink } from "~/components/TournamentLink";
import { TournamentSummary } from "~/components/domain/TournamentSummary";
import type { TournamentPreview } from "~/types/home";

export type SearchHistoryItem = { id: string; label: string; kind: "region" | "tournament" | "query" };
export function RecentSearches({ items, onSelect, onOpenTournament, onDelete, onClear, tournaments }: { items: SearchHistoryItem[]; onSelect: (item: SearchHistoryItem) => void; onOpenTournament: (item: SearchHistoryItem) => void; onDelete: (id: string) => void; onClear: () => void; tournaments: TournamentPreview[] }) {
  return <>
    <AdBanner height={60} className="mt-3" />
    <SectionHeader title="최근 검색" action={<button type="button" onClick={onClear} className="text-body text-neutral-muted">전체 삭제</button>} className="mb-4 mt-8" />
    <ul>{items.map((item, index) => <li key={item.id} className={index === 3 ? "border-t border-neutral-border pt-3" : ""}>
      <RecentSearchItem label={item.label} kind={item.kind} onSelect={() => onSelect(item)} onDelete={() => onDelete(item.id)} interactiveContent={item.kind === "tournament" ? <TournamentLink tournamentId={tournaments.find(({ id }) => id === item.id)?.id ?? tournaments.find(({ title }) => title === item.label)?.id ?? "october-1"} onClick={() => onOpenTournament(item)} className="min-w-0 flex-1 text-left"><TournamentSummary title={item.label} location={tournaments.find(({ id }) => id === item.id)?.location ?? "경기 고양"} dates={tournaments.find(({ id }) => id === item.id)?.dates.split(" ~ ")[0].replace("2026.", "") ?? "10.24 (토)"} /></TournamentLink> : undefined} />
    </li>)}</ul>
  </>;
}
