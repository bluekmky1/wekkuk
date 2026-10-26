import { EmptyState, ListToolbar } from "~/components/ui";
import { TournamentListItem } from "~/components/domain/TournamentListItem";
import type { TournamentPreview } from "~/types/home";

export function TournamentResults({ results, descending, onSort, showPromotion }: { results: TournamentPreview[]; descending: boolean; onSort: () => void; showPromotion: boolean }) {
  return <>
    <ListToolbar count={results.length} sortLabel={`대회 일자 ${descending ? "늦은순" : "빠른순"}`} sortAriaLabel={descending ? "대회 일자 빠른순으로 정렬" : "대회 일자 늦은순으로 정렬"} onSort={onSort} className="py-5" />
    {results.length ? <div className="pb-6">{results.map((tournament) => <TournamentListItem key={tournament.id} tournament={tournament} showPromotion={showPromotion} />)}</div> : <EmptyState title="조건에 일치하는 대회 없어요" description="조건을 다르게 입력해 보세요." illustration={<div className="flex h-[100px] w-[100px] items-center justify-center bg-neutral-border px-3 text-body leading-tight">검색 결과 없음<br />이미지</div>} className="min-h-[min(480px,65vh)] pb-8" />}
  </>;
}
