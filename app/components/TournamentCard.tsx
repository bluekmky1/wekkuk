import type { TournamentPreview } from "~/types/home";
import { TournamentLink } from "~/components/TournamentLink";
import { TournamentSummary } from "~/components/domain/TournamentSummary";

export function TournamentCard({ tournament }: { tournament: TournamentPreview }) {
  return (
    <TournamentLink tournamentId={tournament.id} className="flex min-h-[110px] gap-3 rounded-xl bg-neutral-white p-3 focus-visible:outline-primary">
      <TournamentSummary title={tournament.title} location={tournament.location} dates={tournament.dates.replace(/\b\d{4}\./g, "")} className="flex flex-1 flex-col justify-between text-caption [&>span:first-child]:text-body [&>span:first-child]:leading-normal [&>span:last-child]:mt-0 [&>span:last-child]:flex-col [&>span:last-child]:items-start [&>span:last-child]:gap-1" />
      <div className="h-[86px] w-[58px] shrink-0 self-center bg-neutral-border" aria-label={tournament.thumbnailUrl ? undefined : "대회 포스터 없음"}>
        {tournament.thumbnailUrl && <img src={tournament.thumbnailUrl} width={116} height={172} alt={`${tournament.title} 포스터`} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-full w-full object-contain" onError={(event) => { event.currentTarget.hidden = true; }} />}
      </div>
    </TournamentLink>
  );
}
