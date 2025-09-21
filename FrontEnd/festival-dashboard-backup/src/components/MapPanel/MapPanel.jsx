import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import { useFestivals } from '../../hooks/useFestivals.js';
import './MapPanel.css';

const MapPanel = () => {
  const { state, actions } = useApp();
  const { selectedFestival } = state;
  const { festivals } = useFestivals();
  
  const [mapControls, setMapControls] = useState({
    showCluster: false,
    showSatellite: false
  });

  // 지역별 색상 매핑
  const getRegionColor = (region) => {
    const colorMap = {
      '목포시': 'var(--marker-mokpo)',
      '나주시': 'var(--marker-naju)',
      '영광군': 'var(--marker-yeonggwang)',
      '함평군': 'var(--marker-hampyeong)',
      '곡성군': 'var(--marker-gokseong)',
      '구례군': 'var(--marker-gurye)',
      '담양군': 'var(--marker-damyang)',
      '강진군': 'var(--marker-gangjin)',
      '해남군': 'var(--marker-haenam)',
      '진도군': 'var(--marker-jindo)'
    };
    return colorMap[region] || 'var(--primary-purple)';
  };

  const handleMarkerClick = (festival) => {
    actions.setSelectedFestival(festival);
  };

  const handleMapControl = (control) => {
    setMapControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }));
  };

  const handleFullView = () => {
    // 전체 보기 로직 (추후 구현)
    console.log('전체 보기');
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
        {/* 실제 지도 구현 전 임시 지도 영역 */}
        <div className="map-placeholder">
          <div className="map-background">
            {/* 전라남도 지도 배경 */}
            <div className="jeollanamdo-outline">
              {/* 축제 마커들 */}
              {festivals.map(festival => {
                const isSelected = selectedFestival?.id === festival.id;
                const regionName = festival.location?.name || festival.region || '알 수 없음';
                const regionColor = getRegionColor(regionName);
                
                return (
                  <div
                    key={festival.id}
                    className={`map-marker ${isSelected ? 'selected pulse' : ''}`}
                    style={{
                      left: `${((festival.longitude || 126) - 125) * 100}%`,
                      top: `${(36 - (festival.latitude || 35)) * 100}%`,
                      backgroundColor: regionColor
                    }}
                    onClick={() => handleMarkerClick(festival)}
                    title={festival.name}
                  >
                    <div className="marker-content">
                      {regionName.replace(/[시군]/g, '')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 마커 정보 툴팁 */}
        {selectedFestival && (
          <div className="marker-tooltip">
            <div className="tooltip-content">
              <h4>{selectedFestival.name}</h4>
              <p>위치: {selectedFestival.location?.name || selectedFestival.region || '알 수 없음'}</p>
              <p>카테고리: {selectedFestival.category?.name || selectedFestival.category || '알 수 없음'}</p>
              <p>방문객: {selectedFestival.totalVisitors?.toLocaleString() || '정보 없음'}명</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPanel;
