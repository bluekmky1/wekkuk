export const tournamentRules: { title: string; paragraphs?: string[]; bullets?: string[] }[] = [
  {
    title: "📌 경기 방법 안내",
  },
  {
    title: "🎯 경기 방식",
    bullets: [
      "예선 경기는 랠리포인트 25점 1세트 경기로 진행되며, 듀스 없이 25점 선취 시 종료됩니다.",
      "본선 풀리그는 랠리포인트 21점 1세트 경기로 진행되며, 듀스 없이 21점 선취 시 종료됩니다.",
    ],
    paragraphs: ["단, 상황에 따라 집행부 판단으로 변경될 수 있음을 안내드립니다."],
  },
  {
    title: "🩹 부상 및 기권 처리",
    bullets: [
      "경기 중 부상으로 기권할 경우, 당시 점수 그대로 인정됩니다.",
      "기권승 및 몰수 경기는 25:0으로 처리되며, 해당 팀은 예선 순위 산정에서 제외됩니다.",
    ],
  },
  {
    title: "🔄 예선 리그 운영",
    bullets: [
      "[광고에 가려진 부분] 할 수 있습니다.",
      "예선 리그 종료 후, 본선 토너먼트 방식으로 진행됩니다.",
    ],
  },
  {
    title: "📊 본선 시드 배정 기준",
    bullets: [
      "각 조 1위 팀만 본선 진출 가능하며,",
      "예선 성적(👉 다승 → 득실차 → 팀 합산 연령)에 따라 유리한 시드 순으로 배정됩니다.",
      "부전승 자리가 있을 경우, 상위 성적 팀에 우선 배정됩니다.",
    ],
  },
  {
    title: "📈 예선 리그 순위 결정 기준",
    bullets: [
      "순위는 아래 순서에 따라 결정됩니다:",
      "✅ 다승 → ✅ 승자승 → ✅ 득실차 → ✅ 다득점 → ✅ 팀 합산 연령",
      "2팀이 동률인 경우: 승자승 우선 적용",
      "3팀 이상 동률인 경우: 승자승 미적용, 👉 득실차 → 다득점 순",
    ],
  },
  {
    title: "⛳ 출전 관련 유의사항",
    bullets: [
      "예선 첫 경기에서 기권 처리되었더라도, 이후 경기부터는 출전 가능합니다.",
      "경기 중 부상 발생 시, 최대 5분간 응급처치가 허용되며, 고의성이 확인되면 해당 경기는 몰수 처리됩니다.",
      "승부 조작 적발 시, 모든 경기는 즉시 몰수 처리됩니다.",
    ],
  },
  {
    title: "🥉 3위 결정 방식",
    bullets: [
      "공동 3위는 없습니다.",
      "4강전에서 최종 1위 팀에게 패한 팀이 자동 3위로 확정됩니다.",
    ],
  },
  {
    title: "📦 참가팀 부족 시 조정 안내",
    bullets: [
      "출전 팀이 4팀 미만일 경우, 대회본부는 다음과 같은 조치를 취할 수 있습니다:",
      "🔶 연령 통합 또는 🔶 급수 통합",
      "🔶 또는 해당 종목 취소",
      "선수열람 기간 내에 통보됩니다.",
      "통합 우선순위: ① 연령 통합 → ② 급수 통합",
    ],
  },
];

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
