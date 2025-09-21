# 상태 관리 가이드

## 개요

PRD의 상태 관리 구조에 맞춰 구현된 새로운 Context API와 커스텀 훅들을 사용하는 방법을 설명합니다.

## 구조

```
src/
├── contexts/
│   └── AppContext.jsx          # 전역 상태 관리
├── hooks/
│   ├── useFestivals.js         # 축제 목록 및 필터링
│   ├── useChartData.js         # 차트 데이터 관리
│   └── useApi.js              # API 호출 관리
└── services/
    ├── api.js                 # API 클라이언트
    └── festivalService.js     # 축제 관련 API
```

## 사용 방법

### 1. AppProvider 설정

```jsx
// App.jsx
import { AppProvider } from './contexts/AppContext.jsx';

function App() {
  return (
    <AppProvider>
      <div className="app">
        {/* 모든 컴포넌트 */}
      </div>
    </AppProvider>
  );
}
```

### 2. 기본 상태 접근

```jsx
import { useApp, useAppState, useAppActions } from '../contexts/AppContext.jsx';

const MyComponent = () => {
  // 전체 상태와 액션
  const { state, actions } = useApp();
  
  // 상태만
  const state = useAppState();
  
  // 액션만
  const actions = useAppActions();
  
  return (
    <div>
      <p>로딩 중: {state.loading ? '예' : '아니오'}</p>
      <button onClick={() => actions.setLoading(true)}>
        로딩 시작
      </button>
    </div>
  );
};
```

### 3. 축제 목록 및 필터링

```jsx
import { useFestivals } from '../hooks/useFestivals.js';

const FestivalList = () => {
  const {
    festivals,
    filterOptions,
    loading,
    error,
    selectedRegions,
    selectedCategories,
    toggleRegion,
    toggleCategory,
    setSearchTerm,
    resetAllFilters
  } = useFestivals();

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      {/* 필터 옵션 */}
      <div>
        {filterOptions?.regions.map(region => (
          <label key={region.id}>
            <input
              type="checkbox"
              checked={selectedRegions.includes(region.id)}
              onChange={() => toggleRegion(region.id)}
            />
            {region.name}
          </label>
        ))}
      </div>

      {/* 축제 목록 */}
      <div>
        {festivals.map(festival => (
          <div key={festival.id}>
            <h3>{festival.name}</h3>
            <p>{festival.region}</p>
          </div>
        ))}
      </div>

      <button onClick={resetAllFilters}>필터 초기화</button>
    </div>
  );
};
```

### 4. 차트 데이터 관리

```jsx
import { useChartData } from '../hooks/useChartData.js';
import { Line, Bar } from 'react-chartjs-2';

const FestivalChart = () => {
  const {
    selectedFestival,
    festivalDetail,
    formattedChartData,
    combinedChartData,
    chartOptions,
    statsSummary,
    selectFestival,
    setChartType,
    chartType,
    loading
  } = useChartData();

  if (loading) return <div>차트 로딩 중...</div>;

  return (
    <div>
      {/* 축제 선택 */}
      <select onChange={(e) => selectFestival(JSON.parse(e.target.value))}>
        <option value="">축제를 선택하세요</option>
        {/* 축제 옵션들 */}
      </select>

      {/* 축제 정보 */}
      {festivalDetail && (
        <div>
          <h3>{festivalDetail.name}</h3>
          <p>총 방문객: {statsSummary.totalVisitors.toLocaleString()}명</p>
          <p>총 수익: {statsSummary.totalRevenue.toLocaleString()}원</p>
          <p>성장률: {statsSummary.growthRate}%</p>
        </div>
      )}

      {/* 차트 타입 선택 */}
      <div>
        <button 
          onClick={() => setChartType('line')}
          className={chartType === 'line' ? 'active' : ''}
        >
          선차트
        </button>
        <button 
          onClick={() => setChartType('bar')}
          className={chartType === 'bar' ? 'active' : ''}
        >
          막대차트
        </button>
      </div>

      {/* 차트 */}
      {chartType === 'line' ? (
        <Line data={combinedChartData} options={chartOptions} />
      ) : (
        <Bar data={combinedChartData} options={chartOptions} />
      )}
    </div>
  );
};
```

### 5. 특정 지역/카테고리별 축제

```jsx
import { useFestivalsByRegion, useFestivalsByCategory } from '../hooks/useFestivals.js';

const RegionFestivals = ({ regionId }) => {
  const { festivals, loading, error, refresh } = useFestivalsByRegion(regionId);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <button onClick={refresh}>새로고침</button>
      {festivals.map(festival => (
        <div key={festival.id}>{festival.name}</div>
      ))}
    </div>
  );
};

const CategoryFestivals = ({ categoryId }) => {
  const { festivals, loading, error, refresh } = useFestivalsByCategory(categoryId);

  return (
    <div>
      {/* 카테고리별 축제 목록 */}
    </div>
  );
};
```

### 6. 축제 상세 정보

```jsx
import { useFestivalDetail } from '../hooks/useChartData.js';

const FestivalDetail = ({ festivalId }) => {
  const { festivalDetail, loading, error, refresh } = useFestivalDetail(festivalId);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!festivalDetail) return <div>축제 정보가 없습니다.</div>;

  return (
    <div>
      <h2>{festivalDetail.name}</h2>
      <p>지역: {festivalDetail.region}</p>
      <p>카테고리: {festivalDetail.category}</p>
      <p>기간: {festivalDetail.period.startDate} ~ {festivalDetail.period.endDate}</p>
      
      <div>
        <h3>통계</h3>
        <p>총 방문객: {festivalDetail.stats.totalVisitors.toLocaleString()}명</p>
        <p>평균 방문객: {festivalDetail.stats.averageVisitors.toLocaleString()}명</p>
        <p>총 수익: {festivalDetail.stats.totalRevenue.toLocaleString()}원</p>
        <p>성장률: {festivalDetail.stats.growthRate}%</p>
      </div>

      <button onClick={refresh}>정보 새로고침</button>
    </div>
  );
};
```

## 상태 구조

### 초기 상태 (initialState)

```javascript
{
  // API 데이터
  festivals: [],
  selectedFestival: null,
  selectedFestivals: [],
  festivalDetail: null,
  filterOptions: null,
  chartData: null,

  // UI 상태
  selectedRegions: [],
  selectedCategories: [],
  selectedYears: ['2022', '2023', '2024'],
  searchTerm: '',
  chartType: 'line',
  viewMode: 'split',
  activeFilterTab: 'region',

  // 로딩 상태
  loading: false,
  chartLoading: false,
  error: null
}
```

### 주요 액션들

```javascript
// 로딩 상태
actions.setLoading(true)
actions.setChartLoading(true)
actions.setError('에러 메시지')
actions.clearError()

// 데이터 관리
actions.setFestivals(festivals)
actions.setSelectedFestival(festival)
actions.setFestivalDetail(detail)
actions.setChartData(data)
actions.setFilterOptions(options)

// UI 상태
actions.setViewMode('map')
actions.setChartType('bar')
actions.setActiveFilterTab('category')

// 필터 관리
actions.setSelectedRegions([1, 2, 3])
actions.setSelectedCategories([1, 2])
actions.setSelectedYears(['2023', '2024'])
actions.setSearchTerm('검색어')
actions.updateFilters({ regions: [1], categories: [2] })
actions.resetFilters()

// 복합 액션
actions.selectFestival(festival)  // 선택 + 상세 정보 로딩
actions.toggleRegion(regionId)    // 지역 토글
actions.toggleCategory(categoryId) // 카테고리 토글
actions.toggleYear(year)          // 연도 토글
```

## 에러 처리

모든 API 호출은 자동으로 에러 처리가 되며, 사용자 친화적인 메시지로 변환됩니다.

```javascript
const { error, clearError } = useApp();

if (error) {
  return (
    <div className="error">
      <p>{error}</p>
      <button onClick={clearError}>닫기</button>
    </div>
  );
}
```

## 성능 최적화

- 모든 액션과 상태는 `useMemo`로 메모이제이션됩니다
- API 호출은 `useCallback`으로 최적화됩니다
- 불필요한 리렌더링을 방지합니다
- 병렬 API 호출을 지원합니다
