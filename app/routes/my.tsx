import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { ChevronRight, UserRound } from "lucide-react";
import { AppBar, Divider, StickyHeader, Toast } from "~/components/ui";
import { PlayerSummaryCard } from "~/components/features/my/PlayerSummaryCard";
import { MyMenuItem } from "~/components/features/my/MyMenuItem";
import { useBackNavigation } from "~/navigation";
export const meta: MetaFunction = () => [{ title: "MY | 위꾹" }];
export default function MyPage() {
  const goBack = useBackNavigation();
  const [message, setMessage] = useState("");
  useEffect(() => { if (!message) return; const timer = window.setTimeout(() => setMessage(""), 3000); return () => window.clearTimeout(timer); }, [message]);
  const preview = (label: string) => setMessage(`${label}은 준비 중이에요.`);
  return <div className="min-h-full bg-neutral-white">
    <StickyHeader><AppBar title="MY" onBack={goBack} /></StickyHeader>
    <main className="pb-8">
      <section className="px-5 pb-6 pt-4" aria-label="내 프로필">
        <button type="button" onClick={() => preview("프로필 편집")} className="mb-4 flex min-h-16 w-full items-center gap-3 text-left"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-surface"><UserRound size={28} aria-hidden="true" /></span><span className="flex-1"><span className="block text-heading-lg font-bold">김철수</span></span><ChevronRight size={16} className="text-neutral-subtext" aria-hidden="true" /></button>
        <PlayerSummaryCard name="김철수" />
      </section>
      <Divider />
      <section className="px-5 py-6" aria-labelledby="my-activity-heading"><h2 id="my-activity-heading" className="mb-2 text-heading-lg font-bold">나의 활동</h2>{["참가 대회", "내 경기 내역", "저장한 경기", "내 Q&A"].map(label => <MyMenuItem key={label} label={label} onClick={() => preview(label)} />)}</section>
      <Divider />
      <section className="px-5 py-6" aria-labelledby="my-service-heading"><h2 id="my-service-heading" className="mb-2 text-heading-lg font-bold">이용 안내</h2><MyMenuItem label="공지사항" to="/notices" /><MyMenuItem label="알림" to="/notifications" /><MyMenuItem label="컴포넌트 보기" to="/components" /></section>
    </main>
    <Toast message={message} onClose={() => setMessage("")} />
  </div>;
}
