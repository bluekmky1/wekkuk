import { CalendarDays, MapPin } from "lucide-react";
import { TournamentLink } from "~/components/TournamentLink";
import type { TournamentPreview } from "~/types/home";

export function TournamentCompactItem({ tournament }: { tournament: TournamentPreview }) {
  const dates = tournament.dates.replace(/\b\d{4}\./g, "");

  return <TournamentLink tournamentId={tournament.id} className="block min-w-0 px-3 py-3">
    <div className="flex min-w-0 items-center gap-2">
      {tournament.status && <span className="shrink-0 whitespace-nowrap rounded border border-neutral-border px-1.5 py-0.5 text-[10px] leading-[14px] text-neutral-subtext">{tournament.status}</span>}
      <h3 title={tournament.title} className="min-w-0 flex-1 truncate text-body font-semibold">{tournament.title}</h3>
    </div>
    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption">
      <span className="inline-flex items-center gap-1 whitespace-nowrap"><MapPin size={13} aria-hidden="true" />{tournament.location}</span>
      <span className="inline-flex items-center gap-1 whitespace-nowrap"><CalendarDays size={13} aria-hidden="true" />{dates}</span>
    </div>
  </TournamentLink>;
}
