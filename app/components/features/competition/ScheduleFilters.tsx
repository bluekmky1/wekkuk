import { ChevronUp, SlidersHorizontal } from "lucide-react";
import type { Ref } from "react";
import { Button, ChoiceChip, FilterChip } from "~/components/ui";
import type { CompetitionVenue } from "~/data/competition";
import { formatCompetitionDate } from "~/utils/competition";

type Props = {
  expanded: boolean;
  date: string;
  dates: string[];
  venue: CompetitionVenue;
  venues: CompetitionVenue[];
  court: number;
  courts: number[];
  onDate: (date: string) => void;
  onVenue: (venueId: string) => void;
  onCourt: (court: number) => void;
  onCollapse: () => void;
  onExpand: () => void;
  controlsRef?: Ref<HTMLElement>;
  summaryRef?: Ref<HTMLElement>;
};

export function ScheduleFilters({ expanded, date, dates, venue, venues, court, courts, onDate, onVenue, onCourt, onCollapse, onExpand, controlsRef, summaryRef }: Props) {
  return <>
    {expanded && <section ref={controlsRef} aria-label="경기시간 필터" className="px-5 pt-3">
      <h2 className="mb-2 text-caption text-neutral-subtext">일자</h2>
      <div className="flex flex-wrap gap-2" aria-label="경기 일자">
        {dates.map((value) => <ChoiceChip key={value} selected={date === value} onClick={() => onDate(value)}>{formatCompetitionDate(value).replace(" (", "(")}</ChoiceChip>)}
      </div>
      <h2 className="mb-2 mt-2 text-caption text-neutral-subtext">경기장 · 코트</h2>
      <div className="grid grid-cols-2 gap-2" aria-label="경기장">
        {venues.map((value) => <ChoiceChip key={value.id} selected={venue.id === value.id} onClick={() => onVenue(value.id)}>{value.name}</ChoiceChip>)}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-border pt-3" aria-label="코트">
        {courts.map((value) => <ChoiceChip key={value} selected={court === value} onClick={() => onCourt(value)}>{value}코트{!venue.courts.includes(value) ? " (미운영)" : ""}</ChoiceChip>)}
      </div>
    </section>}
    <section ref={summaryRef} aria-label={expanded ? "경기시간 필터 접기" : "선택한 경기시간 필터"} className="sticky top-[calc(104px+var(--appbar-top-inset))] z-20 flex min-h-[66px] items-center justify-between gap-2 border-b-2 border-neutral-border bg-neutral-white px-5 py-3">
      {expanded ? <div className="flex w-full justify-center"><Button variant="ghost" size="sm" onClick={onCollapse} aria-expanded="true" className="h-9 text-caption text-neutral-subtext">필터 접기<ChevronUp size={16} aria-hidden="true" /></Button></div> : <>
        <div className="min-w-0"><h2 className="truncate text-body font-semibold">{venue.name} · {court}코트</h2><p className="mt-1 text-caption">{formatCompetitionDate(date)}</p></div>
        <FilterChip aria-expanded="false" onClick={onExpand} icon={<SlidersHorizontal size={12} aria-hidden="true" />}>필터</FilterChip>
      </>}
    </section>
  </>;
}
