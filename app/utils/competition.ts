import type { CompetitionMatch, CompetitionTeam } from "~/data/competition";

export function formatCompetitionDate(date: string) {
  const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
  return `${date} (${weekday})`;
}

export function getStandings(teams: CompetitionTeam[], matches: CompetitionMatch[]) {
  const rows = teams.map((team) => {
    let wins = 0, losses = 0, scored = 0, conceded = 0;
    for (const match of matches) {
      if (match.status !== "finished" || match.scoreA === null || match.scoreB === null) continue;
      const isA = match.teamA.id === team.id;
      if (!isA && match.teamB.id !== team.id) continue;
      const score = isA ? match.scoreA : match.scoreB;
      const opponent = isA ? match.scoreB : match.scoreA;
      scored += score;
      conceded += opponent;
      if (score > opponent) wins += 1;
      else if (score < opponent) losses += 1;
    }
    return { team, wins, losses, scored, conceded };
  });
  return rows.sort((a, b) => b.wins - a.wins || (b.scored - b.conceded) - (a.scored - a.conceded) || b.scored - a.scored);
}
