import type { MetaFunction } from "@remix-run/node";
import { useLocation, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SearchAppBar, EmptyState } from "~/components/ui";
import { RecentSearches, type SearchHistoryItem } from "~/components/features/search/RecentSearches";
import { SearchResults } from "~/components/features/search/SearchResults";
import { tournaments as allTournaments } from "~/data/home";
import { useBackToHome, useScreenScroll } from "~/navigation";

export const meta: MetaFunction = () => [{ title: "대회 검색 | 위꾹" }];

type RecentSearch = SearchHistoryItem;

const regions = ["경기도 전체", "경기도 안양시", "경기도 광명시"];
const tournaments = allTournaments;
const initialRecent: RecentSearch[] = [
  { id: "region-anyang", label: "경기도 안양시", kind: "region" },
  { id: "region-all", label: "경기도 전체", kind: "region" },
  { id: "region-mungyeong", label: "강원도 문경시", kind: "region" },
  ...tournaments.slice(0, 3).map(({ id, title }) => ({ id, label: title, kind: "tournament" as const })),
];
const storageKey = "wekkuk-recent-searches";

export default function SearchPage() {
  const location = useLocation();
  const goBack = useBackToHome();
  const screenScroll = useScreenScroll();
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get("q") ?? "";
  const [recent, setRecent] = useState<RecentSearch[]>(initialRecent);
  const [recentLoaded, setRecentLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecent(parsed.filter((item): item is RecentSearch =>
            item !== null && typeof item === "object" &&
            typeof item.id === "string" && typeof item.label === "string" &&
            ["region", "tournament", "query"].includes(item.kind),
          ));
        }
      }
    } catch {
      // Keep the example searches if browser storage is unavailable.
    }
    setRecentLoaded(true);
  }, []);

  useEffect(() => {
    if (!recentLoaded) return;
    try { localStorage.setItem(storageKey, JSON.stringify(recent)); } catch { /* Storage is optional. */ }
  }, [recent, recentLoaded]);

  const trimmedQuery = query.trim();
  const matchingRegions = trimmedQuery ? regions.filter((region) => region.includes(trimmedQuery)) : [];
  const matchingTournaments = trimmedQuery
    ? tournaments.filter(({ title, location }) => title.includes(trimmedQuery) || location.includes(trimmedQuery))
    : [];
  const hasResults = matchingRegions.length > 0 || matchingTournaments.length > 0;

  function setQuery(value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value);
    else next.delete("q");
    setSearchParams(next, { replace: true, preventScrollReset: true, state: location.state });
  }

  function saveRecent(item: RecentSearch) {
    setRecent((items) => [item, ...items.filter((previous) => previous.id !== item.id)].slice(0, 12));
  }

  function selectSearch(item: RecentSearch) {
    setQuery(item.label);
    saveRecent(item);
    inputRef.current?.blur();
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedQuery) {
      inputRef.current?.focus();
      return;
    }
    saveRecent({ id: `query-${trimmedQuery}`, label: trimmedQuery, kind: "query" });
    inputRef.current?.blur();
  }

  return (
    <div className="search-page flex h-full flex-col overflow-hidden bg-neutral-white">
      <SearchAppBar value={query} onChange={(event) => setQuery(event.target.value)} onSubmit={submitSearch} onBack={goBack} placeholder="대회명 또는 지역 검색" label="대회명 또는 지역 검색" inputRef={inputRef} />

      {!trimmedQuery ? (
        <main {...screenScroll} className="flex-1 overflow-y-auto px-5 pb-10">
          <RecentSearches items={recent} onSelect={selectSearch} onOpenTournament={saveRecent} onDelete={(id) => setRecent((items) => items.filter((item) => item.id !== id))} onClear={() => setRecent([])} tournaments={allTournaments} />
        </main>
      ) : hasResults ? (
        <main {...screenScroll} className="flex-1 overflow-y-auto px-5 pb-10">
          <SearchResults regions={matchingRegions} tournaments={matchingTournaments} onSelectRegion={(region) => selectSearch({ id: `region-${region}`, label: region, kind: "region" })} onSelectTournament={(tournament) => saveRecent({ id: tournament.id, label: tournament.title, kind: "tournament" })} />
        </main>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-5 pb-16 text-center">
          <EmptyState title="검색 결과가 없어요" description="대회명이나 지역을 다르게 입력해 보세요." illustration={<div className="flex h-[100px] w-[100px] items-center justify-center bg-neutral-border px-3 text-body leading-tight">검색 결과 없음<br />이미지</div>} />
        </div>
      )}
    </div>
  );
}
