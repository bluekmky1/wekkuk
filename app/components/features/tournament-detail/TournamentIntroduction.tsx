import { ChevronRight, ThumbsUp } from "lucide-react";

export function TournamentIntroduction({ title, dateLabel, location, organizer, venue, host, type, posterUrl, supporters, sponsors, liked, likeCount, onLike }: { title: string; dateLabel: string; location: string; organizer: string; venue?: string; host?: string; type?: string; posterUrl?: string; supporters?: string; sponsors?: string; liked: boolean; likeCount: number; onLike: () => void }) {
  return <div className="px-5 pt-3">{posterUrl ? <img src={posterUrl} alt={`${title} 포스터`} className="aspect-[335/497] w-full bg-neutral-border object-contain" referrerPolicy="no-referrer" /> : <div className="aspect-[335/497] w-full bg-neutral-border" role="img" aria-label={`${title} 포스터 자리`} />}<section className="pt-6" aria-labelledby="tournament-title"><div className="flex items-center justify-between gap-3"><span className="inline-block rounded-full bg-primary px-3 py-1 text-caption font-semibold text-neutral-white">{type ?? "승급대회"}</span><button type="button" onClick={onLike} aria-label={`대회 좋아요 ${likeCount}개`} aria-pressed={liked} className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-2.5 text-caption ${liked ? "border-[#b6d6f7] bg-[#eaf3fd] font-semibold text-[#005eb8]" : "border-[#cbd0d7] bg-neutral-white text-[#596273]"}`}><ThumbsUp size={12} aria-hidden="true" /><span>{likeCount}</span></button></div><h1 id="tournament-title" className="mt-2 text-heading-lg font-bold leading-6">{title}</h1><p className="mt-1 text-body">{dateLabel}</p><div className="mt-6 flex items-center justify-between gap-3 text-body"><p>{venue ?? location}</p><a href={`https://map.naver.com/p/search/${encodeURIComponent(venue ?? location)}`} target="_blank" rel="noopener noreferrer" aria-label="네이버지도에서 대회 장소 보기 (새 창)" className="flex shrink-0 items-center gap-1 text-caption text-neutral-subtext">장소보기<ChevronRight size={16} aria-hidden="true" /></a></div><div aria-label="대회 운영 기관" className="mt-6 space-y-1 text-caption leading-[18px]">
      {[
        [{ role: "주최", name: host ?? organizer }, { role: "주관", name: organizer }],
        [{ role: "후원", name: supporters || "—" }, { role: "협찬", name: sponsors || "—" }],
      ].map((row) => <dl key={row[0].role} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {row.map(({ role, name }) => <div key={role} className="inline-flex max-w-full shrink-0 items-baseline gap-x-1">
          <dt className="shrink-0 font-normal text-neutral-subtext">{role}</dt>
          <dd className="min-w-0 break-words font-semibold text-neutral-text">{name}</dd>
        </div>)}
      </dl>)}
    </div></section></div>;
}
