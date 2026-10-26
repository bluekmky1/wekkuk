import { Trophy } from "lucide-react";
import type { TournamentPreview } from "~/types/home";
import { TournamentLink } from "~/components/TournamentLink";
import { TournamentSummary } from "~/components/domain/TournamentSummary";

export function TournamentSearchItem({ tournament, onSelect }: { tournament: TournamentPreview; onSelect: () => void }) {
  return <TournamentLink tournamentId={tournament.id} onClick={onSelect} className="flex min-h-[80px] w-full items-start gap-3 py-3 text-left">
    <Trophy className="mt-0.5 shrink-0" size={20} strokeWidth={2.2} aria-hidden="true" />
    <TournamentSummary title={tournament.title} location={tournament.location} dates={tournament.dates.split(" ~ ")[0].replace("2026.", "")} />
  </TournamentLink>;
}
