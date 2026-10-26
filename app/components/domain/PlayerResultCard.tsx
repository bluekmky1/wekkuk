import { CalendarDays, ChevronRight, UsersRound } from "lucide-react";

export type PlayerResult = { id: string; tournament: string; dates: string; dateKey: string; names: string; division: string };
export function PlayerResultCard({ result }: { result: PlayerResult }) {
  return <article className="relative rounded-xl border border-neutral-text p-3 pr-8">
    <h2 className="line-clamp-2 text-heading font-semibold leading-5">{result.tournament}</h2>
    <p className="mt-1 flex items-center gap-1.5 text-body leading-[18px]"><CalendarDays size={14} strokeWidth={2} aria-hidden="true" />{result.dates}</p>
    <p className="mt-1 text-heading font-semibold leading-5">{result.names}</p>
    <p className="mt-1 flex items-center gap-1.5 text-caption"><UsersRound size={14} strokeWidth={2} aria-hidden="true" />{result.division}</p>
    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2" size={26} strokeWidth={2.4} aria-hidden="true" />
  </article>;
}
