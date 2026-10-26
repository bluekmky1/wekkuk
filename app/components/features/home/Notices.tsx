import { PushLink } from "~/components/PushLink";
import { SectionHeader } from "~/components/ui";
import { notices } from "~/data/home";

export function NoticePreviewItem({ id, title, date, isLast = false }: { id: string; title: string; date: string; isLast?: boolean }) {
  return (
    <PushLink to={`/notices/${encodeURIComponent(id)}`} className={`block py-3 ${isLast ? "" : "border-b border-neutral-surface"}`}>
      <h3 className="text-body font-semibold">{title}</h3>
      <p className="mt-2 text-caption text-neutral-muted">{date}</p>
    </PushLink>
  );
}

export function Notices() {
  return (
    <section aria-labelledby="notices-heading">
      <SectionHeader id="notices-heading" title="공지사항" size="sm" />
      <div className="mt-3 rounded-xl bg-neutral-white px-3">
        {notices.map((notice, index) => (
          <NoticePreviewItem key={notice.id} id={notice.id} title={notice.title} date={notice.date} isLast={index === notices.length - 1} />
        ))}
      </div>
      <PushLink to="/notices" className="block py-4 text-center text-body text-neutral-muted">더보기</PushLink>
    </section>
  );
}
