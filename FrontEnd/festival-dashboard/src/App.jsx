import React, { useState, useMemo } from 'react';
import FilterPanel from './components/FilterPanel/FilterPanel';
import MapPanel from './components/MapPanel/MapPanel';
import StatsPanel from './components/StatsPanel/StatsPanel';
import ChartOnlyPanel from './components/ChartOnlyPanel/ChartOnlyPanel';
import InputPage from './components/InputPage/InputPage';
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

  // 페이지 상태 ('dashboard', 'input', 'history')
  const [currentPage, setCurrentPage] = useState('dashboard');

  // 년도 선택 상태 (StatsPanel과 ChartOnlyPanel에서 공유)
  const [selectedYears, setSelectedYears] = useState([2024]);

  // onSelectionChange 객체를 useMemo로 안정화
  const onSelectionChange = useMemo(() => ({
    setSelectedFestivals,
    setSelectedRegions,
    setSelectedCategories,
    setAllFestivals
  }), []); // 빈 의존성 배열로 안정화

  // 메인 콘텐츠 렌더링 함수
  const renderContent = () => {
    // 페이지별 렌더링
    if (currentPage === 'input') {
      return <InputPage />;
    }

    if (currentPage === 'history') {
      return (
        <div className="page-placeholder">
          <h2>히스토리 페이지</h2>
          <p>히스토리 페이지는 추후 구현 예정입니다.</p>
        </div>
      );
    }

    // 대시보드 페이지 (기존 뷰 모드별 렌더링)
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
          {/* 왼쪽: 뷰 모드 버튼들 (대시보드 페이지에서만 표시) */}
          <div className="left-section">
            {currentPage === 'dashboard' && (
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
            )}
          </div>

          {/* 가운데: 타이틀 */}
          <h1>전라남도 축제 데이터 분석</h1>

          {/* 오른쪽: 네비게이션 버튼들 */}
          <div className="nav-buttons">
            <button
              className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              대시보드
            </button>
            <button
              className={`nav-btn ${currentPage === 'input' ? 'active' : ''}`}
              onClick={() => setCurrentPage('input')}
            >
              입력 페이지
            </button>
            <button
              className={`nav-btn ${currentPage === 'history' ? 'active' : ''}`}
              onClick={() => setCurrentPage('history')}
            >
              히스토리 페이지
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