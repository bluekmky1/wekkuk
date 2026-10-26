import type { CompetitionMatch } from "~/data/competition";

export const matchStatusLabels = { scheduled: "예정", live: "진행 중", finished: "종료" } as const;
export function MatchStatusBadge({ status, label, monochrome = false }: { status: CompetitionMatch["status"]; label?: string; monochrome?: boolean }) {
  const filled = monochrome || status === "finished";
  return <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-caption font-semibold ${filled ? "border-neutral-text bg-neutral-text text-neutral-white" : "border-neutral-text bg-neutral-white text-neutral-text"}`}>{label ?? matchStatusLabels[status]}</span>;
}
