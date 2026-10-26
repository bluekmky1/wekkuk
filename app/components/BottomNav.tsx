import { CircleUserRound, House, Search, Trophy, UsersRound } from "lucide-react";
import type { TournamentPreview } from "~/types/home";
import { PushLink } from "~/components/PushLink";

const iconProps = { size: 28, strokeWidth: 2.5, "aria-hidden": true as const };

export function BottomNav({ selectedMonth, embedded = false }: { selectedMonth: TournamentPreview["month"]; embedded?: boolean }) {
  return (
    <nav style={embedded ? { position: "relative" } : undefined} className="bottom-nav grid grid-cols-4 pt-4 text-center" aria-label="주 메뉴">
      <div className="flex flex-col items-center gap-1" aria-current="page">
        <House {...iconProps} />
        <span className="text-caption">홈</span>
      </div>
      <PushLink
        to={`/tournaments?month=${selectedMonth}`}
        className="flex flex-col items-center gap-1"
      >
        <Trophy {...iconProps} />
        <span className="text-caption">대회</span>
      </PushLink>
      <PushLink
        to="/players/search"
        className="flex flex-col items-center gap-1"
      >
        <span className="relative h-7 w-7">
          <UsersRound size={27} strokeWidth={2.5} aria-hidden="true" />
          <Search className="absolute -bottom-1 -right-1 bg-neutral-white" size={14} strokeWidth={2.8} aria-hidden="true" />
        </span>
        <span className="text-caption">선수 검색</span>
      </PushLink>
      <div className="flex flex-col items-center gap-1" aria-label="MY 화면 준비 중">
        <CircleUserRound {...iconProps} />
        <span className="text-caption">MY</span>
      </div>
    </nav>
  );
}
