# FilterPanel 컴포넌트 기능 정리

## 📋 개요

FilterPanel은 전라남도 축제 데이터 분석 대시보드의 왼쪽 사이드바를 담당하는 컴포넌트입니다. 사용자가 지역별/카테고리별로 축제를 필터링하고 선택할 수 있는 인터페이스를 제공합니다.

## 🏗️ 컴포넌트 구조

```
FilterPanel/
├── FilterPanel.jsx          # 메인 컴포넌트 (상태 관리, 이벤트 처리)
├── FilterHeader.jsx         # 헤더 (제목, 설명)
├── FilterTabs.jsx           # 탭 전환 (지역별/카테고리별)
├── FilterActions.jsx        # 액션 버튼 (전체 선택/초기화)
├── FilterList.jsx           # 필터 목록 (지역/카테고리/축제)
├── FilterStats.jsx          # 통계 정보 (선택된 항목 수)
└── styles/                  # CSS 스타일 파일들
    ├── index.css            # 통합 CSS 임포트
    ├── FilterPanel.css      # 메인 컴포넌트 스타일
    ├── FilterHeader.css     # 헤더 스타일
    ├── FilterTabs.css       # 탭 스타일
    ├── FilterActions.css    # 액션 버튼 스타일
    ├── FilterList.css       # 필터 목록 스타일
    └── FilterStats.css      # 통계 스타일
```

## 📄 컴포넌트별 상세 기능

### 1. FilterPanel.jsx (메인 컴포넌트)

**역할**: FilterPanel의 핵심 컴포넌트로 모든 하위 컴포넌트들을 조합하고 상태를 관리합니다.

**주요 기능**:
- **상태 관리**: 선택된 지역, 카테고리, 축제 상태 관리
- **API 연결**: 백엔드 API와 연동하여 실제 데이터 로딩
- **이벤트 처리**: 모든 사용자 상호작용 이벤트 처리
- **데이터 필터링**: 선택된 필터에 따른 축제 데이터 필터링
- **자동 연관 선택**: 축제 선택 시 관련 지역/카테고리 자동 선택

**상태 변수**:
```javascript
const [activeTab, setActiveTab] = useState('region');           // 활성 탭
const [selectedRegions, setSelectedRegions] = useState([]);     // 선택된 지역
const [selectedCategories, setSelectedCategories] = useState([]); // 선택된 카테고리
const [selectedFestivals, setSelectedFestivals] = useState([]);  // 선택된 축제
const [festivals, setFestivals] = useState([]);                 // 필터링된 축제
const [allFestivals, setAllFestivals] = useState([]);           // 전체 축제 데이터
```

**주요 함수**:
- `handleTabChange()`: 탭 전환 처리
- `handleItemToggle()`: 지역/카테고리 선택/해제 처리
- `handleFestivalToggle()`: 축제 선택/해제 처리
- `handleSelectAll()`: 전체 선택 처리
- `handleReset()`: 초기화 처리

### 2. FilterHeader.jsx (헤더 컴포넌트)

**역할**: FilterPanel의 상단 헤더 부분을 담당합니다.

**주요 기능**:
- **제목 표시**: "축제 필터링" 제목 표시
- **설명 텍스트**: 사용자 가이드 텍스트 표시

**Props**:
```javascript
{
  title: string,        // 헤더 제목 (기본값: "축제 필터링")
  subtitle: string      // 부제목 (기본값: "지역과 카테고리로 축제를 필터링하세요")
}
```

**렌더링 요소**:
- 제목 (h2 태그)
- 부제목 (p 태그, 선택사항)

### 3. FilterTabs.jsx (탭 컴포넌트)

**역할**: 지역별/카테고리별 필터 모드를 전환하는 탭을 제공합니다.

**주요 기능**:
- **탭 전환**: 지역별 ↔ 카테고리별 모드 전환
- **활성 탭 표시**: 현재 선택된 탭 하이라이트
- **탭 클릭 이벤트**: 탭 변경 시 부모 컴포넌트에 알림

**Props**:
```javascript
{
  activeTab: string,        // 현재 활성화된 탭 ('region' | 'category')
  onTabChange: function     // 탭 변경 시 호출되는 함수
}
```

**탭 목록**:
- `region`: 지역별 필터링
- `category`: 카테고리별 필터링

### 4. FilterActions.jsx (액션 버튼 컴포넌트)

**역할**: 전체 선택과 초기화 기능을 제공하는 버튼들을 담당합니다.

**주요 기능**:
- **전체 선택**: 현재 탭의 모든 항목 선택
- **초기화**: 모든 선택 상태 초기화
- **버튼 상태 관리**: 비활성화 상태 처리

**Props**:
```javascript
{
  onSelectAll: function,    // 전체 선택 버튼 클릭 시 호출되는 함수
  onReset: function,        // 초기화 버튼 클릭 시 호출되는 함수
  disabled: boolean         // 버튼 비활성화 여부 (기본값: false)
}
```

**버튼 목록**:
- **전체 선택**: 현재 탭의 모든 지역/카테고리 선택
- **초기화**: 모든 선택 상태 리셋

### 5. FilterList.jsx (필터 목록 컴포넌트)

**역할**: 지역/카테고리 목록과 하위 축제 목록을 표시하는 핵심 컴포넌트입니다.

**주요 기능**:
- **지역별 축제 그룹화**: 지역 ID별로 축제들을 그룹화
- **카테고리별 축제 그룹화**: 카테고리 ID별로 축제들을 그룹화
- **축제 중복 제거**: 축제명 기준으로 중복 제거 (최신 연도 유지)
- **계층적 표시**: 지역/카테고리 → 축제 계층 구조
- **펼치기/접기**: 축제 목록 토글 기능
- **체크박스 상호작용**: 선택/해제 상태 관리

**Props**:
```javascript
{
  items: array,                    // 표시할 항목 목록 (지역/카테고리)
  selectedItems: array,            // 선택된 항목 ID 배열
  onItemToggle: function,          // 항목 선택/해제 시 호출되는 함수
  type: string,                    // 필터 타입 ('region' | 'category')
  festivals: array,                // 전체 축제 데이터
  selectedFestivals: array,        // 선택된 축제명 배열
  onFestivalToggle: function       // 축제 선택/해제 시 호출되는 함수
}
```

**주요 로직**:
- `festivalsByRegion`: 지역별 축제 그룹화 (useMemo)
- `festivalsByCategory`: 카테고리별 축제 그룹화 (useMemo)
- `handleCheckboxClick()`: 체크박스 클릭 처리
- `handleFestivalClick()`: 축제 클릭 처리
- `toggleExpanded()`: 펼치기/접기 토글

### 6. FilterStats.jsx (통계 컴포넌트)

**역할**: 현재 선택된 필터의 통계 정보를 시각적으로 표시합니다.

**주요 기능**:
- **실시간 통계**: 선택된 항목 수 실시간 업데이트
- **시각적 표시**: 아이콘과 색상을 활용한 직관적 표시
- **그리드 레이아웃**: 2x2 그리드로 통계 카드 배치

**Props**:
```javascript
{
  selectedRegions: number,         // 선택된 지역 수
  selectedCategories: number,      // 선택된 카테고리 수
  selectedFestivals: number,       // 선택된 축제 수
  totalFestivals: number,          // 전체 축제 수 (고정값: 61)
  filteredFestivals: array         // 필터된 축제 배열
}
```

**통계 항목**:
1. **선택된 축제** (🎪): 현재 선택된 축제 수
2. **선택된 지역** (📍): 현재 선택된 지역 수
3. **선택된 카테고리** (🏷️): 현재 선택된 카테고리 수
4. **전체 축제** (📊): 전체 축제 수 (고정값: 61)

## 🔄 데이터 흐름

### 1. 초기 로딩
```
FilterPanel → API 호출 → 전체 축제 데이터 로딩 → FilterList에 전달
```

### 2. 필터 선택
```
사용자 클릭 → FilterList → FilterPanel → 상태 업데이트 → FilterStats 업데이트
```

### 3. 자동 연관 선택
```
축제 선택 → 관련 지역/카테고리 자동 선택 → 모든 상태 동기화
```

## 🎨 스타일링

### CSS 구조
- **모듈화**: 각 컴포넌트별 독립적인 CSS 파일
- **통합 관리**: `styles/index.css`에서 모든 스타일 임포트
- **일관성**: PRD 색상 팔레트 기반 통일된 디자인
- **반응형**: 모바일 디바이스 대응

### 주요 CSS 변수
```css
:root {
  --primary: #2D5016;           /* 전라남도 녹색 */
  --secondary: #4A7C59;         /* 보조 녹색 */
  --accent: #8B4513;            /* 축제 갈대색 */
  --background: #F8F9FA;        /* 배경색 */
  --text: #2C3E50;              /* 텍스트 색상 */
}
```

## 🚀 주요 특징

### 1. 계층적 필터링
- 지역/카테고리 → 축제 2단계 계층 구조
- 상위 항목 선택 시 하위 항목 자동 선택
- 하위 항목 선택 시 상위 항목 자동 선택

### 2. 실시간 동기화
- 모든 선택 상태가 실시간으로 동기화
- 통계 정보 즉시 업데이트
- API 데이터와 UI 상태 일치

### 3. 사용자 경험
- 직관적인 체크박스 인터페이스
- 펼치기/접기로 정보 정리
- 시각적 피드백 (아이콘, 색상)

### 4. 성능 최적화
- useMemo로 불필요한 재계산 방지
- useCallback으로 함수 참조 안정화
- 중복 제거로 데이터 효율성 향상

## 📊 현재 데이터 현황

- **전체 축제**: 61개 (중복 제거 후)
- **지역 수**: 22개 (전라남도 시/군)
- **카테고리 수**: 5개 (문화/역사, 음식/미식, 일반/기타, 자연/계절, 체험/레저)
- **API 엔드포인트**: `/api/festivals`, `/api/filters`

## 🔧 기술 스택

- **Frontend**: React 18, Vite
- **상태 관리**: useState, useMemo, useCallback
- **API 통신**: Axios
- **스타일링**: CSS Modules
- **백엔드**: Spring Boot, MySQL, MyBatis

---

*이 문서는 FilterPanel 컴포넌트의 현재 구현 상태를 기준으로 작성되었습니다. (2024년 기준)*
