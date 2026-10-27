import { compactBadge } from "~/components/ui/styles";
import type { CompetitionMatch } from "~/data/competition";

export const matchStatusLabels = { scheduled: "예정", live: "진행 중", finished: "종료" } as const;
export function MatchStatusBadge({ status, label, size = "md" }: { status: CompetitionMatch["status"]; label?: string; size?: "sm" | "md" }) {
  const tone = status === "live"
    ? "border-[#b6d6f7] bg-[#eaf3fd] text-[#005eb8]"
    : status === "finished"
      ? "border-[#e5e7eb] bg-[#e5e7eb] text-[#4b5563]"
      : "border-[#cbd0d7] bg-neutral-white text-[#596273]";
  return <span className={`whitespace-nowrap rounded-full border font-semibold ${size === "sm" ? compactBadge : "px-3 py-1 text-caption"} ${tone}`}>{label ?? matchStatusLabels[status]}</span>;
}
