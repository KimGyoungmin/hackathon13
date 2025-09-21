# 🎨 프론트엔드 개발 가이드

## 📋 보편적 개발 방법론

### 1. **컴포넌트 기반 개발 (Component-Driven Development)**
- 작은 컴포넌트부터 시작
- 재사용 가능한 컴포넌트 설계
- 단일 책임 원칙 (SRP)

### 2. **Atomic Design Pattern**
```
Atoms (원자) → Molecules (분자) → Organisms (유기체) → Templates → Pages
```

### 3. **점진적 개발 (Progressive Development)**
1. 기본 UI 틀 만들기
2. 하나의 기능 완전히 구현
3. 데이터 연결 및 상태 관리
4. 다음 기능으로 확장

## 🚀 현재 프로젝트 개발 순서

### **Phase 1: FilterPanel 완전 구현** ✅
- [x] 기본 UI 구조
- [x] 탭 전환 기능
- [x] 필터링 로직
- [ ] 스타일링 완성
- [ ] 데이터 연동 테스트

### **Phase 2: MapPanel 구현** ⏳
- [ ] 기본 지도 표시
- [ ] 마커 표시
- [ ] 마커 클릭 이벤트

### **Phase 3: ChartPanel 구현** ⏳
- [ ] 기본 차트 표시
- [ ] 데이터 연동
- [ ] 차트 전환 기능

### **Phase 4: 통합 및 최적화** ⏳
- [ ] 전체 레이아웃 조정
- [ ] 성능 최적화
- [ ] 반응형 디자인

## 🎯 개발 원칙

### **1. 컴포넌트 설계 원칙**
```javascript
// ✅ 좋은 예: 단일 책임
const FilterButton = ({ label, isActive, onClick }) => {
  return (
    <button 
      className={`filter-btn ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// ❌ 나쁜 예: 여러 책임
const FilterPanel = () => {
  // 필터링 + API 호출 + 상태 관리 + UI 렌더링
};
```

### **2. 상태 관리 원칙**
```javascript
// ✅ 좋은 예: 명확한 상태 분리
const useFilterState = () => {
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  return { regions, categories, searchTerm, setRegions, setCategories, setSearchTerm };
};

// ❌ 나쁜 예: 복잡한 상태 객체
const [state, setState] = useState({
  filters: { regions: [], categories: [] },
  ui: { loading: false, error: null },
  data: { festivals: [] }
});
```

### **3. 스타일링 원칙**
```css
/* ✅ 좋은 예: CSS 변수 활용 */
.filter-panel {
  background-color: var(--background);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

/* ❌ 나쁜 예: 하드코딩된 값 */
.filter-panel {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
```

## 🛠️ 개발 도구 및 패턴

### **1. 커스텀 훅 패턴**
```javascript
// 데이터 로딩 훅
const useFestivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchFestivals = useCallback(async (filters) => {
    setLoading(true);
    try {
      const data = await festivalService.getFestivals(filters);
      setFestivals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { festivals, loading, error, fetchFestivals };
};
```

### **2. 컴포넌트 조합 패턴**
```javascript
// 작은 컴포넌트들을 조합
const FilterPanel = () => {
  return (
    <div className="filter-panel">
      <FilterHeader />
      <FilterTabs />
      <FilterContent />
      <FilterActions />
      <FilterStats />
    </div>
  );
};
```

### **3. 에러 바운더리 패턴**
```javascript
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return <div>Something went wrong.</div>;
  }
  
  return children;
};
```

## 📱 반응형 디자인 원칙

### **1. Mobile-First 접근**
```css
/* 모바일 우선 */
.filter-panel {
  width: 100%;
  padding: 1rem;
}

/* 태블릿 */
@media (min-width: 768px) {
  .filter-panel {
    width: 300px;
    padding: 1.5rem;
  }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  .filter-panel {
    width: 350px;
    padding: 2rem;
  }
}
```

### **2. 플렉시블 레이아웃**
```css
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

@media (min-width: 768px) {
  .main-layout {
    flex-direction: row;
  }
}
```

## 🧪 테스트 전략

### **1. 단위 테스트**
```javascript
// 컴포넌트 테스트
import { render, screen } from '@testing-library/react';
import FilterButton from './FilterButton';

test('renders filter button with correct label', () => {
  render(<FilterButton label="지역별" isActive={true} />);
  expect(screen.getByText('지역별')).toBeInTheDocument();
});
```

### **2. 통합 테스트**
```javascript
// 훅 테스트
import { renderHook, act } from '@testing-library/react';
import { useFestivals } from './useFestivals';

test('should fetch festivals', async () => {
  const { result } = renderHook(() => useFestivals());
  
  act(() => {
    result.current.fetchFestivals({ regions: [1, 2] });
  });
  
  expect(result.current.loading).toBe(true);
});
```

## 🚀 성능 최적화

### **1. 메모이제이션**
```javascript
// 컴포넌트 메모이제이션
const FilterButton = React.memo(({ label, isActive, onClick }) => {
  return (
    <button 
      className={`filter-btn ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
});

// 값 메모이제이션
const filteredFestivals = useMemo(() => {
  return festivals.filter(festival => 
    selectedRegions.includes(festival.regionId)
  );
}, [festivals, selectedRegions]);
```

### **2. 지연 로딩**
```javascript
// 컴포넌트 지연 로딩
const MapPanel = lazy(() => import('./MapPanel'));
const ChartPanel = lazy(() => import('./ChartPanel'));

// 사용
<Suspense fallback={<div>Loading...</div>}>
  <MapPanel />
</Suspense>
```

## 📚 학습 리소스

### **1. React 공식 문서**
- [React 공식 문서](https://react.dev/)
- [React Hooks 가이드](https://react.dev/reference/react)

### **2. 디자인 시스템**
- [Material-UI](https://mui.com/)
- [Ant Design](https://ant.design/)
- [Chakra UI](https://chakra-ui.com/)

### **3. 상태 관리**
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Jotai](https://jotai.org/)

## 🎯 다음 단계

1. **FilterPanel 스타일링 완성**
2. **데이터 연동 테스트**
3. **MapPanel 기본 구현**
4. **ChartPanel 기본 구현**
5. **전체 통합 및 최적화**
