import { Bell } from "lucide-react";
import { PushLink } from "~/components/PushLink";
import { notifications } from "~/data/notifications";

export function HomeHeader({ hasUnreadNotifications = notifications.some((notification) => !notification.read) }: { hasUnreadNotifications?: boolean }) {
  return (
    <div className="sticky top-0 z-40 bg-neutral-surface">
      <header className="flex h-12 items-center justify-between rounded-b-[24px] bg-neutral-white px-5">
        <div className="flex items-end gap-1" aria-label="Wekkuk live">
          <span className="font-brand text-[30px] leading-none">Wekkuk</span>
          <span className="pb-0.5 text-caption">live</span>
        </div>
        <PushLink
          to="/notifications"
          aria-label={hasUnreadNotifications ? "알림, 읽지 않은 알림 있음" : "알림, 새 알림 없음"}
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center"
        >
          <Bell size={25} strokeWidth={2.3} aria-hidden="true" />
          {hasUnreadNotifications && <span className="absolute right-[7px] top-[4px] h-1 w-1 rounded-full bg-error" aria-hidden="true" />}
        </PushLink>
      </header>
    </div>
  );
}
