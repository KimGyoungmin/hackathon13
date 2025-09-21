# 카카오맵 API 통합 가이드

## 🗺️ 카카오맵 API 설정

### 1. 카카오 개발자 계정 및 API 키 발급

1. **카카오 개발자 사이트 접속**
   - https://developers.kakao.com/
   - 카카오 계정으로 로그인

2. **애플리케이션 생성**
   - "내 애플리케이션" → "애플리케이션 추가하기"
   - 앱 이름: "전라남도 축제 대시보드"
   - 사업자명: 개인 또는 회사명

3. **플랫폼 설정**
   - Web 플랫폼 추가
   - 사이트 도메인: `http://localhost:5173` (개발용)
   - 사이트 도메인: `https://yourdomain.com` (프로덕션용)

4. **API 키 확인**
   - JavaScript 키 복사
   - 환경변수에 저장

### 2. 환경변수 설정

```bash
# .env.local
VITE_KAKAO_MAP_API_KEY=your_javascript_api_key_here
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_DATA=false
VITE_DEBUG_MODE=false
```

## 🏗️ 카카오맵 서비스 클래스

### 1. 카카오맵 서비스 생성

```javascript
// src/services/kakaoMapService.js
class KakaoMapService {
  constructor() {
    this.map = null;
    this.markers = [];
    this.clusterer = null;
    this.infoWindow = null;
    this.isLoaded = false;
  }

  // 카카오맵 API 로드
  async loadKakaoMapAPI() {
    if (this.isLoaded) return Promise.resolve();

    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(() => {
          this.isLoaded = true;
          resolve();
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // 지도 초기화
  initMap(containerId, centerLat = 34.8679, centerLng = 126.9910, level = 8) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Map container with id '${containerId}' not found`);
    }

    const options = {
      center: new kakao.maps.LatLng(centerLat, centerLng),
      level: level
    };

    this.map = new kakao.maps.Map(container, options);
    this.infoWindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    
    return this.map;
  }

  // 마커 클러스터링 설정
  setClusterer() {
    this.clusterer = new kakao.maps.MarkerClusterer({
      map: this.map,
      averageCenter: true,
      minLevel: 8,
      gridSize: 60
    });
  }

  // 축제 마커 생성
  createFestivalMarker(festival) {
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(festival.latitude, festival.longitude),
      title: festival.name
    });

    // 마커 클릭 이벤트
    kakao.maps.event.addListener(marker, 'click', () => {
      this.showFestivalInfo(festival, marker);
    });

    return marker;
  }

  // 축제 정보 표시
  showFestivalInfo(festival, marker) {
    const content = `
      <div style="padding: 10px; min-width: 200px;">
        <h4 style="margin: 0 0 5px 0; font-size: 14px;">${festival.name}</h4>
        <p style="margin: 0 0 3px 0; font-size: 12px; color: #666;">
          📍 ${festival.location?.name || '알 수 없음'}
        </p>
        <p style="margin: 0 0 3px 0; font-size: 12px; color: #666;">
          🎭 ${festival.category?.name || '알 수 없음'}
        </p>
        <p style="margin: 0; font-size: 12px; color: #666;">
          👥 ${festival.totalVisitors?.toLocaleString() || '정보 없음'}명
        </p>
      </div>
    `;

    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, marker);

    // 마커 클릭 이벤트 발생 (부모 컴포넌트에서 처리)
    if (this.onMarkerClick) {
      this.onMarkerClick(festival);
    }
  }

  // 마커 업데이트
  updateMarkers(festivals) {
    if (!this.map || !this.clusterer) return;

    this.clearMarkers();
    this.markers = festivals.map(festival => this.createFestivalMarker(festival));
    this.clusterer.addMarkers(this.markers);
  }

  // 마커 클리어
  clearMarkers() {
    if (this.clusterer) {
      this.clusterer.clear();
    }
    this.markers = [];
  }

  // 지도 중심점 이동
  setCenter(lat, lng) {
    if (this.map) {
      const moveLatLon = new kakao.maps.LatLng(lat, lng);
      this.map.setCenter(moveLatLon);
    }
  }

  // 지도 레벨 변경
  setLevel(level) {
    if (this.map) {
      this.map.setLevel(level);
    }
  }

  // 지도 타입 변경
  setMapTypeId(mapTypeId) {
    if (this.map) {
      this.map.setMapTypeId(mapTypeId);
    }
  }

  // 특정 축제로 지도 이동
  moveToFestival(festival) {
    if (this.map && festival.latitude && festival.longitude) {
      this.setCenter(festival.latitude, festival.longitude);
      this.setLevel(5); // 더 가까운 레벨로 설정
    }
  }

  // 지도 컨트롤 추가
  addMapControls() {
    if (!this.map) return;

    // 줌 컨트롤
    const zoomControl = new kakao.maps.ZoomControl();
    this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 지도 타입 컨트롤
    const mapTypeControl = new kakao.maps.MapTypeControl();
    this.map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
  }

  // 지도 크기 조정
  relayout() {
    if (this.map) {
      this.map.relayout();
    }
  }

  // 지도 제거
  destroy() {
    this.clearMarkers();
    this.map = null;
    this.clusterer = null;
    this.infoWindow = null;
  }
}

export default KakaoMapService;
```

### 2. 지도 컴포넌트 업데이트

```javascript
// src/components/MapPanel/MapPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import { useFestivals } from '../../hooks/useFestivals.js';
import KakaoMapService from '../../services/kakaoMapService.js';
import './MapPanel.css';

const MapPanel = () => {
  const { state, actions } = useApp();
  const { selectedFestival } = state;
  const { festivals } = useFestivals();
  
  const [mapService, setMapService] = useState(null);
  const [mapControls, setMapControls] = useState({
    showCluster: true,
    showSatellite: false
  });
  const mapRef = useRef(null);

  // 카카오맵 API 로드 및 초기화
  useEffect(() => {
    const initMap = async () => {
      try {
        const service = new KakaoMapService();
        await service.loadKakaoMapAPI();
        
        // 지도 초기화
        service.initMap('map-container', 34.8679, 126.9910, 8);
        service.setClusterer();
        service.addMapControls();
        
        // 마커 클릭 이벤트 핸들러 설정
        service.onMarkerClick = (festival) => {
          actions.setSelectedFestival(festival);
        };
        
        setMapService(service);
      } catch (error) {
        console.error('카카오맵 초기화 실패:', error);
      }
    };

    initMap();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (mapService) {
        mapService.destroy();
      }
    };
  }, []);

  // 축제 데이터 변경 시 마커 업데이트
  useEffect(() => {
    if (mapService && festivals) {
      mapService.updateMarkers(festivals);
    }
  }, [festivals, mapService]);

  // 선택된 축제로 지도 이동
  useEffect(() => {
    if (mapService && selectedFestival) {
      mapService.moveToFestival(selectedFestival);
    }
  }, [selectedFestival, mapService]);

  // 지도 컨트롤 핸들러
  const handleMapControl = (control) => {
    setMapControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }));

    if (mapService) {
      switch (control) {
        case 'showSatellite':
          mapService.setMapTypeId(
            mapControls.showSatellite ? 
            kakao.maps.MapTypeId.ROADMAP : 
            kakao.maps.MapTypeId.HYBRID
          );
          break;
        default:
          break;
      }
    }
  };

  const handleFullView = () => {
    if (mapService) {
      mapService.setCenter(34.8679, 126.9910);
      mapService.setLevel(8);
    }
  };

  return (
    <div className="map-panel">
      <div className="map-header">
        <h2>전라남도 축제 위치</h2>
        <div className="map-controls">
          <button 
            className="btn btn-outline"
            onClick={handleFullView}
          >
            전체보기
          </button>
          <button 
            className={`btn ${mapControls.showCluster ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleMapControl('showCluster')}
          >
            클러스터
          </button>
          <button 
            className={`btn ${mapControls.showSatellite ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleMapControl('showSatellite')}
          >
            위성
          </button>
        </div>
      </div>

      <div className="map-container">
        <div 
          id="map-container" 
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default MapPanel;
```

### 3. CSS 스타일링

```css
/* src/components/MapPanel/MapPanel.css */
.map-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow);
  overflow: hidden;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--white);
}

.map-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}

.map-controls {
  display: flex;
  gap: 8px;
}

.map-container {
  flex: 1;
  position: relative;
  min-height: 400px;
}

#map-container {
  width: 100%;
  height: 100%;
  border-radius: 0 0 8px 8px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .map-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .map-controls {
    justify-content: center;
  }
  
  .map-container {
    min-height: 300px;
  }
}

/* 카카오맵 커스텀 스타일 */
.map-panel .kakao-map {
  border-radius: 0 0 8px 8px;
}

/* 마커 클러스터 스타일 */
.marker-cluster {
  background-color: var(--primary);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
}

/* 정보창 스타일 */
.kakao-map-info-window {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

## 🔧 4. 환경변수 및 설정

### 1. 환경변수 파일 업데이트

```bash
# .env.local
VITE_KAKAO_MAP_API_KEY=your_javascript_api_key_here
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_DATA=false
VITE_DEBUG_MODE=false
```

### 2. Vite 설정 업데이트

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    port: 5173,
    host: true
  }
})
```

## 🚀 5. 배포 시 고려사항

### 1. API 키 보안

```javascript
// 프로덕션 환경에서 API 키 검증
const validateApiKey = () => {
  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  if (!apiKey || apiKey === 'your_javascript_api_key_here') {
    console.error('카카오맵 API 키가 설정되지 않았습니다.');
    return false;
  }
  return true;
};
```

### 2. 도메인 제한 설정

- 카카오 개발자 콘솔에서 사이트 도메인 설정
- 개발: `http://localhost:5173`
- 프로덕션: `https://yourdomain.com`

### 3. HTTPS 필수

- 카카오맵 API는 HTTPS 환경에서만 정상 작동
- 개발 환경에서는 localhost 예외 적용

## 📱 6. 모바일 최적화

### 1. 터치 이벤트 처리

```javascript
// 모바일 터치 이벤트 최적화
const handleTouchStart = (e) => {
  e.preventDefault();
  // 터치 시작 처리
};

const handleTouchMove = (e) => {
  e.preventDefault();
  // 터치 이동 처리
};
```

### 2. 반응형 지도 크기

```css
/* 모바일에서 지도 크기 조정 */
@media (max-width: 768px) {
  .map-container {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .map-container {
    height: 250px;
  }
}
```

## 🔍 7. 디버깅 및 테스트

### 1. 콘솔 로그 추가

```javascript
// 디버깅용 로그
console.log('카카오맵 API 로드 상태:', mapService?.isLoaded);
console.log('현재 마커 수:', mapService?.markers?.length);
console.log('선택된 축제:', selectedFestival);
```

### 2. 에러 처리

```javascript
// 에러 처리
try {
  await service.loadKakaoMapAPI();
} catch (error) {
  console.error('카카오맵 API 로드 실패:', error);
  // 대체 UI 표시
}
```

이제 카카오맵 API가 완전히 통합된 전라남도 축제 대시보드를 사용할 수 있습니다! 🗺️✨
