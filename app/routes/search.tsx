import { SearchEmptyIllustration } from "~/components/ui/SearchEmptyIllustration";
import { normalizeRegion, regions as regionOptions } from "~/data/regions";
import { useConfirmDelete } from "~/components/ui/ConfirmDeleteDialog";
import type { MetaFunction } from "@remix-run/node";
import { useLocation, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SearchAppBar, EmptyState, Toast } from "~/components/ui";
import { RecentSearches, type SearchHistoryItem } from "~/components/features/search/RecentSearches";
import { SearchResults } from "~/components/features/search/SearchResults";
import { tournaments as allTournaments } from "~/data/home";
import { useBackToHome, useScreenScroll } from "~/navigation";

export const meta: MetaFunction = () => [{ title: "대회 검색 | 위꾹" }];

type RecentSearch = SearchHistoryItem;

const regions = regionOptions.flatMap(region => [`${region.name} 전체`, ...region.cities.map(city => `${region.name} ${city}`)]);
const tournaments = allTournaments;
const initialRecent: RecentSearch[] = [
  { id: "region-anyang", label: "경기 가평", kind: "region" },
  { id: "region-all", label: "경기도 전체", kind: "region" },
  { id: "region-mungyeong", label: "경기 군포", kind: "region" },
  ...tournaments.slice(0, 3).map(({ id, title }) => ({ id, label: title, kind: "tournament" as const })),
];
const storageKey = "wekkuk-recent-searches-v2";

export default function SearchPage() {
  const { requestDelete, dialog } = useConfirmDelete();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  useEffect(() => { if (!message) return; const timer = window.setTimeout(() => setMessage(""), 3000); return () => window.clearTimeout(timer); }, [message]);
  const goBack = useBackToHome();
  const screenScroll = useScreenScroll();

  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get("q") ?? "");
  useEffect(() => { setQuery(new URLSearchParams(location.search).get("q") ?? ""); }, [location.search]);
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


  function saveRecent(item: RecentSearch) {
    const next = [item, ...recent.filter((previous) => previous.id !== item.id)].slice(0, 12);
    setRecent(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* In-memory search still works. */ }
  }

  function selectSearch(item: RecentSearch) {
    if (item.kind === "tournament" && !allTournaments.some(tournament => tournament.id === item.id)) { setMessage("대회를 찾을 수 없어요."); return; }
    saveRecent(item);
    inputRef.current?.blur();
    const destination = item.kind === "region" ? `/tournaments?${new URLSearchParams({ region: normalizeRegion(item.label) })}` : item.kind === "tournament" ? `/tournaments/${encodeURIComponent(item.id)}` : `/tournaments?${new URLSearchParams({ q: item.label, search: "1" })}`;
    navigate(destination, { state: { returnTo: `${location.pathname}${query ? `?${new URLSearchParams({ q: query })}` : ""}` } });
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedQuery) {
      inputRef.current?.focus();
      return;
    }
    selectSearch({ id: `query-${trimmedQuery}`, label: trimmedQuery, kind: "query" });
    inputRef.current?.blur();
  }

  return (
    <div className="search-page flex h-full flex-col overflow-hidden bg-neutral-white">
      {dialog}
      <Toast message={message} onClose={() => setMessage("")} />
      <SearchAppBar value={query} onChange={(event) => setQuery(event.target.value)} onSubmit={submitSearch} onBack={goBack} placeholder="대회명 또는 지역 검색" label="대회명 또는 지역 검색" inputRef={inputRef} />

      {!trimmedQuery ? (
        <main {...screenScroll} className="flex-1 overflow-y-auto px-5 pb-10">
          <RecentSearches items={recent} onSelect={selectSearch} onOpenTournament={saveRecent} onDelete={(id) => setRecent((items) => items.filter((item) => item.id !== id))} onClear={() => requestDelete(() => setRecent([]), true)} tournaments={allTournaments} />
        </main>
      ) : hasResults ? (
        <main {...screenScroll} className="flex-1 overflow-y-auto px-5 pb-10">
          <SearchResults regions={matchingRegions} tournaments={matchingTournaments} onSelectRegion={(region) => selectSearch({ id: `region-${region}`, label: region, kind: "region" })} onSelectTournament={(tournament) => saveRecent({ id: tournament.id, label: tournament.title, kind: "tournament" })} />
        </main>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-5 pb-16 text-center">
          <EmptyState title="검색 결과가 없어요" description="대회명이나 지역을 다르게 입력해 보세요." illustration={<SearchEmptyIllustration />} />
        </div>
      )}
    </div>
  );
}
