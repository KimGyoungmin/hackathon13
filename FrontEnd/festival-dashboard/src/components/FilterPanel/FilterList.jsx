/**
 * FilterList 컴포넌트
 * 
 * 역할: 필터 옵션 목록을 표시
 * - 지역별/카테고리별 목록
 * - 체크박스로 선택/해제
 * - 선택된 항목 표시
 * - 지역 선택 시 하위 축제들 표시 (계층적 구조)
 * 
 * Props:
 * - items: 필터 옵션 배열
 * - selectedItems: 선택된 항목 ID 배열
 * - onItemToggle: 항목 선택/해제 시 호출되는 함수
 * - type: 필터 타입 ('region' | 'category')
 * - festivals: 축제 데이터 배열 (지역별 축제 표시용)
 * - selectedFestivals: 선택된 축제 ID 배열
 * - onFestivalToggle: 축제 선택/해제 시 호출되는 함수
 */
import React, { useState, useMemo } from 'react';
import './styles/FilterList.css';

const FilterList = ({ 
  items = [], 
  selectedItems = [], 
  onItemToggle,
  type = 'region',
  festivals = [],
  selectedFestivals = [],
  onFestivalToggle
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  // 지역별 축제 그룹화 (중복 제거 - 축제명 기준으로 가장 최신 연도만 유지)
  const festivalsByRegion = useMemo(() => {
    if (type !== 'region' || !festivals.length) return {};
    
    console.log('🔍 전체 축제 데이터:', festivals.length, '개');
    
    const grouped = {};
    festivals.forEach(festival => {
      const regionId = festival.locationId;
      if (!grouped[regionId]) {
        grouped[regionId] = [];
      }
      grouped[regionId].push(festival);
    });
    
    console.log('📍 지역별 그룹화 결과:', Object.keys(grouped).map(id => `${id}: ${grouped[id].length}개`));

    // 각 지역별로 축제명 기준 중복 제거 (가장 최신 연도 유지)
    Object.keys(grouped).forEach(regionId => {
      const regionFestivals = grouped[regionId];
      const uniqueFestivals = new Map();
      
      regionFestivals.forEach(festival => {
        const festivalName = festival.festivalNm || festival.name;
        const currentYear = festival.year || 0;
        
        // festivalId가 같은 경우도 고려 (festivalId 기준으로도 중복 제거)
        const festivalKey = festival.festivalId || festival.id;
        
        if (!uniqueFestivals.has(festivalName) || 
            currentYear > (uniqueFestivals.get(festivalName).year || 0)) {
          uniqueFestivals.set(festivalName, {
            ...festival,
            id: festivalKey, // 고유한 ID 사용
            name: festivalName
          });
        }
      });
      
      grouped[regionId] = Array.from(uniqueFestivals.values());
      
      // 강진군(regionId: 1) 디버깅
      if (regionId === 1) {
        console.log('🏛️ 강진군 축제 목록:', grouped[regionId].map(f => f.festivalNm));
      }
    });
    
    console.log('✅ 최종 결과:', Object.keys(grouped).map(id => `${id}: ${grouped[id].length}개 고유 축제`));
    return grouped;
  }, [festivals, type]);

  // 카테고리별 축제 그룹화 (중복 제거 - 축제명 기준으로 가장 최신 연도만 유지)
  const festivalsByCategory = useMemo(() => {
    if (type !== 'category' || !festivals.length) return {};
    
    console.log('🔍 카테고리별 전체 축제 데이터:', festivals.length, '개');
    
    const grouped = {};
    festivals.forEach(festival => {
      const categoryId = festival.categoryId;
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(festival);
    });
    
    console.log('🏷️ 카테고리별 그룹화 결과:', Object.keys(grouped).map(id => `${id}: ${grouped[id].length}개`));

    // 각 카테고리별로 축제명 기준 중복 제거 (가장 최신 연도 유지)
    Object.keys(grouped).forEach(categoryId => {
      const categoryFestivals = grouped[categoryId];
      const uniqueFestivals = new Map();
      
      categoryFestivals.forEach(festival => {
        const festivalName = festival.festivalNm || festival.name;
        const currentYear = festival.year || 0;
        
        // festivalId가 같은 경우도 고려 (festivalId 기준으로도 중복 제거)
        const festivalKey = festival.festivalId || festival.id;
        
        if (!uniqueFestivals.has(festivalName) || 
            currentYear > (uniqueFestivals.get(festivalName).year || 0)) {
          uniqueFestivals.set(festivalName, {
            ...festival,
            id: festivalKey, // 고유한 ID 사용
            name: festivalName
          });
        }
      });
      
      grouped[categoryId] = Array.from(uniqueFestivals.values());
    });
    
    console.log('✅ 카테고리별 최종 결과:', Object.keys(grouped).map(id => `${id}: ${grouped[id].length}개 고유 축제`));
    return grouped;
  }, [festivals, type]);

  // handleItemClick은 현재 사용하지 않음 (체크박스 클릭으로 대체)
  // const handleItemClick = (itemId) => {
  //   if (onItemToggle) {
  //     onItemToggle(itemId);
  //   }
  // };

  const handleCheckboxClick = (itemId, isSelected) => {
    // 체크박스 클릭 시 선택/해제
    if (onItemToggle) {
      onItemToggle(itemId);
    }
    
    if (!isSelected) {
      // 체크박스가 선택되면 자동으로 토글 (펼치기) - 지역별과 카테고리별 모두
      setExpandedItems(prev => new Set([...prev, itemId]));
    }
    // 체크박스 해제 시 자동 접힘 기능 제거됨
  };

  const handleFestivalClick = (festival) => {
    if (onFestivalToggle) {
      // 축제명을 기준으로 선택/해제 (중복 제거된 축제명)
      const festivalName = festival.festivalNm || festival.name;
      onFestivalToggle(festivalName);
    }
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  if (items.length === 0) {
    return (
      <div className="filter-list">
        <div className="filter-list__empty">
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="filter-list">
      <div className="filter-list__content">
        {items.map(item => {
          const isSelected = selectedItems.includes(item.id);
          const isExpanded = expandedItems.has(item.id);
          const regionFestivals = festivalsByRegion[item.id] || [];
          const categoryFestivals = festivalsByCategory[item.id] || [];
          const hasFestivals = type === 'region' ? regionFestivals.length > 0 : categoryFestivals.length > 0;

          return (
            <div key={item.id} className="filter-item-container">
              {/* 지역/카테고리 항목 */}
              <div className={`filter-item ${isSelected ? 'filter-item--selected' : ''}`}>
                <div className="filter-item__checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCheckboxClick(item.id, isSelected)}
                  />
                </div>
                <div 
                  className="filter-item__content filter-item__content--clickable"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasFestivals) {
                      toggleExpanded(item.id);
                    }
                  }}
                  style={{ cursor: hasFestivals ? 'pointer' : 'default' }}
                >
                  <span className="filter-item__name">{item.name}</span>
                  {item.festivalCount && (
                    <span className="filter-item__count">({item.festivalCount})</span>
                  )}
                  {/* 축제가 있는 경우 펼침/접힘 상태 표시 */}
                  {hasFestivals && (
                    <span className="filter-item__expand-icon">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  )}
                </div>
              </div>

              {/* 하위 축제 목록 (지역별과 카테고리별 모두) */}
              {isExpanded && hasFestivals && (
                <div className="filter-item__festivals">
                  {(type === 'region' ? regionFestivals : categoryFestivals).map(festival => {
                    const festivalName = festival.festivalNm || festival.name;
                    const isSelected = selectedFestivals.includes(festivalName);
                    
                    return (
                      <div
                        key={festival.id}
                        className={`filter-festival ${isSelected ? 'filter-festival--selected' : ''}`}
                        onClick={() => handleFestivalClick(festival)}
                      >
                        <div className="filter-festival__checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            readOnly
                          />
                        </div>
                        <div className="filter-festival__content">
                          <span className="filter-festival__name">{festivalName}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterList;
