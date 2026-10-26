import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ArrowLeft, Bookmark, FileText, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getCompetitionData } from "~/data/competition";
import { MatchScoreboard } from "~/components/features/match-detail/MatchScoreboard";
import { tournaments } from "~/data/home";
import { useRouteQuery } from "~/hooks/useRouteQuery";
import { useBackNavigation } from "~/navigation";
import { CommentComposer, EmptyState, IconButton, TabBar, Toast, type CommentSubmission } from "~/components/ui";
import { useMatchCheers } from "~/hooks/useMatchCheers";
import { scrollAppToElement } from "~/viewport";

export { CompetitionRouteError as ErrorBoundary } from "~/components/CompetitionRouteError";

export function loader({ params }: LoaderFunctionArgs) {
  const tournament = tournaments.find(({ id }) => id === params.tournamentId);
  if (!tournament) throw new Response("대회를 찾을 수 없어요", { status: 404 });
  const data = getCompetitionData(tournament);
  const match = data.matches.find(({ id }) => id === params.matchId);
  if (!match) throw new Response("경기를 찾을 수 없어요", { status: 404 });
  return json({ tournament, match, division: data.divisions.find(({ id }) => id === match.divisionId)!, venue: data.venues.find(({ id }) => id === match.venueId)! });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: `${data ? `${data.match.teamA.name} vs ${data.match.teamB.name}` : "경기 상세"} | 위꾹` }];

export default function MatchDetailPage() {
  const { tournament, match, division, venue } = useLoaderData<typeof loader>();
  const finished = match.status === "finished";
  const goBack = useBackNavigation(`/tournaments/${tournament.id}?page=matches&view=schedule`);
  const { params, update } = useRouteQuery();
  const defaultTab = finished ? "analysis" : "vote";
  const requestedTab = params.get("tab");
  const tab = requestedTab === "cheers" || requestedTab === "vote" || (requestedTab === "analysis" && finished) ? requestedTab : defaultTab;
  const [bookmarked, setBookmarked] = useState(false);
  const [message, setMessage] = useState("");
  const { comments, ready, addComment } = useMatchCheers(tournament.id, match.id);
  const bookmarkKey = `wekkuk-bookmark:${tournament.id}:${match.id}`;

  useEffect(() => {
    try { setBookmarked(localStorage.getItem(bookmarkKey) === "1"); } catch { setBookmarked(false); }
  }, [bookmarkKey]);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [message]);

  function submitCheer(submission: CommentSubmission) {
    const id = addComment(submission);
    if (!id) return;
    window.requestAnimationFrame(() => scrollAppToElement(document.getElementById(`cheer-${id}`), { behavior: "smooth" }));
  }

  function toggleBookmark() {
    const next = !bookmarked;
    setBookmarked(next);
    try {
      if (next) localStorage.setItem(bookmarkKey, "1");
      else localStorage.removeItem(bookmarkKey);
      setMessage(next ? "경기를 저장했어요." : "저장을 해제했어요.");
    } catch { setMessage("현재 브라우저에서는 저장할 수 없어요."); }
  }

  async function shareMatch() {
    const data = { title: `${match.teamA.name} vs ${match.teamB.name}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); setMessage("경기 링크를 복사했어요."); }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setMessage("공유할 링크를 주소창에서 복사해 주세요.");
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-neutral-white">
      <header className="sticky top-0 z-30 bg-neutral-white"><div className="flex h-[60px] items-center justify-between px-5 pb-3">
        <IconButton onClick={goBack} label="뒤로 가기" className="-ml-1 h-10 w-8"><ArrowLeft size={25} strokeWidth={2.2} aria-hidden="true" /></IconButton>
        <h1 className="sr-only">{match.teamA.name} 대 {match.teamB.name} 경기 상세</h1>
        <div className="flex items-center gap-4"><IconButton onClick={shareMatch} label="경기 공유" className="h-10 w-8"><Share2 size={25} strokeWidth={2.2} aria-hidden="true" /></IconButton><IconButton onClick={toggleBookmark} label="경기 저장" aria-pressed={bookmarked} className="h-10 w-8"><Bookmark size={25} strokeWidth={2.2} fill={bookmarked ? "currentColor" : "none"} aria-hidden="true" /></IconButton></div>
      </div></header>
      <main className={`flex flex-1 flex-col ${tab === "cheers" ? "pb-44" : ""}`}>
        <MatchScoreboard match={match} division={division} venue={venue} />
        <TabBar items={[{ value: "vote", label: "승자투표" }, { value: "cheers", label: `응원(${comments.length})` }, { value: "analysis", label: "경기분석", disabled: !finished }]} value={tab} onChange={(value) => update({ tab: value })} label="경기 상세 메뉴" idPrefix="match-tabs" fullWidth={false} className="mt-8 shrink-0" />
        {(["vote", "cheers", "analysis"] as const).map((value) => <div key={value} id={`match-tabs-${value}-panel`} role="tabpanel" aria-labelledby={`match-tabs-${value}-tab`} hidden={tab !== value} className="min-h-64 flex-1">
          {value === "cheers" && (comments.length ? <ul aria-label="응원 댓글" className="space-y-5 px-5 py-5">
            {comments.map((comment) => <li key={comment.id} id={`cheer-${comment.id}`} className="scroll-mt-[68px] text-body leading-5">
              <p className="font-bold">{comment.author}</p>
              {comment.content && <p className="mt-1 whitespace-pre-wrap break-words">{comment.content}</p>}
              {comment.attachments.map((name, index) => <span key={`${name}-${index}`} className="mt-1 flex items-center gap-1 text-caption text-neutral-subtext"><FileText size={13} aria-hidden="true" /><span className="truncate">{name}</span></span>)}
              <time dateTime={comment.createdAt} className="mt-1 block text-caption text-neutral-subtext">{new Date(comment.createdAt).toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Seoul" })}</time>
            </li>)}
          </ul> : <EmptyState title={ready ? "첫 응원을 남겨주세요" : "응원을 불러오는 중이에요"} description="선수들에게 응원의 한마디를 전해보세요." />)}
        </div>)}
      </main>
      {tab === "cheers" && <CommentComposer key={`${tournament.id}:${match.id}`} disabled={!ready} onSubmit={submitCheer} />}
      <Toast message={message} onClose={() => setMessage("")} />
    </div>
  );
}
