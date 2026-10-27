import { Bell } from "lucide-react";
import { PushLink } from "~/components/PushLink";
import { notifications } from "~/data/notifications";

export function HomeHeader({ hasUnreadNotifications = notifications.some((notification) => !notification.read) }: { hasUnreadNotifications?: boolean }) {
  return (
    <div className="appbar-top-space sticky top-0 z-40 bg-neutral-surface">
      <header className="flex h-14 items-center justify-between px-5">
        <div className="flex items-end gap-1" aria-label="Wekkuk live">
          <span className="font-brand text-[24px] leading-none text-primary">Wekkuk</span>
          <span className="pb-0.5 text-caption text-secondary">live</span>
        </div>
        <PushLink
          to="/notifications"
          aria-label={hasUnreadNotifications ? "알림, 읽지 않은 알림 있음" : "알림, 새 알림 없음"}
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center"
        >
          <Bell size={24} strokeWidth={2} aria-hidden="true" />
          {hasUnreadNotifications && <span className="absolute right-[7px] top-[4px] h-1 w-1 rounded-full bg-error" aria-hidden="true" />}
        </PushLink>
      </header>
    </div>
  );
}
