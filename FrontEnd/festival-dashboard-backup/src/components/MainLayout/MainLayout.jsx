import React from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import { useFestivals } from '../../hooks/useFestivals.js';
import FilterPanel from '../FilterPanel/FilterPanel';
import MapPanel from '../MapPanel/MapPanel';
import ChartPanel from '../ChartPanel/ChartPanel';
import './MainLayout.css';

const MainLayout = () => {
  const { state } = useApp();
  const { viewMode } = state;
  
  // 데이터 로딩
  useFestivals();

  const getLayoutClass = () => {
    switch (viewMode) {
      case 'map':
        return 'main-layout map-only';
      case 'chart':
        return 'main-layout chart-only';
      default:
        return 'main-layout split-view';
    }
  };

  return (
    <div className={getLayoutClass()}>
      {viewMode !== 'chart' && (
        <div className="filter-panel-container">
          <FilterPanel />
        </div>
      )}
      
      {viewMode !== 'chart' && (
        <div className="map-panel-container">
          <MapPanel />
        </div>
      )}
      
      {viewMode !== 'map' && (
        <div className="chart-panel-container">
          <ChartPanel />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
