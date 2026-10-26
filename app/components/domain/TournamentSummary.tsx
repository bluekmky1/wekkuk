import { CalendarDays, MapPin } from "lucide-react";

export type TournamentSummaryProps = { title: string; location: string; dates: string; className?: string };

/** Shared tournament name, region, and schedule content used by each card layout. */
export function TournamentSummary({ title, location, dates, className = "" }: TournamentSummaryProps) {
  return <span className={`block min-w-0 ${className}`}>
    <span className="block text-heading font-semibold leading-[21px]">{title}</span>
    <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-neutral-text">
      <span className="inline-flex items-center gap-1"><MapPin size={13} aria-hidden="true" />{location}</span>
      <span className="inline-flex items-center gap-1"><CalendarDays size={13} aria-hidden="true" />{dates}</span>
    </span>
  </span>;
}
