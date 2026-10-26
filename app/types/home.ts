export type TournamentPreview = {
  id: string;
  title: string;
  location: string;
  dates: string;
  month: 10 | 11 | 12;
  type: "생활체육" | "오픈" | "랭킹전";
  promoted?: boolean;
  status?: "경기 준비" | "진행 중" | "종료";
};

export type NoticePreview = {
  id: string;
  title: string;
  date: string;
};
