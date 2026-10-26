import type { MetaFunction } from "@remix-run/node";
import { useLocation } from "@remix-run/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SearchAppBar, EmptyState, AdBanner } from "~/components/ui";
import { PlayerResults } from "~/components/features/player-search/PlayerResults";
import { RecentSearchItem } from "~/components/domain/RecentSearchItem";
import type { PlayerResult } from "~/components/domain/PlayerResultCard";
import { useBackToHome } from "~/navigation";

export const meta: MetaFunction = () => [{ title: "선수 검색 | 위꾹" }];

type RecentPlayer = { id: string; name: string };
const featuredTournament = "2026 제12회 고양특례시 의회 의장배 중년부 생활체육 배드민턴대회";
const initialRecent: RecentPlayer[] = [1, 2, 3, 4].map((id) => ({ id: `sample-${id}`, name: "마재훈" }));
const playerResults: PlayerResult[] = [
  ...[1, 2, 3, 4, 5].map((id) => ({
    id: `goyang-${id}`,
    tournament: featuredTournament,
    dates: "2026.10.24 (토) ~ 2026.10.25 (일)",
    dateKey: "2026-10-24",
    names: "마재훈 마재혁",
    division: "남복-20대-D1 덕천클럽",
  })),
  { id: "anyang-1", tournament: "2026 안양시 생활체육 배드민턴대회", dates: "2026.11.07 (토) ~ 2026.11.08 (일)", dateKey: "2026-11-07", names: "마재훈 마재혁", division: "남복-20대-D1 덕천클럽" },
  { id: "anyang-2", tournament: "2026 안양시 생활체육 배드민턴대회", dates: "2026.11.07 (토) ~ 2026.11.08 (일)", dateKey: "2026-11-07", names: "마재훈 마재혁", division: "남복-20대-D1 덕천클럽" },
  { id: "north-1", tournament: "2026 경기 북부 배드민턴 오픈대회", dates: "2026.11.14 (토) ~ 2026.11.15 (일)", dateKey: "2026-11-14", names: "마재훈 마재혁", division: "남복-20대-D1 덕천클럽" },
  { id: "suwon-1", tournament: "2026 수원시 배드민턴 연합회장배 대회", dates: "2026.11.21 (토) ~ 2026.11.22 (일)", dateKey: "2026-11-21", names: "마재훈 마재혁", division: "남복-20대-D1 덕천클럽" },
  { id: "ranking-1", tournament: "2026 고양 배드민턴 랭킹전", dates: "2026.11.28 (토) ~ 2026.11.29 (일)", dateKey: "2026-11-28", names: "마재훈 마재혁", division: "남복-20대-D1 덕천클럽" },
];
const storageKey = "wekkuk-recent-player-searches";

export default function PlayerSearchPage() {
  const location = useLocation();
  const goBack = useBackToHome();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get("q") ?? "");
  const [recent, setRecent] = useState<RecentPlayer[]>(initialRecent);
  const [recentLoaded, setRecentLoaded] = useState(false);
  const [descending, setDescending] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecent(parsed.filter((item): item is RecentPlayer =>
            item !== null && typeof item === "object" &&
            typeof item.id === "string" && typeof item.name === "string",
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
  const results = trimmedQuery
    ? playerResults
      .filter((result) => result.names.includes(trimmedQuery))
      .sort((a, b) => descending ? b.dateKey.localeCompare(a.dateKey) : a.dateKey.localeCompare(b.dateKey))
    : [];

  function saveRecent(name: string) {
    setRecent((items) => [
      { id: `search-${name}`, name },
      ...items.filter((item) => item.name !== name),
    ].slice(0, 10));
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedQuery) {
      inputRef.current?.focus();
      return;
    }
    saveRecent(trimmedQuery);
    inputRef.current?.blur();
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-neutral-white">
      <SearchAppBar value={query} onChange={(event) => setQuery(event.target.value)} onSubmit={submitSearch} onBack={goBack} placeholder="선수 검색" label="선수 이름 검색" inputRef={inputRef} />

      {!trimmedQuery ? (
        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
          <div className="mb-4 mt-5 flex items-center justify-between">
            <h1 className="text-body font-semibold text-neutral-subtext">최근 검색</h1>
            <button type="button" onClick={() => setRecent([])} className="text-body text-neutral-muted">전체 삭제</button>
          </div>
          <ul>
            {recent.map((item) => (
              <li key={item.id}><RecentSearchItem label={item.name} kind="player" onSelect={() => { setQuery(item.name); saveRecent(item.name); inputRef.current?.blur(); }} onDelete={() => setRecent((items) => items.filter(({ id }) => id !== item.id))} /></li>
            ))}
          </ul>
          <p className="mt-2 text-center text-body text-neutral-muted">동명 이인이 검색될 수 있습니다.</p>
          <AdBanner className="mt-3" />
        </main>
      ) : results.length > 0 ? (
        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
          <PlayerResults results={results} descending={descending} onSort={() => setDescending((value) => !value)} />
        </main>
      ) : (
        <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 pb-16 text-center">
          <EmptyState title="검색 결과가 없어요" description="선수명을 다르게 입력해 보세요." illustration={<div className="flex h-[100px] w-[100px] items-center justify-center bg-neutral-border px-3 text-body leading-tight">검색 결과 없음<br />이미지</div>} />
        </main>
      )}
    </div>
  );
}
