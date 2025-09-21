/**
 * 전역 애플리케이션 상태 관리 Context
 * PRD의 상태 관리 구조에 맞춰 구현
 */

import React, { createContext, useContext, useReducer, useMemo } from 'react';

// 액션 타입 상수
export const ActionTypes = {
  // 로딩 상태
  SET_LOADING: 'SET_LOADING',
  SET_CHART_LOADING: 'SET_CHART_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',

  // API 데이터
  SET_FESTIVALS: 'SET_FESTIVALS',
  SET_SELECTED_FESTIVAL: 'SET_SELECTED_FESTIVAL',
  SET_FESTIVAL_DETAIL: 'SET_FESTIVAL_DETAIL',
  SET_CHART_DATA: 'SET_CHART_DATA',
  SET_FILTER_OPTIONS: 'SET_FILTER_OPTIONS',

  // UI 상태
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  SET_CHART_TYPE: 'SET_CHART_TYPE',
  SET_ACTIVE_FILTER_TAB: 'SET_ACTIVE_FILTER_TAB',

  // 필터 상태
  SET_SELECTED_REGIONS: 'SET_SELECTED_REGIONS',
  SET_SELECTED_CATEGORIES: 'SET_SELECTED_CATEGORIES',
  SET_SELECTED_YEARS: 'SET_SELECTED_YEARS',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',

  // 선택된 축제 관리
  ADD_SELECTED_FESTIVAL: 'ADD_SELECTED_FESTIVAL',
  REMOVE_SELECTED_FESTIVAL: 'REMOVE_SELECTED_FESTIVAL',
  CLEAR_SELECTED_FESTIVALS: 'CLEAR_SELECTED_FESTIVALS',
  SET_SELECTED_FESTIVALS: 'SET_SELECTED_FESTIVALS'
};

// 초기 상태 (PRD 구조 기반)
const initialState = {
  // API 데이터
  festivals: [],
  selectedFestival: null,
  selectedFestivals: [],
  festivalDetail: null,
  filterOptions: null,
  chartData: null,

  // UI 상태
  selectedRegions: [],
  selectedCategories: [],
  selectedYears: ['2022', '2023', '2024'],
  searchTerm: '',
  chartType: 'line',
  viewMode: 'split', // 'split', 'map', 'chart'
  activeFilterTab: 'region', // 'region', 'category'

  // 로딩 상태
  loading: false,
  chartLoading: false,
  error: null
};

// 리듀서 함수
const appReducer = (state, action) => {
  switch (action.type) {
    // 로딩 상태 관리
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_CHART_LOADING:
      return { ...state, chartLoading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { 
        ...state, 
        error: action.payload,
        loading: false,
        chartLoading: false
      };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    // API 데이터 관리
    case ActionTypes.SET_FESTIVALS:
      return { ...state, festivals: action.payload };
    
    case ActionTypes.SET_SELECTED_FESTIVAL:
      return { ...state, selectedFestival: action.payload };
    
    case ActionTypes.SET_FESTIVAL_DETAIL:
      return { ...state, festivalDetail: action.payload };
    
    case ActionTypes.SET_CHART_DATA:
      return { ...state, chartData: action.payload };
    
    case ActionTypes.SET_FILTER_OPTIONS:
      return { ...state, filterOptions: action.payload };

    // UI 상태 관리
    case ActionTypes.SET_VIEW_MODE:
      return { ...state, viewMode: action.payload };
    
    case ActionTypes.SET_CHART_TYPE:
      return { ...state, chartType: action.payload };
    
    case ActionTypes.SET_ACTIVE_FILTER_TAB:
      return { ...state, activeFilterTab: action.payload };

    // 필터 상태 관리
    case ActionTypes.SET_SELECTED_REGIONS:
      return { ...state, selectedRegions: action.payload };
    
    case ActionTypes.SET_SELECTED_CATEGORIES:
      return { ...state, selectedCategories: action.payload };
    
    case ActionTypes.SET_SELECTED_YEARS:
      return { ...state, selectedYears: action.payload };
    
    case ActionTypes.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    
    case ActionTypes.UPDATE_FILTERS:
      return { 
        ...state, 
        ...action.payload,
        error: null // 필터 업데이트 시 에러 클리어
      };
    
    case ActionTypes.RESET_FILTERS:
      return {
        ...state,
        selectedRegions: [],
        selectedCategories: [],
        selectedYears: ['2022', '2023', '2024'],
        searchTerm: '',
        error: null
      };

    // 선택된 축제 관리
    case ActionTypes.ADD_SELECTED_FESTIVAL:
      const festivalToAdd = action.payload;
      const isAlreadySelected = state.selectedFestivals.some(f => f.id === festivalToAdd.id);
      if (isAlreadySelected) return state;
      return {
        ...state,
        selectedFestivals: [...state.selectedFestivals, festivalToAdd]
      };
    
    case ActionTypes.REMOVE_SELECTED_FESTIVAL:
      return {
        ...state,
        selectedFestivals: state.selectedFestivals.filter(f => f.id !== action.payload)
      };
    
    case ActionTypes.CLEAR_SELECTED_FESTIVALS:
      return { ...state, selectedFestivals: [] };
    
    case ActionTypes.SET_SELECTED_FESTIVALS:
      return { ...state, selectedFestivals: action.payload };

    default:
      return state;
  }
};

// Context 생성
const AppContext = createContext();

// Provider 컴포넌트
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 액션 크리에이터들 (메모이제이션)
  // 개별 액션들을 useCallback으로 메모이제이션
  const setLoading = useCallback((loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }), []);
  const setChartLoading = useCallback((loading) => dispatch({ type: ActionTypes.SET_CHART_LOADING, payload: loading }), []);
  const setError = useCallback((error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }), []);
  const clearError = useCallback(() => dispatch({ type: ActionTypes.CLEAR_ERROR }), []);

  // API 데이터 관리
  const setFestivals = useCallback((festivals) => dispatch({ type: ActionTypes.SET_FESTIVALS, payload: festivals }), []);
  const setSelectedFestival = useCallback((festival) => dispatch({ type: ActionTypes.SET_SELECTED_FESTIVAL, payload: festival }), []);
  const setFestivalDetail = useCallback((detail) => dispatch({ type: ActionTypes.SET_FESTIVAL_DETAIL, payload: detail }), []);
  const setChartData = useCallback((data) => dispatch({ type: ActionTypes.SET_CHART_DATA, payload: data }), []);
  const setFilterOptions = useCallback((options) => dispatch({ type: ActionTypes.SET_FILTER_OPTIONS, payload: options }), []);

  // UI 상태 관리
  const setViewMode = useCallback((mode) => dispatch({ type: ActionTypes.SET_VIEW_MODE, payload: mode }), []);
  const setChartType = useCallback((type) => dispatch({ type: ActionTypes.SET_CHART_TYPE, payload: type }), []);
  const setActiveFilterTab = useCallback((tab) => dispatch({ type: ActionTypes.SET_ACTIVE_FILTER_TAB, payload: tab }), []);

  // 필터 상태 관리
  const setSelectedRegions = useCallback((regions) => dispatch({ type: ActionTypes.SET_SELECTED_REGIONS, payload: regions }), []);
  const setSelectedCategories = useCallback((categories) => dispatch({ type: ActionTypes.SET_SELECTED_CATEGORIES, payload: categories }), []);
  const setSelectedYears = useCallback((years) => dispatch({ type: ActionTypes.SET_SELECTED_YEARS, payload: years }), []);
  const setSearchTerm = useCallback((term) => dispatch({ type: ActionTypes.SET_SEARCH_TERM, payload: term }), []);
  const updateFilters = useCallback((filters) => dispatch({ type: ActionTypes.UPDATE_FILTERS, payload: filters }), []);
  const resetFilters = useCallback(() => dispatch({ type: ActionTypes.RESET_FILTERS }), []);

  // 선택된 축제 관리
  const addSelectedFestival = useCallback((festival) => dispatch({ type: ActionTypes.ADD_SELECTED_FESTIVAL, payload: festival }), []);
  const removeSelectedFestival = useCallback((festivalId) => dispatch({ type: ActionTypes.REMOVE_SELECTED_FESTIVAL, payload: festivalId }), []);
  const clearSelectedFestivals = useCallback(() => dispatch({ type: ActionTypes.CLEAR_SELECTED_FESTIVALS }), []);
  const setSelectedFestivals = useCallback((festivals) => dispatch({ type: ActionTypes.SET_SELECTED_FESTIVALS, payload: festivals }), []);

  // 복합 액션들
  const selectFestival = useCallback((festival) => {
    dispatch({ type: ActionTypes.SET_SELECTED_FESTIVAL, payload: festival });
    dispatch({ type: ActionTypes.ADD_SELECTED_FESTIVAL, payload: festival });
  }, []);

  const toggleRegion = useCallback((regionId) => {
    const currentRegions = state.selectedRegions;
    const newRegions = currentRegions.includes(regionId)
      ? currentRegions.filter(id => id !== regionId)
      : [...currentRegions, regionId];
    dispatch({ type: ActionTypes.SET_SELECTED_REGIONS, payload: newRegions });
  }, [state.selectedRegions]);

  const toggleCategory = useCallback((categoryId) => {
    const currentCategories = state.selectedCategories;
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    dispatch({ type: ActionTypes.SET_SELECTED_CATEGORIES, payload: newCategories });
  }, [state.selectedCategories]);

  const toggleYear = useCallback((year) => {
    const currentYears = state.selectedYears;
    const newYears = currentYears.includes(year)
      ? currentYears.filter(y => y !== year)
      : [...currentYears, year].sort();
    dispatch({ type: ActionTypes.SET_SELECTED_YEARS, payload: newYears });
  }, [state.selectedYears]);

  // actions 객체 생성
  const actions = useMemo(() => ({
    // 로딩 상태 관리
    setLoading,
    setChartLoading,
    setError,
    clearError,

    // API 데이터 관리
    setFestivals,
    setSelectedFestival,
    setFestivalDetail,
    setChartData,
    setFilterOptions,

    // UI 상태 관리
    setViewMode,
    setChartType,
    setActiveFilterTab,

    // 필터 상태 관리
    setSelectedRegions,
    setSelectedCategories,
    setSelectedYears,
    setSearchTerm,
    updateFilters,
    resetFilters,

    // 선택된 축제 관리
    addSelectedFestival,
    removeSelectedFestival,
    clearSelectedFestivals,
    setSelectedFestivals,

    // 복합 액션들
    selectFestival,
    toggleRegion,
    toggleCategory,
    toggleYear
  }), [
    setLoading, setChartLoading, setError, clearError,
    setFestivals, setSelectedFestival, setFestivalDetail, setChartData, setFilterOptions,
    setViewMode, setChartType, setActiveFilterTab,
    setSelectedRegions, setSelectedCategories, setSelectedYears, setSearchTerm, updateFilters, resetFilters,
    addSelectedFestival, removeSelectedFestival, clearSelectedFestivals, setSelectedFestivals,
    selectFestival, toggleRegion, toggleCategory, toggleYear
  ]);

  // Context 값 메모이제이션
  const contextValue = useMemo(() => ({
    state,
    actions
  }), [state, actions]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// 편의 훅들
export const useAppState = () => {
  const { state } = useApp();
  return state;
};

export const useAppActions = () => {
  const { actions } = useApp();
  return actions;
};

export default AppContext;
