import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import { useFestivals } from '../../hooks/useFestivals.js';
import FilterButton from './FilterButton';
import FilterCheckbox from './FilterCheckbox';
import './FilterPanel.css';

const FilterPanel = () => {
  const { state } = useApp();
  const { activeFilterTab } = state;
  
  const {
    festivals,
    filterOptions,
    selectedRegions,
    selectedCategories,
    searchTerm,
    toggleRegion,
    toggleCategory,
    setSearchTerm,
    selectAllRegions,
    selectAllCategories,
    resetAllFilters
  } = useFestivals();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // 검색 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, setSearchTerm]);

  const handleTabChange = (tab) => {
    // AppContext에서 activeFilterTab 설정
    const { actions } = useApp();
    actions.setActiveFilterTab(tab);
  };

  const handleSelectAll = () => {
    if (activeFilterTab === 'region') {
      selectAllRegions();
    } else {
      selectAllCategories();
    }
  };

  const handleClearSelections = () => {
    resetAllFilters();
    setLocalSearchTerm('');
  };

  const handleRegionToggle = (regionId) => {
    toggleRegion(regionId);
  };

  const handleCategoryToggle = (categoryId) => {
    toggleCategory(categoryId);
  };

  // 통계 계산
  const selectedRegionCount = selectedRegions.length;
  const selectedCategoryCount = selectedCategories.length;
  const totalFestivalCount = festivals.length;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2>축제 필터링</h2>
      </div>

      {/* 탭 */}
      <div className="filter-tabs">
        <FilterButton
          label="지역별"
          isActive={activeFilterTab === 'region'}
          onClick={() => handleTabChange('region')}
          variant="outline"
          size="medium"
          className="filter-tab"
        />
        <FilterButton
          label="카테고리별"
          isActive={activeFilterTab === 'category'}
          onClick={() => handleTabChange('category')}
          variant="outline"
          size="medium"
          className="filter-tab"
        />
      </div>

      {/* 액션 버튼 */}
      <div className="filter-actions">
        <FilterButton
          label="전체 선택"
          onClick={handleSelectAll}
          variant="outline"
          size="small"
        />
        <FilterButton
          label="선택 초기화"
          onClick={handleClearSelections}
          variant="secondary"
          size="small"
        />
      </div>

      {/* 검색 박스 */}
      <div className="search-container">
        <input
          type="text"
          className="input"
          placeholder="축제명 또는 지역명 검색..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
        />
      </div>

      {/* 필터 리스트 */}
      <div className="filter-list">
        {activeFilterTab === 'region' ? (
          <div className="region-list">
            {filterOptions?.regions?.map(region => (
              <FilterCheckbox
                key={region.id}
                id={`region-${region.id}`}
                label={region.name}
                checked={selectedRegions.includes(region.id)}
                onChange={(checked) => handleRegionToggle(region.id)}
                showCount={true}
                count={region.festivalCount}
              />
            ))}
          </div>
        ) : (
          <div className="category-list">
            {filterOptions?.categories?.map(category => (
              <FilterCheckbox
                key={category.id}
                id={`category-${category.id}`}
                label={category.name}
                checked={selectedCategories.includes(category.id)}
                onChange={(checked) => handleCategoryToggle(category.id)}
                showCount={true}
                count={category.festivalCount}
              />
            ))}
          </div>
        )}
      </div>

      {/* 축제 목록 */}
      <div className="festival-list">
        <h3>축제 목록</h3>
        <div className="festival-items">
          {festivals.map(festival => (
            <div key={festival.id} className="festival-item">
              <div className="festival-info">
                <span className="festival-name">{festival.name}</span>
                <span className="festival-region">{festival.location?.name || festival.region || '알 수 없음'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="filter-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎪</div>
            <div className="stat-content">
              <div className="stat-number">{festivals.length}</div>
              <div className="stat-label">표시된 축제</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-content">
              <div className="stat-number">{selectedRegionCount}</div>
              <div className="stat-label">선택된 지역</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎭</div>
            <div className="stat-content">
              <div className="stat-number">{selectedCategoryCount}</div>
              <div className="stat-label">선택된 카테고리</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎪</div>
            <div className="stat-content">
              <div className="stat-number">{totalFestivalCount}</div>
              <div className="stat-label">전체 축제</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
