import React, { useState, useMemo } from 'react';
import FilterPanel from './components/FilterPanel/FilterPanel';
import MapPanel from './components/MapPanel/MapPanel';
import StatsPanel from './components/StatsPanel/StatsPanel';
import ChartOnlyPanel from './components/ChartOnlyPanel/ChartOnlyPanel';
import './App.css';


// 메인태그는 바디태그와 비슷하고, 화면의 디스플레이 담당? 레이아웃 담당
function App() {
  // FilterPanel과 MapPanel 간의 데이터 공유를 위한 상태
  const [selectedFestivals, setSelectedFestivals] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [allFestivals, setAllFestivals] = useState([]);

  // 뷰 모드 상태 ('split', 'map', 'chart')
  const [viewMode, setViewMode] = useState('split');

  // 년도 선택 상태 (StatsPanel과 ChartOnlyPanel에서 공유)
  const [selectedYears, setSelectedYears] = useState([2024]);

  // onSelectionChange 객체를 useMemo로 안정화
  const onSelectionChange = useMemo(() => ({
    setSelectedFestivals,
    setSelectedRegions,
    setSelectedCategories,
    setAllFestivals
  }), []); // 빈 의존성 배열로 안정화

  // 뷰 모드별 렌더링 함수
  const renderContent = () => {
    switch (viewMode) {
      case 'split':
        return (
          <div className="main-layout">
            {/* 왼쪽 사이드바 - FilterPanel 컴포넌트 */}
            <aside className="sidebar">
              <FilterPanel
                onSelectionChange={onSelectionChange}
              />
            </aside>

            {/* 메인 콘텐츠 영역 - MapPanel 컴포넌트 */}
            <section className="main-content">
              <MapPanel
                selectedFestivals={selectedFestivals}
                selectedRegions={selectedRegions}
                selectedCategories={selectedCategories}
                allFestivals={allFestivals}
              />
            </section>

            {/* 오른쪽 사이드바 - StatsPanel 컴포넌트 */}
            <aside className="right-sidebar">
              <StatsPanel
                selectedFestivals={selectedFestivals}
                selectedYears={selectedYears}
                setSelectedYears={setSelectedYears}
                allFestivals={allFestivals}
              />
            </aside>
          </div>
        );

      case 'map':
        return (
          <div className="map-only-layout">
            <MapPanel
              selectedFestivals={selectedFestivals}
              selectedRegions={selectedRegions}
              selectedCategories={selectedCategories}
              allFestivals={allFestivals}
            />
          </div>
        );

      case 'chart':
        return (
          <div className="chart-layout">
            {/* 왼쪽 사이드바 - FilterPanel 컴포넌트 */}
            <aside className="sidebar">
              <FilterPanel
                onSelectionChange={onSelectionChange}
              />
            </aside>

            {/* 오른쪽 사이드바 - StatsPanel 컴포넌트 */}
            <aside className="right-sidebar">
              <StatsPanel
                selectedFestivals={selectedFestivals}
                selectedYears={selectedYears}
                setSelectedYears={setSelectedYears}
                allFestivals={allFestivals}
              />
            </aside>

            {/* 차트만 메인 영역 */}
            <section className="chart-main-content">
              <ChartOnlyPanel
                selectedFestivals={selectedFestivals}
                selectedYears={selectedYears}
                allFestivals={allFestivals}
              />
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>전라남도 축제 데이터 분석</h1>

          {/* 뷰 모드 버튼들 */}
          <div className="view-mode-buttons">
            <button
              className={`view-btn ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => setViewMode('split')}
            >
              분할보기
            </button>
            <button
              className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              지도만
            </button>
            <button
              className={`view-btn ${viewMode === 'chart' ? 'active' : ''}`}
              onClick={() => setViewMode('chart')}
            >
              차트만
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;