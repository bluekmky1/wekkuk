import { metadataText } from "~/components/ui/styles";
import { CalendarDays, ChevronRight, UsersRound } from "lucide-react";

export type PlayerResult = { id: string; tournament: string; dates: string; dateKey: string; names: string; division: string };
export function PlayerResultCard({ result, onSelect }: { result: PlayerResult; onSelect?: () => void }) {
  return <article className="relative rounded-xl border border-neutral-text p-3 pr-8">
    <h2 className="line-clamp-2 text-heading font-semibold leading-5">{result.tournament}</h2>
    <p className={`mt-1 flex items-center gap-1.5 ${metadataText}`}><CalendarDays size={12} strokeWidth={2} aria-hidden="true" />{result.dates.replace(/\b\d{4}\./g, "")}</p>
    <p className="mt-1 text-heading font-semibold leading-5">{result.names}</p>
    <p className={`mt-1 flex items-center gap-1.5 ${metadataText}`}><UsersRound size={12} strokeWidth={2} aria-hidden="true" />{result.division}</p>
    {onSelect && <button type="button" onClick={onSelect} aria-label={`${result.names}, ${result.tournament} 선수 상세 보기`} className="absolute inset-0 z-10 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />}
    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2" size={26} strokeWidth={2.4} aria-hidden="true" />
  </article>;
}
