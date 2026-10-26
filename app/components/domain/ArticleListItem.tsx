import { CalendarDays, Eye, LockKeyhole } from "lucide-react";
import { Badge } from "~/components/ui/ListPrimitives";
import { cx } from "~/components/ui/styles";

export type ArticleListItemProps = { category: string; title: string; date: string; views: number; isPrivate?: boolean; onClick?: () => void; className?: string };

export function ArticleListItem({ category, title, date, views, isPrivate = false, onClick, className }: ArticleListItemProps) {
  const content = <><Badge>{category}</Badge><span className="mt-2 flex items-center gap-1 text-body font-semibold">{title}{isPrivate && <LockKeyhole size={14} aria-label="비밀글" className="shrink-0" />}</span><span className="mt-2 flex items-center gap-3 text-caption text-neutral-subtext"><span className="inline-flex items-center gap-1"><CalendarDays size={13} aria-hidden="true" />{date}</span><span className="inline-flex items-center gap-1"><Eye size={14} aria-hidden="true" /><span className="sr-only">조회수 </span>{views}</span></span></>;
  const classes = cx("block w-full border-b border-neutral-surface py-5 text-left last:border-0", className);
  return onClick ? <button type="button" onClick={onClick} className={classes}>{content}</button> : <article className={classes}>{content}</article>;
}
