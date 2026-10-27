import { MatchStatusBadge } from "~/components/domain/MatchStatusBadge";
import { metadataText } from "~/components/ui/styles";
import { CalendarDays, MapPin } from "lucide-react";
import { TournamentLink } from "~/components/TournamentLink";
import type { TournamentPreview } from "~/types/home";

export function TournamentCompactItem({ tournament }: { tournament: TournamentPreview }) {
  const dates = tournament.dates.replace(/\b\d{4}\./g, "");

  return <TournamentLink tournamentId={tournament.id} className="block min-w-0 px-3 py-3">
    <div className="flex min-w-0 items-center gap-2">
      {tournament.status && <MatchStatusBadge status="scheduled" size="sm" label={tournament.status} />}
      <h3 title={tournament.title} className="min-w-0 flex-1 truncate text-body font-semibold">{tournament.title}</h3>
    </div>
    <div className={`mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 ${metadataText}`}>
      <span className="inline-flex items-center gap-1 whitespace-nowrap"><MapPin size={12} aria-hidden="true" />{tournament.location}</span>
      <span className="inline-flex items-center gap-1 whitespace-nowrap"><CalendarDays size={12} aria-hidden="true" />{dates}</span>
    </div>
  </TournamentLink>;
}
