import { SearchEmptyIllustration } from "~/components/ui/SearchEmptyIllustration";
import { useConfirmDelete } from "~/components/ui/ConfirmDeleteDialog";
import type { MetaFunction } from "@remix-run/node";
import { useLocation } from "@remix-run/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SearchAppBar, EmptyState, AdBanner, Toast } from "~/components/ui";
import { PlayerResults } from "~/components/features/player-search/PlayerResults";
import { RecentSearchItem } from "~/components/domain/RecentSearchItem";
import type { PlayerResult } from "~/components/domain/PlayerResultCard";
import { useBackToHome } from "~/navigation";

export const meta: MetaFunction = () => [{ title: "선수 검색 | 위꾹" }];

import { tournaments } from "~/data/home";
import { demoPlayerNames, getCompetitionData } from "~/data/competition";

type RecentPlayer = { id: string; name: string };
const initialRecent: RecentPlayer[] = demoPlayerNames.slice(0, 6).map((name) => ({ id: `sample-${name}`, name }));
const playerResults: PlayerResult[] = tournaments.flatMap((tournament) => {
  const data = getCompetitionData(tournament);
  return data.teams.map((team) => {
    const match = data.matches.find(item => item.teamA.id === team.id || item.teamB.id === team.id)!;
    const division = data.divisions.find(item => item.id === match.divisionId)!;
    return {
      id: `${tournament.id}:${division.id}:${team.id}`,
      tournament: tournament.title, dates: tournament.dates, dateKey: division.date,
      names: team.players.join(" · "), division: `${division.label} · ${team.name}`,
    };
  });
});
const storageKey = "wekkuk-recent-player-searches-v2";

export default function PlayerSearchPage() {
  const { requestDelete, dialog } = useConfirmDelete();
  const location = useLocation();
  const goBack = useBackToHome();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get("q") ?? "");
  const [recent, setRecent] = useState<RecentPlayer[]>(initialRecent);
  const [recentLoaded, setRecentLoaded] = useState(false);
  const [toast, setToast] = useState(0);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(0), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);
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
      {dialog}
      <Toast message={toast ? "선수 상세는 준비 중이에요." : ""} onClose={() => setToast(0)} />
      <SearchAppBar value={query} onChange={(event) => setQuery(event.target.value)} onSubmit={submitSearch} onBack={goBack} placeholder="선수 검색" label="선수 이름 검색" inputRef={inputRef} />

      {!trimmedQuery ? (
        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
          <div className="mb-4 mt-5 flex items-center justify-between">
            <h1 className="text-body font-semibold text-neutral-subtext">최근 검색</h1>
            <button type="button" onClick={() => requestDelete(() => setRecent([]), true)} className="text-body text-neutral-muted">전체 삭제</button>
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
          <PlayerResults onSelect={() => setToast((value) => value + 1)} results={results} descending={descending} onSort={() => setDescending((value) => !value)} />
        </main>
      ) : (
        <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 pb-16 text-center">
          <EmptyState title="검색 결과가 없어요" description="선수명을 다르게 입력해 보세요." illustration={<SearchEmptyIllustration />} />
        </main>
      )}
    </div>
  );
}
