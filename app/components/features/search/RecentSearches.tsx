import { AdBanner, SectionHeader } from "~/components/ui";
import { RecentSearchItem } from "~/components/domain/RecentSearchItem";
import { TournamentLink } from "~/components/TournamentLink";
import { TournamentSummary } from "~/components/domain/TournamentSummary";
import type { TournamentPreview } from "~/types/home";

export type SearchHistoryItem = { id: string; label: string; kind: "region" | "tournament" | "query" };
export function RecentSearches({ items, onSelect, onOpenTournament, onDelete, onClear, tournaments }: { items: SearchHistoryItem[]; onSelect: (item: SearchHistoryItem) => void; onOpenTournament: (item: SearchHistoryItem) => void; onDelete: (id: string) => void; onClear: () => void; tournaments: TournamentPreview[] }) {
  return <>
    <AdBanner className="mt-3" />
    <SectionHeader title="최근 검색" action={<button type="button" onClick={onClear} className="text-body text-neutral-muted">전체 삭제</button>} className="mb-4 mt-8" />
    <div>{[items.filter(item => item.kind !== "tournament"), items.filter(item => item.kind === "tournament")].filter(group => group.length > 0).map((group, index) => <ul key={group[0].kind === "tournament" ? "tournaments" : "queries"} className={index ? "mt-3 border-t border-neutral-border pt-3" : ""}>{group.map(item => {
      const tournament = tournaments.find(({ id }) => id === item.id);
      return <li key={item.id}><RecentSearchItem label={item.label} kind={item.kind} onSelect={() => onSelect(item)} onDelete={() => onDelete(item.id)} interactiveContent={item.kind === "tournament" && tournament ? <TournamentLink tournamentId={tournament.id} onClick={() => onOpenTournament(item)} className="min-w-0 flex-1 text-left"><TournamentSummary title={tournament.title} location={tournament.location} dates={tournament.dates.split(" ~ ")[0].replace(/\b\d{4}\./g, "")} /></TournamentLink> : undefined} /></li>;
    })}</ul>)}</div>
  </>;
}
