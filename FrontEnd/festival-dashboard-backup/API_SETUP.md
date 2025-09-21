# API 설정 가이드

## 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# Development Settings
VITE_USE_MOCK_DATA=false
VITE_DEBUG_MODE=true
```

## 환경변수 설명

| 변수명 | 설명 | 기본값 | 예시 |
|--------|------|--------|------|
| `VITE_API_BASE_URL` | 백엔드 API 기본 URL | `http://localhost:8080/api` | `https://api.example.com/api` |
| `VITE_USE_MOCK_DATA` | Mock 데이터 사용 여부 | `false` | `true` / `false` |
| `VITE_DEBUG_MODE` | 디버그 모드 활성화 | `true` | `true` / `false` |

## API 엔드포인트

### 1. 필터 옵션 조회
```
GET /api/filters
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "regions": [
      { "id": 1, "name": "강진군", "festivalCount": 15 }
    ],
    "categories": [
      { "id": 1, "name": "문화/역사", "festivalCount": 45 }
    ],
    "years": ["2020", "2021", "2022", "2023", "2024"]
  }
}
```

### 2. 축제 목록 조회
```
GET /api/festivals?regions=1,2&categories=1&search=축제&years=2023,2024
```

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "강진만춤추는갈대축제",
      "region": "강진군",
      "category": "자연/계절",
      "latitude": 34.6421,
      "longitude": 126.7672,
      "totalVisitors": 45000,
      "revenue": 850000000
    }
  ],
  "total": 520
}
```

### 3. 축제 상세 정보
```
GET /api/festivals/{id}
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "강진만춤추는갈대축제",
    "region": "강진군",
    "category": "자연/계절",
    "period": {
      "startDate": "2024-10-15",
      "endDate": "2024-10-18"
    },
    "stats": {
      "totalVisitors": 45000,
      "averageVisitors": 42000,
      "totalRevenue": 850000000,
      "growthRate": 12
    }
  }
}
```

### 4. 연도별 통계
```
GET /api/festivals/{id}/yearly-stats?years=2022,2023,2024
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "festivalId": 1,
    "yearlyData": [
      { "year": 2022, "visitors": 38000, "revenue": 720000000 },
      { "year": 2023, "visitors": 41000, "revenue": 780000000 },
      { "year": 2024, "visitors": 45000, "revenue": 850000000 }
    ]
  }
}
```

## 에러 처리

모든 API 호출은 다음과 같은 에러 처리를 포함합니다:

- **400**: 잘못된 요청
- **401**: 인증 필요
- **403**: 접근 권한 없음
- **404**: 데이터 없음
- **500**: 서버 오류
- **0**: 네트워크 오류

## 사용 예시

```javascript
import festivalService from './services/festivalService.js';
import { useApi } from './hooks/useApi.js';

// 직접 API 호출
const fetchFestivals = async () => {
  try {
    const result = await festivalService.getFestivals({
      regions: [1, 2],
      categories: [1],
      search: '축제',
      years: ['2023', '2024']
    });
    console.log(result.festivals);
  } catch (error) {
    console.error('API 호출 실패:', error);
  }
};

// 훅 사용
const MyComponent = () => {
  const { loading, data, error, execute } = useApi(festivalService.getFestivals);
  
  useEffect(() => {
    execute({ regions: [1, 2] });
  }, [execute]);
  
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  
  return <div>{data?.festivals?.length}개의 축제</div>;
};
```
