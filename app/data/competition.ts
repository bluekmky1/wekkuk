import type { TournamentPreview } from "~/types/home";

export type CompetitionDivision = {
  id: string;
  event: "혼복" | "남복" | "여복";
  age: number;
  grade: "초심" | "D" | "C" | "B" | "A";
  date: string;
  label: string;
  teamCount: number;
  matchCount: number;
};

export type CompetitionVenue = { id: string; name: string; courts: number[] };
export type CompetitionTeam = { id: string; name: string; players: string[] };
export type CompetitionMatch = {
  id: string;
  divisionId: string;
  date: string;
  venueId: string;
  court: number;
  sequence: number;
  group: 1 | 2;
  time: string;
  status: "scheduled" | "live" | "finished";
  teamA: CompetitionTeam;
  teamB: CompetitionTeam;
  scoreA: number | null;
  scoreB: number | null;
  previousCourt?: number;
  previousSequence?: number;
};
export type CompetitionData = {
  dates: string[];
  venues: CompetitionVenue[];
  divisions: CompetitionDivision[];
  teams: CompetitionTeam[];
  matches: CompetitionMatch[];
};

const originalPlayers = ["김철수", "박훈이", "최맹구", "신짱구", "이유리", "신짱아"];
const surnames = ["김", "이", "박", "최", "문", "여", "마", "백", "송"];
const givenNames = ["철수", "유리", "맹구", "짱구", "짱아", "훈이"];
export const demoPlayerNames = [...new Set([
  ...originalPlayers,
  ...givenNames.flatMap(name => surnames.map(surname => surname + name)),
])].slice(0, 48);
const teamNames = [
  "달빛스매셔스", "궤도셔틀즈", "복숭아랠리", "새벽콕연구소",
  "구름드라이브", "노을네트단", "별빛헤어핀", "푸른궤적",
  "은하드롭샷", "민트클리어", "바람셔틀단", "오로라랠리즈",
  "달토끼민턴", "코랄스매셔스", "비눗방울콕", "해질녘드롭",
  "반달네트워크", "파도클리어즈", "초록코트단", "자몽드라이브",
  "번개헤어핀", "라일락셔틀", "해오름랠리", "도토리스매시",
];
export const demoTeams: CompetitionTeam[] = teamNames.map((name, index) => ({
  id: `team-demo-${index + 1}`, name,
  players: demoPlayerNames.slice(index * 2, index * 2 + 2),
}));
const teams = demoTeams;

const divisionSpecs = [
  ["혼복", 20, "초심"], ["남복", 20, "D"], ["여복", 20, "초심"],
  ["혼복", 30, "D"], ["남복", 30, "C"], ["여복", 30, "D"],
  ["혼복", 40, "C"], ["남복", 40, "초심"], ["여복", 40, "C"],
  ["혼복", 20, "B"], ["남복", 30, "A"], ["여복", 40, "B"],
] as const;

function parseDates(tournament: TournamentPreview): string[] {
  const matches = tournament.dates.match(/(\d{4})\.(\d{2})\.(\d{2})/g) ?? [];
  return [...new Set(matches.map((date) => date.replaceAll(".", "-")))];
}

export function splitVenueNames(value: string): string[] {
  const names: string[] = [];
  let depth = 0;
  let current = "";
  for (const character of value) {
    if (character === "(" || character === "（") depth += 1;
    if (character === ")" || character === "）") depth = Math.max(0, depth - 1);
    if ((character === "," || character === "，") && depth === 0) {
      if (current.trim()) names.push(current.trim());
      current = "";
    } else current += character;
  }
  if (current.trim()) names.push(current.trim());
  return [...new Set(names)];
}

export function getCompetitionData(tournament: TournamentPreview): CompetitionData {
  const dates = parseDates(tournament);
  // Venue names are sourced; court counts, divisions, fixtures and scores are demo data.
  const venueNames = splitVenueNames(tournament.venue ?? "경기장 미확인");
  const venues: CompetitionVenue[] = venueNames.map((name, index) => ({
    id: `venue-${index + 1}`, name, courts: Array.from({ length: Math.ceil(12 / venueNames.length) }, (_, index) => index + 1),
  }));
  const divisions: CompetitionDivision[] = dates.flatMap((date) => divisionSpecs.map(([event, age, grade]) => {
    const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
    const id = `division-${date}-${event}-${age}-${grade}`;
    return { id, event, age, grade, date, label: `${event}-${age}-${grade}(${weekday})`, teamCount: 0, matchCount: 0 };
  }));
  const courtPool = venues.flatMap((venue) => venue.courts.map((court) => ({ venue, court })));
  // Three round-robin rounds; disjoint pairs can play at the same time.
  const pairs: Array<[number, number, number, number]> = [
    [0, 1, 25, 19], [2, 3, 21, 25],
    [0, 2, 18, 25], [1, 3, 25, 23],
    [0, 3, 25, 22], [1, 2, 20, 25],
  ];
  const matches: CompetitionMatch[] = [];
  dates.forEach((date) => {
    const dateDivisions = divisions.filter((division) => division.date === date);
    dateDivisions.forEach((division, divisionIndex) => {
      ([1, 2] as const).forEach((group) => {
        const groupStart = (divisionIndex % 3) * 8 + (group - 1) * 4;
        pairs.forEach(([a, b, finalScoreA, finalScoreB], pairIndex) => {
          const courtIndex = (divisionIndex % 3) * 4 + (group - 1) * 2 + pairIndex % 2;
          const { venue, court } = courtPool[courtIndex];
          const timeSlot = Math.floor(divisionIndex / 3) * 3 + Math.floor(pairIndex / 2);
          const minute = 8 * 60 + 30 + timeSlot * 20;
          const time = `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
          const finished = tournament.status === "종료" || timeSlot < 3;
          const live = !finished && timeSlot === 3;
          matches.push({
            id: `match-${date}-${venue.id}-c${court}-s${10 + timeSlot}`,
            divisionId: division.id, date, venueId: venue.id, court,
            sequence: 10 + timeSlot, group, time,
            status: finished ? "finished" : live ? "live" : "scheduled",
            teamA: teams[groupStart + a], teamB: teams[groupStart + b],
            scoreA: finished ? finalScoreA : live ? 15 : null,
            scoreB: finished ? finalScoreB : live ? 13 : null,
          });
        });
      });
    });
  });
  const divisionStats = new Map<string, { matches: number; teamIds: Set<string> }>();
  matches.forEach((match) => {
    const stats = divisionStats.get(match.divisionId) ?? { matches: 0, teamIds: new Set<string>() };
    stats.matches += 1;
    stats.teamIds.add(match.teamA.id);
    stats.teamIds.add(match.teamB.id);
    divisionStats.set(match.divisionId, stats);
  });
  divisions.forEach((division) => {
    const stats = divisionStats.get(division.id);
    division.matchCount = stats?.matches ?? 0;
    division.teamCount = stats?.teamIds.size ?? 0;
  });
  return { dates, venues, divisions, teams, matches };
}
