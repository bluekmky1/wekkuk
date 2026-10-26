import { notices as homeNotices } from "~/data/home";

export const noticeCategories = ["전체", "공지사항", "유용한 팁", "아이폰앱"] as const;
export type NoticeCategory = Exclude<(typeof noticeCategories)[number], "전체">;
export type NoticeContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "numbered-list"; items: string[] }
  | { type: "bullet-list"; items: string[] };
export type Notice = {
  id: string;
  category: NoticeCategory;
  title: string;
  date: string;
  views: number;
  content: NoticeContentBlock[];
};

const shareContent: NoticeContentBlock[] = [
  { type: "paragraph", text: "안녕하세요, 위꾹입니다! 🏸" },
  { type: "paragraph", text: "대회가 끝난 후 경기 결과를 친구나 가족, 클럽 회원들과 공유하고 싶었던 적 있으신가요?" },
  { type: "paragraph", text: "이제 경기 공유 기능을 통해 내 경기 결과를 더욱 간편하게 전달할 수 있습니다." },
  { type: "heading", text: "📢 경기 공유 기능 안내" },
  { type: "numbered-list", items: [
    "원하는 경기 찾기\n대회 상세 페이지에서 [경기시간] 또는 [대진표] 메뉴를 선택한 후 공유하고 싶은 경기를 찾아주세요.",
    "공유 버튼 누르기\n경기 상세 화면의 공유 버튼을 누르면 해당 경기의 정보를 간편하게 전달할 수 있습니다.",
    "경기 결과 함께 확인하기\n공유받은 링크를 통해 경기 일정, 참가 선수, 경기 점수 및 결과를 확인할 수 있습니다.",
  ] },
  { type: "heading", text: "💡 이런 상황에서 활용해 보세요!" },
  { type: "bullet-list", items: [
    "클럽 단체 채팅방에 우리 팀의 경기 결과를 공유할 때",
    "가족이나 친구에게 내 경기 일정을 알려주고 싶을 때",
    "함께 출전한 팀원들과 경기 기록을 확인할 때",
    "대회가 끝난 후 지난 경기 결과를 다시 살펴볼 때",
  ] },
  { type: "heading", text: "📌 이용 시 참고해 주세요" },
  { type: "paragraph", text: "공유된 경기 정보는 대회 운영 상황에 따라 달라질 수 있습니다. 위꾹과 함께 더 편리하게 경기를 확인해 보세요." },
  { type: "paragraph", text: "앞으로도 더 나은 서비스를 제공하기 위해 노력하겠습니다. 감사합니다." },
];

const homeEntries: Notice[] = homeNotices.map((notice, index) => ({
  ...notice,
  category: index < 2 ? "유용한 팁" : "아이폰앱",
  date: "2026-10-17",
  views: [1234, 1234, 1234][index],
  content: index === 0 ? shareContent : index === 1 ? [
    { type: "paragraph", text: "안녕하세요, 위꾹입니다!" },
    { type: "paragraph", text: "랭킹전 풀리그 대진표를 자동으로 생성해 대회 준비 시간을 줄여 보세요." },
    { type: "heading", text: "📢 풀리그 대진표 생성 안내" },
    { type: "numbered-list", items: ["대회 관리 화면에서 풀리그 방식을 선택해 주세요.", "참가 선수와 경기 조건을 확인한 뒤 자동 생성을 눌러주세요.", "생성된 대진표를 검토하고 필요한 내용을 수정해 저장해 주세요."] },
    { type: "paragraph", text: "선수 구성과 경기 조건에 따라 대진표가 달라질 수 있으니 저장 전에 한 번 더 확인해 주세요." },
  ] : [
    { type: "paragraph", text: "안녕하세요, 위꾹입니다! 📱" },
    { type: "paragraph", text: "위꾹 아이폰 앱을 설치하면 대회 일정과 경기 결과를 모바일에서 편리하게 확인할 수 있습니다." },
    { type: "heading", text: "📲 앱 설치 방법" },
    { type: "numbered-list", items: ["아이폰에서 App Store를 열어주세요.", "검색창에 ‘위꾹’을 입력한 뒤 앱을 선택해 주세요.", "받기를 누르고 설치가 끝나면 앱을 실행해 주세요."] },
    { type: "paragraph", text: "앱과 기기 버전에 따라 화면 구성이 다를 수 있습니다. 설치에 어려움이 있으면 위꾹 웹사이트를 이용해 주세요." },
  ] as NoticeContentBlock[],
}));

export const notices: Notice[] = [
  ...homeEntries,
  {
    id: "notice-4", category: "공지사항", title: "2026년 10월 서비스 운영 안내", date: "2026-10-16", views: 987,
    content: [
      { type: "paragraph", text: "안녕하세요, 위꾹입니다." },
      { type: "paragraph", text: "더 안정적인 서비스 제공을 위한 운영 일정을 안내해 드립니다." },
      { type: "heading", text: "서비스 이용 안내" },
      { type: "bullet-list", items: ["대회 일정과 경기 정보는 주최 측 등록 내용에 따라 업데이트됩니다.", "점검 시간에는 일부 화면 이용이 제한될 수 있습니다.", "불편 사항은 앱 내 문의 메뉴를 통해 알려주세요."] },
      { type: "paragraph", text: "이용에 참고해 주시기 바라며, 더 나은 서비스를 위해 노력하겠습니다. 감사합니다." },
    ],
  },
  {
    id: "notice-5", category: "공지사항", title: "대회 경기 일정 및 코트 변경 안내", date: "2026-10-15", views: 432,
    content: [
      { type: "paragraph", text: "대회 참가 선수 여러분께 안내드립니다." },
      { type: "paragraph", text: "대회 당일 운영 상황에 따라 경기 시간과 코트가 변경될 수 있습니다. 출발 전 최신 경기 정보를 확인해 주세요." },
      { type: "heading", text: "확인 방법" },
      { type: "numbered-list", items: ["대회 상세 화면에서 경기시간 메뉴를 선택합니다.", "경기 날짜와 경기장을 확인합니다.", "내 경기의 시작 시간과 코트 번호를 확인합니다."] },
    ],
  },
  {
    id: "notice-6", category: "유용한 팁", title: "경기 일정을 놓치지 않도록 미리 확인해 보세요", date: "2026-10-14", views: 328,
    content: [
      { type: "paragraph", text: "대회가 가까워지면 경기 시간을 미리 확인해 두세요." },
      { type: "paragraph", text: "대회 상세의 경기시간 메뉴에서 날짜와 경기장을 선택하면 코트별 경기 일정을 볼 수 있습니다." },
      { type: "heading", text: "빠르게 확인하는 방법" },
      { type: "bullet-list", items: ["참가 부문과 경기 날짜를 확인해 주세요.", "경기 시작 전 코트 변경 여부를 다시 확인해 주세요.", "함께 출전하는 팀원에게 경기 정보를 공유해 주세요."] },
    ],
  },
];
