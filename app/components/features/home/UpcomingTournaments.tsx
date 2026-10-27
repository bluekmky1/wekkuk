import { ChipGroup } from "~/components/ui";
import { PushLink } from "~/components/PushLink";
import { TournamentCompactItem } from "~/components/domain/TournamentCompactItem";
import { tournaments } from "~/data/home";
import type { TournamentPreview } from "~/types/home";

const months = [10, 11, 12] as const;

export function UpcomingTournaments({ selectedMonth, onSelectMonth }: { selectedMonth: TournamentPreview["month"]; onSelectMonth: (month: TournamentPreview["month"]) => void }) {
  const monthTournaments = tournaments.filter((tournament) => tournament.dates.includes(`2026.${String(selectedMonth).padStart(2, "0")}.`) && tournament.status !== "종료");
  const visibleTournaments = monthTournaments.slice(0, 6);
  const remainingCount = monthTournaments.length - visibleTournaments.length;
  const monthItems = months.map((month) => ({ value: month, label: `${month}월` }));

  return (
    <section id="upcoming" aria-labelledby="upcoming-heading">
      <h2 id="upcoming-heading" className="text-heading-lg font-extrabold">다가오는 대회</h2>
      <div className="mt-2">
        <ChipGroup items={monthItems} value={selectedMonth} onChange={onSelectMonth} label="대회 개최 월" />
      </div>
      <div className="mt-3 overflow-hidden rounded-xl bg-neutral-white">
        <ul aria-label={`${selectedMonth}월 다가오는 대회`}>
          {visibleTournaments.map((tournament) => (
            <li key={tournament.id} className="border-b border-neutral-surface last:border-0"><TournamentCompactItem tournament={tournament} /></li>
          ))}
        </ul>
        <PushLink
          to={`/tournaments?month=${selectedMonth}`}
          className="block border-t border-neutral-surface py-4 text-center text-body text-neutral-subtext"
        >
          {remainingCount > 0 ? `${remainingCount}개 대회 더보기` : "대회 리스트 보기"}
        </PushLink>
      </div>
    </section>
  );
}
