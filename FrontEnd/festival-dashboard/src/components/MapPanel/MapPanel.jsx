/**
 * MapPanel 컴포넌트
 * 
 * 역할: 지도 패널의 메인 컴포넌트
 * - FilterPanel에서 선택된 축제 데이터를 받아서 지도에 표시
 * - 카카오맵 API와 연동하여 축제 마커 표시
 * - 지역별 축제 분포를 시각적으로 표현
 * 
 * Props:
 * - selectedFestivals: 선택된 축제 목록
 * - allFestivals: 전체 축제 데이터
 * - selectedRegions: 선택된 지역 목록
 * - selectedCategories: 선택된 카테고리 목록
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import KakaoMap from './KakaoMap';
import { getLocationCoordinates, JEONNAM_CENTER, DEFAULT_ZOOM_LEVEL } from '../../data/locationCoordinates';
import './styles/MapPanel.css';

const MapPanel = ({
  selectedFestivals = [],
  allFestivals = [],
  selectedRegions = [],
  selectedCategories = []
}) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [openInfoWindows, setOpenInfoWindows] = useState(new Set());

  // 선택된 축제들을 지역별로 그룹화
  const festivalsByLocation = useMemo(() => {
    if (!selectedFestivals.length || !allFestivals.length) return {};

    const grouped = {};
    
    selectedFestivals.forEach(festivalName => {
      // 선택된 축제명과 일치하는 축제 데이터 찾기
      const festival = allFestivals.find(f => 
        (f.festivalNm || f.name) === festivalName
      );
      
      if (festival && festival.locationId) {
        const locationId = festival.locationId;
        if (!grouped[locationId]) {
          grouped[locationId] = [];
        }
        grouped[locationId].push(festival);
      }
    });

    return grouped;
  }, [selectedFestivals, allFestivals]);

  // 지도 초기화 (useCallback으로 최적화)
  const handleMapReady = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // 마커 생성 함수 (useCallback으로 최적화)
  const createMarkers = useCallback(() => {
    if (!map) return;

    // 기존 마커들 제거 (정보창 상태는 유지)
    markers.forEach(marker => marker.setMap(null));
    const newMarkers = [];

    // 현재 선택된 축제들의 지역 ID 목록
    const currentLocationIds = Object.keys(festivalsByLocation);

    // 더 이상 선택되지 않은 지역의 정보창 닫기 (상태 변경이 실제 필요한 경우에만)
    setOpenInfoWindows(prevOpenWindows => {
      const newOpenWindows = new Set();
      let hasChanges = false;

      prevOpenWindows.forEach(locationKey => {
        if (currentLocationIds.includes(locationKey)) {
          newOpenWindows.add(locationKey);
        } else {
          hasChanges = true;
        }
      });

      // 변경사항이 없다면 기존 상태 반환
      return hasChanges ? newOpenWindows : prevOpenWindows;
    });

    // 지역별로 마커 생성
    Object.entries(festivalsByLocation).forEach(([locationId, festivals]) => {
      const coordinates = getLocationCoordinates(parseInt(locationId));

      if (coordinates) {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng),
          map: map
        });

        // 마커 클릭 시 정보창 토글
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `
            <div class="map-info-window">
              <h3>${coordinates.name}</h3>
              <p>축제 ${festivals.length}개</p>
              <ul>
                ${festivals.slice(0, 3).map(festival =>
                  `<li>${festival.festivalNm || festival.name}</li>`
                ).join('')}
                ${festivals.length > 3 ? `<li>... 외 ${festivals.length - 3}개</li>` : ''}
              </ul>
            </div>
          `
        });

        // 이미 열려있는 정보창이면 다시 열기 (초기 렌더링 시에만)
        const locationKey = `${locationId}`;
        setTimeout(() => {
          if (openInfoWindows.has(locationKey)) {
            infoWindow.open(map, marker);
          }
        }, 0);

        window.kakao.maps.event.addListener(marker, 'click', () => {
          setOpenInfoWindows(prevOpenWindows => {
            const newOpenWindows = new Set(prevOpenWindows);

            if (newOpenWindows.has(locationKey)) {
              // 이미 열려있으면 닫기
              infoWindow.close();
              newOpenWindows.delete(locationKey);
            } else {
              // 닫혀있으면 열기
              infoWindow.open(map, marker);
              newOpenWindows.add(locationKey);
            }

            return newOpenWindows;
          });
        });

        newMarkers.push({ marker, infoWindow, locationId });
      }
    });

    setMarkers(newMarkers.map(item => item.marker));

    // 축제가 선택된 경우 해당 지역으로 지도 중심 이동
    if (Object.keys(festivalsByLocation).length > 0) {
      const firstLocationId = Object.keys(festivalsByLocation)[0];
      const coordinates = getLocationCoordinates(parseInt(firstLocationId));
      
      if (coordinates) {
        map.setCenter(new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng));
        map.setLevel(9); // 줌 레벨 조정
      }
    } else {
      // 선택된 축제가 없으면 전라남도 전체로 이동
      map.setCenter(new window.kakao.maps.LatLng(JEONNAM_CENTER.lat, JEONNAM_CENTER.lng));
      map.setLevel(DEFAULT_ZOOM_LEVEL);
    }
  }, [map, festivalsByLocation]); // openInfoWindows 의존성 제거

  // 마커 생성 및 업데이트
  useEffect(() => {
    createMarkers();
  }, [createMarkers]);

  return (
    <div className="map-panel">
      <div className="map-panel__header">
        <h2>전라남도 축제 지도</h2>
        <div className="map-panel__stats">
          <span className="stat-item">
            <span className="stat-label">선택된 지역:</span>
            <span className="stat-value">{Object.keys(festivalsByLocation).length}개</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">선택된 축제:</span>
            <span className="stat-value">{selectedFestivals.length}개</span>
          </span>
        </div>
      </div>
      
      <div className="map-panel__content">
        <KakaoMap 
          onMapReady={handleMapReady}
          center={JEONNAM_CENTER}
          level={DEFAULT_ZOOM_LEVEL}
        />
      </div>
      
      <div className="map-panel__legend">
        <div className="legend-item">
          <span className="legend-marker">📍</span>
          <span className="legend-text">축제가 있는 지역</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker">🎪</span>
          <span className="legend-text">선택된 축제</span>
        </div>
      </div>
    </div>
  );
};

export default MapPanel;
