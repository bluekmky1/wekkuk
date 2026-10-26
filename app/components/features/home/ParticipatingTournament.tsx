import { ChevronRight } from "lucide-react";
import { SectionHeader } from "~/components/ui";

export function ParticipatingTournament() {
  return (
    <section aria-labelledby="participating-heading">
      <SectionHeader id="participating-heading" title="참가중인 대회" size="sm" />
      <div className="mt-3 rounded-xl bg-neutral-white p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-body font-semibold">2026 안양시 배드민턴대회</h3>
            <p className="mt-1 text-caption text-neutral-muted">2026년 10월 24일</p>
          </div>
          <ChevronRight size={20} strokeWidth={2.2} aria-hidden="true" />
        </div>
        <div className="mt-3 border-t border-neutral-border pt-3">
          <div className="flex items-center justify-between text-body">
            <h4 className="font-semibold">나의 다음 경기</h4>
            <span className="text-caption">남복-D조</span>
          </div>
          <p className="mt-3 text-heading font-bold">vs 케이엔비스&amp;요넥스</p>
          <p className="mt-1 text-caption">호계 체육관 2층 5코트 12경기 <span className="text-neutral-muted">(3경기 남음)</span></p>
        </div>
        <p className="mt-3 border-t border-neutral-border pt-3 text-center text-caption text-neutral-muted">이전 내 경기들 보기</p>
      </div>
    </section>
  );
}
