import { useState } from "react";
import { BottomSheet, FilterChip, SelectOptionList, EmptyState } from "~/components/ui";
import { PushLink } from "~/components/PushLink";
import type { CompetitionData } from "~/data/competition";
import { formatCompetitionDate } from "~/utils/competition";

type DrawFilter = "drawDate" | "event" | "grade";
const filterNames: Record<DrawFilter, string> = { drawDate: "날짜", event: "종목", grade: "등급" };
type UpdateQuery = (values: Record<string, string | null>) => void;

export function DrawList({ tournamentId, data, params, update }: { tournamentId: string; data: CompetitionData; params: URLSearchParams; update: UpdateQuery }) {
  const [sheet, setSheet] = useState<DrawFilter | null>(null);
  const date = params.get("drawDate") ?? "";
  const event = params.get("event") ?? "";
  const grade = params.get("grade") ?? "";
  const divisions = data.divisions.filter((division) => (!date || division.date === date) && (!event || division.event === event) && (!grade || division.grade === grade));
  const options: Record<DrawFilter, { value: string; label: string }[]> = {
    drawDate: data.dates.map((value) => ({ value, label: formatCompetitionDate(value) })),
    event: [...new Set(data.divisions.map((division) => division.event))].map((value) => ({ value, label: value })),
    grade: ["초심", "D", "C", "B", "A"].map((value) => ({ value, label: value })),
  };
  return <><div className="flex gap-2 px-5 py-3" aria-label="대진표 필터">{(["drawDate", "event", "grade"] as const).map((key) => { const value = params.get(key); return <FilterChip key={key} type="button" onClick={() => setSheet(key)} selected={Boolean(value)}>{value ? key === "drawDate" ? formatCompetitionDate(value).slice(5) : value : filterNames[key]}</FilterChip>; })}</div><div className="px-5 pb-8">{divisions.map((division) => <PushLink key={division.id} to={`/tournaments/${encodeURIComponent(tournamentId)}/divisions/${encodeURIComponent(division.id)}`} className="flex min-h-[54px] flex-wrap items-center gap-x-1 gap-y-1 border-t border-neutral-border py-4 text-body first:mt-1"><span className="font-semibold">{division.label}</span><span className="text-caption">{division.matchCount}경기, {division.teamCount}팀</span></PushLink>)}{divisions.length === 0 && <EmptyState title="선택한 조건에 해당하는 대진표가 없어요." className="py-20" />}</div>{sheet && <BottomSheet title={`${filterNames[sheet]} 선택`} onClose={() => setSheet(null)}><SelectOptionList options={[{ value: "", label: `${filterNames[sheet]} 전체` }, ...options[sheet]]} value={params.get(sheet) ?? ""} onChange={(value) => { update({ [sheet]: value }); setSheet(null); }} label={`${filterNames[sheet]} 선택`} /></BottomSheet>}</>;
}
