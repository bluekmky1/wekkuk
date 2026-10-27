import type { CompetitionTeam } from "~/data/competition";

export type Standing = { team: CompetitionTeam; wins: number; losses: number; scored: number; conceded: number };

export function StandingsTable({ rows, caption }: { rows: Standing[]; caption: string }) {
  // Keyboard users need to focus this region to scroll the statistics horizontally.
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  return <div className="overflow-x-auto overscroll-x-contain border-y border-[#dce7f3] bg-neutral-white" role="region" aria-label="순위 통계 가로 스크롤" tabIndex={0}>
    <table className="w-[504px] table-fixed text-center text-body tabular-nums"><caption className="sr-only">{caption}</caption>
      <colgroup><col className="w-[52px]" /><col className="w-[132px]" />{[1,2,3,4,5].map((value) => <col key={value} className="w-16" />)}</colgroup>
      <thead className="bg-[#eef5fc] text-caption text-[#405a75]"><tr className="h-10">{["순위", "팀(선수)", "승", "패", "득", "실", "포인트"].map((label, index) => <th key={label} scope="col" className={`bg-[#eef5fc] font-semibold ${index === 0 ? "sticky left-0 z-20" : index === 1 ? "sticky left-[52px] z-20 px-3 text-left" : ""}`}>{label}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={row.team.id} className="h-[74px] border-t border-[#edf1f5]"><th scope="row" className="sticky left-0 z-10 bg-neutral-white text-[20px] font-bold text-[#005eb8]">{index + 1}</th><td className="sticky left-[52px] z-10 bg-neutral-white px-3 py-3 text-left"><p className="truncate font-semibold">{row.team.name}</p><p className="mt-2 whitespace-nowrap text-[11px] text-neutral-subtext">{row.team.players.join(" ")}</p></td><td>{row.wins}</td><td>{row.losses}</td><td>{row.scored}</td><td>{row.conceded}</td><td className={`font-semibold ${row.scored - row.conceded < 0 ? "text-secondary" : "text-[#005eb8]"}`} title="득실차 (득점 - 실점)">{row.scored - row.conceded}</td></tr>)}</tbody>
    </table>
  </div>;
}
