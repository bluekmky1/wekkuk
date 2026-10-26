import { PushLink } from "~/components/PushLink";
import { EmptyState } from "~/components/ui";
import type { Notification } from "~/data/notifications";

const timeFormat = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Seoul",
});

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  if (!notifications.length) return <EmptyState title="새로운 알림이 없어요" description="새 알림이 도착하면 이곳에서 확인할 수 있어요." />;

  return <ul>{notifications.map((notification) => <li key={notification.id} className="border-b border-neutral-border last:border-0">
    <PushLink to={notification.to} className="block px-5 py-5">
      <h2 className="text-body font-semibold leading-5">{notification.title}</h2>
      <time dateTime={notification.createdAt} className="mt-2 block text-caption text-neutral-subtext">{timeFormat.format(new Date(notification.createdAt))}</time>
    </PushLink>
  </li>)}</ul>;
}
