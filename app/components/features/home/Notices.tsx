import { PushLink } from "~/components/PushLink";
import { ChevronRight } from "lucide-react";
import { notices } from "~/data/notices";
import { NoticeList } from "~/components/features/notices/NoticeList";

export function Notices() {
  return (
    <section aria-labelledby="notices-heading">
      <h2 id="notices-heading"><PushLink to="/notices" className="inline-flex items-center gap-1 text-heading-lg font-extrabold" aria-label="공지사항 전체보기">공지사항<ChevronRight size={20} strokeWidth={2.5} aria-hidden="true" /></PushLink></h2>
      <div className="mt-2 overflow-hidden rounded-xl bg-neutral-white">
        <NoticeList inset="card" notices={notices.slice(0, 3)} />
      </div>
    </section>
  );
}
