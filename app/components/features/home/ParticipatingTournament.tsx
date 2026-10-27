import { tournaments } from "~/data/home";
import { ChevronRight } from "lucide-react";
import { SectionHeader } from "~/components/ui";

export function ParticipatingTournament() {
  const tournament = tournaments.find(item => item.status !== "종료") ?? tournaments[0];
  return (
    <section aria-labelledby="participating-heading">
      <SectionHeader id="participating-heading" title="참가중인 대회" size="sm" />
      <div className="mt-3 rounded-xl bg-neutral-white p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-body font-semibold">{tournament.title}</h3>
            <p className="mt-1 text-caption text-neutral-muted">{tournament.dates}</p>
          </div>
          <ChevronRight size={20} strokeWidth={2.2} aria-hidden="true" />
        </div>
        <div className="mt-3 border-t border-neutral-border pt-3">
          <div className="flex items-center justify-between text-body">
            <h4 className="font-semibold">나의 다음 경기</h4>
            <span className="text-caption">남복-D조</span>
          </div>
          <p className="mt-3 text-heading font-bold">vs 궤도셔틀즈</p>
          <p className="mt-1 text-caption">{tournament.venue} 5코트 12경기 <span className="text-neutral-muted">(3경기 남음)</span></p>
        </div>
        <p className="mt-3 border-t border-neutral-border pt-3 text-center text-caption text-neutral-muted">이전 내 경기들 보기</p>
      </div>
    </section>
  );
}
