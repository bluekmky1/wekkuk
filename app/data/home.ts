import type { NoticePreview, TournamentPreview } from "~/types/home";

import bkplayTournaments from "./bkplay-tournaments.json";
import sampleTournaments from "./sample-tournaments.json";
import importedImages from "./tournament-image-assets.json";

const imageAssets: Record<string, { thumbnailUrl?: string; displayPosterUrl?: string; outlineImages: string[] }> = importedImages;

// Public BKPLAY facts; the importer preserves source IDs and source links.
export const tournaments: TournamentPreview[] = [
  ...bkplayTournaments.map((tournament) => ({
    ...tournament, ...imageAssets[tournament.sourceId],
  })) as TournamentPreview[],
  ...sampleTournaments as TournamentPreview[],
];

// Preserve previously shared prototype links after replacing the data source.
const legacyIds: Record<string, string> = {
  "october-1": "3960", "october-2": "3961",
  "november-1": "4008", "november-2": "3989", "november-3": "4012",
  "november-4": "4010", "november-5": "4005", "november-6": "4031",
  "finished-october-1": "3991",
};
export function findTournament(id: string | undefined) {
  return tournaments.find((item) => item.id === id || item.sourceId === legacyIds[id ?? ""]);
}

export const notices: NoticePreview[] = [
  {
    id: "notice-1",
    title: "경기 공유로 더 간편하게 결과를 전달해 보세요",
    date: "2026.10.24",
  },
  {
    id: "notice-2",
    title: "랭킹전 풀리그 자동 생성으로 대진표를 한번에 만드세요",
    date: "2026.10.24",
  },
  {
    id: "notice-3",
    title: "위꾹 아이폰 앱 출시 및 설치 방법 안내",
    date: "2026.10.24",
  },
];
