import type { MetaFunction } from "@remix-run/node";
import { useLocation, useSearchParams } from "@remix-run/react";
import { CalendarDays, ChevronDown, ListFilter, MapPin, Search } from "lucide-react";
import { type FormEvent } from "react";
import { AppBar, FilterChip, SearchInput } from "~/components/ui";
import { TournamentResults } from "~/components/features/tournament-list/TournamentResults";
import { tournaments } from "~/data/home";
import type { TournamentPreview } from "~/types/home";
import { useBackToHome, useScreenScroll } from "~/navigation";

export const meta: MetaFunction = () => [{ title: "대회 리스트 | 위꾹" }];

const months = [10, 11, 12] as const;
type Month = TournamentPreview["month"];

export default function TournamentsPage() {
  const location = useLocation();
  const backToHome = useBackToHome();
  const [searchParams, setSearchParams] = useSearchParams();
  const screenScroll = useScreenScroll();
  const month = months.find((value) => String(value) === searchParams.get("month"));
  const region = searchParams.get("region") ?? "";
  const type = searchParams.get("type") ?? "";
  const status = searchParams.get("status") ?? "";
  const searchMode = searchParams.get("search") === "1";
  const query = searchParams.get("q") ?? "";
  const descending = searchParams.get("sort") === "desc";

  const results = tournaments
    .filter((tournament) => !month || tournament.month === month)
    .filter((tournament) => !region || tournament.location.includes(region))
    .filter((tournament) => !type || tournament.type === type)
    .filter(() => !status || status === "예정")
    .filter((tournament) => !query.trim() || `${tournament.title} ${tournament.location}`.includes(query.trim()))
    .sort((a, b) => descending ? b.dates.localeCompare(a.dates) : a.dates.localeCompare(b.dates));

  function updateFilters(values: Record<string, string>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(values)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setSearchParams(next, { replace: true, preventScrollReset: true, state: location.state });
  }

  function goBack() {
    if (searchMode) {
      updateFilters({ search: "", q: "" });
      return;
    }
    backToHome();
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    (event.currentTarget.elements.namedItem("tournament-query") as HTMLInputElement | null)?.blur();
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-neutral-white">
      <form onSubmit={submitSearch} role={searchMode ? "search" : undefined} className="shrink-0">
        <AppBar height={58} onBack={goBack} title={!searchMode ? "대회 리스트" : undefined} center={searchMode ? <SearchInput name="tournament-query" value={query} onChange={(event) => updateFilters({ q: event.target.value })} placeholder="대회명을 검색하세요" label="대회명 검색" className="text-heading-lg font-semibold" /> : undefined} actions={<button type={searchMode ? "submit" : "button"} onClick={searchMode ? undefined : () => updateFilters({ search: "1" })} aria-label={searchMode ? "검색" : "대회명 검색 열기"}><Search size={25} strokeWidth={2.4} aria-hidden="true" /></button>} />
      </form>

      <div className="flex h-[58px] shrink-0 items-center gap-2 overflow-x-auto border-b border-neutral-border px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="대회 필터">
        <div className="relative h-9 shrink-0 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2">
          <FilterChip tabIndex={-1} aria-hidden="true" icon={<MapPin size={16} strokeWidth={2} aria-hidden="true" />} selected={Boolean(region)}>{region ? `경기 ${region}` : "지역 전체"}</FilterChip>
          <select aria-label="지역" value={region} onChange={(event) => updateFilters({ region: event.target.value })} className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
            <option value="">지역 전체</option><option value="고양">경기 고양</option><option value="안양">경기 안양</option><option value="수원">경기 수원</option><option value="광명">경기 광명</option>
          </select>
        </div>
        <div className="relative h-9 shrink-0 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2">
          <FilterChip tabIndex={-1} aria-hidden="true" icon={<CalendarDays size={16} strokeWidth={2} aria-hidden="true" />} selected={Boolean(month)}>{month ? `${month}월` : "개최 월"}</FilterChip>
          <select aria-label="개최 월" value={month ?? ""} onChange={(event) => updateFilters({ month: event.target.value })} className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
            <option value="">개최 월 전체</option>{months.map((value: Month) => <option key={value} value={value}>{value}월</option>)}
          </select>
        </div>
        <div className="relative h-9 shrink-0 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2">
          <FilterChip tabIndex={-1} aria-hidden="true" icon={<ListFilter size={16} strokeWidth={2} aria-hidden="true" />} selected={Boolean(type)}>{type || "대회 유형"}</FilterChip>
          <select aria-label="대회 유형" value={type} onChange={(event) => updateFilters({ type: event.target.value })} className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
            <option value="">대회 유형 전체</option><option value="생활체육">생활체육</option><option value="오픈">오픈</option><option value="랭킹전">랭킹전</option>
          </select>
        </div>
        <div className="relative h-9 shrink-0 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2">
          <FilterChip tabIndex={-1} aria-hidden="true" icon={<ChevronDown size={16} strokeWidth={2} aria-hidden="true" />} selected={Boolean(status)}>{status || "진행/예정"}</FilterChip>
          <select aria-label="진행 상태" value={status} onChange={(event) => updateFilters({ status: event.target.value })} className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
            <option value="">진행/예정</option><option value="예정">예정</option><option value="진행">진행</option><option value="종료">종료</option>
          </select>
        </div>
      </div>

      <main {...screenScroll} className="min-h-0 flex-1 overflow-y-auto px-5">
        <TournamentResults results={results} descending={descending} onSort={() => updateFilters({ sort: descending ? "" : "desc" })} showPromotion={!searchMode && !query.trim()} />
      </main>
    </div>
  );
}
