export type TournamentPreview = {
  id: string;
  title: string;
  location: string;
  dates: string;
  month: 10 | 11 | 12;
  type: "승급대회" | "전국대회" | "시구군대회" | "친선대회";
  sourceId?: string;
  startDate?: string;
  endDate?: string;
  posterUrl?: string;
  thumbnailUrl?: string;
  displayPosterUrl?: string;
  outlineImages?: string[];
  supporters?: string;
  sponsors?: string;
  venue?: string;
  host?: string;
  organizer?: string;
  entryFee?: string;
  registration?: string;
  sourceUrl?: string;
  sourceName?: string;
  verifiedAt?: string;
  promoted?: boolean;
  status?: "경기 준비" | "진행 중" | "종료";
};

export type NoticePreview = {
  id: string;
  title: string;
  date: string;
};
