import { ArticleListItem } from "~/components/domain/ArticleListItem";
import { PushLink } from "~/components/PushLink";
import { EmptyState } from "~/components/ui";
import type { Notice } from "~/data/notices";

export function NoticeList({ notices }: { notices: Notice[] }) {
  return notices.length ? <div>{notices.map((notice) => (
    <PushLink key={notice.id} to={`/notices/${encodeURIComponent(notice.id)}`} className="block border-b border-neutral-border px-5 text-inherit no-underline last:border-0">
      <ArticleListItem category={notice.category} title={notice.title} date={notice.date} views={notice.views} className="border-0" />
    </PushLink>
  ))}</div> : <EmptyState title="공지사항이 없어요" description="다른 분류를 선택해 보세요." />;
}
