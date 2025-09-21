# 전라남도 축제 대시보드 아키텍처 설계

## 🏗️ 전체 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Header    │  │ FilterPanel │  │  MapPanel   │            │
│  │             │  │             │  │ (KakaoMap)  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    ChartPanel                              │ │
│  │                 (Chart.js)                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/REST API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Spring Boot)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Controller  │  │   Service   │  │   Mapper    │            │
│  │ (REST API)  │  │ (Business)  │  │ (MyBatis)   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ JDBC
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database (MySQL)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Festival  │  │  Location   │  │  Category   │            │
│  │     Table   │  │    Table    │  │    Table    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ External API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Kakao Map   │  │   Weather   │  │   Traffic   │            │
│  │    API      │  │    API      │  │    API      │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 API 플로우 다이어그램

### 1. 초기 로딩 플로우
```
사용자 접속
    │
    ▼
Frontend 시작
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. GET /api/filters                                         │
│    - 지역 목록 조회                                         │
│    - 카테고리 목록 조회                                     │
│    - 연도 목록 조회                                         │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GET /api/festivals                                       │
│    - 전체 축제 목록 조회                                    │
│    - 기본 필터 적용                                         │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Kakao Map API 초기화                                     │
│    - 지도 컨테이너 생성                                     │
│    - 전라남도 중심 좌표 설정                               │
│    - 마커 클러스터링 설정                                   │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
대시보드 렌더링 완료
```

### 2. 필터링 플로우
```
사용자 필터 변경
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend State Update                                       │
│ - selectedRegions 업데이트                                  │
│ - selectedCategories 업데이트                               │
│ - searchTerm 업데이트                                       │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ GET /api/festivals?regions=1,2,3&categories=1,2&search=축제 │
│ - 필터링된 축제 목록 조회                                   │
│ - 응답: {data: [...], total: 150, success: true}           │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend UI Update                                          │
│ - 축제 목록 업데이트                                        │
│ - 지도 마커 업데이트                                        │
│ - 통계 카드 업데이트                                        │
└─────────────────────────────────────────────────────────────┘
```

### 3. 축제 선택 및 상세 정보 플로우
```
사용자 마커 클릭
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend State Update                                       │
│ - selectedFestival 업데이트                                 │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. GET /api/festivals/{id}                                  │
│    - 축제 상세 정보 조회                                    │
│    - 응답: {data: {...}, success: true}                    │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GET /api/festivals/{id}/yearly-stats?years=2022,2023,2024│
│    - 연도별 통계 조회                                       │
│    - 응답: {data: {...}, success: true}                    │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend UI Update                                          │
│ - 축제 정보 카드 업데이트                                   │
│ - 차트 데이터 업데이트                                      │
│ - 통계 카드 업데이트                                        │
└─────────────────────────────────────────────────────────────┘
```

## 🗺️ 카카오맵 API 통합 설계

### 1. 카카오맵 API 설정
```javascript
// src/services/kakaoMapService.js
class KakaoMapService {
  constructor() {
    this.map = null;
    this.markers = [];
    this.clusterer = null;
  }

  // 지도 초기화
  initMap(containerId, centerLat, centerLng, level = 8) {
    const container = document.getElementById(containerId);
    const options = {
      center: new kakao.maps.LatLng(centerLat, centerLng),
      level: level
    };
    this.map = new kakao.maps.Map(container, options);
    return this.map;
  }

  // 마커 생성
  createMarker(festival) {
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(festival.latitude, festival.longitude),
      title: festival.name
    });

    // 마커 클릭 이벤트
    kakao.maps.event.addListener(marker, 'click', () => {
      this.onMarkerClick(festival);
    });

    return marker;
  }

  // 마커 클러스터링
  setClusterer() {
    this.clusterer = new kakao.maps.MarkerClusterer({
      map: this.map,
      averageCenter: true,
      minLevel: 8
    });
  }

  // 마커 업데이트
  updateMarkers(festivals) {
    this.clearMarkers();
    this.markers = festivals.map(festival => this.createMarker(festival));
    this.clusterer.addMarkers(this.markers);
  }
}
```

### 2. 지도 컴포넌트 구조
```javascript
// src/components/MapPanel/MapPanel.jsx
const MapPanel = () => {
  const { festivals, selectedFestival } = useFestivals();
  const [mapService, setMapService] = useState(null);

  useEffect(() => {
    // 카카오맵 API 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
    script.onload = () => {
      kakao.maps.load(() => {
        const service = new KakaoMapService();
        service.initMap('map', 34.8679, 126.9910, 8); // 전라남도 중심
        service.setClusterer();
        setMapService(service);
      });
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (mapService && festivals) {
      mapService.updateMarkers(festivals);
    }
  }, [festivals, mapService]);

  return (
    <div className="map-panel">
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};
```

## 📊 데이터베이스 스키마

### 1. Festival 테이블
```sql
CREATE TABLE festival (
    festival_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    festival_nm VARCHAR(100) NOT NULL,
    category_id BIGINT,
    location_id BIGINT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_visitors INT,
    revenue BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(category_id),
    FOREIGN KEY (location_id) REFERENCES location(location_id)
);
```

### 2. Location 테이블
```sql
CREATE TABLE location (
    location_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    location_nm VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Category 테이블
```sql
CREATE TABLE category (
    category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_nm VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Festival_Detail 테이블
```sql
CREATE TABLE festival_detail (
    detail_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    festival_id BIGINT,
    year INT,
    visitors INT,
    revenue BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (festival_id) REFERENCES festival(festival_id)
);
```

## 🔧 기술 스택 및 의존성

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "axios": "^1.6.0"
  }
}
```

### Backend
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
</dependencies>
```

## 🚀 배포 및 운영

### 1. 개발 환경
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Database: `localhost:3306`

### 2. 프로덕션 환경
- Frontend: Nginx + React Build
- Backend: Docker + Spring Boot
- Database: MySQL 8.0
- Load Balancer: Nginx

### 3. 모니터링
- Application: Spring Boot Actuator
- Database: MySQL Performance Schema
- Frontend: React DevTools
- API: Swagger UI

## 🔒 보안 고려사항

### 1. API 보안
- CORS 설정
- Rate Limiting
- Input Validation
- SQL Injection 방지

### 2. 카카오맵 API 보안
- API Key 환경변수 관리
- 도메인 제한 설정
- HTTPS 필수

### 3. 데이터 보안
- 데이터베이스 암호화
- 백업 및 복구 계획
- 접근 권한 관리
