/**
 * 축제 목록 조회 및 필터링을 위한 커스텀 훅
 * PRD의 상태 관리 구조에 맞춰 구현
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import festivalService from '../services/festivalService.js';
import { useApi, getErrorMessage } from './useApi.js';

/**
 * 축제 목록 및 필터링 관리 훅
 * @returns {Object} 축제 관련 상태와 함수들
 */
export const useFestivals = () => {
  const { state, actions } = useApp();
  const {
    festivals,
    selectedRegions,
    selectedCategories,
    selectedYears,
    searchTerm,
    filterOptions,
    loading,
    error
  } = state;

  // API 훅들
  const filterOptionsApi = useApi(festivalService.getFilterOptions);
  const festivalsApi = useApi(festivalService.getFestivals);

  // 초기 데이터 로딩
  const loadInitialData = useCallback(async () => {
    try {
      actions.setLoading(true);
      actions.clearError();

      // 필터 옵션과 기본 축제 목록을 병렬로 로딩
      const [filterOptions, festivalsResult] = await Promise.all([
        filterOptionsApi.execute(),
        festivalsApi.execute()
      ]);

      actions.setFilterOptions(filterOptions);
      actions.setFestivals(festivalsResult.festivals);
    } catch (error) {
      console.error('초기 데이터 로딩 실패:', error);
      const errorMessage = getErrorMessage(error);
      actions.setError(errorMessage);
    } finally {
      actions.setLoading(false);
    }
  }, [filterOptionsApi, festivalsApi]); // actions 제거

  // 필터 변경 시 축제 목록 업데이트
  const loadFilteredFestivals = useCallback(async () => {
    try {
      actions.setLoading(true);
      
      const filters = {
        regions: selectedRegions,
        categories: selectedCategories,
        years: selectedYears,
        search: searchTerm
      };

      const result = await festivalsApi.execute(filters);
      actions.setFestivals(result.festivals);
    } catch (error) {
      console.error('필터된 축제 데이터 로딩 실패:', error);
      const errorMessage = getErrorMessage(error);
      actions.setError(errorMessage);
    } finally {
      actions.setLoading(false);
    }
  }, [selectedRegions, selectedCategories, selectedYears, searchTerm, festivalsApi]); // actions 제거

  // 초기 데이터 로딩
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 필터 변경 시 축제 목록 업데이트
  useEffect(() => {
    // 초기 로딩이 완료된 후에만 필터링 실행
    if (filterOptions) {
      loadFilteredFestivals();
    }
  }, [loadFilteredFestivals, filterOptions]);

  // 필터링된 축제 목록 (클라이언트 사이드 추가 필터링)
  const filteredFestivals = useMemo(() => {
    return festivals.filter(festival => {
      const regionName = festival.location?.name || festival.region || '';
      const categoryName = festival.category?.name || festival.category || '';
      
      // 검색어 필터링
      if (searchTerm && searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = festival.name.toLowerCase().includes(searchLower);
        const matchesRegion = regionName.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesRegion) return false;
      }

      return true;
    });
  }, [festivals, searchTerm]);

  // 통계 계산
  const stats = useMemo(() => ({
    totalFestivals: festivals.length,
    filteredFestivals: filteredFestivals.length,
    selectedRegionsCount: selectedRegions.length,
    selectedCategoriesCount: selectedCategories.length,
    selectedYearsCount: selectedYears.length,
    hasActiveFilters: selectedRegions.length > 0 || 
                     selectedCategories.length > 0 || 
                     (selectedYears.length !== 3) || // 기본 3개 연도가 아닌 경우
                     (searchTerm && searchTerm.trim().length > 0)
  }), [festivals, filteredFestivals, selectedRegions, selectedCategories, selectedYears, searchTerm]);

  // 필터 관련 함수들
  const filterActions = useMemo(() => ({
    // 지역 필터
    toggleRegion: (regionId) => {
      actions.toggleRegion(regionId);
    },

    selectAllRegions: () => {
      const allRegionIds = filterOptions?.regions?.map(r => r.id) || [];
      actions.setSelectedRegions(allRegionIds);
    },

    clearRegions: () => {
      actions.setSelectedRegions([]);
    },

    // 카테고리 필터
    toggleCategory: (categoryId) => {
      actions.toggleCategory(categoryId);
    },

    selectAllCategories: () => {
      const allCategoryIds = filterOptions?.categories?.map(c => c.id) || [];
      actions.setSelectedCategories(allCategoryIds);
    },

    clearCategories: () => {
      actions.setSelectedCategories([]);
    },

    // 연도 필터
    toggleYear: (year) => {
      actions.toggleYear(year);
    },

    selectAllYears: () => {
      const allYears = filterOptions?.years || ['2022', '2023', '2024'];
      actions.setSelectedYears(allYears);
    },

    clearYears: () => {
      actions.setSelectedYears(['2022', '2023', '2024']);
    },

    // 검색
    setSearchTerm: (term) => {
      actions.setSearchTerm(term);
    },

    clearSearch: () => {
      actions.setSearchTerm('');
    },

    // 전체 필터 리셋
    resetAllFilters: () => {
      actions.resetFilters();
    },

    // 필터 상태 확인
    isRegionSelected: (regionId) => selectedRegions.includes(regionId),
    isCategorySelected: (categoryId) => selectedCategories.includes(categoryId),
    isYearSelected: (year) => selectedYears.includes(year)
  }), [actions, filterOptions, selectedRegions, selectedCategories, selectedYears]);

  // 축제 관련 함수들
  const festivalActions = useMemo(() => ({
    selectFestival: (festival) => {
      actions.selectFestival(festival);
    },

    clearSelectedFestival: () => {
      actions.setSelectedFestival(null);
    },

    refreshFestivals: () => {
      loadFilteredFestivals();
    },

    // 축제 검색
    searchFestivals: async (query) => {
      try {
        actions.setLoading(true);
        const result = await festivalService.searchFestivals(query, {
          regions: selectedRegions,
          categories: selectedCategories,
          years: selectedYears
        });
        actions.setFestivals(result.festivals);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        actions.setError(errorMessage);
      } finally {
        actions.setLoading(false);
      }
    }
  }), [actions, selectedRegions, selectedCategories, selectedYears, loadFilteredFestivals]);

  return {
    // 상태
    festivals: filteredFestivals,
    allFestivals: festivals,
    filterOptions,
    loading,
    error,
    stats,

    // 필터 상태
    selectedRegions,
    selectedCategories,
    selectedYears,
    searchTerm,

    // 필터 액션
    ...filterActions,

    // 축제 액션
    ...festivalActions,

    // API 상태
    filterOptionsLoading: filterOptionsApi.loading,
    festivalsLoading: festivalsApi.loading,
    filterOptionsError: filterOptionsApi.error,
    festivalsError: festivalsApi.error
  };
};

/**
 * 특정 지역의 축제 목록을 조회하는 훅
 * @param {number} regionId - 지역 ID
 * @returns {Object} 지역별 축제 목록과 상태
 */
export const useFestivalsByRegion = (regionId) => {
  const { state, actions } = useApp();
  const festivalsApi = useApi(festivalService.getFestivalsByRegion);

  const loadFestivals = useCallback(async () => {
    if (!regionId) return;

    try {
      actions.setLoading(true);
      const result = await festivalsApi.execute(regionId);
      return result.festivals;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      actions.setError(errorMessage);
      return [];
    } finally {
      actions.setLoading(false);
    }
  }, [regionId, actions, festivalsApi]);

  useEffect(() => {
    loadFestivals();
  }, [loadFestivals]);

  return {
    festivals: festivalsApi.data?.festivals || [],
    loading: festivalsApi.loading,
    error: festivalsApi.error,
    refresh: loadFestivals
  };
};

/**
 * 특정 카테고리의 축제 목록을 조회하는 훅
 * @param {number} categoryId - 카테고리 ID
 * @returns {Object} 카테고리별 축제 목록과 상태
 */
export const useFestivalsByCategory = (categoryId) => {
  const { state, actions } = useApp();
  const festivalsApi = useApi(festivalService.getFestivalsByCategory);

  const loadFestivals = useCallback(async () => {
    if (!categoryId) return;

    try {
      actions.setLoading(true);
      const result = await festivalsApi.execute(categoryId);
      return result.festivals;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      actions.setError(errorMessage);
      return [];
    } finally {
      actions.setLoading(false);
    }
  }, [categoryId, actions, festivalsApi]);

  useEffect(() => {
    loadFestivals();
  }, [loadFestivals]);

  return {
    festivals: festivalsApi.data?.festivals || [],
    loading: festivalsApi.loading,
    error: festivalsApi.error,
    refresh: loadFestivals
  };
};

export default useFestivals;
