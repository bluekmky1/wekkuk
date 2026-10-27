import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CompetitionHeader } from "~/components/CompetitionHeader";
import { MatchCard } from "~/components/MatchCard";
import { getCompetitionData } from "~/data/competition";
import { findTournament } from "~/data/home";
import { useRouteQuery } from "~/hooks/useRouteQuery";
import { getStandings } from "~/utils/competition";
import { StandingsTable } from "~/components/features/division/StandingsTable";
import { HeadToHeadTable } from "~/components/features/division/HeadToHeadTable";
import { ChipGroup, EmptyState, SectionHeader, StickyHeader, TabBar } from "~/components/ui";
import { scrollAppTo } from "~/viewport";

export { CompetitionRouteError as ErrorBoundary } from "~/components/CompetitionRouteError";

export function clientLoader({ params }: LoaderFunctionArgs) {
  const tournament = findTournament(params.tournamentId);
  if (!tournament) throw new Response("대회를 찾을 수 없어요", { status: 404 });
  const data = getCompetitionData(tournament);
  const division = data.divisions.find(({ id }) => id === params.divisionId);
  if (!division) throw new Response("부문을 찾을 수 없어요", { status: 404 });
  return ({ tournament, division, teams: data.teams, venues: data.venues, matches: data.matches.filter((match) => match.divisionId === division.id) });
}

export const meta: MetaFunction<typeof clientLoader> = ({ data }) => [{ title: `${data?.division.label ?? "대진표"} | 위꾹` }];

export default function DivisionPage() {
  const { tournament, division, teams, venues, matches } = useLoaderData<typeof clientLoader>();
  const { params, update } = useRouteQuery();
  const final = params.get("round") === "final";
  const group = params.get("group") === "2" ? 2 : 1;
  const groupTeamIds = new Set(matches.filter(match => match.group === group).flatMap(match => [match.teamA.id, match.teamB.id]));
  const groupTeams = teams.filter(team => groupTeamIds.has(team.id));
  const groupMatches = matches.filter((match) => match.group === group);
  const standings = getStandings(groupTeams, groupMatches);

  return (
    <div className="min-h-full bg-neutral-white">
      <StickyHeader>
        <CompetitionHeader title={division.label} fallback={`/tournaments/${tournament.id}?page=matches`} />
        <TabBar label="대진표 단계" items={[{ label: "예선", value: "preliminary" }, { label: "본선", value: "final" }]} value={final ? "final" : "preliminary"} onChange={(value) => { update({ round: value === "final" ? "final" : null }); scrollAppTo({ top: 0, behavior: "instant" }); }} className="h-12 [&>button]:text-heading" />
        {!final && <ChipGroup label="예선 조 선택" items={[1, 2].map((value) => ({ value, label: `${value}조` }))} value={group} onChange={(value) => update({ group: value === 1 ? null : "2" })} className="bg-neutral-white px-5 py-3" />}
      </StickyHeader>
      <main>
        {final ? <EmptyState title="본선 대진표가 아직 등록되지 않았어요" description="본선 대진이 확정되면 확인할 수 있어요." className="py-24" /> : <>
          <section aria-labelledby="standings-heading">
            <SectionHeader id="standings-heading" title="순위" className="px-5 pb-3 pt-2" />
            <StandingsTable rows={standings} caption={`${division.label} 예선 ${group}조 순위`} />
          </section>
          <section aria-labelledby="head-to-head-heading" className="border-t-4 border-neutral-border pt-8"><HeadToHeadTable teams={groupTeams} matches={groupMatches} group={group} /></section>
          <section aria-labelledby="division-schedule-heading" className="pb-6 pt-8"><SectionHeader id="division-schedule-heading" title="경기 일정" className="border-b border-neutral-border px-5 pb-5" />{groupMatches.map((match) => <MatchCard key={match.id} tournamentId={tournament.id} match={match} venue={venues.find(({ id }) => id === match.venueId)?.name ?? "경기장"} />)}{groupMatches.length === 0 && <EmptyState title="등록된 경기 일정이 없어요." />}</section>
        </>}
      </main>
    </div>
  );
}
