import { PlayerSummaryCard } from "~/components/features/my/PlayerSummaryCard";
import { MyMenuItem } from "~/components/features/my/MyMenuItem";
import { RegionFilter } from "~/components/domain/RegionFilter";
import { Foundations } from "~/components/features/design-system/Foundations";
import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState, type ReactNode } from "react";
import { Bell } from "lucide-react";
import { SearchEmptyIllustration } from "~/components/ui/SearchEmptyIllustration";
import { BottomNav } from "~/components/BottomNav";
import { MatchCard } from "~/components/MatchCard";
import { TournamentCard } from "~/components/TournamentCard";
import { ArticleListItem } from "~/components/domain/ArticleListItem";
import { CourtInfo } from "~/components/domain/CourtInfo";
import { MatchStatusBadge } from "~/components/domain/MatchStatusBadge";
import { PlayerResultCard } from "~/components/domain/PlayerResultCard";
import { RecentSearchItem } from "~/components/domain/RecentSearchItem";
import { TournamentListItem } from "~/components/domain/TournamentListItem";
import { TournamentCompactItem } from "~/components/domain/TournamentCompactItem";
import { TournamentSearchItem } from "~/components/domain/TournamentSearchItem";
import { HeadToHeadTable } from "~/components/features/division/HeadToHeadTable";
import { StandingsTable } from "~/components/features/division/StandingsTable";
import { MatchScoreboard } from "~/components/features/match-detail/MatchScoreboard";
import {
  AdBanner, AppBar, Badge, BottomSheet, Button, ChipGroup, ChoiceChip, Dialog, Divider,
  EmptyState, FilterChip, IconButton, ListToolbar, SearchInput,
  SectionHeader, SectionNav, SegmentedControl, SelectOptionList, StickyHeader, TabBar, Toast,
} from "~/components/ui";
import { getCompetitionData } from "~/data/competition";
import { tournaments } from "~/data/home";
import { useBackNavigation } from "~/navigation";
import { getStandings } from "~/utils/competition";
import { scrollAppToElement } from "~/viewport";

export const meta: MetaFunction = () => [{ title: "컴포넌트 | 위꾹" }];

const tournament = tournaments[1];
const competition = getCompetitionData(tournament);
const division = competition.divisions[0];
const groupMatches = competition.matches.filter((match) => match.divisionId === division.id && match.group === 1);
const teams = competition.teams.slice(0, 4);
const sections = [{ value: "ui", label: "기본 UI" }, { value: "domain", label: "정보 아이템" }, { value: "feature", label: "화면 조합" }, { value: "colors", label: "색상" }, { value: "typography", label: "타이포" }, { value: "rules", label: "규칙" }];

function Example({ title, description, children, flush = false }: { title: string; description?: string; children: ReactNode; flush?: boolean }) {
  return <section className="overflow-hidden rounded-xl border border-neutral-border bg-neutral-white">
    <div className="border-b border-neutral-surface px-4 py-3">
      <h3 className="text-body font-bold">{title}</h3>
      {description && <p className="mt-1 text-caption text-neutral-subtext">{description}</p>}
    </div>
    <div className={flush ? "" : "p-4"}>{children}</div>
  </section>;
}

export default function ComponentsPage() {
  const goBack = useBackNavigation();
  const [selectedRegion, setSelectedRegion] = useState("경기 고양");
  const [section, setSection] = useState("ui");
  const [tab, setTab] = useState("draw");
  const [segment, setSegment] = useState("info");
  const [month, setMonth] = useState(10);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("전체");
  const [noticeCategory, setNoticeCategory] = useState("전체");
  const [overlay, setOverlay] = useState<"sheet" | "dialog" | null>(null);
  const [toast, setToast] = useState("");
  const [ascending, setAscending] = useState(true);
  const [recentVisible, setRecentVisible] = useState(true);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return <div className="min-h-full bg-neutral-surface">
    <StickyHeader>
      <AppBar title="컴포넌트" onBack={goBack} />
      <SectionNav label="컴포넌트 분류" items={sections} value={section} className="overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>button]:shrink-0" onChange={(value) => {
        setSection(value);
        scrollAppToElement(document.getElementById(`preview-${value}`), { behavior: "smooth" });
      }} />
    </StickyHeader>
    <main className="space-y-8 px-4 pb-10 pt-5">
      <p className="text-body leading-6 text-neutral-subtext">실제 화면에서 사용하는 컴포넌트입니다. 탭과 칩을 선택하거나 버튼을 눌러 상태를 확인할 수 있어요.</p>

      <section id="preview-ui" className="scroll-mt-32 space-y-4" aria-labelledby="ui-heading">
        <SectionHeader id="ui-heading" title="기본 UI" />
        <Example title="AppBar · SegmentedControl" description="앱바의 가운데 영역에 제목 또는 탭을 배치합니다." flush>
          <AppBar onBack={() => setToast("뒤로 가기 버튼을 눌렀어요.")} center={<SegmentedControl label="대회 화면 예시" items={[{ value: "info", label: "대회 정보" }, { value: "matches", label: "경기 정보" }]} value={segment} onChange={setSegment} />} />
          <p className="px-4 pb-4 text-caption text-neutral-subtext">선택: {segment === "info" ? "대회 정보" : "경기 정보"}</p>
        </Example>
        <Example title="TabBar" flush>
          <TabBar label="경기 보기 예시" items={[{ value: "draw", label: "대진표" }, { value: "schedule", label: "경기시간" }, { value: "disabled", label: "준비 중", disabled: true }]} value={tab} onChange={setTab} idPrefix="preview" />
          <div role="tabpanel" id={`preview-${tab}-panel`} aria-labelledby={`preview-${tab}-tab`} className="p-4 text-body">{tab === "draw" ? "대진표" : "경기시간"} 선택 상태</div>
        </Example>
        <Example title="ChoiceChip · ChipGroup · FilterChip" description="월은 바로 선택하고, 필터는 바텀시트를 엽니다.">
          <ChipGroup label="월 선택 예시" items={[10, 11, 12].map((value) => ({ value, label: `${value}월` }))} value={month} onChange={setMonth} />
          <div className="mt-4 flex flex-wrap gap-2"><ChoiceChip selected>선택</ChoiceChip><ChoiceChip>기본</ChoiceChip><ChoiceChip disabled>비활성</ChoiceChip><FilterChip selected={filter !== "전체"} onClick={() => setOverlay("sheet")}>{filter === "전체" ? "종목" : filter}</FilterChip></div>
          <ChipGroup className="mt-4" label="공지 분류 예시" items={["전체", "일반", "대회공지"].map((value) => ({ value, label: value }))} value={noticeCategory} onChange={setNoticeCategory} />
        </Example>
        <Example title="RegionFilter · 지역 선택" description="시·도를 펼친 뒤 전체 또는 세부 지역을 선택합니다. 실제 화면에서는 선택 즉시 바텀시트가 닫힙니다."><RegionFilter value={selectedRegion} onChange={setSelectedRegion} /><p className="mt-3 text-caption text-neutral-subtext">선택: {selectedRegion || "지역 전체"}</p></Example>
        <Example title="SearchInput" description="입력값과 지우기 동작을 공유합니다.">
          <div className="space-y-3"><SearchInput label="기본 검색 예시" placeholder="기본 검색" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} /><SearchInput label="배경 검색 예시" variant="filled" showIcon placeholder="검색" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} /><SearchInput label="테두리 검색 예시" variant="outlined" showIcon placeholder="대회를 검색해 보세요" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} /></div>
        </Example>
        <Example title="Button · IconButton · Dialog · Toast">
          <div className="flex flex-wrap items-center gap-2"><Button onClick={() => setOverlay("dialog")}>다이얼로그</Button><Button variant="outline" onClick={() => setToast("알림이 표시됩니다.")}>토스트</Button><Button variant="ghost" size="sm" disabled>비활성</Button><IconButton label="알림 예시" onClick={() => setToast("알림 버튼을 눌렀어요.")}><Bell size={24} /></IconButton></div>
          <Button className="mt-3" fullWidth onClick={() => setOverlay("sheet")}>바텀시트 · 옵션 선택</Button>
        </Example>
        <Example title="Badge · SectionHeader · ListToolbar">
          <div className="mb-5 flex gap-2"><Badge>일반</Badge><Badge tone="muted">안내</Badge><Badge tone="primary">진행 중</Badge><Badge tone="danger">코트 변경</Badge></div>
          <SectionHeader title="목록 제목" count={3} action={<Button variant="ghost" size="sm" onClick={() => setToast("더보기를 눌렀어요.")}>더보기</Button>} />
          <ListToolbar count={3} sortLabel={ascending ? "일자 순" : "최신 순"} onSort={() => setAscending(!ascending)} />
        </Example>
        <Example title="EmptyState" flush><EmptyState title="검색 결과가 없어요." description="검색어를 다시 확인해 주세요." illustration={<SearchEmptyIllustration />} action={<Button variant="outline" onClick={() => setToast("다시 검색을 눌렀어요.")}>다시 검색</Button>} /></Example>
        <Example title="AdBanner · BottomNav · 기기 표시" flush><div className="p-4"><AdBanner /></div><BottomNav selectedMonth={10} embedded /></Example>
      </section>

      <section id="preview-domain" className="scroll-mt-32 space-y-4" aria-labelledby="domain-heading">
        <SectionHeader id="domain-heading" title="정보 아이템" />
        <Example title="PlayerSummaryCard · MY 경기 요약"><PlayerSummaryCard /></Example>
        <Example title="MyMenuItem · Divider" description="메뉴 행 높이 56px, 영역 구분선 4px." flush><div className="px-4"><MyMenuItem label="참가 대회" onClick={() => setToast("참가 대회는 준비 중이에요.")} /></div><Divider /><div className="px-4"><MyMenuItem label="공지사항" to="/notices" /></div></Example>
        <Example title="TournamentCompactItem" description="홈의 밀도 높은 대회 항목. 대회명 왼쪽에 작은 테두리 상태 배지를 두고 아래에 지역·일정을 표시합니다." flush><TournamentCompactItem tournament={tournament} /></Example>
        <Example title="TournamentCard" description="이미지를 포함한 대회 카드형 예시입니다."><div className="rounded-xl bg-neutral-surface p-2"><TournamentCard tournament={tournament} /></div></Example>
        <Example title="TournamentListItem · TournamentSearchItem"><TournamentListItem tournament={tournament} showPromotion /><TournamentSearchItem tournament={tournament} onSelect={() => undefined} /></Example>
        <Example title="RecentSearchItem" description="항목 선택과 삭제를 각각 확인할 수 있습니다.">{recentVisible ? <RecentSearchItem label="고양" kind="region" onSelect={() => setToast("고양을 선택했어요.")} onDelete={() => setRecentVisible(false)} /> : <Button variant="outline" onClick={() => setRecentVisible(true)}>최근 검색 복원</Button>}</Example>
        <Example title="PlayerResultCard"><PlayerResultCard result={{ id: "preview-player", tournament: tournament.title, dates: tournament.dates, dateKey: "2026-10-24", names: "김철수 · 박훈이", division: "남복 · 20대 · D조" }} /></Example>
        <Example title="ArticleListItem" description="공지사항은 공개 항목, Q&A는 공개·비밀글을 같은 구조로 표시합니다."><ArticleListItem category="일반" title="대회 일정 안내" date="2026.10.24" views={125} onClick={() => setOverlay("dialog")} /><ArticleListItem category="Q&A" title="참가 신청 문의드립니다." date="2026.10.24" views={12} isPrivate onClick={() => setToast("비밀글 예시입니다.")} /></Example>
        <Example title="테두리 배지" description="경기 보기 같은 안내 라벨과 경기 상태에 사용하는 테두리형 배지입니다."><div className="flex flex-wrap items-center gap-2"><Badge tone="outline">경기 보기</Badge><MatchStatusBadge status="scheduled" /><MatchStatusBadge status="live" /></div></Example>
        <Example title="경기 준비 배지" description="홈 대회 목록에 사용하는 작은 상태 배지입니다. Micro 11px / 14px, Semibold 600."><MatchStatusBadge status="scheduled" label="경기 준비" size="sm" /></Example>
        <Example title="MatchStatusBadge · CourtInfo"><div className="flex gap-2">{(["finished", "live", "scheduled"] as const).map((status) => <MatchStatusBadge key={status} status={status} />)}</div><p className="mt-4 flex flex-wrap items-center gap-1.5 text-caption"><CourtInfo match={groupMatches[0]} venue={competition.venues[0].name} /></p></Example>
        <Example title="MatchCard" description="종료 · 진행 중 · 예정 상태. 각 항목은 같은 상태의 실제 경기 상세로 연결됩니다." flush>{(["finished", "live", "scheduled"] as const).map((status) => {
          const match = competition.matches.find((item) => item.status === status)!;
          return <MatchCard key={status} tournamentId={tournament.id} match={match} venue={competition.venues.find((venue) => venue.id === match.venueId)!.name} />;
        })}</Example>
      </section>

      <section id="preview-feature" className="scroll-mt-32 space-y-4" aria-labelledby="feature-heading">
        <SectionHeader id="feature-heading" title="화면 조합" />
        <Example title="StandingsTable" description="순위·팀은 고정하고 통계 열은 가로로 스크롤합니다." flush><StandingsTable rows={getStandings(teams, groupMatches)} caption="컴포넌트 예시 순위표" /></Example>
        <Example title="HeadToHeadTable" flush><div className="pt-4"><HeadToHeadTable teams={teams} matches={groupMatches} group={1} /></div></Example>
        <Example title="MatchScoreboard" flush><div className="py-5"><MatchScoreboard match={groupMatches[0]} division={division} venue={competition.venues[0]} /></div></Example>
      </section>
      <Foundations />
    </main>
    {overlay === "sheet" && <BottomSheet title="종목 선택" onClose={() => setOverlay(null)}><SelectOptionList label="종목 예시" options={["전체", "혼복", "남복", "여복"].map((value) => ({ value, label: value }))} value={filter} onChange={(value) => { setFilter(value); setOverlay(null); }} /></BottomSheet>}
    {overlay === "dialog" && <Dialog title="안내" onClose={() => setOverlay(null)}><p className="text-body leading-6">공지 본문과 안내를 표시하는 공통 다이얼로그입니다.</p><Button className="mt-5" fullWidth onClick={() => setOverlay(null)}>확인</Button></Dialog>}
    <Toast message={toast} onClose={() => setToast("")} />
  </div>;
}
