import type { TournamentPreview } from "~/types/home";

export type TournamentRule = { title: string; paragraphs?: string[]; bullets?: string[]; images?: string[]; sourceUrl?: string };
export function getTournamentRules(tournament: TournamentPreview): TournamentRule[] {
  const rules: TournamentRule[] = [
    { title: "📌 대회 안내", bullets: [tournament.title, tournament.dates, tournament.venue || tournament.location] },
    { title: "📝 접수 안내", paragraphs: [
      `접수기간: ${tournament.registration || "원문 요강 확인"}`,
      `참가비: ${tournament.entryFee || "원문 요강 확인"}`,
    ] },
  ];
  if (tournament.sourceId === "3980") rules.push({ title: "🏸 참가 자격", paragraphs: ["협회에 등록된 회원을 대상으로 합니다. 미성년자는 보호자의 동의가 필요합니다.", "연령은 출생연도를 기준으로 하며, 복식과 혼합복식 출전 시 연령과 급수를 일치시켜야 합니다."] });
  if (tournament.sourceId === "3991") rules.push({ title: "⏰ 경기 일정", paragraphs: ["경기 시작: 2026년 10월 11일 오전 8시", "입장식: 오후 1시"] });
  rules.push({ title: "📋 대회요강", images: tournament.outlineImages, paragraphs: tournament.outlineImages?.length ? [] : ["BKPLAY에 게시된 추가 요강은 원문에서 확인해 주세요."], sourceUrl: tournament.sourceUrl });
  return rules;
}

export type QuestionComment = { id: string; author: string; content: string; createdAt: string; attachments?: string[] };
export type TournamentQuestion = {
  id: string; category: string; title: string; private: boolean; date: string; views: number;
  content: string; comments: QuestionComment[];
};
export const questionCategories = ["전체", "공지사항", "기타", "대진표 문의"] as const;
export const tournamentQuestions: TournamentQuestion[] = [
  { id: "q1", category: "공지", title: "이의제기 관련 공지드립니다", private: false, date: "2026-10-17", views: 1234,
    content: "안녕하세요, 위꾹입니다! 🏸\n\n대회 참가와 경기 결과에 관한 이의제기는 대회 운영본부로 문의해 주세요.\n\n원활한 확인을 위해 참가 부문, 선수 이름, 경기장과 코트 정보를 함께 남겨주시면 감사하겠습니다.", comments: [] },
  { id: "q2", category: "기타", title: "샤워시설 이용할 수 있나요?", private: true, date: "2026-10-17", views: 1234,
    content: "안녕하세요. 대회 당일 체육관 내 샤워시설을 이용할 수 있는지 문의드립니다.\n\n이용 가능한 시간이나 별도로 준비해야 할 물품이 있다면 안내 부탁드립니다.",
    comments: [{ id: "q2-comment-1", author: "관리자", content: "시설 이용 안내는 대회 운영본부에서 확인해 드릴게요.", createdAt: "2026-10-27T20:50:00+09:00" }] },
  { id: "q3", category: "대진표 문의", title: "대진표가 이상해요 코트가 안보임", private: true, date: "2026-10-17", views: 1234,
    content: "안녕하세요, 위꾹입니다! 🏸\n\n대회가 끝난 후 경기 결과를 친구나 가족, 클럽 회원들과 공유하고 싶었던 적 있으신가요?\n\n이제 경기 공유 기능을 통해 내 경기 결과를 더욱 간편하게 전달할 수 있습니다.",
    comments: [
      { id: "q3-comment-1", author: "관리자", content: "알겠습니다!", createdAt: "2026-10-27T20:50:00+09:00" },
      { id: "q3-comment-2", author: "글쓴이", content: "확인 감사합니다", createdAt: "2026-10-27T20:55:00+09:00" },
    ] },
];
