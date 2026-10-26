import type { CompetitionMatch } from "~/data/competition";

export function CourtInfo({ match, venue }: { match: Pick<CompetitionMatch, "previousCourt" | "previousSequence" | "court" | "sequence">; venue: string }) {
  return <><span>{venue}</span>{match.previousCourt !== undefined && <><del className="text-neutral-muted">{match.previousCourt}코트 {match.previousSequence}경기</del><span aria-hidden="true">→</span></>}<span>{match.court}코트 {match.sequence}경기</span></>;
}
