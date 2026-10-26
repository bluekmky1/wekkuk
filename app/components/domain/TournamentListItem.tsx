import type { TournamentPreview } from "~/types/home";
import { TournamentLink } from "~/components/TournamentLink";
import { TournamentSummary } from "~/components/domain/TournamentSummary";

export function TournamentListItem({ tournament, showPromotion }: { tournament: TournamentPreview; showPromotion: boolean }) {
  return <TournamentLink tournamentId={tournament.id} className="block border-b border-neutral-border py-3 focus-visible:outline-primary">
    {showPromotion && tournament.promoted && <p className="mb-2 text-body font-semibold">위꾹 추천 대회 <span className="ml-1 text-caption font-normal text-neutral-muted">광고</span></p>}
    <div className="flex min-h-[96px] gap-3">
      <TournamentSummary title={tournament.title} location={tournament.location} dates={tournament.dates} className="flex flex-1 flex-col justify-between py-0.5 [&>span:first-child]:line-clamp-2 [&>span:last-child]:flex-col [&>span:last-child]:items-start [&>span:last-child]:gap-1 [&>span:last-child]:text-body" />
      <div className="h-[86px] w-[58px] shrink-0 self-center bg-neutral-border" aria-label="대회 이미지 자리" />
    </div>
  </TournamentLink>;
}
