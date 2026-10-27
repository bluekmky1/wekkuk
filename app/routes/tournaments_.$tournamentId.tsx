import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import { ArrowLeft, ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { DetailDialog } from "~/components/DetailDialog";
import { CompetitionPanel } from "~/components/CompetitionPanel";
import { TournamentIntroduction } from "~/components/features/tournament-detail/TournamentIntroduction";
import { AttachmentsPanel } from "~/components/features/tournament-detail/AttachmentsPanel";
import { QuestionList } from "~/components/features/tournament-detail/QuestionList";
import { InquiryForm } from "~/components/features/tournament-detail/InquiryForm";
import { findTournament } from "~/data/home";
import { getTournamentRules } from "~/data/tournament-details";
import { useBackNavigation } from "~/navigation";
import { useRouteQuery } from "~/hooks/useRouteQuery";
import { useTournamentQuestions } from "~/hooks/useTournamentQuestions";
import { AppBar, Button, SegmentedControl, SectionNav, StickyHeader, Toast } from "~/components/ui";
import { getAppScrollElement, scrollAppTo, scrollAppToElement } from "~/viewport";

export function clientLoader({ params }: LoaderFunctionArgs) {
  const tournament = findTournament(params.tournamentId);
  if (!tournament) throw new Response("대회를 찾을 수 없어요", { status: 404 });
  return ({ tournament });
}

export const meta: MetaFunction<typeof clientLoader> = ({ data }) => [{ title: `${data?.tournament.title ?? "대회 상세"} | 위꾹` }];

type Section = "details" | "attachments" | "questions";
type Dialog = "inquiry" | null;


export default function TournamentDetailPage() {
  const { tournament } = useLoaderData<typeof clientLoader>();
  const goBack = useBackNavigation("/tournaments");
  const { params, update } = useRouteQuery();
  const page = params.get("page") === "matches" ? "matches" : "tournament";
  const [activeSection, setActiveSection] = useState<Section>("details");
  const [expanded, setExpanded] = useState(false);
  const [hidePrivate, setHidePrivate] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [message, setMessage] = useState("");
  const { questions, saveQuestions } = useTournamentQuestions(tournament.id);
  const [liked, setLiked] = useState(false);
  const detailsRef = useRef<HTMLElement>(null);
  const attachmentsRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);
  const visibleQuestions = questions.filter((question) => !hidePrivate || !question.private);
  const dateLabel = tournament.dates.replace(/\./g, "-").replace(/\s*\([^)]*\)/g, "").replace(/\s*~\s*/g, "~");
  const tournamentRules = getTournamentRules(tournament);
  const organizer = tournament.organizer ?? tournament.host ?? tournament.location;

  useEffect(() => {
    try { setLiked(localStorage.getItem(`wekkuk-tournament-like:${tournament.id}`) === "1"); } catch { setLiked(false); }
  }, [tournament.id]);

  function handleBack() {
    if (page === "matches") {
      update({ page: null });
      scrollAppTo({ top: 0 });
      return;
    }
    goBack();
  }

  function toggleLike() {
    const next = !liked;
    setLiked(next);
    try { localStorage.setItem(`wekkuk-tournament-like:${tournament.id}`, next ? "1" : "0"); } catch { /* Local preview storage is optional. */ }
  }

  useEffect(() => {
    if (page !== "tournament") return;
    function updateActiveSection() {
      const scrollArea = getAppScrollElement();
      if (!scrollArea) return;
      const scrollAreaRect = scrollArea.getBoundingClientRect();
      const relativeTop = (element: HTMLElement | null) => element ? element.getBoundingClientRect().top - scrollAreaRect.top : Infinity;
      let section: Section = "details";
      if (relativeTop(attachmentsRef.current) <= 132) section = "attachments";
      if (relativeTop(questionsRef.current) <= 132 || scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 4) section = "questions";
      setActiveSection(section);
    }
    const scrollArea = getAppScrollElement();
    scrollArea?.addEventListener("scroll", updateActiveSection, { passive: true });
    updateActiveSection();
    return () => scrollArea?.removeEventListener("scroll", updateActiveSection);
  }, [page]);

  function jumpTo(section: Section) {
    setActiveSection(section);
    const refs = { details: detailsRef, attachments: attachmentsRef, questions: questionsRef };
    scrollAppToElement(refs[section].current, { behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  async function shareTournament() {
    const data = { title: tournament.title, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        setMessage("대회 링크를 복사했어요.");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setMessage("공유할 링크를 주소창에서 복사해 주세요.");
    }
  }

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const content = String(form.get("content") ?? "").trim();
    if (!title || !content) return;
    saveQuestions([...questions, {
      id: `preview-${Date.now()}`, category: String(form.get("category")), title,
      private: form.get("private") === "on", date: new Date().toLocaleDateString("sv-SE"), views: 0,
      content, comments: [],
    }]);
    setDialog(null);
    setMessage("미리보기 문의를 추가했어요. 실제 주최 측으로 전송되지는 않아요.");
  }

  return (
    <div className="min-h-full bg-neutral-white">
      <StickyHeader layer={40}><AppBar onBack={handleBack} center={<SegmentedControl items={[{ value: "tournament", label: "대회 정보" }, { value: "matches", label: "경기 정보" }]} value={page} onChange={(value) => { update({ page: value === "matches" ? "matches" : null }); scrollAppTo({ top: 0 }); }} label="대회 화면" idPrefix="tournament-page" />} actions={page === "tournament" ? <button type="button" onClick={shareTournament} aria-label="대회 공유" className="flex h-10 w-8 items-center justify-center"><Share2 size={24} strokeWidth={2.2} aria-hidden="true" /></button> : null} /></StickyHeader>

      <main>
        <div id="tournament-page-tournament-panel" role="tabpanel" aria-labelledby="tournament-page-tournament-tab" hidden={page !== "tournament"}>
          <TournamentIntroduction title={tournament.title} dateLabel={dateLabel} location={tournament.location} organizer={organizer} venue={tournament.venue} host={tournament.host} type={tournament.type} posterUrl={tournament.displayPosterUrl ?? tournament.posterUrl} supporters={tournament.supporters} sponsors={tournament.sponsors} liked={liked} likeCount={24 + Number(liked)} onLike={toggleLike} />

          <div className="sticky top-[calc(60px+var(--appbar-top-inset))] z-20 mt-5"><SectionNav items={[{ value: "details", label: "대회상세" }, { value: "attachments", label: "첨부파일" }, { value: "questions", label: `Q&A(${questions.length})` }]} value={activeSection} onChange={jumpTo} label="대회 정보 섹션" /></div>

          <div className="px-5">
            <section ref={detailsRef} id="details" aria-labelledby="details-heading" className="scroll-mt-[calc(124px+var(--appbar-top-inset))] pt-5">
              <h2 id="details-heading" className="text-heading-lg font-bold">대회상세</h2>
              <div id="tournament-rules" className={`mt-3 space-y-5 text-heading leading-5 ${expanded ? "" : "max-h-64 overflow-hidden [mask-image:linear-gradient(black_70%,transparent)]"}`}>
                {tournamentRules.map((rule) => (
                  <div key={rule.title}>
                    <h3>{rule.title}</h3>
                    {rule.bullets && <ul className="list-disc pl-6">{rule.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                    {rule.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {rule.images?.map((url, index) => <a key={url} href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt={`${tournament.title} 대회요강 ${index + 1}페이지`} loading="lazy" className="mt-3 h-auto w-full" referrerPolicy="no-referrer" /></a>)}
                    {rule.sourceUrl && <a href={rule.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-caption text-neutral-subtext underline">BKPLAY 대회 원문</a>}
                  </div>
                ))}
              </div>
              <Button type="button" variant="ghost" aria-expanded={expanded} aria-controls="tournament-rules" onClick={() => {
                if (expanded) scrollAppToElement(detailsRef.current);
                setExpanded((value) => !value);
              }} className={`relative flex h-14 w-full items-center justify-center gap-2 rounded-none text-caption text-neutral-subtext ${expanded ? "mt-8 border-t-2 border-neutral-border" : "-mt-10 bg-gradient-to-t from-neutral-white via-neutral-white/90 to-transparent"}`}>
                대회상세 {expanded ? "접기" : "펼치기"}{expanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
              </Button>
            </section>

            <div ref={attachmentsRef} className="scroll-mt-[calc(124px+var(--appbar-top-inset))]"><AttachmentsPanel onDownload={() => setMessage("미리보기용 첨부파일이에요. 다운로드는 제공하지 않아요.")} /></div>

            <div ref={questionsRef} className="scroll-mt-[calc(124px+var(--appbar-top-inset))]"><QuestionList tournamentId={tournament.id} questions={visibleQuestions} totalCount={questions.length} hidePrivate={hidePrivate} onHidePrivateChange={setHidePrivate} onInquiry={() => setDialog("inquiry")} /></div>
          </div>
        </div>
        <div id="tournament-page-matches-panel" role="tabpanel" aria-labelledby="tournament-page-matches-tab" hidden={page !== "matches"}>
          {page === "matches" && <CompetitionPanel tournament={tournament} />}
        </div>
      </main>


      <Toast message={message} onClose={() => setMessage("")} />

      {dialog && <DetailDialog title="주최측에 문의하기" onClose={() => setDialog(null)}><InquiryForm onSubmit={submitInquiry} /></DetailDialog>}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const goBack = useBackNavigation("/tournaments");
  return <div className="min-h-full bg-neutral-white"><button type="button" onClick={goBack} aria-label="뒤로 가기" className="p-5"><ArrowLeft aria-hidden="true" /></button><main className="px-5 py-20 text-center"><h1 className="text-heading-lg font-bold">{isRouteErrorResponse(error) && error.status === 404 ? "대회를 찾을 수 없어요" : "대회 정보를 불러오지 못했어요"}</h1><p className="mt-3 text-body text-neutral-subtext">대회 목록에서 다시 선택해 주세요.</p></main></div>;
}
