import { ListToolbar, EmptyState } from "~/components/ui";
import { PlayerResultCard, type PlayerResult } from "~/components/domain/PlayerResultCard";

export function PlayerResults({ results, descending, onSort }: { results: PlayerResult[]; descending: boolean; onSort: () => void }) {
  return <>
    <ListToolbar count={results.length} sortLabel={`대회 일자 ${descending ? "늦은순" : "빠른순"}`} sortAriaLabel={descending ? "대회 일자 빠른순으로 정렬" : "대회 일자 늦은순으로 정렬"} onSort={onSort} className="py-5" />
    {results.length ? <div className="space-y-3">{results.map((result) => <PlayerResultCard key={result.id} result={result} />)}</div> : <EmptyState title="검색 결과가 없어요" description="선수명을 다르게 입력해 보세요." className="min-h-0 flex-1 pb-16" />}
  </>;
}
