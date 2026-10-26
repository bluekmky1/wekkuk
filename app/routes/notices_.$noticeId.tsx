import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import { CalendarDays, Eye } from "lucide-react";
import { NoticeDetail } from "~/components/features/notices/NoticeDetail";
import { AppBar, StickyHeader } from "~/components/ui";
import { notices } from "~/data/notices";
import { useBackNavigation } from "~/navigation";

export function loader({ params }: LoaderFunctionArgs) {
  const notice = notices.find(({ id }) => id === params.noticeId);
  if (!notice) throw new Response("공지사항을 찾을 수 없어요", { status: 404 });
  return json({ notice });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: `${data?.notice.title ?? "공지사항 상세"} | 위꾹` }];

export default function NoticeDetailPage() {
  const { notice } = useLoaderData<typeof loader>();
  const goBack = useBackNavigation("/notices");

  return <div className="min-h-full bg-neutral-white">
    <StickyHeader className="border-b border-neutral-border">
      <AppBar onBack={goBack} />
    </StickyHeader>
    <main>
      <header className="border-b border-neutral-border px-5 py-5">
        <h1 className="text-heading font-bold leading-6">{notice.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2.5 text-caption text-neutral-subtext">
          <span className="inline-flex items-center gap-1"><CalendarDays size={13} aria-hidden="true" /><time dateTime={notice.date}>{notice.date}</time></span>
          <span className="inline-flex items-center gap-1"><Eye size={14} aria-hidden="true" /><span className="sr-only">조회수 </span>{notice.views}</span>
        </div>
      </header>
      <NoticeDetail content={notice.content} />
    </main>
  </div>;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const goBack = useBackNavigation("/notices");
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return <div className="min-h-full bg-neutral-white">
    <StickyHeader className="border-b border-neutral-border"><AppBar onBack={goBack} /></StickyHeader>
    <main className="px-5 py-20 text-center">
      <h1 className="text-heading-lg font-bold">{notFound ? "공지사항을 찾을 수 없어요" : "공지사항을 불러오지 못했어요"}</h1>
      <p className="mt-3 text-body text-neutral-subtext">공지사항 목록에서 다시 선택해 주세요.</p>
    </main>
  </div>;
}
