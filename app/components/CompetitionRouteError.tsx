import { isRouteErrorResponse, useParams, useRouteError } from "@remix-run/react";
import { CompetitionHeader } from "~/components/CompetitionHeader";

export function CompetitionRouteError() {
  const error = useRouteError();
  const { tournamentId } = useParams();
  return <div className="min-h-full bg-neutral-white"><CompetitionHeader title="경기 정보" fallback={tournamentId ? `/tournaments/${encodeURIComponent(tournamentId)}?page=matches` : "/tournaments"} /><main className="px-5 py-20 text-center"><h2 className="text-heading-lg font-bold">{isRouteErrorResponse(error) && error.status === 404 ? "경기 정보를 찾을 수 없어요" : "경기 정보를 불러오지 못했어요"}</h2><p className="mt-3 text-body text-neutral-subtext">대회의 경기 정보에서 다시 선택해 주세요.</p></main></div>;
}
