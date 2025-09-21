import React, { useState, useMemo } from 'react';
import FilterPanel from './components/FilterPanel/FilterPanel';
import MapPanel from './components/MapPanel/MapPanel';
import './App.css';


// 메인태그는 바디태그와 비슷하고, 화면의 디스플레이 담당? 레이아웃 담당
function App() {
  // FilterPanel과 MapPanel 간의 데이터 공유를 위한 상태
  const [selectedFestivals, setSelectedFestivals] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [allFestivals, setAllFestivals] = useState([]);

  // onSelectionChange 객체를 useMemo로 안정화
  const onSelectionChange = useMemo(() => ({
    setSelectedFestivals,
    setSelectedRegions,
    setSelectedCategories,
    setAllFestivals
  }), []); // 빈 의존성 배열로 안정화

  return (
    <div className="app">
      <header className="app-header">
        <h1>전라남도 축제 데이터 분석</h1>
      </header>
      
      <main className="app-main">
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
        </div>
      </main>
    </div>
  );
}

export default App;