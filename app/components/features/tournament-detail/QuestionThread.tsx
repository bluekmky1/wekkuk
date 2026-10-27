import { CalendarDays, Eye, FileText, LockKeyhole, MoreVertical } from "lucide-react";
import { IconButton } from "~/components/ui";
import type { QuestionComment, TournamentQuestion } from "~/data/tournament-details";

function commentTime(value: string) {
  const date = new Date(value);
  return `${date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", timeZone: "Asia/Seoul" })} ${date.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Seoul" })}`;
}

export function QuestionThread({ question, onCommentMenu }: { question: TournamentQuestion; onCommentMenu: (comment: QuestionComment) => void }) {
  return <>
    <header className="border-y border-neutral-border px-5 py-5">
      <h1 className="text-heading font-bold leading-6">{question.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-caption text-neutral-subtext">
        <span className="inline-flex items-center gap-1"><CalendarDays size={12} aria-hidden="true" /><time dateTime={question.date}>{question.date}</time></span>
        <span className="inline-flex items-center gap-1"><Eye size={12} aria-hidden="true" /><span className="sr-only">조회수 </span>{question.views}</span>
        {question.private && <span className="inline-flex items-center gap-1"><LockKeyhole size={12} aria-hidden="true" />비밀글</span>}
      </div>
    </header>
    <section aria-label="문의 내용" className="space-y-8 px-5 py-5 text-body leading-5">
      {question.content.split(/\n\n+/).map((paragraph, index) => <p key={index} className="whitespace-pre-line break-words">{paragraph}</p>)}
    </section>
    <section aria-labelledby="comments-heading" className="border-t-2 border-neutral-border px-5 py-3">
      <h2 id="comments-heading" className="scroll-mt-[68px] text-heading font-bold">댓글 {question.comments.length}</h2>
      <ul className="mt-2 space-y-3">
        {question.comments.map((comment) => <li key={comment.id}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 text-body leading-5">
              <p className="font-bold">{comment.author}</p>
              {comment.content && <p className="mt-1 whitespace-pre-wrap break-words">{comment.content}</p>}
              {comment.attachments?.map((name, index) => <span key={`${name}-${index}`} className="mt-1 flex items-center gap-1 text-caption text-neutral-subtext"><FileText size={12} aria-hidden="true" /><span className="truncate">{name}</span></span>)}
              <time dateTime={comment.createdAt} className="mt-1 block text-caption text-neutral-subtext">{commentTime(comment.createdAt)}</time>
            </div>
            <IconButton label={`${comment.author} 댓글 더보기`} size="sm" onClick={() => onCommentMenu(comment)} className="-mr-2"><MoreVertical size={16} aria-hidden="true" /></IconButton>
          </div>
        </li>)}
      </ul>
    </section>
  </>;
}
