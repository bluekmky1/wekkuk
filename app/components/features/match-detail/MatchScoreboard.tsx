import type { CompetitionDivision, CompetitionMatch, CompetitionVenue } from "~/data/competition";
import { CourtInfo } from "~/components/domain/CourtInfo";
import { MatchStatusBadge } from "~/components/domain/MatchStatusBadge";

export function MatchScoreboard({ match, division, venue }: { match: CompetitionMatch; division: CompetitionDivision; venue: CompetitionVenue }) {
  const finished = match.status === "finished";
  return <section aria-label="경기 점수" className="px-5 text-center">
    <MatchStatusBadge monochrome status={match.status} label={finished ? "경기종료" : match.status === "live" ? "경기중" : "경기예정"} />
    <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
      {<div><h2 className="break-words text-heading font-bold">{match.teamA.name}</h2><ul className="mt-1 space-y-1 text-caption">{match.teamA.players.map((player) => <li key={player}>{player}</li>)}</ul></div>}
      <div className="flex items-center justify-center gap-2"><span className={`text-[36px] font-bold leading-none tabular-nums ${finished && match.scoreA !== null && match.scoreB !== null && match.scoreA < match.scoreB ? "text-neutral-muted" : ""}`}>{match.scoreA ?? "-"}</span><span className="text-body">vs</span><span className={`text-[36px] font-bold leading-none tabular-nums ${finished && match.scoreB !== null && match.scoreA !== null && match.scoreB < match.scoreA ? "text-neutral-muted" : ""}`}>{match.scoreB ?? "-"}</span></div>
      <div><h2 className="break-words text-heading font-bold">{match.teamB.name}</h2><ul className="mt-1 space-y-1 text-caption">{match.teamB.players.map((player) => <li key={player}>{player}</li>)}</ul></div>
    </div>
    <h2 className="mt-5 text-body font-semibold">{division.event}-{division.age}-{division.grade}-예선{match.group}조</h2>
    <p className="mt-2 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-caption leading-5">{match.previousCourt !== undefined && <span className="rounded-full border border-[#ff4646] px-1.5 text-[10px] leading-4 text-[#ff4646]">코트 변경</span>}<CourtInfo match={match} venue={venue.name} /></p>
  </section>;
}
