import { ChevronRight } from "lucide-react";
import { QuestionItem } from "./QuestionItem";
import { Button, SectionHeader } from "~/components/ui";
import { PushLink } from "~/components/PushLink";
import type { tournamentQuestions } from "~/data/tournament-details";
type Question = (typeof tournamentQuestions)[number];

export function QuestionList({ tournamentId, questions, totalCount, hidePrivate, onHidePrivateChange, onInquiry }: { tournamentId: string; questions: Question[]; totalCount: number; hidePrivate: boolean; onHidePrivateChange: (value: boolean) => void; onInquiry: () => void }) {
  const base = `/tournaments/${encodeURIComponent(tournamentId)}/questions`;
  return <section aria-labelledby="questions-heading" className="scroll-mt-[168px] border-t-2 border-neutral-border pb-8 pt-8"><SectionHeader id="questions-heading" title={`Q&A (${totalCount})`} action={<PushLink to={base} className="flex items-center gap-1 text-caption text-neutral-subtext">전체보기<ChevronRight size={12} aria-hidden="true" /></PushLink>} /><label className="mt-3 flex w-fit items-center gap-1.5 text-caption text-neutral-subtext"><input type="checkbox" checked={hidePrivate} onChange={(event) => onHidePrivateChange(event.target.checked)} className="h-3.5 w-3.5 accent-neutral-text" />비밀글 제외</label><div>{questions.map((question) => <QuestionItem key={question.id} question={question} to={`${base}/${encodeURIComponent(question.id)}`} className="block border-b border-neutral-surface last:border-0" />)}</div><Button variant="outline" onClick={onInquiry} className="mt-5 h-11 w-full rounded border-neutral-subtext text-body text-neutral-subtext">주최측에 문의하기</Button></section>;
}
