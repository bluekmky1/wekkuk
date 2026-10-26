import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { BottomNav } from "~/components/BottomNav";
import { HomeHeader } from "~/components/HomeHeader";
import { PushLink } from "~/components/PushLink";
import { AdBanner } from "~/components/ui";
import { HomeSearchField } from "~/components/features/home/HomeSearchField";
import { UpcomingTournaments } from "~/components/features/home/UpcomingTournaments";
import { ParticipatingTournament } from "~/components/features/home/ParticipatingTournament";
import { Notices } from "~/components/features/home/Notices";
import type { TournamentPreview } from "~/types/home";

export const meta: MetaFunction = () => [
  { title: "위꾹 홈" },
  { name: "description", content: "위꾹 모바일 웹 UX 검증 프로토타입" },
];

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const participating = searchParams.get("participating") === "1";
  const selectedMonth = ([10, 11, 12] as const).find((month) => String(month) === searchParams.get("month")) ?? 10;

  function selectMonth(month: TournamentPreview["month"]) {
    const next = new URLSearchParams(searchParams);
    if (month === 10) next.delete("month");
    else next.set("month", String(month));
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }

  return (
    <div className="min-h-full bg-neutral-surface">
      <HomeHeader />
      <main className="space-y-6 bg-neutral-surface px-5 pb-32 pt-5">
        {participating && <ParticipatingTournament />}
        {participating && <AdBanner />}
        <HomeSearchField />
        <UpcomingTournaments selectedMonth={selectedMonth} onSelectMonth={selectMonth} />
        <AdBanner />
        <Notices />
        <div className="pb-4 text-center">
          <PushLink to="/components" className="inline-flex min-h-11 items-center px-4 text-body text-neutral-subtext underline underline-offset-4">컴포넌트 보기</PushLink>
        </div>
      </main>
      <BottomNav selectedMonth={selectedMonth} />
    </div>
  );
}
