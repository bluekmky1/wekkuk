import { CircleUserRound, House, Trophy, UserSearch } from "lucide-react";
import type { TournamentPreview } from "~/types/home";
import { PushLink } from "~/components/PushLink";

const iconProps = { size: 28, strokeWidth: 2.5, "aria-hidden": true as const };

export function BottomNav({ selectedMonth, embedded = false, active = "home" }: { selectedMonth: TournamentPreview["month"]; embedded?: boolean; active?: "home" | "my" }) {
  return (
    <nav style={embedded ? { position: "relative" } : undefined} className="bottom-nav grid grid-cols-4 pt-4 text-center text-neutral-subtext" aria-label="주 메뉴">
      <PushLink to="/" className={`flex flex-col items-center gap-1 ${active === "home" ? "text-neutral-text" : ""}`} aria-current={active === "home" ? "page" : undefined}>
        {active === "home" ? <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M10.72 2.48a2 2 0 0 1 2.56 0l7 5.83A2 2 0 0 1 21 9.85V20a2 2 0 0 1-2 2h-4v-8H9v8H5a2 2 0 0 1-2-2V9.85a2 2 0 0 1 .72-1.54l7-5.83Z" /></svg> : <House {...iconProps} />}
        <span className={`text-caption ${active === "home" ? "font-bold" : ""}`}>홈</span>
      </PushLink>
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
        <UserSearch {...iconProps} />
        <span className="text-caption">선수 검색</span>
      </PushLink>
      <PushLink to="/my" className={`flex flex-col items-center gap-1 ${active === "my" ? "text-neutral-text" : ""}`} aria-current={active === "my" ? "page" : undefined}>
        {active === "my" ? <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" /><circle cx="12" cy="9" r="3" fill="white" /><path d="M6 19v-1a6 6 0 0 1 12 0v1" fill="white" /></svg> : <CircleUserRound {...iconProps} />}
        <span className={`text-caption ${active === "my" ? "font-bold" : ""}`}>MY</span>
      </PushLink>
    </nav>
  );
}
