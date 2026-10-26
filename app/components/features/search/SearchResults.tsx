import { MapPin } from "lucide-react";
import { TournamentSearchItem } from "~/components/domain/TournamentSearchItem";
import type { TournamentPreview } from "~/types/home";

export function SearchResults({ regions, tournaments, onSelectRegion, onSelectTournament }: { regions: string[]; tournaments: TournamentPreview[]; onSelectRegion: (region: string) => void; onSelectTournament: (tournament: TournamentPreview) => void }) {
  return <>
    {regions.length > 0 && <section className="pt-5" aria-labelledby="region-results-heading"><h2 id="region-results-heading" className="mb-2 text-body font-semibold text-neutral-subtext">지역</h2>{regions.map((region) => <button key={region} type="button" onClick={() => onSelectRegion(region)} className="flex min-h-11 w-full items-center gap-3 text-left"><MapPin size={20} strokeWidth={2.2} aria-hidden="true" /><span className="text-heading-lg font-semibold">{region}</span></button>)}</section>}
    {tournaments.length > 0 && <section className={`${regions.length > 0 ? "mt-3 border-t border-neutral-border pt-5" : "pt-5"}`} aria-labelledby="tournament-results-heading"><h2 id="tournament-results-heading" className="mb-3 text-body font-semibold text-neutral-subtext">대회</h2>{tournaments.map((tournament) => <TournamentSearchItem key={tournament.id} tournament={tournament} onSelect={() => onSelectTournament(tournament)} />)}</section>}
  </>;
}
