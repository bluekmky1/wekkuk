# 컴포넌트 구성

컴포넌트는 재사용 범위에 따라 `ui`, `domain`, `features`로 나눕니다. 각 화면의 URL·탐색·상태는 `app/routes`가 관리하고, 화면 전용 조립은 `features`에 둡니다.

## 레이어

| 경로 | 역할 | 실제 사용 예 |
| --- | --- | --- |
| `app/components/ui/` | 특정 도메인에 종속되지 않는 버튼, 앱바, 칩, 검색 입력, 다이얼로그, 빈 상태, 섹션 헤더 등 공용 표현 요소 | 화면에서는 보통 `~/components/ui` 배럴에서 가져옵니다. 홈은 `AdBanner`, `ChipGroup`, `SectionHeader`, `IconButton`을 사용하고 공지 화면은 `AppBar`, `StickyHeader`, `ChipGroup`를 사용합니다. |
| `app/components/domain/` | 여러 화면에서 쓰는 도메인 정보의 표현 단위 | `ArticleListItem`은 공지·Q&A 목록에, `TournamentSummary`는 대회 카드·목록·검색 결과에 사용합니다. `MatchCard`는 팀 정보·중앙 점수·선수·시각·상태를 묶어 경기시간, 부문 일정, 갤러리에 표시합니다. 진행·예정 배지는 outline, 종료 배지는 채움 표현입니다. |
| `app/components/features/<feature>/` | 한 기능 화면의 섹션·목록·폼 등 화면 전용 조립 | `features/home/`의 홈 섹션, `features/notices/`의 `NoticeHeader`·`NoticeList`·긴 본문 `NoticeDetail`, `features/notifications/`의 `NotificationList`, `features/tournament-detail/`의 첨부파일·질문 스레드 등이 해당합니다. |

## 사용 기준

- 공용 표현 규칙은 `ui`에 둡니다. UI 컴포넌트는 페이지 전용 데이터나 라우팅을 알지 않게 합니다.
- 선택 칩은 기본 스타일로 통일합니다. 선택 시 검은 배경·흰 글자, 미선택 시 투명 배경·검은 테두리를 사용하며 별도의 색상 변형은 두지 않습니다.
- 대회·선수·공지·경기 같은 도메인 표현이 여러 화면에서 반복되면 `domain`으로 추출합니다. 화면별 배치와 고유 동작은 feature가 담당합니다.
- `features`는 기능 이름으로 폴더를 만들고 그 기능에서만 쓰는 화면 조각을 둡니다. 해당 컴포넌트는 필요한 `ui`·`domain` 요소를 조합합니다.
- 라우트는 URL 쿼리, 화면 진입·뒤로 가기 등 화면 흐름을 소유하고 feature에 표시 데이터를 전달합니다. `/notices`는 분류를 URL로 관리하며 최신 목록에는 검색 입력이 없지만 기존 `q` URL 검색과 이전 분류 값은 호환합니다. 홈 공지 미리보기와 공지 목록의 항목은 `/notices/:noticeId` 독립 상세로 이동합니다. 홈 알림은 `/notifications` 독립 라우트로 열고, `features/notifications/NotificationList.tsx`가 제목·발생 시간 행을 표시합니다. 데이터는 `app/data/notifications.ts`의 예시 3개이며 모두 읽은 상태이고 실제 알림 API는 연결되지 않았습니다. 알림 선택은 관련 공지 상세로 이동하고 뒤로 가면 알림 목록을 복원합니다.
- 대회 Q&A는 목록(`/tournaments/:tournamentId/questions`)과 상세(`/tournaments/:tournamentId/questions/:questionId`)를 독립 라우트로 둡니다. 목록 분류와 비밀글 제외는 URL 쿼리로 교체하고, 질문 선택은 상세로 push합니다. 질문·댓글은 `wekkuk-questions:${tournamentId}` localStorage 미리보기이며 실제 서버 API는 없습니다. 댓글 첨부는 파일명 표시만 하고 업로드하지 않습니다.
- 페이지에서 공용 UI를 가져올 때는 `~/components/ui` 배럴을 사용합니다. 호환을 위한 기존 루트 래퍼가 필요한 경우를 제외하고, 새 화면 구현은 각 레이어의 실제 경로를 따릅니다.

## 개발 검토

`/components`는 공용 UI를 개발 중 확인하는 검토 페이지입니다. 홈 맨 아래의 ‘컴포넌트 보기’ 텍스트 버튼으로 이동할 수 있습니다.

홈 인디케이터를 흉내 낸 검은 막대는 표시하지 않습니다. 하단 입력창 등은 safe-area 여백으로 기기의 시스템 UI 공간을 확보합니다.

앱은 `.app-scroll` 내부에서 스크롤하며 화면의 고정 요소와 `app-overlays` 포털도 앱 viewport 안에 제한됩니다. `ModalLayer`는 이 포털에 딤·시트·다이얼로그를 표시하고, 배경을 inert 처리하며 포커스 가두기와 Escape 닫기를 제공합니다. 데스크톱 fine pointer·hover 환경에서는 앱을 검은 7px 프레임에 넣고 공통 상태 표시줄 하나를 보입니다. 모바일은 전체 viewport를 사용합니다.

- `CommentComposer`: Q&A 상세와 경기 응원 탭에서 공유하는 하단 댓글 입력창입니다. 빈 댓글 등록을 막고, 첨부 파일명 표시·취소와 등록 후 입력 초기화를 처리합니다. 경기 응원 댓글은 대회·경기별 localStorage에 저장하며 실제 업로드나 서버 전송은 하지 않습니다.

- 홈 앱바는 상태바와 분리된 48px 높이이며, 하단 24px 곡면을 가집니다. `HomeHeader`의 알림 버튼은 `PushLink`로 `/notifications` 독립 화면을 엽니다. 알림 화면 AppBar는 왼쪽 정렬 제목 ‘알림’과 뒤로가기를 표시합니다. 예시 알림 3개는 읽은 상태여서 빨간 점이 없습니다. `ChoiceChip`의 미선택 배경은 투명하고 선택 배경은 검정입니다. 홈 검색 진입 버튼은 흰 내부 배경과 회색→진한 회색의 그라디언트 테두리를 겹쳐 표시합니다.

- `TournamentCompactItem`: 홈의 다가오는 대회와 컴포넌트 확인 페이지에서 사용하는 밀도 높은 목록 항목입니다. 한 줄 대회명 왼쪽에 작은 테두리 상태 배지를 두고, 지역·짧은 일정은 아래 줄에 표시하며 이미지 영역은 없습니다. 홈은 하나의 흰 목록 안에 월별 최대 6개와 더보기를 배치합니다. `TournamentCard`는 이미지가 있는 카드형 예시로 남겨둡니다.
