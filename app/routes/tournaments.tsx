import { RegionFilter } from "~/components/domain/RegionFilter";
import { matchesRegion, regionLabel } from "~/data/regions";
import type { MetaFunction } from "@remix-run/node";
import { useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import { CalendarDays, ListFilter, MapPin, Search } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AppBar, BottomSheet, FilterChip, SearchInput, SelectOptionList } from "~/components/ui";
import { TournamentResults } from "~/components/features/tournament-list/TournamentResults";
import { tournaments } from "~/data/home";
import { useBackToHome, useScreenScroll } from "~/navigation";

export const meta: MetaFunction = () => [{ title: "대회 리스트 | 위꾹" }];

const months = [10, 11, 12] as const;
type FilterKey = "region" | "month" | "type" | "status";
const filterOptions = {
  region: [{ value: "", label: "지역 전체" }, ...["고양", "안양", "수원", "광명"].map(value => ({ value, label: `경기 ${value}` }))],
  month: [{ value: "", label: "개최 월 전체" }, ...months.map(value => ({ value: String(value), label: `${value}월` }))],
  type: [{ value: "", label: "대회 유형 전체" }, ...["승급대회", "전국대회", "시구군대회", "친선대회"].map(value => ({ value, label: value }))],
  status: [{ value: "", label: "진행/예정" }, { value: "종료", label: "종료" }],
};
const filterTitles = { region: "지역", month: "개최 월", type: "대회 유형", status: "진행 상태" };

export default function TournamentsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const seededSearch = useRef(false);
  const pendingSearch = useRef<string | null>(null);
  const previousSearch = useRef<string | null>(null);
  const backToHome = useBackToHome();
  const [searchParams, setSearchParams] = useSearchParams();
  const screenScroll = useScreenScroll();
  const month = months.find((value) => String(value) === searchParams.get("month"));
  const region = searchParams.get("region") ?? "";
  const type = searchParams.get("type") ?? "";
  const status = searchParams.get("status") ?? "";
  const searchMode = searchParams.get("search") === "1";
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  useEffect(() => { setQuery(searchMode ? urlQuery : ""); }, [urlQuery, searchMode]);
  useEffect(() => {
    if (!searchMode && pendingSearch.current !== null) {
      const search = pendingSearch.current;
      pendingSearch.current = null;
      navigate({ pathname: location.pathname, search }, { state: { ...location.state, tournamentSearch: true }, preventScrollReset: true });
      return;
    }
    // A direct/search-result entry also needs a closed-list history entry below it.
    if (searchMode && !location.state?.tournamentSearch && !seededSearch.current) {
      seededSearch.current = true;
      pendingSearch.current = location.search;
      const closed = new URLSearchParams(location.search);
      closed.delete("search"); closed.delete("q");
      navigate({ pathname: location.pathname, search: closed.toString() }, { replace: true, state: location.state, preventScrollReset: true });
      return;
    }
    if (searchMode) {
      previousSearch.current = location.search;
    } else if (previousSearch.current !== null) {
      // Retain filters changed while searching when either close or browser Back is used.
      const closed = new URLSearchParams(previousSearch.current);
      previousSearch.current = null;
      closed.delete("search"); closed.delete("q");
      setQuery("");
      if (closed.toString() !== new URLSearchParams(location.search).toString()) {
        navigate({ pathname: location.pathname, search: closed.toString() }, { replace: true, state: location.state, preventScrollReset: true });
      }
    }
  }, [searchMode, location.pathname, location.search, location.state, navigate]);
  useEffect(() => {
    if (searchMode) inputRef.current?.focus();
  }, [searchMode]);
  const descending = searchParams.get("sort") === "desc";

  const results = tournaments
    .filter((tournament) => !month || tournament.dates.includes(`2026.${String(month).padStart(2, "0")}.`))
    .filter((tournament) => !region || matchesRegion(tournament.location, region))
    .filter((tournament) => !type || tournament.type === type)
    .filter((tournament) => status === "종료" ? tournament.status === "종료" : tournament.status !== "종료")
    .filter((tournament) => !query.trim() || query.trim().split(/\s+/).every(word => `${tournament.title} ${tournament.location}`.toLocaleLowerCase().includes(word.toLocaleLowerCase())))
    .sort((a, b) => descending ? b.dates.localeCompare(a.dates) : a.dates.localeCompare(b.dates));

  function updateFilters(values: Record<string, string>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(values)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setSearchParams(next, { replace: true, preventScrollReset: true, state: location.state });
  }

  function openSearch() {
    const next = new URLSearchParams(searchParams);
    next.set("search", "1");
    navigate({ pathname: location.pathname, search: next.toString() }, { state: { ...location.state, tournamentSearch: true }, preventScrollReset: true });
  }

  function goBack() {
    if (searchMode) {
      inputRef.current?.blur();
      if (location.state?.tournamentSearch) navigate(-1);
      else { setQuery(""); updateFilters({ search: "", q: "" }); }
      return;
    }
    backToHome();
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateFilters({ q: query });
    (event.currentTarget.elements.namedItem("tournament-query") as HTMLInputElement | null)?.blur();
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-neutral-white">
      <form onSubmit={submitSearch} role={searchMode ? "search" : undefined} className="shrink-0">
        <AppBar height={58} onBack={goBack} backVariant={searchMode ? "close" : "back"} title={!searchMode && !query ? "대회 리스트" : undefined} center={searchMode || query ? <SearchInput ref={inputRef} name="tournament-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="대회명을 검색하세요" label="대회명 검색" className="text-heading-lg font-semibold" /> : undefined} actions={<button type={searchMode ? "submit" : "button"} onClick={searchMode ? undefined : openSearch} aria-label={searchMode ? "검색" : "대회명 검색 열기"}><Search size={24} strokeWidth={2.4} aria-hidden="true" /></button>} />
      </form>

      <div className="flex h-[58px] shrink-0 items-center gap-2 overflow-x-auto border-b border-neutral-border px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="대회 필터">
        <FilterChip className="focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-text focus-visible:ring-offset-2" icon={<MapPin size={16} aria-hidden="true" />} selected={Boolean(region)} onClick={() => setActiveFilter("region")}>{regionLabel(region)}</FilterChip>
        <FilterChip className="focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-text focus-visible:ring-offset-2" icon={<CalendarDays size={16} aria-hidden="true" />} selected={Boolean(month)} onClick={() => setActiveFilter("month")}>{month ? `${month}월` : "개최 월"}</FilterChip>
        <FilterChip className="focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-text focus-visible:ring-offset-2" icon={<ListFilter size={16} aria-hidden="true" />} selected={Boolean(type)} onClick={() => setActiveFilter("type")}>{type || "대회 유형"}</FilterChip>
        <FilterChip className="focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-text focus-visible:ring-offset-2" selected={Boolean(status)} onClick={() => setActiveFilter("status")}>{status || "진행/예정"}</FilterChip>
      </div>

      {activeFilter && <BottomSheet title={filterTitles[activeFilter]} onClose={() => setActiveFilter(null)}>{activeFilter === "region" ? <RegionFilter value={region} onChange={(value) => { updateFilters({ region: value }); setActiveFilter(null); }} /> : <SelectOptionList label={filterTitles[activeFilter]} options={filterOptions[activeFilter]} value={searchParams.get(activeFilter) ?? ""} onChange={(value) => { updateFilters({ [activeFilter]: value }); setActiveFilter(null); }} />}</BottomSheet>}
      <main {...screenScroll} className="min-h-0 flex-1 overflow-y-auto px-5">
        <TournamentResults results={results} descending={descending} onSort={() => updateFilters({ sort: descending ? "" : "desc" })} showPromotion={!searchMode && !query.trim()} />
      </main>
    </div>
  );
}
