# 프론트엔드 아키텍처 문서

## 프로젝트 개요
- **프로젝트명**: festival-dashboard (축제 데이터 분석 대시보드)
- **프레임워크**: React 18.2.0
- **언어**: JavaScript (ES6+)
- **번들러**: Vite 5.4.10
- **패키지 관리자**: npm
- **개발 서버**: http://localhost:5173

## 기술 스택

### 핵심 라이브러리
- **React**: 사용자 인터페이스 라이브러리
- **React DOM**: DOM 렌더링
- **Axios**: HTTP 클라이언트 (API 통신)
- **Chart.js**: 차트 및 그래프 라이브러리
- **React Chart.js 2**: React용 Chart.js 래퍼

### 개발 도구
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **ESLint**: 코드 품질 및 스타일 검사
- **@vitejs/plugin-react**: Vite React 플러그인

### 스타일링
- **CSS Modules**: 컴포넌트별 스타일 격리
- **CSS Variables**: 일관된 디자인 토큰 관리
- **Responsive Design**: 모바일-퍼스트 반응형 디자인

## 아키텍처 패턴

### 컴포넌트 기반 아키텍처
```
App (루트 컴포넌트)
├── FilterPanel (필터링 사이드바)
├── MapPanel (지도 표시)
├── StatsPanel (통계 사이드바)
├── ChartOnlyPanel (차트 전용 패널)
└── InputPage (축제 시뮬레이션 입력)
```

### 상태 관리 패턴
- **React Hooks**: useState, useEffect, useMemo, useCallback
- **Props Drilling**: 컴포넌트 간 상태 전달
- **Callback Props**: 상위 컴포넌트로 이벤트 전달

## 프로젝트 구조

```
src/
├── App.jsx                           # 루트 컴포넌트
├── App.css                           # 글로벌 스타일
├── index.css                         # CSS 변수 및 기본 스타일
├── main.jsx                          # 애플리케이션 진입점
├── components/                       # 컴포넌트 디렉토리
│   ├── FilterPanel/                  # 필터링 사이드바
│   │   ├── FilterPanel.jsx
│   │   ├── FilterTabs.jsx
│   │   ├── FilterList.jsx
│   │   ├── FilterActions.jsx
│   │   └── styles/                   # 스타일 파일들
│   ├── MapPanel/                     # 지도 패널
│   │   ├── MapPanel.jsx
│   │   ├── KakaoMap.jsx             # 카카오맵 컴포넌트
│   │   └── styles/
│   ├── StatsPanel/                   # 통계 패널
│   │   ├── StatsPanel.jsx
│   │   └── styles/
│   ├── ChartOnlyPanel/               # 차트 전용 패널
│   │   ├── ChartOnlyPanel.jsx
│   │   └── styles/
│   └── InputPage/                    # 축제 시뮬레이션 입력
│       ├── InputPage.jsx
│       └── styles/
├── services/                         # API 서비스
│   ├── api.js                        # API 클라이언트
│   ├── festivalService.js            # 축제 데이터 서비스
│   └── statisticsService.js          # 통계 데이터 서비스
├── data/                            # 정적 데이터
│   └── locationCoordinates.js        # 지역 좌표 데이터
└── utils/                           # 유틸리티 함수
    └── formatters.js                 # 데이터 포맷팅 함수
```

## 주요 기능

### 1. 대시보드 시스템
- **분할보기**: 필터패널 + 지도 + 통계패널
- **지도만 보기**: 필터패널 + 지도
- **차트만 보기**: 필터패널 + 차트 + 통계패널

### 2. 축제 필터링 시스템
- **지역별 필터링**: 시/군 단위 축제 검색
- **카테고리별 필터링**: 문화예술, 음식, 스포츠, 전통, 국제
- **다중 선택**: 여러 조건 동시 적용
- **실시간 업데이트**: 필터 변경 시 즉시 반영

### 3. 지도 시각화
- **카카오맵 연동**: 실제 지리 정보 표시
- **마커 시스템**: 축제 위치 및 정보 표시
- **정보창**: 클릭 시 축제 상세 정보 팝업
- **중심점 이동**: 선택된 축제에 따른 자동 포커스

### 4. 통계 및 차트
- **Chart.js 기반**: 다양한 차트 타입 지원
- **반응형 차트**: 화면 크기에 따른 자동 조정
- **인터랙티브**: 호버 효과 및 클릭 이벤트
- **년도별 비교**: 다중 연도 데이터 비교 분석

### 5. 축제 시뮬레이션 (입력 페이지)
- **축제 선택**: 드롭다운으로 축제 선택
- **연도 선택**: 해당 축제의 사용 가능한 연도 표시
- **데이터 조회**: 선택된 축제의 상세 데이터 표시
- **시뮬레이션 입력**: 예산, 홍보 강도, 숙박객 수 입력
- **예측 결과**: 예상 방문객 수 및 매출 표시

## 컴포넌트 상세

### App.jsx (루트 컴포넌트)
- 전역 상태 관리
- 뷰 모드 전환 (분할보기/지도만/차트만)
- 페이지 네비게이션 (대시보드/입력페이지/히스토리)
- 컴포넌트 간 데이터 공유

### FilterPanel
- **FilterTabs**: 지역/카테고리 탭 전환
- **FilterList**: 필터 옵션 목록 표시
- **FilterActions**: 전체선택/전체해제 액션
- 축제 데이터 필터링 및 상태 관리

### MapPanel
- **KakaoMap**: 카카오맵 API 래핑 컴포넌트
- 선택된 축제 마커 표시
- 정보창 토글 관리
- 지도 중심점 자동 이동

### StatsPanel
- 선택된 축제 통계 표시
- 년도별 데이터 비교
- 주요 지표 하이라이트

### InputPage
- 축제 시뮬레이션 전용 페이지
- API 연동을 통한 실제 데이터 조회
- 예측 알고리즘 연동 준비

## API 연동

### API 서비스 구조
```javascript
// api.js - 기본 API 클라이언트
class ApiService {
  async get(endpoint, params)
  async post(endpoint, data)
  // ... HTTP 메서드들
}

// inputPageAPI - 입력 페이지 전용 API
export const inputPageAPI = {
  getAllUniqueFestivals()
  getFestivalDetailByNameAndYear(name, year)
  getAvailableYearsForFestival(name)
  getFestivalStatistics(names, years)
}
```

### 주요 API 엔드포인트
- `/api/festivals/unique` - 고유 축제 목록
- `/api/festivals/details` - 축제 상세 데이터
- `/api/festivals/statistics` - 축제 통계 데이터
- `/api/filters` - 필터 옵션 데이터

## 스타일링 시스템

### CSS 변수 시스템
```css
:root {
  --primary: #2D5016;           /* 전라남도 녹색 */
  --secondary: #4A7C59;         /* 보조 녹색 */
  --accent: #8B4513;            /* 축제 갈대색 */
  --white: #FFFFFF;
  --light-gray: #F8F9FA;
  --gray: #6C757D;
  --text: #212529;
  --background: #F8F9FA;
  --border-color: #DEE2E6;
  --shadow: rgba(0, 0, 0, 0.1);
}
```

### 컴포넌트별 스타일 격리
- 각 컴포넌트마다 별도 CSS 파일
- BEM 방법론 기반 클래스 네이밍
- 일관된 디자인 토큰 사용

### 반응형 디자인
- 모바일-퍼스트 접근법
- 주요 브레이크포인트: 480px, 768px, 1024px
- Flexbox 및 CSS Grid 활용

## 상태 관리

### 전역 상태 (App.jsx)
```javascript
// 필터링 상태
const [selectedFestivals, setSelectedFestivals] = useState([]);
const [selectedRegions, setSelectedRegions] = useState([]);
const [selectedCategories, setSelectedCategories] = useState([]);

// UI 상태
const [viewMode, setViewMode] = useState('split');
const [currentPage, setCurrentPage] = useState('dashboard');

// 데이터 상태
const [allFestivals, setAllFestivals] = useState([]);
const [selectedYears, setSelectedYears] = useState([2024]);
```

### 컴포넌트별 로컬 상태
- 각 컴포넌트는 필요한 로컬 상태만 관리
- Props를 통한 상위 컴포넌트와 데이터 동기화
- useCallback, useMemo를 통한 성능 최적화

## 성능 최적화

### React 최적화
- **useMemo**: 비용이 큰 계산 결과 메모이제이션
- **useCallback**: 함수 참조 안정화로 불필요한 리렌더링 방지
- **조건부 렌더링**: 필요한 컴포넌트만 렌더링

### 네트워크 최적화
- **Axios 인터셉터**: 요청/응답 로깅 및 에러 처리
- **API 응답 캐싱**: 동일한 요청 결과 재사용
- **로딩 상태 관리**: 사용자 경험 개선

### 지도 최적화
- **카카오맵 지연 로딩**: API 로드 확인 후 초기화
- **컨테이너 크기 확인**: 지도 렌더링 전 DOM 준비 대기
- **마커 관리**: 불필요한 마커 제거 및 재사용

## 빌드 및 배포

### 개발 환경
```bash
npm run dev          # 개발 서버 시작 (localhost:5173)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # ESLint 검사
```

### 빌드 최적화
- **Vite**: 빠른 HMR과 최적화된 번들링
- **Tree Shaking**: 사용하지 않는 코드 제거
- **Code Splitting**: 동적 import를 통한 청크 분할
- **Asset Optimization**: 이미지 및 리소스 최적화

## 브라우저 호환성

### 지원 브라우저
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 폴리필 및 트랜스파일링
- Vite가 자동으로 모던 브라우저 타겟팅
- ES6+ 문법 사용
- CSS Grid 및 Flexbox 적극 활용

## 에러 처리

### API 에러 처리
```javascript
try {
  const data = await api.getData();
  setData(data);
} catch (error) {
  setError('데이터를 불러오는데 실패했습니다.');
  console.error('API 에러:', error);
}
```

### 사용자 친화적 에러 메시지
- 로딩 상태 표시
- 명확한 에러 메시지
- 재시도 옵션 제공

## 접근성 (A11y)

### 키보드 네비게이션
- Tab 순서 관리
- Focus 상태 시각화
- 키보드 단축키 지원

### 시맨틱 HTML
- 적절한 HTML 태그 사용
- ARIA 속성 적용
- 스크린 리더 지원

## 향후 개선 사항

### 기술적 개선
- **TypeScript 도입**: 타입 안정성 강화
- **State Management**: Redux 또는 Zustand 도입
- **Testing**: Jest + React Testing Library
- **PWA**: 오프라인 지원 및 앱 설치

### 기능 개선
- **실시간 데이터**: WebSocket 연동
- **다국어 지원**: i18n 시스템 구축
- **테마 시스템**: 다크모드 지원
- **데이터 내보내기**: CSV, PDF 내보내기

### 성능 개선
- **가상화**: 대용량 리스트 렌더링 최적화
- **이미지 최적화**: WebP, lazy loading
- **번들 최적화**: 더 세밀한 코드 스플리팅
- **캐싱 전략**: Service Worker 활용

## 개발 가이드라인

### 코드 스타일
- **함수형 컴포넌트**: 클래스 컴포넌트 지양
- **Hooks**: useState, useEffect 등 적극 활용
- **ES6+**: 화살표 함수, 구조분해할당, 템플릿 리터럴
- **JSDoc**: 복잡한 함수에 대한 문서화

### 컴포넌트 설계
- **단일 책임 원칙**: 하나의 컴포넌트는 하나의 기능
- **재사용성**: 공통 컴포넌트 분리
- **Props 인터페이스**: 명확한 props 정의
- **기본값 설정**: defaultProps 또는 기본 매개변수

### 파일 구조
- **컴포넌트별 폴더**: 관련 파일들을 함께 관리
- **index.js**: 폴더별 진입점 정의
- **명명 규칙**: PascalCase (컴포넌트), camelCase (함수/변수)
- **경로 별칭**: 상대 경로 최소화