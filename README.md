# 위꾹 UX 프로토타입

위꾹 모바일 웹 사용자 경험 검증을 위한 Remix 프로토타입입니다. [remix-boiler-plate](https://github.com/bluekmky1/remix-boiler-plate)를 기반으로 시작했으며, Remix는 같은 2.x 계열의 2.17.5로 업데이트했습니다.

## 실행

Node.js 20 이상이 필요합니다.

```sh
npm ci
npm run dev
```

기본 개발 주소는 터미널에 표시됩니다. 프로덕션 빌드와 타입 검사는 다음 명령으로 확인합니다.

```sh
npm run build
npm run typecheck
```

## 구조

- `app/root.tsx`, `app/components/AppViewport.tsx`: HTML 문서와 앱 표시 영역. 모바일은 전체 viewport를 사용하고, 데스크톱 fine pointer·hover 환경(최소 너비 600px)은 최대 390px 콘텐츠를 검은 7px 프레임에 표시합니다. 데스크톱 프레임에는 상태 표시줄 하나가 있으며 최대 높이는 858px입니다.
- `app/routes/_index.tsx`: 홈 화면. 기본은 참가 대회가 없는 시안이며 `?participating=1`로 참가 중인 대회 시안을 확인할 수 있습니다. 10·11·12월 칩으로 대회를 최대 6개씩 목록형으로 전환하며 상태 배지를 제목 왼쪽에 표시합니다.
- `app/routes/search.tsx`: 검색 화면과 최근 검색, 결과 및 결과 없음 상태
- `app/routes/tournaments.tsx`: 대회 리스트와 개최 월, 지역, 유형, 진행 상태 필터
- `app/routes/players.search.tsx`: 선수 검색, 최근 검색, 참가 결과 및 결과 없음 상태
- `app/components/`: 앱 viewport, 홈 헤더, 대회 카드, 상태 표시줄, 하단 내비게이션
- `app/data/`, `app/types/`: 화면 검증용 예시 대회 데이터와 타입
- `app/tailwind.css`: Figma 원시 색상 토큰, 테나다 로고 글꼴, 모바일 기본 스타일
- `tailwind.config.ts`: 원시 색상과 홈 Figma의 글자 스타일을 Tailwind에서 사용하도록 연결

현재 색상은 첨부된 Figma 원시 토큰을 그대로 옮겼습니다. 시멘틱 토큰은 정의하지 않았습니다. Pretendard는 공식 프로젝트에서 안내하는 jsDelivr 스타일시트로 로드합니다. 위꾹 로고 글꼴인 테나다는 jsDelivr WOFF2로 로드합니다. 아이콘은 `lucide-react`를 사용합니다.

앱 화면은 내부 스크롤을 사용하고 경로·쿼리·히스토리 항목별 스크롤을 수동 복원합니다. 경로 전환은 앱 viewport 안에서 처리하며 쿼리 변경에는 전환을 적용하지 않습니다. 모바일 VisualViewport 높이 변화도 반영합니다. 대회와 검색 결과는 현재 예시 데이터입니다. 현재 IA와 URL 상태 관리는 [IA.md](./IA.md)에 정리했습니다. 알림은 `/notifications` 목록에서 제목·시간을 표시하고 관련 공지로 이동합니다. 홈 공지 미리보기에서도 개별 공지 상세로 바로 이동할 수 있습니다. 선수 결과 상세와 MY 등의 후속 화면은 아직 구현하지 않았습니다.
