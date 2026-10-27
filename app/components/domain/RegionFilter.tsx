import { useState, Fragment } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { regions, normalizeRegion } from "~/data/regions";

export function RegionFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const selected = normalizeRegion(value);
  const [expanded, setExpanded] = useState(() => regions.find(region => selected.startsWith(region.name))?.name ?? "경기");
  const choose = (target: string, label: string) => <button key={target} type="button" aria-pressed={selected === target} onClick={() => onChange(target)} className={`flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-body ${selected === target ? "bg-[#eaf3fd] font-semibold text-[#005eb8]" : "bg-neutral-white text-neutral-text"}`}><span>{label}</span>{selected === target && <Check size={16} aria-hidden="true" />}</button>;
  return <div>
    <div className="mb-3">{choose("", "지역 전체")}</div>
    <div className="overflow-hidden rounded-xl border border-neutral-border">{Array.from({ length: Math.ceil(regions.length / 3) }, (_, row) => {
      const group = regions.slice(row * 3, row * 3 + 3);
      const active = group.find(region => region.name === expanded);
      return <Fragment key={row}><div className="grid grid-cols-3">{group.map(region => <button key={region.name} type="button" aria-expanded={expanded === region.name} aria-controls={`region-${region.name}`} onClick={() => setExpanded(expanded === region.name ? "" : region.name)} className={`flex min-h-12 items-center justify-between border-b border-r border-neutral-border px-3 text-body ${expanded === region.name ? "bg-neutral-surface font-bold" : "bg-neutral-white"}`}><span>{region.name}</span>{expanded === region.name ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}</button>)}</div>{active && <div id={`region-${active.name}`} className="grid grid-cols-2 gap-2 border-b border-neutral-border bg-neutral-surface p-3">{choose(active.name, `${active.name} 전체`)}{active.cities.map(city => choose(`${active.name} ${city}`, city))}</div>}</Fragment>;
    })}</div>
  </div>;
}
