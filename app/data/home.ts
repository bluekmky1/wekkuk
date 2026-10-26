import type { NoticePreview, TournamentPreview } from "~/types/home";

const octoberTournament: Omit<TournamentPreview, "id"> = {
  title: "2026 제12회 고양특례시 의회 의장배 중년부 생활체육 배드민턴대회",
  location: "경기 고양",
  dates: "2026.10.24 (토) ~ 2026.10.25 (일)",
  month: 10,
  type: "생활체육",
  status: "경기 준비",
};

// Sample entries keep the supplied October mockup visible until live tournament data is connected.
export const tournaments: TournamentPreview[] = [
  ...[1, 2, 3, 4, 5].map((id) => ({
    id: `october-${id}`,
    ...octoberTournament,
    ...(id === 1 ? { title: "2026 고양오픈 국제 배드민턴 페스티벌", dates: "2026.10.17 (토) ~ 2026.10.18 (일)" } : {}),
    promoted: id === 2,
  })),
  { id: "october-6", title: "2026 용인 배드민턴 가을 오픈대회", location: "경기 용인", dates: "2026.10.10 (토) ~ 2026.10.11 (일)", month: 10, type: "오픈", status: "경기 준비" },
  { id: "november-1", title: "2026 안양시 생활체육 배드민턴대회", location: "경기 안양", dates: "2026.11.07 (토) ~ 2026.11.08 (일)", month: 11, type: "생활체육", status: "경기 준비" },
  { id: "november-2", title: "2026 경기 북부 배드민턴 오픈대회", location: "경기 고양", dates: "2026.11.14 (토) ~ 2026.11.15 (일)", month: 11, type: "오픈", status: "경기 준비" },
  { id: "november-3", title: "2026 수원시 배드민턴 연합회장배 대회", location: "경기 수원", dates: "2026.11.21 (토) ~ 2026.11.22 (일)", month: 11, type: "생활체육", status: "경기 준비" },
  { id: "november-4", title: "2026 고양 배드민턴 랭킹전", location: "경기 고양", dates: "2026.11.28 (토) ~ 2026.11.29 (일)", month: 11, type: "랭킹전", status: "경기 준비" },
  { id: "november-5", title: "2026 의정부 생활체육 배드민턴 한마당", location: "경기 의정부", dates: "2026.11.01 (일) ~ 2026.11.01 (일)", month: 11, type: "생활체육", status: "경기 준비" },
  { id: "november-6", title: "2026 성남 배드민턴 가을 오픈", location: "경기 성남", dates: "2026.11.22 (일) ~ 2026.11.22 (일)", month: 11, type: "오픈", status: "경기 준비" },
  { id: "december-1", title: "2026 경기 남부 배드민턴 오픈대회", location: "경기 수원", dates: "2026.12.05 (토) ~ 2026.12.06 (일)", month: 12, type: "오픈", status: "경기 준비" },
  { id: "december-2", title: "2026 안양시 배드민턴 송년대회", location: "경기 안양", dates: "2026.12.12 (토) ~ 2026.12.13 (일)", month: 12, type: "생활체육", status: "경기 준비" },
  { id: "december-3", title: "2026 고양 배드민턴 랭킹전 결선", location: "경기 고양", dates: "2026.12.19 (토) ~ 2026.12.20 (일)", month: 12, type: "랭킹전", status: "경기 준비" },
  { id: "december-4", title: "2026 경기 연말 배드민턴 페스티벌", location: "경기 광명", dates: "2026.12.26 (토) ~ 2026.12.27 (일)", month: 12, type: "생활체육", status: "경기 준비" },
  { id: "december-5", title: "2026 용인 배드민턴 겨울맞이 오픈", location: "경기 용인", dates: "2026.12.06 (일) ~ 2026.12.06 (일)", month: 12, type: "오픈", status: "경기 준비" },
  { id: "december-6", title: "2026 부천 배드민턴 연말 친선대회", location: "경기 부천", dates: "2026.12.20 (일) ~ 2026.12.20 (일)", month: 12, type: "생활체육", status: "경기 준비" },
];

export const notices: NoticePreview[] = [
  {
    id: "notice-1",
    title: "[💡유용한 팁] 경기 공유로 더 간편하게 결과를 전달해 보세요",
    date: "2026.10.24",
  },
  {
    id: "notice-2",
    title: "[💡유용한 팁] 랭킹전 풀리그 자동 생성으로 대진표를 한번에 만드세요",
    date: "2026.10.24",
  },
  {
    id: "notice-3",
    title: "[📱아이폰앱] 위꾹 아이폰 앱 출시 및 설치 방법 안내",
    date: "2026.10.24",
  },
];
