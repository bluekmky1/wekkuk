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

const teams: CompetitionTeam[] = [
  { id: "team-deokcheon", name: "덕천클럽", players: ["마재훈", "마재혁"] },
  { id: "team-unicock", name: "유니콕", players: ["김민준", "이서준"] },
  { id: "team-byeolnuri", name: "별누리클럽", players: ["박서연", "최지우"] },
  { id: "team-stun", name: "STUN", players: ["정현우", "윤도현"] },
  { id: "team-four", name: "콕사랑", players: ["한지민", "오지훈"] },
  { id: "team-five", name: "스매시클럽", players: ["강민호", "조은우"] },
  { id: "team-six", name: "셔틀콕", players: ["임수빈", "배준호"] },
  { id: "team-seven", name: "라온클럽", players: ["서준혁", "문채원"] },
];

const venues: CompetitionVenue[] = [
  { id: "venue-ichung-center", name: "이충문화체육센터", courts: [1, 2, 3, 4, 5, 6] },
  { id: "venue-ichung-indoor", name: "이충실내배드민턴장", courts: [1, 2, 3, 4, 5, 6, 7, 8] },
];

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

export function getCompetitionData(tournament: TournamentPreview): CompetitionData {
  const dates = parseDates(tournament);
  const divisions: CompetitionDivision[] = dates.flatMap((date) => divisionSpecs.map(([event, age, grade]) => {
    const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
    const id = `division-${date}-${event}-${age}-${grade}`;
    return { id, event, age, grade, date, label: `${event}-${age}-${grade}(${weekday})`, teamCount: 0, matchCount: 0 };
  }));
  const times = ["08:30", "09:30", "10:30", "10:50", "11:10", "11:30", "11:50", "12:10", "12:30", "12:50", "13:10"];
  const courtPool = venues.flatMap((venue) => venue.courts.map((court) => ({ venue, court })));
  const pairs: Array<[number, number, number, number]> = [
    [2, 1, 25, 13], [0, 1, 7, 25], [0, 2, 12, 25],
    [0, 3, 25, 20], [1, 3, 15, 25], [2, 3, 18, 25],
  ];
  const matches: CompetitionMatch[] = [];
  dates.forEach((date) => {
    const dateDivisions = divisions.filter((division) => division.date === date);
    let matchIndex = 0;
    dateDivisions.forEach((division, divisionIndex) => {
      ([1, 2] as const).forEach((group) => {
        const groupStart = group === 1 ? 0 : 4;
        pairs.forEach(([a, b, finalScoreA, finalScoreB], pairIndex) => {
          const { venue, court } = courtPool[matchIndex % courtPool.length];
          const timeSlot = Math.floor(matchIndex / courtPool.length);
          const time = times[timeSlot];
          const teamA = teams[groupStart + a];
          const teamB = teams[groupStart + b];
          const finished = divisionIndex === 0 || timeSlot === 0;
          const live = !finished && timeSlot === 1;
          matches.push({
            id: `match-${date}-${venue.id}-c${court}-s${10 + timeSlot}`,
            divisionId: division.id,
            date,
            venueId: venue.id,
            court,
            sequence: 10 + timeSlot,
            group,
            time,
            status: finished ? "finished" : live ? "live" : "scheduled",
            teamA,
            teamB,
            scoreA: finished ? finalScoreA : live ? 15 : null,
            scoreB: finished ? finalScoreB : live ? 13 : null,
            ...(pairIndex === 0 ? { previousCourt: court === 1 ? 5 : court - 1, previousSequence: 12 } : {}),
          });
          matchIndex += 1;
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
