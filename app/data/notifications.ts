export type Notification = {
  id: string;
  title: string;
  createdAt: string;
  to: string;
  read: boolean;
};

// Read sample notifications show the list without an unread dot on the home bell.
// Replace with notification API data when the service is connected.
export const notifications: Notification[] = [
  { id: "notification-1", title: "대회 경기 일정 및 코트 변경 안내", createdAt: "2026-10-26T19:20:00+09:00", to: "/notices/notice-5", read: true },
  { id: "notification-2", title: "경기 공유로 더 간편하게 결과를 전달해 보세요", createdAt: "2026-10-25T10:00:00+09:00", to: "/notices/notice-1", read: true },
  { id: "notification-3", title: "위꾹 아이폰 앱 출시 및 설치 방법 안내", createdAt: "2026-10-24T09:00:00+09:00", to: "/notices/notice-3", read: true },
];
