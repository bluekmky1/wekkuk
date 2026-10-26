import type { MetaFunction } from "@remix-run/node";
import { NoticeHeader } from "~/components/features/notices/NoticeHeader";
import { NoticeList } from "~/components/features/notices/NoticeList";
import { notices, noticeCategories } from "~/data/notices";
import { useRouteQuery } from "~/hooks/useRouteQuery";
import { useBackNavigation } from "~/navigation";

export const meta: MetaFunction = () => [{ title: "공지사항 | 위꾹" }];

export default function NoticesPage() {
  const goBack = useBackNavigation();
  const { params, update } = useRouteQuery();
  const query = params.get("q") ?? "";
  const rawCategory = params.get("category");
  const requestedCategory = ["일반", "대회공지", "서비스공지"].includes(rawCategory ?? "") ? "공지사항" : rawCategory;
  const category = noticeCategories.find((value) => value === requestedCategory) ?? "전체";
  const normalized = query.trim().toLocaleLowerCase("ko-KR");
  const results = notices.filter((notice) =>
    (category === "전체" || notice.category === category) &&
    (!normalized || `${notice.title} ${notice.content.map((block) => block.type === "paragraph" || block.type === "heading" ? block.text : block.items.join(" ")).join(" ")}`.toLocaleLowerCase("ko-KR").includes(normalized)),
  );

  return <div className="flex min-h-full flex-col bg-neutral-white">
    <NoticeHeader
      category={category}
      onCategoryChange={(value) => update({ category: value === "전체" ? null : value })}
      onBack={goBack}
    />
    <main className="flex-1 pb-8"><NoticeList notices={results} /></main>
  </div>;
}
