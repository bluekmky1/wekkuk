import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import { QuestionItem } from "~/components/features/tournament-detail/QuestionItem";
import { AppBar, ChipGroup, EmptyState, StickyHeader } from "~/components/ui";
import { findTournament } from "~/data/home";
import { questionCategories } from "~/data/tournament-details";
import { useRouteQuery } from "~/hooks/useRouteQuery";
import { useTournamentQuestions } from "~/hooks/useTournamentQuestions";
import { useBackNavigation } from "~/navigation";

export function clientLoader({ params }: LoaderFunctionArgs) {
  const tournament = findTournament(params.tournamentId);
  if (!tournament) throw new Response("대회를 찾을 수 없어요", { status: 404 });
  return ({ tournament });
}
export const meta: MetaFunction = () => [{ title: "Q&A | 위꾹" }];

export default function TournamentQuestionsPage() {
  const { tournament } = useLoaderData<typeof clientLoader>();
  const { questions } = useTournamentQuestions(tournament.id);
  const { params, update } = useRouteQuery();
  const goBack = useBackNavigation(`/tournaments/${encodeURIComponent(tournament.id)}`);
  const category = questionCategories.find((item) => item === params.get("category")) ?? "전체";
  const hidePrivate = params.get("hidePrivate") === "1";
  const visible = questions.filter((item) => (!hidePrivate || !item.private) && (category === "전체" || item.category === (category === "공지사항" ? "공지" : category)));

  return <div className="flex min-h-full flex-col bg-neutral-white">
    <StickyHeader>
      <AppBar title={`Q&A (${questions.length})`} onBack={goBack} />
      <ChipGroup label="Q&A 분류" items={questionCategories.map((value) => ({ value, label: value }))} value={category} onChange={(value) => update({ category: value === "전체" ? null : value })} className="flex-nowrap overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" />
      <div className="border-b-2 border-t border-neutral-border px-5 py-2.5"><label className="flex w-fit items-center gap-1.5 text-caption text-neutral-subtext"><input type="checkbox" checked={hidePrivate} onChange={(event) => update({ hidePrivate: event.target.checked ? "1" : null })} className="h-3.5 w-3.5 accent-neutral-text" />비밀글 제외</label></div>
    </StickyHeader>
    <main className="flex-1">
      {visible.map((question) => <QuestionItem key={question.id} question={question} to={`/tournaments/${encodeURIComponent(tournament.id)}/questions/${encodeURIComponent(question.id)}`} className="block border-b border-neutral-border px-5 last:border-0" />)}
      {visible.length === 0 && <EmptyState title="해당하는 문의가 없어요." description="다른 분류나 비밀글 설정을 확인해 주세요." />}
    </main>
  </div>;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const goBack = useBackNavigation("/tournaments");
  return <div className="min-h-full bg-neutral-white"><AppBar title="Q&A" onBack={goBack} /><EmptyState title={isRouteErrorResponse(error) && error.status === 404 ? "문의를 찾을 수 없어요." : "문의를 불러오지 못했어요."} /></div>;
}
