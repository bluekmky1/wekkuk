import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { MatchCard } from "~/components/MatchCard";
import { DrawList } from "~/components/features/competition/DrawList";
import { ScheduleFilters } from "~/components/features/competition/ScheduleFilters";
import { TabBar, EmptyState } from "~/components/ui";
import { getCompetitionData, type CompetitionData } from "~/data/competition";
import { useRouteQuery } from "~/hooks/useRouteQuery";
import type { TournamentPreview } from "~/types/home";
import { getAppScrollElement, scrollAppTo } from "~/viewport";

const useScrollLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

function ScheduleList({ tournamentId, data }: { tournamentId: string; data: CompetitionData }) {
  const { params, update } = useRouteQuery();
  const date = data.dates.find((value) => value === params.get("date")) ?? data.dates[0];
  const venue = data.venues.find(({ id }) => id === params.get("venue")) ?? data.venues[0];
  const requestedCourt = Number(params.get("court") ?? 1);
  const court = Number.isInteger(requestedCourt) && requestedCourt > 0 && requestedCourt <= 30 ? requestedCourt : 1;
  const expanded = params.get("filters") !== "closed";
  const controlsRef = useRef<HTMLElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const collapsePosition = useRef<{ y: number; height: number } | null>(null);
  const courts = venue.courts.includes(court) ? venue.courts : [...venue.courts, court];
  const matches = data.matches.filter((match) => match.date === date && match.venueId === venue.id && match.court === court);

  const collapseFilters = useCallback(() => {
    collapsePosition.current = {
      y: getAppScrollElement()?.scrollTop ?? 0,
      height: (controlsRef.current?.getBoundingClientRect().height ?? 0) + (summaryRef.current?.getBoundingClientRect().height ?? 0),
    };
    update({ filters: "closed" });
  }, [update]);

  // Only remove controls after they have scrolled away; preserve the list position before paint.
  useScrollLayoutEffect(() => {
    if (!expanded) {
      const position = collapsePosition.current;
      if (position) {
        const height = summaryRef.current?.getBoundingClientRect().height ?? 0;
        scrollAppTo({ top: Math.max(0, position.y - (position.height - height)), behavior: "instant" });
        collapsePosition.current = null;
      }
    }
  }, [expanded]);

  useEffect(() => {
    const scrollElement = getAppScrollElement();
    if (!expanded || !scrollElement) return;
    let collapsed = false;
    const handleScroll = () => {
      const controls = controlsRef.current;
      const summary = summaryRef.current;
      if (collapsed || !controls || !summary || scrollElement.scrollTop <= 0 || controls.offsetHeight === 0 || scrollElement.clientHeight === 0) return;
      const pinnedTop = scrollElement.getBoundingClientRect().top + (Number.parseFloat(getComputedStyle(summary).top) || 0);
      if (controls.getBoundingClientRect().bottom <= pinnedTop + 0.5) {
        collapsed = true;
        collapseFilters();
      }
    };
    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    const observer = new ResizeObserver(handleScroll);
    if (controlsRef.current) observer.observe(controlsRef.current);
    observer.observe(scrollElement);
    handleScroll();
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [collapseFilters, expanded]);

  return <div style={{ overflowAnchor: "none" }}><ScheduleFilters expanded={expanded} controlsRef={controlsRef} summaryRef={summaryRef} date={date} dates={data.dates} venue={venue} venues={data.venues} court={court} courts={courts} onDate={(value) => update({ date: value })} onVenue={(value) => update({ venue: value })} onCourt={(value) => update({ court: String(value) })} onCollapse={collapseFilters} onExpand={() => { scrollAppTo({ top: 0, behavior: "instant" }); update({ filters: null }); }} /><section aria-label="경기 일정" className="pb-6">{matches.map((match) => <MatchCard key={match.id} tournamentId={tournamentId} match={match} venue={venue.name} />)}{matches.length === 0 && <EmptyState title="선택한 조건에 해당하는 경기가 없어요." description="다른 날짜나 경기장·코트를 선택해 주세요." className="py-20" />}</section></div>;
}

export function CompetitionPanel({ tournament }: { tournament: TournamentPreview }) {
  const { params, update } = useRouteQuery();
  const data = useMemo(() => getCompetitionData(tournament), [tournament]);
  const schedule = params.get("view") === "schedule";
  return <><div className="sticky top-[calc(60px+var(--appbar-top-inset))] z-20"><TabBar items={[{ label: "대진표", value: "draw" }, { label: "경기시간", value: "schedule" }, { label: "참가클럽", value: "clubs", disabled: true }, { label: "참가자", value: "players", disabled: true }, { label: "입상자", value: "winners", disabled: true }]} value={schedule ? "schedule" : "draw"} onChange={(value) => { scrollAppTo({ top: 0, behavior: "instant" }); update({ view: value === "draw" ? null : value }); }} label="경기 정보 메뉴" fullWidth /></div>{schedule ? <ScheduleList tournamentId={tournament.id} data={data} /> : <DrawList tournamentId={tournament.id} data={data} params={params} update={update} />}</>;
}
