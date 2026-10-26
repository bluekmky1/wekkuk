import { ChevronRight, ThumbsUp } from "lucide-react";

export function TournamentIntroduction({ title, dateLabel, location, organizer, onVenueClick, liked, likeCount, onLike }: { title: string; dateLabel: string; location: string; organizer: string; onVenueClick: () => void; liked: boolean; likeCount: number; onLike: () => void }) {
  return <div className="px-5 pt-3"><div className="aspect-[335/497] w-full bg-neutral-border" role="img" aria-label={`${title} 포스터 자리`} /><section className="pt-6" aria-labelledby="tournament-title"><div className="flex items-center justify-between gap-3"><span className="inline-block rounded-full bg-neutral-text px-3 py-1 text-caption font-semibold text-neutral-white">승급대회</span><button type="button" onClick={onLike} aria-label={`대회 좋아요 ${likeCount}개`} aria-pressed={liked} className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-2.5 text-caption ${liked ? "border-neutral-text bg-neutral-text text-neutral-white" : "border-neutral-border bg-neutral-white"}`}><ThumbsUp size={13} aria-hidden="true" /><span>{likeCount}</span></button></div><h1 id="tournament-title" className="mt-2 text-heading-lg font-bold leading-6">{title}</h1><p className="mt-1 text-body">{dateLabel}</p><div className="mt-6 flex items-center justify-between gap-3 text-body"><p>{location === "경기 고양" ? "어울림누리체육관 외" : `${location} 대회 체육관`}</p><button type="button" onClick={onVenueClick} className="flex shrink-0 items-center gap-1 text-caption text-neutral-subtext">장소보기<ChevronRight size={15} aria-hidden="true" /></button></div><div aria-label="대회 운영 기관" className="mt-6 space-y-1 text-caption leading-[18px]">
      {[
        [{ role: "주최", name: `${organizer} 체육회` }, { role: "주관", name: `${organizer} 배드민턴 협회` }],
        [{ role: "후원", name: organizer }, { role: "협찬", name: "트라이온, 팩토스타디움" }],
      ].map((row) => <dl key={row[0].role} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {row.map(({ role, name }) => <div key={role} className="inline-flex max-w-full shrink-0 items-baseline gap-x-1">
          <dt className="shrink-0 text-neutral-subtext">{role}</dt>
          <dd className="min-w-0 break-words">{name}</dd>
        </div>)}
      </dl>)}
    </div></section></div>;
}
