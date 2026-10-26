import type { MetaFunction } from "@remix-run/node";
import { NotificationList } from "~/components/features/notifications/NotificationList";
import { AppBar, StickyHeader } from "~/components/ui";
import { notifications } from "~/data/notifications";
import { useBackNavigation } from "~/navigation";

export const meta: MetaFunction = () => [{ title: "알림 | 위꾹" }];

export default function NotificationsPage() {
  const goBack = useBackNavigation();

  return <div className="flex min-h-full flex-col bg-neutral-white">
    <StickyHeader className="border-b border-neutral-border"><AppBar title="알림" onBack={goBack} /></StickyHeader>
    <main className="flex-1 pb-8"><NotificationList notifications={notifications} /></main>
  </div>;
}
