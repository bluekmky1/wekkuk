import { AppBar, StickyHeader } from "~/components/ui";
import { useBackNavigation } from "~/navigation";

export function CompetitionHeader({ title, fallback }: { title: string; fallback: string }) {
  const goBack = useBackNavigation(fallback);
  return <StickyHeader layer={40}><AppBar title={title} onBack={goBack} /></StickyHeader>;
}
