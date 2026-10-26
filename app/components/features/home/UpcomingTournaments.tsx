import { ChipGroup, SectionHeader } from "~/components/ui";
import { PushLink } from "~/components/PushLink";
import { TournamentCompactItem } from "~/components/domain/TournamentCompactItem";
import { tournaments } from "~/data/home";
import type { TournamentPreview } from "~/types/home";

const months = [10, 11, 12] as const;

export function UpcomingTournaments({ selectedMonth, onSelectMonth }: { selectedMonth: TournamentPreview["month"]; onSelectMonth: (month: TournamentPreview["month"]) => void }) {
  const monthTournaments = tournaments.filter((tournament) => tournament.month === selectedMonth);
  const monthItems = months.map((month) => ({ value: month, label: `${month}월` }));

  return (
    <section id="upcoming" aria-labelledby="upcoming-heading">
      <SectionHeader id="upcoming-heading" title="다가오는 대회" size="sm" />
      <div className="mt-3">
        <ChipGroup items={monthItems} value={selectedMonth} onChange={onSelectMonth} label="대회 개최 월" />
      </div>
      <div className="mt-3 overflow-hidden rounded-xl bg-neutral-white">
        <ul aria-label={`${selectedMonth}월 다가오는 대회`}>
          {monthTournaments.slice(0, 6).map((tournament) => (
            <li key={tournament.id} className="border-b border-neutral-surface last:border-0"><TournamentCompactItem tournament={tournament} /></li>
          ))}
        </ul>
        <PushLink
          to={`/tournaments?month=${selectedMonth}`}
          className="block border-t border-neutral-surface py-4 text-center text-body text-neutral-subtext"
        >
          {monthTournaments.length}개 대회 더보기
        </PushLink>
      </div>
    </section>
  );
}
