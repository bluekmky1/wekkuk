import { useEffect, useState } from "react";
import { ArticleListItem } from "~/components/domain/ArticleListItem";
import { PushLink } from "~/components/PushLink";
import { Toast } from "~/components/ui";
import type { TournamentQuestion } from "~/data/tournament-details";

export function QuestionItem({ question, to, className }: { question: TournamentQuestion; to: string; className?: string }) {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [message]);
  const content = <ArticleListItem category={question.category} title={question.title} date={question.date} views={question.views} isPrivate={question.private} className="border-0" />;
  return <>{question.private ? <button type="button" className={`w-full text-left ${className ?? ""}`} onClick={() => setMessage("비밀글은 열람할 수 없어요.")}>{content}</button> : <PushLink to={to} className={className}>{content}</PushLink>}<Toast message={message} onClose={() => setMessage("")} /></>;
}
