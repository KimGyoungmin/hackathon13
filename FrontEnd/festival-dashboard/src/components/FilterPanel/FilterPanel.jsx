/**
 * FilterPanel 컴포넌트
 * 
 * 역할: 필터 패널의 메인 컴포넌트
 * - 모든 하위 컴포넌트들을 조합
 * - 상태 관리 및 이벤트 처리
 * - 컴포넌트 간 데이터 전달
 * - API 연결 및 실제 데이터 로딩
 * 
 * 이 컴포넌트는 다음과 같은 하위 컴포넌트들을 조합합니다:
 * - FilterHeader: 헤더 부분
 * - FilterTabs: 탭 전환
 * - FilterActions: 액션 버튼들
 * - FilterList: 필터 목록
 * - FilterStats: 통계 정보
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import FilterHeader from './FilterHeader';
import FilterTabs from './FilterTabs';
import FilterActions from './FilterActions';
import FilterList from './FilterList';
import FilterStats from './FilterStats';
import festivalService from '../../services/festivalService.js';
import { useApi } from '../../hooks/useApi.js';
import './styles/index.css';

const FilterPanel = ({ onSelectionChange }) => {
  // 상태 관리
  const [activeTab, setActiveTab] = useState('region');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFestivals, setSelectedFestivals] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [allFestivals, setAllFestivals] = useState([]); // 전체 축제 데이터 유지

  // onSelectionChange 참조 안정화
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;

  // API 호출을 위한 훅
  const { data: filterOptions, loading: filterLoading, error: filterError } = useApi(
    () => festivalService.getFilterOptions(),
    []
  );

  // 필터링된 축제 데이터 로딩 (지역/카테고리 필터만 적용)
  const loadFilteredFestivals = useCallback(async () => {
    try {
      const filters = {
        regions: selectedRegions.length > 0 ? selectedRegions.join(',') : null,
        categories: selectedCategories.length > 0 ? selectedCategories.join(',') : null,
      };

      const filteredFestivals = await festivalService.getFilteredFestivals(filters);
      setFestivals(filteredFestivals);
      console.log('🔄 필터링된 축제 로딩:', filteredFestivals.length, '개');
    } catch (error) {
      console.error('필터링된 축제 로딩 실패:', error);
    }
  }, [selectedRegions, selectedCategories]);

  // 필터 변경 시 축제 데이터 다시 로딩
  useEffect(() => {
    loadFilteredFestivals();
  }, [selectedRegions, selectedCategories]); // loadFilteredFestivals 제거

  // 초기 축제 데이터 로딩
  useEffect(() => {
    const loadInitialFestivals = async () => {
      try {
        const allFestivalsData = await festivalService.getAllFestivals();
        setAllFestivals(allFestivalsData); // 전체 데이터 저장
        setFestivals(allFestivalsData); // 초기에는 전체 데이터 표시
        console.log('📊 전체 축제 데이터 로딩:', allFestivalsData.length, '개');
        
        // 부모 컴포넌트에 전체 축제 데이터 전달
        if (onSelectionChangeRef.current?.setAllFestivals) {
          onSelectionChangeRef.current.setAllFestivals(allFestivalsData);
        }
      } catch (error) {
        console.error('초기 축제 데이터 로딩 실패:', error);
      }
    };

    loadInitialFestivals();
  }, []); // onSelectionChange 제거 (초기 로딩은 한 번만)

  // 선택 상태 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    if (onSelectionChangeRef.current) {
      onSelectionChangeRef.current.setSelectedFestivals(selectedFestivals);
      onSelectionChangeRef.current.setSelectedRegions(selectedRegions);
      onSelectionChangeRef.current.setSelectedCategories(selectedCategories);
    }
  }, [selectedFestivals, selectedRegions, selectedCategories]); // 상태 변경 시에만 실행

  // 유틸리티 함수들
  const getUniqueFestivalNames = (festivals) => {
    return [...new Set(festivals.map(festival => festival.festivalNm || festival.name))];
  };

  const getCategoryIds = (festivals) => {
    return [...new Set(festivals.map(festival => festival.categoryId).filter(id => id))];
  };

  const getRegionIds = (festivals) => {
    return [...new Set(festivals.map(festival => festival.locationId).filter(id => id))];
  };

  // 이벤트 핸들러들
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };


  const handleItemToggle = (itemId) => {
    if (activeTab === 'region') {
      const wasSelected = selectedRegions.includes(itemId);
      
      setSelectedRegions(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
      
      if (wasSelected) {
        // 지역이 해제되면 해당 지역의 모든 축제도 해제
        const regionFestivals = allFestivals.filter(festival => festival.locationId === itemId);
        const uniqueFestivalNames = getUniqueFestivalNames(regionFestivals);
        
        // 축제 해제
        setSelectedFestivals(prev => {
          const newFestivals = prev.filter(festivalName => !uniqueFestivalNames.includes(festivalName));
          console.log('🎪 축제 해제 전:', prev.length, '개 → 해제 후:', newFestivals.length, '개');
          
          // 축제 해제 후 카테고리도 확인하여 해제
          const categoryIds = getCategoryIds(regionFestivals);
          categoryIds.forEach(categoryId => {
            // 같은 카테고리의 다른 지역 축제가 선택되어 있는지 확인
            const otherRegionFestivals = allFestivals.filter(festival => 
              festival.categoryId === categoryId && 
              festival.locationId !== itemId
            );
            const otherSelectedFestivals = otherRegionFestivals.filter(festival => 
              newFestivals.includes(festival.festivalNm || festival.name)
            );
            
            // 같은 카테고리의 다른 지역 축제가 선택되어 있지 않으면 카테고리도 해제
            if (otherSelectedFestivals.length === 0) {
              setSelectedCategories(prev => 
                prev.filter(catId => catId !== categoryId)
              );
            }
          });
          
          return newFestivals;
        });
        
        console.log('🗑️ 지역 해제:', itemId, '→ 축제', uniqueFestivalNames.length, '개 해제');
      } else {
        // 지역이 선택되면 해당 지역의 모든 축제도 자동 선택
        const regionFestivals = allFestivals.filter(festival => festival.locationId === itemId);
        const uniqueFestivalNames = getUniqueFestivalNames(regionFestivals);
        
        setSelectedFestivals(prev => {
          const newFestivals = [...prev];
          uniqueFestivalNames.forEach(festivalName => {
            if (!newFestivals.includes(festivalName)) {
              newFestivals.push(festivalName);
            }
          });
          return newFestivals;
        });
        
        // 선택된 축제들의 카테고리도 자동 선택
        const categoryIds = getCategoryIds(regionFestivals);
        setSelectedCategories(prev => {
          const newCategories = [...prev];
          categoryIds.forEach(categoryId => {
            if (!newCategories.includes(categoryId)) {
              newCategories.push(categoryId);
            }
          });
          return newCategories;
        });
        
        console.log('🌍 지역 선택:', itemId, '→ 축제', uniqueFestivalNames.length, '개, 카테고리', categoryIds.length, '개 자동 선택');
      }
    } else {
      // 카테고리별 처리
      const wasSelected = selectedCategories.includes(itemId);
      
      setSelectedCategories(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
      
      if (wasSelected) {
        // 카테고리가 해제되면 해당 카테고리의 모든 축제도 해제
        const categoryFestivals = allFestivals.filter(festival => festival.categoryId === itemId);
        const uniqueFestivalNames = getUniqueFestivalNames(categoryFestivals);
        
        // 축제 해제
        setSelectedFestivals(prev => {
          const newFestivals = prev.filter(festivalName => !uniqueFestivalNames.includes(festivalName));
          console.log('🎪 카테고리 축제 해제 전:', prev.length, '개 → 해제 후:', newFestivals.length, '개');
          
          // 축제 해제 후 지역도 확인하여 해제
          const regionIds = getRegionIds(categoryFestivals);
          regionIds.forEach(regionId => {
            // 같은 지역의 다른 카테고리 축제가 선택되어 있는지 확인
            const otherCategoryFestivals = allFestivals.filter(festival => 
              festival.locationId === regionId && 
              festival.categoryId !== itemId
            );
            const otherSelectedFestivals = otherCategoryFestivals.filter(festival => 
              newFestivals.includes(festival.festivalNm || festival.name)
            );
            
            // 같은 지역의 다른 카테고리 축제가 선택되어 있지 않으면 지역도 해제
            if (otherSelectedFestivals.length === 0) {
              setSelectedRegions(prev => 
                prev.filter(regionId => regionId !== regionId)
              );
            }
          });
          
          return newFestivals;
        });
        
        console.log('🗑️ 카테고리 해제:', itemId, '→ 축제', uniqueFestivalNames.length, '개 해제');
      } else {
        // 카테고리가 선택되면 해당 카테고리의 모든 축제도 자동 선택
        const categoryFestivals = allFestivals.filter(festival => festival.categoryId === itemId);
        const uniqueFestivalNames = getUniqueFestivalNames(categoryFestivals);
        
        setSelectedFestivals(prev => {
          const newFestivals = [...prev];
          uniqueFestivalNames.forEach(festivalName => {
            if (!newFestivals.includes(festivalName)) {
              newFestivals.push(festivalName);
            }
          });
          return newFestivals;
        });
        
        // 선택된 축제들의 지역도 자동 선택
        const regionIds = getRegionIds(categoryFestivals);
        setSelectedRegions(prev => {
          const newRegions = [...prev];
          regionIds.forEach(regionId => {
            if (!newRegions.includes(regionId)) {
              newRegions.push(regionId);
            }
          });
          return newRegions;
        });
        
        console.log('🏷️ 카테고리 선택:', itemId, '→ 축제', uniqueFestivalNames.length, '개, 지역', regionIds.length, '개 자동 선택');
      }
    }
  };

  const handleFestivalToggle = (festivalName) => {
    const wasSelected = selectedFestivals.includes(festivalName);
    
    setSelectedFestivals(prev => 
      prev.includes(festivalName) 
        ? prev.filter(name => name !== festivalName)
        : [...prev, festivalName]
    );
    
    const selectedFestival = allFestivals.find(festival => 
      (festival.festivalNm || festival.name) === festivalName
    );
    
    if (selectedFestival) {
      if (!wasSelected) {
        // 축제가 선택되면 해당 축제의 지역도 자동 선택
        if (selectedFestival.locationId) {
          setSelectedRegions(prev => {
            if (!prev.includes(selectedFestival.locationId)) {
              return [...prev, selectedFestival.locationId];
            }
            return prev;
          });
        }
        
        // 축제가 선택되면 해당 축제의 카테고리도 자동 선택
        if (selectedFestival.categoryId) {
          setSelectedCategories(prev => {
            if (!prev.includes(selectedFestival.categoryId)) {
              return [...prev, selectedFestival.categoryId];
            }
            return prev;
          });
        }
        
        console.log('🎪 축제 선택:', festivalName, '→ 지역', selectedFestival.locationId, ', 카테고리', selectedFestival.categoryId, '자동 선택');
      } else {
        // 축제가 해제되면 해당 지역의 다른 축제가 선택되어 있는지 확인
        if (selectedFestival.locationId) {
          const otherFestivalsInRegion = allFestivals.filter(festival => 
            festival.locationId === selectedFestival.locationId &&
            (festival.festivalNm || festival.name) !== festivalName
          );
          
          const otherSelectedFestivalsInRegion = otherFestivalsInRegion.filter(festival => 
            selectedFestivals.includes(festival.festivalNm || festival.name)
          );
          
          // 같은 지역의 다른 축제가 선택되어 있지 않으면 지역도 해제
          if (otherSelectedFestivalsInRegion.length === 0) {
            console.log('🗑️ 지역 자동 해제:', selectedFestival.locationId, '지역의 다른 축제가 없음');
            setSelectedRegions(prev => 
              prev.filter(regionId => regionId !== selectedFestival.locationId)
            );
          } else {
            console.log('✅ 지역 유지:', selectedFestival.locationId, '지역에 다른 선택된 축제가 있음');
          }
        }
        
        // 축제가 해제되면 해당 카테고리의 다른 축제가 선택되어 있는지 확인
        if (selectedFestival.categoryId) {
          const otherFestivalsInCategory = allFestivals.filter(festival => 
            festival.categoryId === selectedFestival.categoryId &&
            (festival.festivalNm || festival.name) !== festivalName
          );
          
          const otherSelectedFestivalsInCategory = otherFestivalsInCategory.filter(festival => 
            selectedFestivals.includes(festival.festivalNm || festival.name)
          );
          
          // 같은 카테고리의 다른 축제가 선택되어 있지 않으면 카테고리도 해제
          if (otherSelectedFestivalsInCategory.length === 0) {
            console.log('🗑️ 카테고리 자동 해제:', selectedFestival.categoryId, '카테고리의 다른 축제가 없음');
            setSelectedCategories(prev => 
              prev.filter(categoryId => categoryId !== selectedFestival.categoryId)
            );
          } else {
            console.log('✅ 카테고리 유지:', selectedFestival.categoryId, '카테고리에 다른 선택된 축제가 있음');
          }
        }
      }
    }
  };

  const handleSelectAll = () => {
    if (activeTab === 'region' && filterOptions?.regions) {
      const allRegionIds = filterOptions.regions.map(region => region.id);
      setSelectedRegions(allRegionIds);
      
      // 모든 지역의 모든 축제도 선택 (중복 제거)
      const uniqueFestivalNames = getUniqueFestivalNames(allFestivals);
      setSelectedFestivals(uniqueFestivalNames);
      
      // 모든 축제의 카테고리도 선택
      const allCategoryIds = getCategoryIds(allFestivals);
      setSelectedCategories(allCategoryIds);
      
      console.log('🌍 전체 지역 선택:', allRegionIds.length, '개 지역');
      console.log('🎪 전체 축제 선택 (중복 제거):', uniqueFestivalNames.length, '개 축제');
      console.log('🏷️ 전체 카테고리 선택:', allCategoryIds.length, '개 카테고리');
      
    } else if (activeTab === 'category' && filterOptions?.categories) {
      const allCategoryIds = filterOptions.categories.map(category => category.id);
      setSelectedCategories(allCategoryIds);
      
      // 선택된 카테고리의 모든 축제도 선택 (중복 제거)
      const categoryFestivals = allFestivals.filter(festival => 
        allCategoryIds.includes(festival.categoryId)
      );
      const uniqueCategoryFestivalNames = getUniqueFestivalNames(categoryFestivals);
      setSelectedFestivals(uniqueCategoryFestivalNames);
      
      // 선택된 축제들의 지역도 선택
      const regionIds = getRegionIds(categoryFestivals);
      setSelectedRegions(regionIds);
      
      console.log('🏷️ 전체 카테고리 선택:', allCategoryIds.length, '개 카테고리');
      console.log('🎪 관련 축제 선택 (중복 제거):', uniqueCategoryFestivalNames.length, '개 축제');
      console.log('🌍 관련 지역 선택:', regionIds.length, '개 지역');
    }
  };

  const handleReset = () => {
    setSelectedRegions([]);
    setSelectedCategories([]);
    setSelectedFestivals([]);
  };

  // 현재 표시할 데이터 (API에서 가져온 실제 데이터 사용)
  const currentItems = activeTab === 'region' 
    ? (filterOptions?.regions || [])
    : (filterOptions?.categories || []);
    
  const currentSelectedItems = activeTab === 'region' ? selectedRegions : selectedCategories;


  // 로딩 상태 표시
  if (filterLoading) {
    return (
      <div className="filter-panel">
        <div className="loading">필터 옵션을 불러오는 중...</div>
      </div>
    );
  }

  // 에러 상태 표시
  if (filterError) {
    return (
      <div className="filter-panel">
        <div className="error">필터 옵션을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className="filter-panel">
      <FilterHeader 
        title="축제 필터링"
        subtitle="지역과 카테고리로 축제를 필터링하세요"
      />
      
      <FilterTabs 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <FilterActions 
        onSelectAll={handleSelectAll}
        onReset={handleReset}
      />
      
      
      <FilterList 
        items={currentItems}
        selectedItems={currentSelectedItems}
        onItemToggle={handleItemToggle}
        type={activeTab}
        festivals={allFestivals} // 전체 축제 데이터 사용
        selectedFestivals={selectedFestivals}
        onFestivalToggle={handleFestivalToggle}
      />
      
      <FilterStats 
        selectedRegions={selectedRegions.length}
        selectedCategories={selectedCategories.length}
        selectedFestivals={selectedFestivals.length}
        totalFestivals={61} // 고정값 (중복 제거 후 실제 축제 수)
        filteredFestivals={festivals} // 전체 축제 배열 전달
      />
    </div>
  );
};

export default FilterPanel;
