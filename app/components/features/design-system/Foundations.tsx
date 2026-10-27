import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "~/components/ui";

const colorGroups = [
  { title: "브랜드 · 상태", tokens: ["primary", "secondary", "error"] },
  { title: "뉴트럴", tokens: ["neutral-white", "neutral-surface", "neutral-border", "neutral-muted", "neutral-subtext", "neutral-text"] },
];
const typeStyles = [
  { name: "Micro", token: "text-micro", size: "11 / 14px", className: "text-micro font-semibold", weight: "600", sample: "경기 준비 · 작은 상태 배지" },
  { name: "Heading LG", token: "text-heading-lg", size: "18 / 24px", className: "text-heading-lg font-bold", weight: "700", sample: "대회의 모든 순간을 함께" },
  { name: "Heading", token: "text-heading", size: "16 / 22px", className: "text-heading font-bold", weight: "700", sample: "다가오는 대회를 만나보세요" },
  { name: "Body", token: "text-body", size: "14 / 20px", className: "text-body font-normal", weight: "400", sample: "대회 일정과 경기 결과를 확인해 보세요." },
  { name: "Caption", token: "text-caption", size: "12 / 16px", className: "text-caption font-normal", weight: "400", sample: "2026.10.27 · 경기 고양" },
];

export function Foundations() {
  const [colors, setColors] = useState<Record<string, string>>({});
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    setColors(Object.fromEntries(colorGroups.flatMap(({ tokens }) => tokens.map((token) => [token, style.getPropertyValue(`--color-${token}`).trim().toUpperCase()]))));
  }, []);
  return <>
    <section id="preview-colors" className="scroll-mt-32 space-y-4" aria-labelledby="colors-heading">
      <SectionHeader id="colors-heading" title="색상" />
      <p className="text-body leading-6 text-neutral-subtext">현재 화면에서 사용하는 기본 색상입니다. 색상칩은 실제 CSS 변수를 참조합니다.</p>
      {colorGroups.map(({ title, tokens }) => <div key={title} className="rounded-xl border border-neutral-border bg-neutral-white p-4">
        <h3 className="mb-4 text-body font-bold">{title}</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-5">{tokens.map((token) => <div key={token}>
          <div role="img" aria-label={`${token} ${colors[token] ?? ""}`} className="mb-2 h-16 rounded-lg border border-black/10" style={{ backgroundColor: `var(--color-${token})` }} />
          <p className="break-all text-caption font-semibold">{token}</p>
          <p className="mt-0.5 text-caption text-neutral-subtext">{colors[token] || "—"}</p>
          <code className="mt-1 block break-all text-[10px] leading-4 text-neutral-subtext">--color-{token}</code>
        </div>)}</div>
      </div>)}
      <p className="text-caption text-neutral-subtext">현재는 원시 색상 토큰을 사용하며, 용도별 시멘틱 토큰은 아직 정의하지 않았습니다.</p>
    </section>
    <section id="preview-typography" className="scroll-mt-32 space-y-4" aria-labelledby="typography-heading">
      <SectionHeader id="typography-heading" title="타이포그래피" />
      <div className="rounded-xl border border-neutral-border bg-neutral-white p-4">
        <p className="text-caption text-neutral-subtext">기본 서체 · Pretendard</p>
        <p className="mt-3 text-heading-lg">가나다라 Aa Bb 0123</p>
        <p className="mt-2 text-caption leading-5 text-neutral-subtext">크기 / 줄 높이 · 굵기 순서로 표시합니다. 제목은 Bold, 본문은 Regular 예시입니다.</p>
      </div>
      <div className="divide-y divide-neutral-border overflow-hidden rounded-xl border border-neutral-border bg-neutral-white">{typeStyles.map((style) => <div key={style.token} className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-caption font-semibold">{style.name}</h3><span className="text-caption text-neutral-subtext">{style.size} · {style.weight}</span></div>
        <p className={`my-4 ${style.className}`}>{style.sample}</p>
        <code className="text-caption text-neutral-subtext">{style.token}</code>
      </div>)}</div>
      <div className="rounded-xl border border-neutral-border bg-neutral-white p-4">
        <h3 className="text-caption font-semibold">서체 굵기</h3>
        <div className="mt-3 space-y-3 text-body"><p className="font-normal">Regular 400 · 대회를 만나는 즐거움</p><p className="font-semibold">Semibold 600 · 대회를 만나는 즐거움</p><p className="font-bold">Bold 700 · 대회를 만나는 즐거움</p></div>
      </div>
      <div className="rounded-xl border border-neutral-border bg-neutral-white p-4">
        <h3 className="text-caption font-semibold">브랜드 서체 · 테나다</h3>
        <p className="my-4 font-brand text-3xl">Wekkuk live</p>
        <code className="text-caption text-neutral-subtext">font-brand · Tenada · 400</code>
      </div>
    </section>
    <section id="preview-rules" className="scroll-mt-32 space-y-4" aria-labelledby="rules-heading">
      <SectionHeader id="rules-heading" title="아이콘 · 간격 규칙" />
      <div className="rounded-xl border border-neutral-border bg-neutral-white p-4">
        <h3 className="text-body font-bold">아이콘 크기</h3>
        <p className="mt-2 text-caption text-neutral-subtext">기본 선 두께 2px. 홈 알림·앱바 24px, 하단 탐색 28px. 클릭 영역은 아이콘과 별도로 확보합니다.</p>
        <div className="mt-4 space-y-4">{[{ size: 12, label: "부가정보 · 날짜 · 지역" }, { size: 16, label: "화살표 · 보조 동작" }, { size: 20, label: "목록" }, { size: 24, label: "앱바 · 검색 · 홈 알림" }, { size: 28, label: "하단 탐색" }].map(({ size, label }) => <div key={size} className="flex items-center gap-3"><span className="flex w-8 justify-center"><Search size={size} strokeWidth={2} aria-hidden="true" /></span><p className="text-caption">{size}px · {label}</p></div>)}</div>
      </div>
      <div className="rounded-xl border border-neutral-border bg-neutral-white p-4">
        <h3 className="text-body font-bold">4px 단위 간격</h3>
        <div className="mt-4 space-y-4">{[{ value: 4, label: "아이콘과 짧은 텍스트" }, { value: 8, label: "제목 → 콘텐츠 · 칩 사이" }, { value: 12, label: "필터 → 첫 항목 · 카드 안쪽" }, { value: 16, label: "패널 안쪽" }, { value: 20, label: "화면 좌우 여백" }, { value: 24, label: "홈 섹션 사이" }].map(({ value, label }) => <div key={value}><div className="flex items-center gap-3"><span style={{ width: value }} className="h-2 shrink-0 rounded bg-neutral-text" /><p className="text-caption">{value}px · {label}</p></div></div>)}</div>
        <p className="mt-4 text-caption text-neutral-subtext">인접 영역의 여백을 중복하지 않습니다. 화면 너비와 스크롤 방향에 따라 배치는 조정합니다.</p>
      </div>
    </section>
  </>;
}
