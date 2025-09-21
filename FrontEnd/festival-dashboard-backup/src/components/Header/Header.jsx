
import React from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import './Header.css';

const Header = () => {
  const { state, actions } = useApp();
  const { viewMode } = state;

  const handleViewModeChange = (mode) => {
    actions.setViewMode(mode);
  };

  const handleNavigation = (page) => {
    // 네비게이션 로직 (추후 구현)
    console.log(`Navigate to: ${page}`);
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* 제목 */}
        <div className="header-title">
          <h1>전라남도 축제 데이터 분석</h1>
        </div>

        {/* 뷰 모드 컨트롤 */}
        <div className="header-controls">
          <div className="view-mode-controls">
            <button
              className={`btn ${viewMode === 'split' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleViewModeChange('split')}
            >
              분할 보기
            </button>
            <button
              className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleViewModeChange('map')}
            >
              지도만
            </button>
            <button
              className={`btn ${viewMode === 'chart' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleViewModeChange('chart')}
            >
              차트만
            </button>
          </div>

          {/* 네비게이션 */}
          <div className="navigation-controls">
            <button
              className="btn btn-secondary"
              onClick={() => handleNavigation('dashboard')}
            >
              대시보드
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleNavigation('input')}
            >
              입력 페이지
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleNavigation('history')}
            >
              히스토리 페이지
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
