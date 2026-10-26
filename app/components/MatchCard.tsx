import { PushLink } from "~/components/PushLink";
import type { CompetitionMatch } from "~/data/competition";
import { CourtInfo } from "~/components/domain/CourtInfo";
import { MatchStatusBadge, matchStatusLabels } from "~/components/domain/MatchStatusBadge";

export function MatchCard({ tournamentId, match, venue }: { tournamentId: string; match: CompetitionMatch; venue: string }) {
  const finished = match.status === "finished";
  const teams = [
    { team: match.teamA, score: match.scoreA, other: match.scoreB },
    { team: match.teamB, score: match.scoreB, other: match.scoreA },
  ];
  const renderTeam = ({ team, score, other }: typeof teams[number]) => {
    const losing = finished && score !== null && other !== null && score < other;
    return (
      <div key={team.id} className={`flex min-w-0 flex-col items-center justify-center gap-0.5 text-center ${losing ? "text-neutral-muted" : "text-neutral-text"}`}>
        <span className="line-clamp-2 w-full break-words text-heading font-bold leading-5">{team.name}</span>
        <span className="w-full truncate text-caption leading-4">{team.players.join(" ")}</span>
      </div>
    );
  };
  const renderScore = ({ score, other }: typeof teams[number]) => {
    const losing = finished && score !== null && other !== null && score < other;
    return <span className={`self-center text-[28px] font-bold leading-none tabular-nums ${losing ? "text-neutral-muted" : "text-neutral-text"}`}>{score ?? "-"}</span>;
  };

  return (
    <PushLink to={`/tournaments/${encodeURIComponent(tournamentId)}/matches/${encodeURIComponent(match.id)}`} aria-label={`${match.teamA.name} 대 ${match.teamB.name}, ${match.time}, ${matchStatusLabels[match.status]}, 경기 상세`} className="block border-b border-neutral-border px-5 py-5 focus-visible:outline-primary">
      <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-caption leading-5">
        {match.previousCourt !== undefined && <span className="rounded-full border border-[#ff4646] px-1.5 text-[10px] leading-4 text-[#ff4646]">코트 변경</span>}
        <CourtInfo match={match} venue={venue} />
      </p>
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_auto_minmax(0,1fr)_68px] items-stretch gap-2">
        {renderTeam(teams[0])}
        {renderScore(teams[0])}
        {renderScore(teams[1])}
        {renderTeam(teams[1])}
        <div className="flex min-w-0 flex-col items-center justify-center gap-1 border-l border-neutral-border pl-2">
          <span className="text-body tabular-nums">{match.time}</span>
          <MatchStatusBadge status={match.status} />
        </div>
      </div>
    </PushLink>
  );
}
