import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { QuestionThread } from "~/components/features/tournament-detail/QuestionThread";
import { AppBar, BottomSheet, Button, CommentComposer, EmptyState, IconButton, StickyHeader, Toast, type CommentSubmission } from "~/components/ui";
import { findTournament } from "~/data/home";
import { tournamentQuestions, type QuestionComment } from "~/data/tournament-details";
import { useTournamentQuestions } from "~/hooks/useTournamentQuestions";
import { useBackNavigation } from "~/navigation";
import { scrollAppToElement } from "~/viewport";

export { ErrorBoundary } from "./tournaments_.$tournamentId_.questions";

export function clientLoader({ params }: LoaderFunctionArgs) {
  const tournament = findTournament(params.tournamentId);
  const questionId = params.questionId ?? "";
  if (!tournament || (!tournamentQuestions.some((item) => item.id === questionId) && !/^preview-\d+$/.test(questionId))) {
    throw new Response("문의를 찾을 수 없어요", { status: 404 });
  }
  return ({ tournamentId: tournament.id, questionId });
}
export const meta: MetaFunction = () => [{ title: "Q&A 상세 | 위꾹" }];

export default function TournamentQuestionPage() {
  const { tournamentId, questionId } = useLoaderData<typeof clientLoader>();
  const { questions, saveQuestions, ready } = useTournamentQuestions(tournamentId);
  const selectedQuestion = questions.find((item) => item.id === questionId);
  const question = selectedQuestion?.private ? undefined : selectedQuestion;
  const goBack = useBackNavigation(`/tournaments/${encodeURIComponent(tournamentId)}/questions`);
  const [menu, setMenu] = useState<"post" | QuestionComment | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMenu(null);
  }, [questionId]);
  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  function submitComment({ content, attachments }: CommentSubmission) {
    if (!question || !ready || (!content && attachments.length === 0)) return;
    const comment: QuestionComment = { id: `comment-${Date.now()}`, author: "글쓴이", content, createdAt: new Date().toISOString(), ...(attachments.length ? { attachments } : {}) };
    saveQuestions(questions.map((item) => item.id === question.id ? { ...item, comments: [...item.comments, comment] } : item));
    setMessage("댓글을 추가했어요.");
    window.requestAnimationFrame(() => scrollAppToElement(document.getElementById("comments-heading"), { behavior: "smooth" }));
  }

  async function copyMenuContent() {
    try {
      await navigator.clipboard.writeText(menu === "post" ? window.location.href : menu?.content ?? "");
      setMessage(menu === "post" ? "문의 링크를 복사했어요." : "댓글을 복사했어요.");
    } catch { setMessage("복사하지 못했어요. 다시 시도해 주세요."); }
    setMenu(null);
  }

  return <div className="min-h-full bg-neutral-white">
    <StickyHeader><AppBar onBack={goBack} actions={question ? <IconButton label="게시글 더보기" onClick={() => setMenu("post")} className="-mr-2"><MoreVertical size={23} aria-hidden="true" /></IconButton> : undefined} /></StickyHeader>
    <main className="pb-44">
      {question ? <QuestionThread question={question} onCommentMenu={setMenu} /> : <EmptyState title={selectedQuestion?.private ? "비밀글은 열람할 수 없어요." : ready ? "문의를 찾을 수 없어요." : "문의를 불러오는 중이에요."} />}
    </main>
    {question && <CommentComposer key={`${tournamentId}:${questionId}`} disabled={!ready} onSubmit={submitComment} />}
    {menu && <BottomSheet title={menu === "post" ? "게시글 메뉴" : "댓글 메뉴"} onClose={() => setMenu(null)}><Button variant="ghost" fullWidth onClick={copyMenuContent}>{menu === "post" ? "문의 링크 복사" : "댓글 복사"}</Button></BottomSheet>}
    <Toast message={message} onClose={() => setMessage("")} />
  </div>;
}
