import { Badge } from "~/components/ui/ListPrimitives";
import { PushLink } from "~/components/PushLink";
import type { CompetitionMatch } from "~/data/competition";
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
      <div key={team.id} className={`flex min-w-[64px] flex-col items-center justify-center gap-1 text-center ${losing ? "text-neutral-muted" : "text-neutral-text"}`}>
        <span className="line-clamp-2 w-full break-words text-heading font-bold leading-5">{team.name}</span>
        <span className="flex w-full flex-col text-caption leading-4">{team.players.map((player, index) => <span key={`${player}-${index}`} className="break-words">{player}</span>)}</span>
      </div>
    );
  };
  const renderScore = ({ score, other }: typeof teams[number]) => {
    const losing = finished && score !== null && other !== null && score < other;
    return <span className={`min-w-[36px] self-center text-center text-[28px] font-bold leading-none tabular-nums ${losing ? "text-neutral-muted" : "text-neutral-text"}`}>{score ?? "-"}</span>;
  };

  return (
    <PushLink to={`/tournaments/${encodeURIComponent(tournamentId)}/matches/${encodeURIComponent(match.id)}`} aria-label={`${match.teamA.name} 대 ${match.teamB.name}, ${match.time}, ${matchStatusLabels[match.status]}, 경기 상세`} className="match-card block border-b border-neutral-border px-5 py-5 focus-visible:outline-primary">
      <p className="flex min-w-0 items-center gap-1.5 text-caption leading-5">
        {match.previousCourt !== undefined && <Badge tone="danger">코트 변경</Badge>}
        <span className="min-w-0 truncate text-neutral-subtext" title={venue}>{venue}</span>
        <span className="shrink-0 whitespace-nowrap text-neutral-subtext">{match.court}코트 {match.sequence}경기</span>
        <span className="shrink-0 whitespace-nowrap text-neutral-subtext tabular-nums">· {match.time}</span>
      </p>
      <div className="match-card-layout mt-3 grid items-stretch gap-2">
        {renderTeam(teams[0])}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="grid grid-cols-[36px_36px] gap-2" aria-label="경기 점수">{renderScore(teams[0])}{renderScore(teams[1])}</div>
          <MatchStatusBadge status={match.status} />
        </div>
        {renderTeam(teams[1])}
      </div>
    </PushLink>
  );
}
