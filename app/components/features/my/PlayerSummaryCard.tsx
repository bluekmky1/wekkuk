import { Mail, Star } from "lucide-react";

export function PlayerSummaryCard({ name = "김철수", matches = 0, wins = 0, losses = 0, draws = 0 }: { name?: string; matches?: number; wins?: number; losses?: number; draws?: number }) {
  const winRate = matches ? Math.round(wins / matches * 100) : 0;
  return <section aria-label="내 경기 요약" className="rounded-xl border border-neutral-border bg-neutral-white p-3">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-surface pb-3"><h3 className="text-body font-semibold">{name}</h3><div className="flex items-center gap-3 text-caption text-neutral-subtext"><span className="inline-flex items-center gap-1"><Mail size={12} aria-hidden="true" />문의 0건</span><span className="inline-flex items-center gap-1"><Star size={12} aria-hidden="true" />저장 0건</span></div></div>
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption"><span className="font-semibold text-neutral-text">총 {matches}경기</span><span className="text-neutral-subtext">{wins}승 {losses}패 {draws}무</span><span className="ml-auto font-semibold text-neutral-text">승률 {winRate}%</span></div>
  </section>;
}
